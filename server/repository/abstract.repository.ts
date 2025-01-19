import redis from '../config/redis';
import { Model, FindOptions, ModelStatic, WhereOptions, Transaction, Op, CreateOptions, UpdateOptions, DestroyOptions, literal } from 'sequelize';

interface CacheOptions {
  cacheKeyPrefix: string;
  ttl?: number;
}

export interface QueryOptions {
  search?: string
  includes?: string[];
  filters?: WhereOptions;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: string;
  transaction?: Transaction;
}

interface BulkCreateOptions<T extends ModelWithAttributes> {
  records: T['_creationAttributes'][];
  transaction?: Transaction;
  ignoreDuplicates?: boolean;
  returning?: boolean;
}

interface BulkUpdateOptions<T extends ModelWithAttributes> {
  records: Array<{ id: number | string; data: Partial<T['_attributes']> }>;
  transaction?: Transaction;
}

interface BulkDeleteOptions {
  ids: Array<number | string>;
  transaction?: Transaction;
  force?: boolean;
}

interface ModelWithAttributes {
  _attributes: any;
  _creationAttributes: any;
}

abstract class AbstractRepository<T extends Model & ModelWithAttributes> {
  protected model: ModelStatic<T>;
  protected includeConfigs: Record<string, any>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
    this.includeConfigs = {};
  }

  protected registerInclude(name: string, config: any): void {
    this.includeConfigs[name] = config;
  }

  private parseQueryOptions(options: QueryOptions): FindOptions {
    const findOptions: FindOptions = {};

    if (options.includes?.length) {
      findOptions.include = options.includes
        .filter(include => include in this.includeConfigs)
        .map(include => this.includeConfigs[include]);
    }

    if (options.filters) {
      findOptions.where = options.filters;
    }

    if (options.pagination) {
      const { page, limit } = options.pagination;
      findOptions.offset = (page - 1) * limit;
      findOptions.limit = limit;
    }

    if (options.sort) {
      findOptions.order = options.sort.split(',').map(sort => {
        const [field, direction] = sort.split(':');
        return [field, direction.toUpperCase()];
      });
    }

    if (options.search) {
      findOptions.where = {
        ...findOptions.where,
        [Op.and]: [
          literal(`search_vector @@ plainto_tsquery('english', '${options.search}')`),
        ]
      }

      const rankOrder: [any, string] = [literal(`ts_rank(search_vector, plainto_tsquery('english', '${options.search}'))`), 'DESC'];
      findOptions.order = findOptions.order ? [...(findOptions.order as any[]), rankOrder] : [rankOrder];
    }

    if (options.transaction) {
      findOptions.transaction = options.transaction;
    }

    return findOptions;
  }

  private generateCacheKey(prefix: string, options: any): string {
    // Remove transaction from cache key generation
    const { transaction, ...cacheableOptions } = options;
    return `${prefix}:${JSON.stringify(cacheableOptions)}`;
  }

  async findById(
    id: number | string,
    queryOptions: Partial<QueryOptions> = {},
    cacheOptions: CacheOptions
  ): Promise<T | null> {
    const { cacheKeyPrefix, ttl = 300 } = cacheOptions;
    const findOptions = this.parseQueryOptions(queryOptions);
    const cacheKey = this.generateCacheKey(cacheKeyPrefix, { id, ...findOptions });

    try {
      if (!queryOptions.transaction) {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) return JSON.parse(cachedData) as T;
      }

      const result = await this.model.findByPk(id, findOptions) as T | null;
      if (result && !queryOptions.transaction) {
        await redis.set(cacheKey, JSON.stringify(result), 'EX', ttl);
      }

      return result;
    } catch (error) {
      console.error('Repository operation failed:', error);
      return this.model.findByPk(id, findOptions) as Promise<T | null>;
    }
  }

  async findAll(
    queryOptions: QueryOptions,
    cacheOptions: CacheOptions
  ): Promise<{ rows: T[]; count: number; }> {
    const { cacheKeyPrefix, ttl = 300 } = cacheOptions;
    const findOptions = this.parseQueryOptions(queryOptions);
    const cacheKey = this.generateCacheKey(cacheKeyPrefix, findOptions);

    try {
      if (!queryOptions.transaction) {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) return JSON.parse(cachedData) as { rows: T[]; count: number };
      }

      const results = await this.model.findAndCountAll(findOptions);
      if (results.count > 0 && !queryOptions.transaction) {
        await redis.set(cacheKey, JSON.stringify(results), 'EX', ttl);
      }

      return results;
    } catch (error) {
      console.error('Repository operation failed:', error);
      return this.model.findAndCountAll(findOptions) as Promise<{ rows: T[]; count: number }>;
    }
  }

  // Transaction Support
  async withTransaction<R>(
    callback: (transaction: Transaction) => Promise<R>
  ): Promise<R> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Single Record Operations
  async create(
    data: T['_creationAttributes'],
    options: CreateOptions = {}
  ): Promise<T> {
    const result = await this.model.create(data, options);
    if (!options.transaction) await this.invalidateCache();
    return result;
  }

  async update(
    id: number | string,
    data: Partial<T['_attributes']>,
    options: Omit<UpdateOptions, 'where'> = {}
  ): Promise<[number]> {
    const result = await this.model.update(
      data,
      {
        where: { id } as any,
        returning: true,
        ...options
      } as UpdateOptions
    );
    if (!options.transaction) await this.invalidateCache();
    return result;
  }

  async delete(
    id: number | string,
    options: DestroyOptions = {}
  ): Promise<number> {
    const result = await this.model.destroy({
      where: { id } as any,
      ...options
    });
    if (!options.transaction) await this.invalidateCache();
    return result;
  }

  // Bulk Operations
  async bulkCreate(options: BulkCreateOptions<T>): Promise<T[]> {
    const { records, transaction, ignoreDuplicates = false, returning = true } = options;

    const result = await this.model.bulkCreate(records, {
      ignoreDuplicates,
      returning,
      transaction
    });

    if (!transaction) await this.invalidateCache();
    return result;
  }

  async bulkUpdate(options: BulkUpdateOptions<T>): Promise<number> {
    const { records, transaction } = options;
    let updatedCount = 0;

    if (transaction) {
      for (const { id, data } of records) {
        const [count] = await this.update(id, data, { transaction });
        updatedCount += count;
      }
    } else {
      await this.withTransaction(async (t) => {
        for (const { id, data } of records) {
          const [count] = await this.update(id, data, { transaction });
          updatedCount += count;
        }
      });
      await this.invalidateCache();
    }

    return updatedCount;
  }

  async bulkDelete(options: BulkDeleteOptions): Promise<number> {
    const { ids, transaction, force = false } = options;

    const result = await this.model.destroy({
      where: { id: { [Op.in]: ids } } as any,
      force,
      transaction
    });

    if (!transaction) await this.invalidateCache();
    return result;
  }

  protected async invalidateCache(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(keys);
        }
      }
    } catch (error) {
      console.error('Cache invalidation failed:', error);
    }
  }
}

export default AbstractRepository;
import Password from "./user/password.schema";
import RefreshToken from "./user/refreshToken.schema";
import Role from "./user/role.schema";
import User from "./user/user.schema";
import Group from "./group/group.schema";
import Notification from "./group/notification.schema";
import QuestionTag from "./junction/questionTag.schema";
import NotificationGroup from "./junction/notificationGroup.schema";
import UserGroup from "./junction/userGroup.schema";
import AssessmentGroup from "./junction/assessmentGroup.schema";
import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";
import { AppError } from "../lib/appError";
import Assessment from "./assessment/assessment.schema";
import ProctoringOptions from "./assessment/proctoringOptions.schema";

const models = [
  "./user/user.schema",
  "./user/refreshToken.schema",
  "./user/password.schema",
  "./user/role.schema",
  "./group/group.schema",
  "./group/notification.schema",
  "./junction/questionTag.schema",
  "./junction/notificationGroup.schema",
  "./junction/userGroup.schema",
  "./junction/assessmentGroup.schema",
  "./assessment/assessment.schema.ts",
  "./assessment/proctoringOptions.schema.ts",
];

const instantiateModels = async (): Promise<void> => {
  for (const model of models) {
    await import(model);
  }

  // Define relationships
  User.hasOne(RefreshToken, {
    onDelete: "CASCADE",
    foreignKey: 'user_id',
  });

  User.hasOne(Password, {
    onDelete: "CASCADE",
    foreignKey: 'user_id',
  });

  Role.hasMany(User, {
    foreignKey: "role_id"
  });

  Notification.belongsToMany(Group, {
    through: NotificationGroup,
    foreignKey: "notification_id",
    onDelete: "CASCADE",
  });

  Group.belongsToMany(Notification, {
    through: NotificationGroup,
    foreignKey: "group_id",
    onDelete: "CASCADE",
  });

  User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: "group_id",
    onDelete: "CASCADE",
  });

  Assessment.hasOne(ProctoringOptions, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  })

  ProctoringOptions.belongsTo(Assessment, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  })

  Group.belongsToMany(Assessment, {
    through: AssessmentGroup,
    foreignKey: "group_id",
    onDelete: "CASCADE",
  })

  Assessment.belongsToMany(Group, {
    through: AssessmentGroup,
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  })
}

//Writing raw SQL to define foreign key constraints for section because squelize does not support composite foreign keys;
// export const defineCustomRelations = async () => {
//   const transaction = await sequelize.transaction();
//   try {
//     await sequelize.query(
//       "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sections') THEN EXECUTE 'ALTER TABLE questions ADD CONSTRAINT fk_sections FOREIGN KEY (assessment_id, section) REFERENCES sections (assessment_id, section) ON DELETE CASCADE ON UPDATE CASCADE'; END IF; END $$;", {
//       type: QueryTypes.RAW,
//       transaction: transaction
//     }
//     );
//     await transaction.commit();
//   } catch (error: any) {
//     await transaction.rollback();
//     throw new AppError(
//       'Error defining foreign key to question.section',
//       500,
//       error,
//       true
//     )
//   }
// }

export const initFullTextSearch = async () => {
  const transaction = await sequelize.transaction();
  try {
    // Create GIN index if it doesn't exist
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS groups_search_idx 
      ON groups 
      USING GIN (search_vector);
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS users_search_idx 
      ON users 
      USING GIN (search_vector);
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS assessments_search_idx 
      ON assessments 
      USING GIN (search_vector);
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    // Create or replace the trigger function
    await sequelize.query(`
      CREATE OR REPLACE FUNCTION groups_search_vector_update() RETURNS trigger AS $func$
      BEGIN
        NEW.search_vector := 
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A');
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      CREATE OR REPLACE FUNCTION users_search_vector_update() RETURNS trigger AS $func$
      BEGIN
        NEW.search_vector := 
          setweight(to_tsvector('english', COALESCE(NEW.first_name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.last_name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.email, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.phone, '')), 'A')
          ;
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      CREATE OR REPLACE FUNCTION assessments_search_vector_update() RETURNS trigger AS $func$
      BEGIN
        NEW.search_vector := 
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'A')
          ;
        RETURN NEW;
      END;
      $func$ LANGUAGE plpgsql;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    // Drop and recreate trigger
    await sequelize.query(`
      DROP TRIGGER IF EXISTS groups_search_vector_update ON groups;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      DROP TRIGGER IF EXISTS users_search_vector_update ON users;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    // await sequelize.query(`
    //   DROP TRIGGER IF EXISTS assessments_search_vector_update ON assessments;
    // `, {
    //   type: QueryTypes.RAW,
    //   transaction
    // });


    await sequelize.query(`
      CREATE TRIGGER groups_search_vector_update
      BEFORE INSERT OR UPDATE ON groups
      FOR EACH ROW
      EXECUTE FUNCTION groups_search_vector_update();
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      CREATE TRIGGER users_search_vector_update
      BEFORE INSERT OR UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION users_search_vector_update();
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      CREATE TRIGGER assessments_search_vector_update
      BEFORE INSERT OR UPDATE ON assessments
      FOR EACH ROW
      EXECUTE FUNCTION assessments_search_vector_update();
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    // Update existing records
    await sequelize.query(`
      UPDATE groups SET
      search_vector = 
        setweight(to_tsvector('english', COALESCE(name, '')), 'A')
      WHERE search_vector IS NULL;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      UPDATE users SET
      search_vector = 
        setweight(to_tsvector('english', COALESCE(first_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(last_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(email, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(phone, '')), 'A')
      WHERE search_vector IS NULL;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await sequelize.query(`
      UPDATE assessments SET
      search_vector = 
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'A')
      WHERE search_vector IS NULL;
    `, {
      type: QueryTypes.RAW,
      transaction
    });

    await transaction.commit();
  } catch (error: any) {
    await transaction.rollback();
    throw new AppError(
      'Error initializing full text search',
      500,
      error,
      true
    );
  }
};

export default instantiateModels;

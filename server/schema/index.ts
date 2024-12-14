import Assessment from "./assessment/assessment.schema";
import Option from "./assessment/options.schema";
import Question from "./assessment/question.schema";
import Tag from "./assessment/tag.schema";
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
import Section from "./assessment/section.schema";
import SectionStatus from "./assessment/sectionStatus.schema";
import AssessmentStatus from "./assessment/assessmentStatus.schema";
import AssessmentResponse from "./assessment/assessmentResponse.schema";
import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";
import { AppError } from "../lib/appError";
import UserAssessmentResult from './assessment/userAssessmentResult.schema'
import AssessmentResult from "./assessment/assessmentResult.schema";
import GroupAssessmentResult from "./assessment/groupAssessmentResult.schema";

const models = [
  "./user/user.schema",
  "./user/refreshToken.schema",
  "./user/password.schema",
  "./user/role.schema",
  "./assessment/assessment.schema",
  "./assessment/question.schema",
  "./assessment/options.schema",
  "./assessment/section.schema",
  "./assessment/tag.schema",
  "./group/group.schema",
  "./group/notification.schema",
  "./junction/questionTag.schema",
  "./junction/notificationGroup.schema",
  "./junction/userGroup.schema",
  "./junction/assessmentGroup.schema",
  "./assessment/sectionStatus.schema",
  "./assessment/assessmentResponse.schema",
  "./assessment/userAssessmentResult.schema",
  "./assessment/assessmentResult.schema",
  "./assessment/groupAssessmentResult.schema",
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

  User.hasMany(Assessment, {
    foreignKey: "created_by",
    onDelete: "CASCADE",
  });

  User.hasMany(AssessmentStatus, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  User.hasMany(UserAssessmentResult, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  UserAssessmentResult.belongsTo(User, {
    foreignKey: "user_id"
  });

  User.hasMany(AssessmentResponse, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(AssessmentStatus, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(AssessmentResponse, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(Question, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(Section, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  })

  Assessment.hasMany(UserAssessmentResult, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  })

  UserAssessmentResult.belongsTo(Assessment, {
    foreignKey: "assessment_id"
  })

  Assessment.hasMany(AssessmentResult, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  })

  AssessmentResult.belongsTo(Assessment, {
    foreignKey: "assessment_id"
  })

  Question.hasMany(Option, {
    foreignKey: "question_id",
    onDelete: "CASCADE",
  });

  Question.hasMany(AssessmentResponse, {
    foreignKey: "question_id",
    onDelete: "CASCADE",
  });

  AssessmentResponse.belongsTo(Question, {  
    foreignKey: "question_id",
  });

  AssessmentResponse.belongsTo(User, {
    foreignKey: "user_id",
  });

  AssessmentResponse.belongsTo(Assessment, {
    foreignKey: "assessment_id",
  });

  AssessmentResponse.belongsTo(Option, {
    foreignKey: "selected_option_id",
  });

  Option.hasMany(AssessmentResponse, {
    foreignKey: "selected_option_id",
    onDelete: "CASCADE",
  });

  Section.hasMany(Question, {
    foreignKey: "section",
    onDelete: "CASCADE",
  });

  User.hasMany(SectionStatus, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(SectionStatus, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Question.belongsToMany(Tag, {
    through: QuestionTag,
    foreignKey: "question_id",
    onDelete: "CASCADE",
  });

  Tag.belongsToMany(Question, {
    through: QuestionTag,
    foreignKey: "tag_id",
    onDelete: "CASCADE",
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

  UserGroup.belongsTo(User, {
    foreignKey: 'user_id'
  })

  UserGroup.belongsTo(Group, {
    foreignKey: 'group_id'
  })

  User.hasMany(UserGroup, {
    foreignKey: 'user_id'
  })

  Group.hasMany(UserGroup, {
    foreignKey: 'group_id'
  })

  Assessment.belongsToMany(Group, {
    through: AssessmentGroup,
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(AssessmentGroup, {
    foreignKey: 'assessment_id',
    onDelete: "CASCADE",
  })

  AssessmentGroup.belongsTo(Assessment, {
    foreignKey: 'assessment_id'
  })
  Group.belongsToMany(Assessment, {
    through: AssessmentGroup,
    foreignKey: "group_id",
    onDelete: "CASCADE",
  });

  Assessment.hasMany(GroupAssessmentResult, {
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Group.hasMany(GroupAssessmentResult, {
    foreignKey: "group_id",
    onDelete: "CASCADE",
  });

  GroupAssessmentResult.belongsTo(Assessment, {
    foreignKey: "assessment_id"
  });

  GroupAssessmentResult.belongsTo(Group, {
    foreignKey: "group_id"
  });
}

//Writing raw SQL to define foreign key constraints for section because squelize does not support composite foreign keys;
export const defineCustomRelations = async () => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.query(
      "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sections') THEN EXECUTE 'ALTER TABLE questions ADD CONSTRAINT fk_sections FOREIGN KEY (assessment_id, section) REFERENCES sections (assessment_id, section) ON DELETE CASCADE ON UPDATE CASCADE'; END IF; END $$;", {
      type: QueryTypes.RAW,
      transaction: transaction
    }
    );
    await transaction.commit();
  } catch (error: any) {
    await transaction.rollback();
    throw new AppError(
      'Error defining foreign key to question.section',
      500,
      error,
      true
    )
  }
}

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

    await sequelize.query(`
      DROP TRIGGER IF EXISTS assessments_search_vector_update ON assessments;
    `, {
      type: QueryTypes.RAW,
      transaction
    });


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

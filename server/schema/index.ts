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

  Assessment.hasMany(AssessmentStatus, {
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

  Question.hasMany(Option, {
    foreignKey: "question_id",
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

  Assessment.belongsToMany(Group, {
    through: AssessmentGroup,
    foreignKey: "assessment_id",
    onDelete: "CASCADE",
  });

  Group.belongsToMany(Assessment, {
    through: AssessmentGroup,
    foreignKey: "group_id",
    onDelete: "CASCADE",
  });
};

export default instantiateModels;

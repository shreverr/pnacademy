import Assessment from './assessment/assessment.schema'
import Option from './assessment/options.schema'
import Question from './assessment/question.schema'
import Tag from './assessment/tag.schema'
import Password from './user/password.schema'
import RefreshToken from './user/refreshToken.schema'
import Role from './user/role.schema'
import User from './user/user.schema'
import Group from './group/group.schema'
import Notification from './group/notification.schema'

const models = [
  './user/user.schema',
  './user/refreshToken.schema',
  './user/password.schema',
  './user/role.schema',
  './assessment/assessment.schema',
  './assessment/question.schema',
  './assessment/options.schema',
  './assessment/tag.schema',
  './group/group.schema',
  './group/notification.schema'
]

const instantiateModels = async (): Promise<void> => {
  for (const model of models) {
    await import(model)
  }

  // Define relationships
  User.hasOne(RefreshToken)
  RefreshToken.belongsTo(User)
  User.hasOne(Password)
  Password.belongsTo(User)

  User.hasOne(Role, { foreignKey: 'role_id' })
  Role.belongsTo(User, { foreignKey: 'role_id' })

  User.hasMany(Assessment, { foreignKey: 'created_by' })
  Assessment.belongsTo(User, { foreignKey: 'created_by' })
  Assessment.hasMany(Question, { foreignKey: 'assessment_id' })
  Question.belongsTo(Assessment, { foreignKey: 'assessment_id' })
  Question.hasMany(Option, { foreignKey: 'question_id' })
  Option.belongsTo(Question, { foreignKey: 'question_id' })

  Question.belongsToMany(Tag, { through: 'question_tag' })
  Tag.belongsToMany(Question, { through: 'question_tag' })
  Notification.belongsToMany(Group, { through: 'notification_group' })
  Group.belongsToMany(Notification, { through: 'notification_group' })
  User.belongsToMany(Group, { through: 'user_group' })
  Group.belongsToMany(User, { through: 'user_group' })
  Group.belongsToMany(Assessment, { through: 'group_assessment' })
  Assessment.belongsToMany(Group, { through: 'group_assessment' })
}

export default instantiateModels

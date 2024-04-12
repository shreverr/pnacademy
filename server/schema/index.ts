import Assessment from "./assessment/assessment.schema"
import Option from "./assessment/options.schema"
import Question from "./assessment/question.schema"
import Tag from "./assessment/tag.schema"
import Password from "./user/password.schema"
import RefreshToken from "./user/refreshToken.schema"
import Role from "./user/role.schema"
import User from "./user/user.schema"

const models = [
  './user/user.schema',
  './user/refreshToken.schema',
  './user/password.schema',
  './user/role.schema',
  './assessment/assessment.schema',
  './assessment/question.schema',
  './assessment/options.schema',
  './assessment/tag.schema'
]

const instantiateModels = async (): Promise<void> => {
  models.forEach(async (model) => {
    require(model)
  }) 

  // Define relationships
  User.hasOne(RefreshToken)
  RefreshToken.belongsTo(User)
  User.hasOne(Password)
  Password.belongsTo(User)

  User.hasOne(Role)
  Role.belongsTo(User)

  User.hasMany(Assessment);
  Assessment.belongsTo(User);
  Question.hasMany(Option);
  Option.belongsTo(Question);

  Question.belongsToMany(Tag, { through: 'question_tag' });
  Tag.belongsToMany(Question, { through: 'question_tag' });

}

export default instantiateModels

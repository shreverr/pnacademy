import Password from "./user/password.schema"
import RefreshToken from "./user/refreshToken.schema"
import User from "./user/user.schema"

const models = [
  './user/user.schema',
  './user/refreshToken.schema',
  './user/password.schema',
  './user/role.schema'
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
}

export default instantiateModels

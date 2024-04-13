import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface RefreshTokenAttributes {
  user_id: string
  refresh_token: string
}

class RefreshToken extends Model<RefreshTokenAttributes> implements RefreshTokenAttributes {
  public user_id!: string
  public refresh_token!: string
}
RefreshToken.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'refresh_token'
  }
)

export default RefreshToken

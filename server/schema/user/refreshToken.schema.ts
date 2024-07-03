import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'
import { device } from '../../types/user.types'

interface RefreshTokenAttributes {
  user_id: string
  refresh_token: string,
  device_type: device
}

class RefreshToken extends Model<RefreshTokenAttributes> implements RefreshTokenAttributes {
  public user_id!: string
  public device_type!: device
  public refresh_token!: string
}
RefreshToken.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    device_type: {
      type: DataTypes.STRING,
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

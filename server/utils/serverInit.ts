import logger from "../config/logger"
import { AppError } from "../lib/appError"
import { createRole, registerUser, viewAllRoles } from "../service/user/user.service"

export const createSuperAdminIfNotExists = async () => {
  const { roles: existingRoles } = await viewAllRoles()

  let superAdminRoleId: string | undefined = existingRoles.find(role => role.name === "Super Admin")?.id

  if (!superAdminRoleId) {
    const superAdminRole = await createRole({
      name: "Super Admin",
      canManageAssessment: true,
      canManageUser: true,
      canManageRole: true,
      canManageNotification: true,
      canManageLocalGroup: true,
      canManageReports: true,
      canAttemptAssessment: true,
      canViewReport: true,
      canManageMyAccount: true,
      canViewNotification: true,
    })

    if (!superAdminRole) {
      throw new AppError(
        "Super Admin role not created",
        500,
        "Super Admin role not created",
        true
      )
    }

    superAdminRoleId = superAdminRole.id
  }

  try {
    const superAdmin = await registerUser({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@pnacademy.in',
      password: 'superadmin',
      phone: null,
      roleId: superAdminRoleId,
    })
  } catch (error: any) {
    if (error instanceof AppError ) {
      if (!(error.name === 'User already exists'))
        throw error
    } else {
      throw new AppError(
        "Super Admin not created",
        500,
        error,
        true
      )
    }
  }

  logger.info("Super Admin initalized successfully")
}
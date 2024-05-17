import logger from '../../config/logger'
import { AppError } from '../../lib/appError'
import Group from '../../schema/group/group.schema'
import Notification from '../../schema/group/notification.schema'
import { type GroupData } from '../../types/group.types'
import { type NotificationData } from '../../types/notification.types'

export const createNotificationInDB = async (notification: {
  id: string
  description: string
  title: string
  image_url: string | null
  file_url: string | null
}): Promise<NotificationData | null> => {
  try {
    const notificationData = await Notification.create(
      {
        id: notification.id,
        description: notification.description,
        title: notification.title,
        image_url: notification.image_url,
        file_url: notification.file_url
      },
      {
        raw: true
      }
    )
    return notificationData
  } catch (error) {
    throw new AppError(
      'error creating notification',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getnotificationById = async (
  id: string
): Promise<NotificationData | null> => {
  try {
    logger.info(`Getting notification by id ${id}`)
    const notification = await Notification.findOne({
      where: {
        id
      },
      raw: true
    })
    return notification
  } catch (error) {
    throw new AppError(
      'error getting notification',
      500,
      'Something went wrong',
      false
    )
  }
}

export const deleteNotificationInDB = async (notification: {
  id: string
}): Promise<boolean | null> => {
  try {
    const notificationData = await Notification.destroy({
      where: {
        id: notification.id
      }
    })
    return true
  } catch (error) {
    throw new AppError(
      'error deleting notification',
      500,
      'Something went wrong',
      false
    )
  }
}
export const createGroupInDB = async (group: {
  name: string
  id: string
}): Promise<GroupData | null> => {
  try {
    const groupData = await Group.create(
      {
        name: group.name,
        id: group.id
      },
      {
        raw: true
      }
    )
    return groupData
  } catch (error) {
    throw new AppError(
      'error creating group',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getGroupByName = async (
  name: string
): Promise<GroupData | null> => {
  try {
    logger.info(`Getting group by name ${name}`)
    const group = await Group.findOne({
      where: {
        name
      },
      raw: true
    })
    return group
  } catch (error) {
    throw new AppError(
      'error getting group',
      500,
      'Something went wrong',
      false
    )
  }
}

import { FindAndCountOptions, ForeignKeyConstraintError, literal, Op, UniqueConstraintError } from 'sequelize'
import logger from '../../config/logger'
import { AppError } from '../../lib/appError'
import Group from '../../schema/group/group.schema'
import Notification, { NotificationAttributes } from '../../schema/group/notification.schema'
import { type GroupData } from '../../types/group.types'
import { groupAttributes, NotificationSortBy } from '../../types/notification.types'
import NotificationGroup from '../../schema/junction/notificationGroup.schema'
import User from '../../schema/user/user.schema'
import { isValidUUID } from '../../utils/validator'
import AssessmentGroup from '../../schema/junction/assessmentGroup.schema'
import { log } from 'console'

export const createNotificationInDB = async (notification: {
  id: string
  description: string
  title: string
  image_key: string | null
  file_key: string | null
}): Promise<NotificationAttributes> => {
  try {
    const notificationData = await Notification.create(
      {
        id: notification.id,
        description: notification.description,
        title: notification.title,
        image_key: notification.image_key,
        file_key: notification.file_key
      },
      {
        raw: true,
      }
    )

    return notificationData.dataValues
  } catch (error: any) {
    throw new AppError(
      'error creating notification',
      500,
      error,
      false
    )
  }
}

export const getnotificationById = async (
  id: string
): Promise<NotificationAttributes | null> => {
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

export const getGroupById = async (
  id: string
): Promise<GroupData | null> => {
  try {
    logger.info(`Getting group by id`)
    const group = await Group.findOne({
      where: {
        id
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

export const updateGroupInDB = async (
  id: string,
  name: string,
): Promise<GroupData | null> => {
  logger.info(`Updating group`)

  try {
    const [_, [updatedTag]] = await Group.update({
      id: id,
      name: name
    }, {
      where: {
        id: id
      },
      returning: true
    })

    return updatedTag.dataValues as GroupData
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        'Group already exists',
        409,
        'A Group with this name or ID already exists',
        false
      );
    }

    throw new AppError(
      'Error updating tag',
      500,
      'Something went wrong',
      false
    )
  }
}

export const deleteGroupsById = async (groupIds: string[]): Promise<boolean> => {
  logger.debug(`Deleting groups`);
  try {
    const result = await Group.destroy({
      where: {
        id: groupIds,
      },
    })

    if (result === 0) {
      return false;
    };

    return true
  } catch (error: any) {
    throw new AppError(
      "error deleting group",
      500,
      error,
      true
    );
  }
};

export const getAllGroups = async (
  offset?: number,
  pageSize?: number,
  sortBy?: groupAttributes,
  order?: "ASC" | "DESC",
): Promise<{
  rows: GroupData[],
  count: number
}> => {
  try {
    const findOptions: FindAndCountOptions = (offset !== null || offset !== undefined) && pageSize && sortBy && order ? {
      limit: pageSize,
      offset: offset,
      order: [[sortBy, order]]
    } : {}

    logger.info(findOptions)

    const allGroupsData = await Group.findAndCountAll(findOptions);

    // Convert the data to plain object
    let plainData: {
      rows: GroupData[]
      count: number
    } = {
      rows: allGroupsData.rows.map((group) => group.get({ plain: true })),
      count: allGroupsData.count
    }

    return plainData;
  } catch (error) {
    throw new AppError(
      "error getting all groups",
      500,
      "Something went wrong",
      true
    );
  }
};

export const getAllNotifications = async (
  offset?: number,
  pageSize?: number,
  sortBy?: NotificationSortBy,
  order?: "ASC" | "DESC"
): Promise<{ rows: NotificationAttributes[]; count: number }> => {
  try {
    const findOptions: FindAndCountOptions =
      (offset !== null || offset !== undefined) && pageSize && sortBy && order
        ? {
          limit: pageSize,
          offset: offset,
          order: [[sortBy, order]],
        }
        : {};

    const allNotifications = await Notification.findAndCountAll(findOptions);
    // Convert the data to plain object
    let plainData: {
      rows: NotificationAttributes[];
      count: number;
    } = {
      rows: allNotifications.rows.map((assessment) =>
        assessment.get({ plain: true })
      ),
      count: allNotifications.count,
    };
    return plainData;
  } catch (error) {
    throw new AppError(
      "error getting all assessments",
      500,
      "Something went wrong",
      true
    );
  }
};

export const addGroupToNotificationById = async (
  notificationId: string,
  groupId: string
): Promise<boolean> => {
  logger.info(`Adding group to notification`);
  try {
    const notificationGroup = await NotificationGroup.create({
      notification_id: notificationId,
      group_id: groupId,
    });

    return !!notificationGroup;
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "notification already added to group",
        409,
        "notification already added to group",
        false
      );
    } else if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(
        "Either notification or group does not exist",
        404,
        "Either notification or group does not exist",
        false
      );
    } else {
      throw new AppError("Error adding notification to group", 500, error, true);
    }
  }
};

export const removeGroupFromNotificationById = async (
  notificationId: string,
  groupId: string
): Promise<boolean> => {
  logger.info(`Removing group from notification`);
  try {
    const result = await NotificationGroup.destroy({
      where: {
        notification_id: notificationId,
        group_id: groupId,
      },
    });

    if (result === 0) {
      return false;
    }

    return true;
  } catch (error: any) {
    throw new AppError(
      "Error removing group from notification",
      500,
      error,
      true
    );
  }
};

export const viewAssignedNotificationsByUserId = async (
  userId: string,
  offset?: number,
  pageSize?: number,
  sortBy?: NotificationSortBy,
  order?: "ASC" | "DESC"
): Promise<{
  rows: NotificationAttributes[];
  count: number;
}> => {
  try {
    const findOptions: FindAndCountOptions =
      (offset !== null || offset !== undefined) && pageSize && sortBy && order
        ? {
          limit: pageSize,
          offset: offset,
          order: [[sortBy, order]],
        }
        : {};

    const assignedNotifications = await Notification.findAndCountAll({
      include: [
        {
          model: Group,
          include: [
            {
              model: User,
              where: {
                id: userId,
              },
              attributes: [],
              required: true,
            },
          ],
          attributes: [],
          required: true,
        },
      ],
      ...findOptions,
    });

    // Convert the data to plain object
    let plainData: {
      rows: NotificationAttributes[];
      count: number;
    } = {
      rows: assignedNotifications.rows.map((notification) =>
        notification.get({ plain: true })
      ),
      count: assignedNotifications.count,
    };

    return plainData;
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(
        "User does not exists",
        404,
        "User does not exists",
        false
      );
    }

    throw new AppError("error getting all notifications", 500, error, true);
  }
};

export const searchGroupsByQuery = async (
  query: string,
  offset?: number,
  pageSize?: number,
  order?: "ASC" | "DESC"
): Promise<{
  rows: (Group & { searchRank: number })[];
  count: number;
}> => {
  try {
    const searchResults = await Group.findAndCountAll({
      attributes: [
        'id',
        'name',
        [
          literal(`ts_rank(search_vector, plainto_tsquery('english', :query))`),
          'searchRank'
        ]
      ],
      where: {
        [Op.or]: [
          literal(`search_vector @@ plainto_tsquery('english', :query)`),
          // Only include the id condition if the query is a valid UUID
          ...(isValidUUID(query) ? [{ id: query }] : [])
        ],
      },
      order: [
        [literal(`ts_rank(search_vector, plainto_tsquery('english', :query))`), 'DESC']
      ],
      replacements: { query },
      limit: pageSize,
      offset,
      distinct: true,
    }) as { rows: (Group & { searchRank: number })[], count: number };

    return searchResults;
  } catch (error: any) {
    throw new AppError(
      "someting went wrong",
      500,
      "someting went wrong",
      true
    );
  }
};
export const viewGroupCount = async (): Promise<number> => {
  try {
    const groupCount = await Group.count();
    return groupCount;
  } catch (error: any) {
    throw new AppError(
      "someting went wrong",
      500,
      "someting went wrong",
      true
    );
  }
}
// export const getAssessmentByGroupIdInDB = async (
//   groupId: string,
//   offset?: number,
//   pageSize?: number,
//   sortBy?: Exclude<keyof AssessmentAttributes, "created_by">,
//   order?: "ASC" | "DESC"
// ): Promise<{
//   rows: Omit<AssessmentAttributes, "created_by">[];
//   count: number;
// }> => {
//   try {
//     const findOptions: FindAndCountOptions = {
//       where: {
//         group_id: groupId,
//       },
//       include: [
//         {
//           model: Assessment,
//           required: true, // Use INNER JOIN for better performance
//           attributes: {
//             exclude: ["created_by"],
//           },
//         },
//       ],
//     };

//     // Add sorting and pagination if provided
//     if (offset !== undefined && pageSize && sortBy && order) {
//       findOptions.limit = pageSize;
//       findOptions.offset = offset;
//       // Fix: Sort by the assessment model's column instead of assessment_group
//       findOptions.order = [[{ model: Assessment, as: 'Assessment' }, sortBy, order]];
//     }

//     const allAssessments = await AssessmentGroup.findAndCountAll(findOptions);

//     // Transform the data to match the expected type
//     const plainData = {
//       rows: allAssessments.rows.map((assessmentGroup) => 
//         (assessmentGroup.get({ plain: true }) as any).assessment
//       ),
//       count: allAssessments.count,
//     };

//     return plainData;
//   } catch (error: any) {
//     throw new AppError(
//       "error getting all assessments",
//       500,
//       error,
//       true
//     );
//   }
// };
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { addGroupToNotification, createGroup, createNotification, deleteGroups, deleteNotification, removeGroupFromNotification, searchGroups, updateGroup, viewAllGroups, viewAllGroupsCount, viewAllNotifications, viewAssignedNotifications } from "../../service/notification/notification.service";
import { groupAttributes, NotificationSortBy } from "../../types/notification.types";
import { AppError } from "../../lib/appError";
// import { AssessmentAttribute } from "../../types/assessment.types";

export const CreateNotificationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notificationArgs: {
      description: string;
      title: string;
      image?: Express.Multer.File;
      file?: Express.Multer.File;
    } = {
      description: req.body.description,
      title: req.body.title,
    };

    // Expicitly type the files object
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files && files["image"]) {
      notificationArgs.image = files["image"][0];
    }

    if (files && files["file"]) {
      notificationArgs.file = files["file"][0];
    }

    const notification = await createNotification(notificationArgs);

    if (!notification) {
      throw new AppError(
        "someting went wrong",
        500,
        "Notification not created",
        true
      )
    }

    return res.status(201).json({
      status: "success",
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteNotificationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await deleteNotification({
      id: req.body.id,
    });

    return res.status(200).json({
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const CreateGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const group = await createGroup({
      name: req.body.name,
    });

    return res.status(201).json({
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const group = await updateGroup(req.body.id, req.body.name);
    return res.status(201).json({
      message: "Group updated successfully",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allGroupssDeleted = await deleteGroups(req.body.groupIds);

    return res.status(200).json({
      message: allGroupssDeleted
        ? "Groups Deleted successfully"
        : "Some groups deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllGroupsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupsData = await viewAllGroups(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as groupAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(201).json({
      message: "success",
      data: groupsData,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotificationsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notifications = await viewAllNotifications(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as NotificationSortBy,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(201).json({
      message: "success",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

export const addGroupToNotificationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addGroupToNotification(req.body.notificationId, req.body.groupId)

    return res.status(201).json({
      status: 'success'
    })
  } catch (error) {
    next(error)
  }
}

export const removeGroupFromNotificationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeGroupFromNotification(req.body.notificationId, req.body.groupId)

    return res.status(200).json({
      status: 'success',
      message: 'Group removed successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const viewAssignedNotificationsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const assignedNotifications = await viewAssignedNotifications(
      req.user.userId as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as NotificationSortBy,
      req.query.order as 'ASC' | 'DESC'
    )

    return res.status(200).json({
      message: 'success',
      data: assignedNotifications
    })
  } catch (error) {
    next(error)
  }
}


export const searchGroupsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchResults = await searchGroups(
      req.query.query as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.order as 'ASC' | 'DESC'
    )

    return res.status(200).json({
      message: 'success',
      data: searchResults
    })
  } catch (error) {
    next(error)
  }
}
export const getAllGroupsCountController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupsCount = await viewAllGroupsCount();

    return res.status(201).json({
      message: "success",
      data: groupsCount,
    });
  } catch (error) {
    next(error);
  }
}
// export const getAssessmentByGroupIdController: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const assessments = await getAssessmentByGroupId(
//       req.query.groupId as string,
//       req.query.page as string,
//       req.query.pageSize as string,
//       req.query.sortBy as Exclude<AssessmentAttribute, "created_by" | "createdAt" | "updatedAt">,
//       req.query.order as "ASC" | "DESC"
//     );

//     return res.status(200).json({
//       message: "success",
//       data: assessments,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
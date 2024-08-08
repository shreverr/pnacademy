import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createGroup, createNotification, deleteGroups, deleteNotification, updateGroup } from "../../service/notification/notification.service";

export const CreateNotificationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await createNotification({
      description: req.body.description,
      title: req.body.title,
      image_url: req.body.image_url,
      file_url: req.body.file_url,
    });

    return res.status(201).json({
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

    return res.status(201).json({
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
    const group = await updateGroup(
      req.body.id,
      req.body.name,
    );
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
      message: allGroupssDeleted ? "Groups Deleted successfully" : "Some groups deleted"
    });
  } catch (error) {
    next(error);
  }
}

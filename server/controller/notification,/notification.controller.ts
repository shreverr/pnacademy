import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createGroup, createNotification } from "../../service/notification/notification.service";

export const CreateNotificationController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await createNotification({
      id: req.body.id,
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

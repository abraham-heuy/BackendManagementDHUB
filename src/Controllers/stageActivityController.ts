import { AppDataSource } from "@app/DB/data-source";
import { StageActivity } from "@app/entity/StageActivity";
import { Stage } from "@app/entity/stage";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { Response } from "express";

export class StageActivityController {
  private stageActivityRepo = AppDataSource.getRepository(StageActivity);

  // @desc Create a new stage activity (Admin only)
  createActivity = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { stage, title, description, activityType, required, weight, ordering } =
        req.body;

      const newActivity = this.stageActivityRepo.create({
        stage: stage as Stage,
        title,
        description,
        activityType,
        required,
        weight,
        ordering,
      });

      await this.stageActivityRepo.save(newActivity);

      res.status(201).json({
        message: "Stage activity created successfully",
        activity: newActivity,
      });
    } catch (error) {
      console.error("Error creating stage activity:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  // @desc Update an activity (Admin only)
  updateActivity = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, activityType, required, weight, ordering } =
        req.body;

      const activity = await this.stageActivityRepo.findOne({ where: { id } });

      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      activity.title = title ?? activity.title;
      activity.description = description ?? activity.description;
      activity.activityType = activityType ?? activity.activityType;
      activity.required = required ?? activity.required;
      activity.weight = weight ?? activity.weight;
      activity.ordering = ordering ?? activity.ordering;

      await this.stageActivityRepo.save(activity);

      res.json({
        message: "Stage activity updated successfully",
        activity,
      });
    } catch (error) {
      console.error("Error updating stage activity:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  // @desc Delete an activity (Admin only)
  deleteActivity = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
      const { id } = req.params;

      const activity = await this.stageActivityRepo.findOne({ where: { id } });

      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      await this.stageActivityRepo.remove(activity);

      res.json({ message: "Stage activity deleted successfully" });
    } catch (error) {
      console.error("Error deleting stage activity:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  // @desc Get all activities for a stage
  getActivitiesByStage = asyncHandler(
    async (req: UserRequest, res: Response) => {
      try {
        const { stageId } = req.params;

        const activities = await this.stageActivityRepo.find({
          where: { stage: stageId as Stage },
          order: { ordering: "ASC" },
        });

        res.json(activities);
      } catch (error) {
        console.error("Error fetching stage activities:", error);
        res.status(500).json({ message: "Server error", error });
      }
    }
  );
}

// src/Controllers/reportsController.ts
import { Response } from "express";
import asyncHandler from "@app/middlewares/asynchandler/asynchandler";
import { UserRequest } from "@app/Utils/Types/authenticatedUser";
import { Parser } from "json2csv";
import { ReportsService } from "@app/Services.ts/reportService";

const reportsService = new ReportsService();

export class ReportsController {
  getApplicationsReport = asyncHandler(async (req: UserRequest, res: Response) => {
    const data = await reportsService.getApplicationsReport();
    const csv = new Parser().parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("applications_report.csv");
    res.send(csv);
  });

  getEventsReport = asyncHandler(async (req: UserRequest, res: Response) => {
    const data = await reportsService.getEventsReport();
    const csv = new Parser().parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("events_report.csv");
    res.send(csv);
  });

  // getProgressReport = asyncHandler(async (req: UserRequest, res: Response) => {
  //   const data = await reportsService.getProgressReport();
  //   const csv = new Parser().parse(data);
  //   res.header("Content-Type", "text/csv");
  //   res.attachment("progress_report.csv");
  //   res.send(csv);
  // });

  getMentorReport = asyncHandler(async (req: UserRequest, res: Response) => {
    const data = await reportsService.getMentorAllocationReport();
    const csv = new Parser().parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("mentor_allocation_report.csv");
    res.send(csv);
  });
}

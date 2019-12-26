import { scheduledJobs, scheduleJob, Job, rescheduleJob } from "node-schedule";
import { ICronnable } from "../../types";
import { Thread } from "../../models";
import { Dictionary } from "lodash";

export default class Schedule {
  public static async all(): Promise<Dictionary<Job>> {
    return scheduledJobs;
  }

  public static async allByThread(thread: Thread): Promise<Dictionary<Job>> {
    const allJobs = await Schedule.all();
    //must filt allJobs, find task with post that create for input thread
    return;
  }

  public static async create(context: ICronnable): Promise<Job> {
    return scheduleJob(context.id, context.expireDate, context.cb);
  }

  public static async get(id: string): Promise<Job> {
    const all = scheduledJobs;
    return all[id];
  }

  public static async update(context: ICronnable): Promise<Job> {
    const jobs = scheduledJobs;
    const job = jobs[context.id];
    rescheduleJob(job, context.expireDate);
    console.log(job.nextInvocation());
    return job;
  }

  public static async del(id: string): Promise<void> {
    console.log(scheduledJobs);
    const jobs = scheduledJobs;
    const job = jobs[id];
    if (!job) {
      //job for target post doesn't exist.... it's souldn't exist
      console.log("I NEED LOGGER");
      throw Error(`no job for post: ${job.name}`);
    } else {
      job.cancel();
    }
    console.log(scheduledJobs);
  }
}

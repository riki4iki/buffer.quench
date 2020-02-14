import { scheduledJobs, scheduleJob, Job, rescheduleJob } from "node-schedule";
import { Dictionary } from "lodash";

import { ICronnable } from "types";

export default class Schedule {
   /**Get all server tasks */
   public static async all(): Promise<Dictionary<Job>> {
      return scheduledJobs;
   }
   /**
    * Get tasks by thread
    * @param thread Thread - input thread for wich search is being performed
    */

   /* public static async allByThread(thread: Thread): Promise<Dictionary<Job>> {
      const allJobs = await Schedule.all();
      //must filt allJobs, find task with post that create for input thread
      return;
   }*/

   /**
    * Create new task in server
    * @param context input body for new task:
    * - id  - string, post id and name for next task
    * - expireDate - date, date from request and execute time for task
    * - cb - function, callback that will be executed after expire date
    */
   public static async create(context: ICronnable): Promise<Job> {
      return scheduleJob(context.id, context.expireDate, context.cb);
   }

   /**
    * Get task by identifier
    * @param id String - task name, post id
    */
   public static async get(id: string): Promise<Job> {
      const all = scheduledJobs;
      return all[id];
   }
   /**
    * Update task on server state
    * @param context input body for updating taks:
    * - id - task name and post id, need for identify task
    * - expireDate - date what will be updated
    */
   public static async update(context: ICronnable): Promise<Job> {
      const jobs = scheduledJobs;
      const job = jobs[context.id];
      rescheduleJob(job, context.expireDate);
      console.log(job.nextInvocation());
      return job;
   }

   /**
    * Delete task from server state
    * @param id String - Post identifier and task name(identifier too)
    */
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

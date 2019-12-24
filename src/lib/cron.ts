import Koa, { DefaultContext, DefaultState } from "koa";
import { scheduledJobs, scheduleJob, Job, rescheduleJob } from "node-schedule";
import { Repository, getManager } from "typeorm";
import { Thread, Page, Post } from "../models/";
import { ICronnable } from "../types";
export default class CronService {
  constructor() {}
  addListeners(app: Koa<DefaultState, DefaultContext>) {
    app.addListener("cron-create", (context: ICronnable) => {
      this.addListener(context);
    });
    app.addListener("cron-update", (context: ICronnable) => {
      this.updateListener(context);
    });
    app.addListener("cron-remove", (id: string) => {
      this.removeListener(id);
    });
  }

  private addListener(context: ICronnable) {
    //need to create new task with name which contains post_id
    //For every post one task(cron job)
    const cron: Job = scheduleJob(
      `${context.id}`,
      context.expireDate,
      async function executer() {
        const postRepository: Repository<Post> = getManager().getRepository(
          Post
        );
        const pageRepository: Repository<Page> = getManager().getRepository(
          Page
        );
        const post = await postRepository.findOne({
          where: { id: this.name },
          relations: ["thread"]
        });
        const pages: Array<Page> = await pageRepository.find({
          where: { thread: post.thread }
        });

        pages.map(page => page.toSocial());
        const ids: Array<string> = pages.map(page => page.id);
        console.log(
          `${post.id} post to pages; ${ids} at time: ${post.expireDate} body: ${post.context}`
        );
        //need to remove post from db
        try {
          await postRepository.remove(post);
          console.log(`post with id: ${post.id} has been removed`);
        } catch (err) {
          console.log(err);
        }
      }
    );
    console.log(cron);
  }
  private updateListener(context: ICronnable) {
    //task must be updated only if date is updated
    //For future (i think) mode may be updatd too
    const jobs = scheduledJobs;
    const job = jobs[context.id];
    rescheduleJob(job, context.expireDate);
    console.log(job.nextInvocation());
  }
  private removeListener(id: string) {
    //task may be removed if post is removed too
    const jobs = scheduledJobs;
    const job = jobs[id];
  }
}

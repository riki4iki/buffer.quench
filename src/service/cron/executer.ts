import { scheduledJobs, scheduleJob, Job, rescheduleJob } from "node-schedule";
import { getManager, Repository } from "typeorm";
import { Page, Post } from "../../models";
import { ISocialPage } from "types";
export async function add(post: Post): Promise<Job> {
  //need to create new task with name which contains post_id
  //For every post one task(cron job)
  //after creating job need save in to redis storage...
  const cron: Job = scheduleJob(
    `${post.id}`,
    post.expireDate,
    async function executer() {
      const postRepository: Repository<Post> = getManager().getRepository(Post);
      const pageRepository: Repository<Page> = getManager().getRepository(Page);
      const post = await postRepository.findOne({
        where: { id: this.name },
        relations: ["thread"]
      });
      const pages: Array<Page> = await pageRepository.find({
        where: { thread: post.thread }
      });

      try {
        const socials: Array<ISocialPage> = await Promise.all(
          pages.map(async page => await page.toSocial())
        );
        await Promise.all(
          socials.map(async page => {
            console.log(page);
            await page.post(page.accessToken);
          })
        );
      } catch (err) {
        console.log(err);
      }

      const ids: Array<string> = pages.map(page => page.id);
      console.log(
        `${post.id} post to pages; ${ids} at time: ${post.expireDate} body: ${post.context}`
      );
      //need to remove post from db
      try {
        await postRepository.remove(post);
        console.log(`post with id: ${post.id} has been removed`);
      } catch (err) {
        throw err;
      }
    }
  );

  return cron;
}
export async function update(post: Post): Promise<Job> {
  //task must be updated only if date is updated
  //For future (i think) mode may be updatd too
  const jobs = scheduledJobs;
  const job = jobs[post.id];
  rescheduleJob(job, post.expireDate);
  console.log(job.nextInvocation());
  return job;
}
export async function del(id: string): Promise<Job> {
  console.log(scheduledJobs);
  const jobs = scheduledJobs;
  const job = jobs[id];
  job.cancel();
  console.log(scheduledJobs);
  console.log(Job);
  return job;
}

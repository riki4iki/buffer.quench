import schedule from "./schedule";
import { getManager, Repository } from "typeorm";
import { Page, Post, Thread } from "../../../models";
import { ISocialPage } from "../../../types";
import { create as createLegend } from "../legend.service/crud";
export async function add(post: Post): Promise<void> {
   //need to create new task with name which contains post_id
   //For every post one task(cron job)
   //after creating job need save in to redis storage...
   try {
      const job = await schedule.create({
         id: post.id,
         expireDate: post.expireDate,
         cb: executer,
      });
      //save to redis!!!!
   } catch (err) {
      //logger
      console.log(err);
   }
}
export async function update(post: Post): Promise<void> {
   //task must be updated only if date is updated
   //For future (i think) mode may be updatd too
   try {
      const updated = await schedule.update({
         id: post.id,
         expireDate: post.expireDate,
         cb: null,
      });
      //update in redis
   } catch (err) {
      //need loger
      console.log(err);
   }
}
export async function del(id: string): Promise<void> {
   try {
      await schedule.del(id);
      //delete from redis
   } catch (err) {
      //logger
      console.log(err);
   }
}

async function executer(): Promise<void> {
   const postRepository: Repository<Post> = getManager().getRepository(Post);

   const pageRepository: Repository<Page> = getManager().getRepository(Page);

   //find target post by job.name with thread
   const post: Post = await postRepository.findOne({
      where: { id: this.name },
      relations: ["thread"],
   });
   const thread: Thread = post.thread;
   //find all pages by thread
   const pages: Array<Page> = await pageRepository.find({
      where: { thread: thread },
      relations: ["thread"],
   });

   //simple console logger. need rewrite
   const ids: Array<string> = pages.map(page => page.id);
   console.log(`i need loger for next: ${post.id} post to pages; ${ids} at time: ${post.expireDate} body: ${post.context}`);
   try {
      //find all social pages by finded thread pages. in those are stored id of social pages
      //maybe need change Promsie.all to other function.... cause it has one rejected status for all promises
      const socials: Array<ISocialPage> = await Promise.all(pages.map(async page => await page.toSocial()));

      const results: Array<boolean> = await Promise.all(
         socials.map(async page => {
            //now. page.post return boolean type for saving in legend table
            const result = await page.post(post.context);
            return result;
         }),
      );
      const reducer = results.reduce((value, reducer) => reducer && value);
      const legend = await createLegend(post, reducer);
      console.log(`create legend with ${legend.id}`);
   } catch (err) {
      console.log(err);
   } finally {
      //anyway need to remove executed post from
      console.log(`remove post with id: ${post.id} from database`);
      await postRepository.remove(post);
   }
}

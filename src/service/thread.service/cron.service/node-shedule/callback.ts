import { getManager, Repository } from "typeorm";
import { Page, Post, Thread } from "../../../../models";
import { ISocialPage, IExecuter } from "../../../../types";
import { create as createLegend } from "../../legend.service/crud";

export async function execute(): Promise<void> {
   const post = await getPost(this.name); // Job instance have name in property this.name

   const pages = await getPages(post.thread);

   //simple console logger. need rewrite
   console.log(`i need loger for next: ${post.id} post to pages; ${pages.map(page => page.id)} at time: ${post.expireDate} body: ${post.context}`);
   try {
      //find all social pages by finded thread pages. in those are stored id of social pages
      //maybe need change Promsie.all to other function.... cause it has one rejected status for all promises
      const socials: Array<ISocialPage> = await convertPages(pages);

      const results = await executePages(socials, post);

      const reducer = results.reduce((value, reducer) => reducer && value);
      // now results is boolean type, in future need create new entity!!!!
      const legend = await createLegend(post, reducer);
      console.log(`create legend with ${legend.id}`);
   } catch (err) {
      //logger with error level
      console.log(err);
   } finally {
      //anyway need to remove executed post from
      console.log(`remove post with id: ${post.id} from database`);
      await delPost(post);
   }
}
const getPost = async (id: string): Promise<Post> => {
   const postRepository: Repository<Post> = getManager().getRepository(Post);
   const post = await postRepository.findOne({ where: { id }, relations: ["thread"] });
   if (!post) {
      const err = new Error(`post {${id}} not found at execution`);
      throw err;
   }
   return post;
};
const delPost = async (post: Post) => {
   const postRepository: Repository<Post> = getManager().getRepository(Post);
   try {
      await postRepository.remove(post);
   } catch (QueryError) {
      const err = new Error(`post {${post.id}} removing exception: ${QueryError.message}`);
      throw err;
   }
};

const getPages = async (thread: Thread) => {
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const pages = await pageRepository.find({ where: { thread }, relations: ["thread"] });
   if (pages.length === 0) {
      ///why is this even happening?
   }
   return pages;
};
const convertPages = async (pages: Page[]): Promise<ISocialPage[]> => {
   const socials = Promise.all(pages.map(async page => await page.toSocial()));
   return await socials;
};
const executePages = async (socials: ISocialPage[], post: Post): Promise<boolean[]> => {
   const postResults = Promise.all(socials.map(async social => await social.post(post)));
   return await postResults;
};

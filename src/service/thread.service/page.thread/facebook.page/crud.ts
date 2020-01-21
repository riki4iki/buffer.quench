import { getManager, Repository } from "typeorm";
import { SocialType } from "../../../../types";
import { Page, FacebookPage, Thread, FacebookUser, User } from "../../../../models";
import { BadRequest } from "http-errors";

/**
 * Promise. Return all connected facebook pages to thread converted to Facebook Model
 * @param thread Thread - current thread taken by id
 */
export async function all(thread: Thread): Promise<Array<Page>> {
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const pages = await pageRepository.find({ thread: thread, type: SocialType.Facebook });
   return pages;
}
/**
 * Promise. Return target connected facebook page converted to Facebook model
 * @param thread Thread - current thread by id in before middleware
 * @param id String - uuid for identify page
 */
export async function target(thread: Thread, id: string): Promise<FacebookPage> {
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const page = await pageRepository.findOne({ id: id, thread: thread, type: SocialType.Facebook });
   if (!page) {
      const err = new BadRequest("page not found");
      throw err;
   } else {
      const social = await page.toSocial();
      return await (<FacebookPage>social).toResponse();
   }
}
export async function connect(user: User, thread: Thread, pages: Array<string>): Promise<Array<Page>> {
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const facebookPageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);

   //Getting pages in array so need process that in parallel
   const connection = Promise.all(
      pages.map(async requestPage => {
         const databasePage = await facebookPageRepository.findOne({ where: { id: requestPage }, relations: ["fbUser"] });
         if (!databasePage) {
            //input id doesn't match with facebook pages in database
            const err = new BadRequest(`page (${requestPage}) not found`);
            throw err;
         }
         const facebookUser = databasePage.fbUser;
         //Need check is dat page is page of connected facebook socials to system user
         const socials = (await user.withSocials()).social.filter(
            social => social.type === SocialType.Facebook && social.socialId === facebookUser.id,
         );
         if (!socials) {
            //page is not a page of connected facebook socials
            const err = new BadRequest(`page(${requestPage}) from social ${facebookUser.id} doesn't connected to user`);
            throw err;
         } else {
            //social is connected, find page in database maybe it's already connected
            const connected = await pageRepository.findOne({ thread: thread, pageId: requestPage });
            if (connected) {
               //page already connected to target thread
               return connected; //return databasse instance
               //maybe update access token
            } else {
               //create new connection
               const newPage = new Page();
               newPage.thread = thread;
               newPage.pageId = requestPage;
               newPage.type = SocialType.Facebook;

               const saved = await pageRepository.save(newPage);
               return saved;
            }
         }
      }),
   );
   return await connection;
}
/**
 * Promise. Delete raw from mediator Page that connect thread and facebook page
 * @param thread Thread - currnet thread taken by id from before middleware
 * @param id String - uuid resource for identify target connected page
 */
export async function disconnect(thread: Thread, id: string): Promise<Page> {
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const page = await pageRepository.findOne({ thread: thread, id: id });
   if (!page) {
      const err = new BadRequest("page not found");
      throw err;
   } else {
      const removed = await pageRepository.remove(page);
      return removed;
   }
}

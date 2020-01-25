import { getManager, Repository } from "typeorm";
import { BadRequest } from "http-errors";

import { IFacebookPage } from "../../../../types";
import { FacebookPage, Thread, FacebookUser } from "../../../../models";
import fb from "../../../../lib/facebook";

/**
 * Promise. Return all connected facebook pages to thread converted to Facebook Model
 * @param thread Thread - current thread taken by id
 */
export async function all(thread: Thread): Promise<Array<FacebookPage>> {
   const facebookPagesRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);
   const facebookPages = await facebookPagesRepository.find({ thread });
   const buildFacebookPages = async () => await Promise.all(facebookPages.map(async facebookPage => await facebookPage.toResponse()));
   return await buildFacebookPages();
}
/**
 * Promise. Return target connected facebook page converted to Facebook model
 * @param thread Thread - current thread by id in before middleware
 * @param id String - uuid for identify page
 */
export async function target(thread: Thread, id: string): Promise<FacebookPage> {
   const facebookPageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);
   const facebookPage = await facebookPageRepository.findOne({ id, thread });
   if (!facebookPage) {
      const err = new BadRequest("facebook page not found");
      throw err;
   } else {
      const response = await facebookPage.toResponse();
      return response;
   }
}
/**
 *  Promise - Connect facebook pages to thread by current user and facebook social page
 * @param user User - current user from ctx.state decoded from jwt access_token
 * @param thread Thread - thread for which facebook pages will be conected
 * @param facebookUserId String - socialId. Facebook user who owns input pages
 * @param facebookPages String[] - input facebook pages to be connect for thread
 */
export async function connectArrayPages(thread: Thread, facebookUserModel: FacebookUser, facebookPages: Array<string>) {
   //need call facebook api to take long_lived access_token for pages and make sure that connected pages are owned by facebook social
   const pagesByFacebookSocial = await filterPagesByFacebookUser(facebookUserModel, facebookPages);

   //connect validated pages to thread
   const connectedPaged = await connectPages(thread, facebookUserModel, pagesByFacebookSocial);
   return connectedPaged;
}
/**
 * Promise - Connect facebook pages to input thread
 * @param thread Thread - thread for which pages will be connected
 * @param facebookUser FacebookUser - facebook social instance who owns this pages
 * @param pages IFacebookPage[] - pages for connection
 */
async function connectPages(thread: Thread, facebookUser: FacebookUser, pages: IFacebookPage[]) {
   const facebookPageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);
   return Promise.all(
      pages.map(async page => {
         const pageFromDatabase = await facebookPageRepository.findOne({ fbId: page.id, thread: thread, fbUser: facebookUser });
         if (pageFromDatabase) {
            //page with id already connected to thread
            //here we can update page.access_token
            const toResponse = await pageFromDatabase.toResponse();
            return toResponse;
         } else {
            const newPage = new FacebookPage();
            newPage.accessToken = page.access_token;
            (newPage.fbId = page.id), (newPage.thread = thread);
            newPage.fbUser = facebookUser;
            const saved = await facebookPageRepository.save(newPage);
            const toResponse = await saved.toResponse();
            return toResponse;
         }
      }),
   );
}
/**
 * Promise - call facebook api to take long access_token and filter input pages for make sure that they owned that facebook social user
 * @param facebookUser FacebookUser - facebook social instance which pages will be connected
 * @param pages String[] - facebook pages to be filtered and called to api for long_lived access_token
 */
async function filterPagesByFacebookUser(facebookUser: FacebookUser, pages: Array<string>) {
   const apiPages = await fb.longLiveAccounts(facebookUser.accessToken, facebookUser.fbId);
   const ids = apiPages.map(page => page.id);
   const check = pages.every(page => ids.indexOf(page) > -1);
   if (check) {
      const toConnectPages = apiPages.filter(page => pages.includes(page.id));
      return toConnectPages;
   } else {
      const failed = pages.filter(page => !ids.includes(page));
      const err = new BadRequest(`input pages: [${failed}] are not accounts for user: ${facebookUser.id}`);
      throw err;
   }
}

/**
 * Promise. Delete raw from mediator Page that connect thread and facebook page
 * @param thread Thread - currnet thread taken by id from before middleware
 * @param id String - uuid resource for identify target connected page
 */
export async function disconnect(thread: Thread, id: string): Promise<FacebookPage> {
   const facebookPageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);
   const facebookPage = await facebookPageRepository.findOne({ where: { thread, id }, relations: ["thread"] });
   if (!facebookPage) {
      const err = new BadRequest("facebook page not found");
      throw err;
   } else {
      const removed = await facebookPageRepository.remove(facebookPage);
      return removed;
   }
}

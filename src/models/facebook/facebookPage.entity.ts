import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, BeforeRemove, getManager, Repository, AfterInsert } from "typeorm";
import { omit } from "lodash";
import { InternalServerError } from "http-errors";

import { fbService as fb } from "lib";
import { ISocialPage, IFacebookPicture, IResponsible, IBeforeRemover, IAfterInserter } from "types";
import { SocialType } from "types/architecture/SocialTypes"; // import directly cause of error export enums....

import FbUser from "./facebookUser.entity";
import Page from "../page.entity";
import Thread from "../thread.entity";
import Post from "../post.entity";

@Entity()
export default class FacebookPage implements ISocialPage, IResponsible<FacebookPage>, IBeforeRemover, IAfterInserter {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   social_id: string;

   @ManyToOne(
      () => FbUser,
      FbUser => FbUser.page,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   fbUser: FbUser;

   @ManyToOne(
      () => Thread,
      thread => thread.facebookPage,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   thread: Thread;

   @Column()
   accessToken: string;

   picture?: IFacebookPicture;
   name?: string;
   category?: string;

   async post(postInstace: Post) {
      const post = await fb.post(this.social_id, this.accessToken, postInstace.context);
      if (post.err) {
         console.log(`Error api post with page: ${this.id}, facebook_id: ${this.social_id}`);
         console.log(post.err);
         //Error with post to facebook by page
         return false;
      } else {
         return true;
      }
   }

   //#region typeorm events
   @BeforeRemove()
   async _delete?() {
      console.log(this.thread);
      const pageRepository: Repository<Page> = getManager().getRepository(Page);
      const masterPage = await pageRepository.findOne({ where: { pageId: this.id, thread: this.thread }, relations: ["thread"] });
      if (!masterPage) {
         console.log(`master page not found to facebook page: ${this.id}`);
         console.log(this);
      } else {
         const removed = await pageRepository.remove(masterPage);
         console.log(`from thread: {${removed.thread.id}} disconnected ${removed.type} page: {${removed.pageId}}`);
      }
   }
   @AfterInsert()
   async _create?() {
      const pageRepository: Repository<Page> = getManager().getRepository(Page);
      const masterPage = new Page();
      masterPage.thread = this.thread;
      masterPage.type = SocialType.Facebook;
      masterPage.pageId = this.id;
      const saved = await pageRepository.save(masterPage);
      console.log(`to thread: {${saved.thread.id}} connected ${saved.type} page: {${saved.id}}`);
   }
   //#endregion typeorm events
   //#region IResponsable
   public async toResponse(): Promise<FacebookPage> {
      try {
         const apiPage = await fb.accountByToken(this.accessToken);
         this.name = apiPage.name;
         this.category = apiPage.category;
         this.picture = apiPage.picture;
         return omit(this as FacebookPage, ["accessToken", "fbUser", "thread"]) as FacebookPage;
      } catch (err) {
         console.log(err);
         console.log(`Error with api call in toResponse method Facebook Page ${err.message}`);
         const serverErr = new InternalServerError("Error with facebook api call");
         throw serverErr;
      }
   }
   //#endregion IResponsable
}

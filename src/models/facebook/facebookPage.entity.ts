import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, BeforeRemove, AfterLoad, AfterRemove, getManager, Repository } from "typeorm";
import { fbService as fb } from "../../lib";
import FbUser from "./facebookUser.entity";
import ThreadPage from "../page.entity";
import { ISocialPage, IFacebookPicture, IResponsable, IBeforeRemover } from "../../types";
import { omit } from "lodash";
import { InternalServerError } from "http-errors";
@Entity()
export default class FacebookPage implements ISocialPage, IResponsable<FacebookPage>, IBeforeRemover {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   fbId: string;

   @ManyToOne(
      () => FbUser,
      FbUser => FbUser.page,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   fbUser: FbUser;

   @Column()
   accessToken: string;

   picture?: IFacebookPicture;
   name?: string;
   category?: string;

   async post(context) {
      const post = await fb.post(this.id, this.accessToken, context);
      if (post.err) {
         console.log(`Error api post with page: ${this.id}, facebook_id: ${this.fbId}`);
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
      //need find all threads where deleted page connected and delete page from Page table
      console.log(`page with ${this.id} must be disconnected from thread`);
      const pageRepository: Repository<ThreadPage> = getManager().getRepository(ThreadPage);
      const mediators: Array<ThreadPage> = await pageRepository.find({ where: { pageId: this.id }, relations: ["thread"] });
      console.log(mediators);
      const threads = mediators.map(item => item.thread.id);
      try {
         console.log(`remove facebook_page with ${this.id} from threads: ${threads}`);
         await pageRepository.remove(mediators);
      } catch (err) {
         console.log(`@BeforeRemove in facabook page error`);
      }
   }
   //#endregion typeorm events
   //#region IResponsable
   public async toResponse(): Promise<FacebookPage> {
      try {
         const apiPage = await fb.accountByToken(this.accessToken);
         this.name = apiPage.name;
         this.category = apiPage.category;
         this.picture = apiPage.picture;
         return <FacebookPage>omit(<FacebookPage>this, ["accessToken", "fbUser"]);
      } catch (err) {
         console.log(err);
         console.log(`Error with api call in toResponse method Facebook Page ${err.message}`);
         const serverErr = new InternalServerError("Error with facebook api call");
         throw serverErr;
      }
   }
   //#endregion IResponsable
}

import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, BeforeRemove, AfterLoad, AfterRemove, getManager, Repository } from "typeorm";
import { fbService as fb } from "../../lib";
import FbUser from "./facebookUser.entity";
import ThreadPage from "../page.entity";
import { ISocialPage, IFacebookPicture } from "../../types";
import { omit } from "lodash";

@Entity()
export default class FacebookPage implements ISocialPage {
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
      const id: string = this.fbId;
      const token: string = this.accessToken;
      const message: string = context;
      const post = await fb.post(id, token, message);
      if (post.err) {
         console.log(post.err);
         return false;
      } else {
         return true;
      }
   }
   @BeforeRemove()
   private async disconnectFromThreads?() {
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

   /*@AfterLoad()
   private async apiCall?() {
      try {
         const facebookPage = await fb.accountById(this.fbId, this.accessToken);
         this.name = facebookPage.name;
         this.category = facebookPage.category;
         this.picture = facebookPage.picture;
      } catch (err) {
         console.log(`Error with api call in @AfterLoad Facebook Page ${err.message}`);
         this.name = "undefined";
         this.category = "undefined";
         this.picture = null;
      }
   }*/

   public async toResponse?(): Promise<FacebookPage> {
      try {
         const apiPage = await fb.accountById(this.fbId, this.accessToken);
         this.name = apiPage.name;
         this.category = apiPage.category;
         this.picture = apiPage.picture;
         return <FacebookPage>omit(<FacebookPage>this, ["accessToken", "fbUser"]);
      } catch (err) {
         console.log(`Error with api call in toResponse method Facebook Page ${err.message}`);
      }
   }
}

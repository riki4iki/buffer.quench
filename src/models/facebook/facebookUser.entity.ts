import { Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, OneToMany, ManyToOne, AfterLoad, AfterInsert, BeforeRemove, getManager, Repository } from "typeorm";
import User from "../user.entity";
import Page from "./facebookPage.entity";
import { fbService as fb } from "../../lib";
import { IFacebookPicture } from "../../types";
import Social from "../social.entity";
import { omit } from "lodash";

@Entity()
@Index(["id"], { unique: true })
export default class FacebookUser {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   fbId: string;

   @Column()
   accessToken: string;

   @ManyToOne(
      () => User,
      user => user.facebookUser,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   user: User;

   @OneToMany(
      () => Page,
      page => page.fbUser,
   )
   page: Page;

   //Call from Facebook API using afterLoad decorator
   name?: string;
   picture?: IFacebookPicture;
   email: string;

   /*@AfterLoad()
   private async apiCall?() {
      try {
         const facebookUser = await fb.userById(this.fbId, this.accessToken);
         this.name = facebookUser.name;
         this.picture = facebookUser.picture;
         this.email = facebookUser.email;
      } catch (err) {
         console.log(`Error with facebook api call in @AfterLoad FacebookUser ${err.message}`);
         this.name = "";
         this.picture = null;
         this.email = "";
      }
   }*/
   @AfterInsert()
   private async create?() {
      const socialRepository = getManager().getRepository(Social);
      const newSocial = new Social();
      newSocial.type = "facebook";
      newSocial.user = this.user;
      newSocial.socialId = this.id;

      const saved = await socialRepository.save(newSocial);
      console.log(`new social for user ${this.user.id} with type ${saved.type}`);
   }

   public async toResponse(): Promise<FacebookUser> {
      try {
         const apiUser = await fb.userById(this.fbId, this.accessToken);
         this.name = apiUser.name;
         this.picture = apiUser.picture;
         this.email = apiUser.email;
         return <FacebookUser>omit(<FacebookUser>this, "accessToken");
      } catch (err) {
         console.log(`Error in FacebookUser toResponse ${err.message}`);
      }
   }
   @BeforeRemove()
   private async del?() {
      const socialRepository = getManager().getRepository(Social);
      const social = await socialRepository.findOne({ socialId: this.id, user: this.user });
      if (!social) {
         console.log(`throw error with beforeRemove in facebook social`);
      } else {
         console.log(social);
         console.log(`facebook social with facebook_id: ${this.fbId} for user ${this.user.id} has been removed`);
         const removed = await socialRepository.remove(social);
      }
   }

   @BeforeRemove()
   private async delPages?() {
      const pageRepository: Repository<Page> = getManager().getRepository(Page);
      const pages: Array<Page> = await pageRepository.find({ where: { fbUser: this }, relations: ["fbUser"] });
      try {
         const removed = await pageRepository.remove(pages);
      } catch (err) {
         console.log(`Error in @BeforeRemove Facebook user with pages removing`);
         console.log(err);
      }
   }
}

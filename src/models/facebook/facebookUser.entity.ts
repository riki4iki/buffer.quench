import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   Index,
   JoinColumn,
   OneToMany,
   ManyToOne,
   AfterInsert,
   BeforeRemove,
   getManager,
   Repository,
} from "typeorm";
import User from "../user.entity";
import Page from "./facebookPage.entity";
import { fbService as fb } from "../../lib";
import { IFacebookPicture, IResponsible, IAfterInserter, IBeforeRemover } from "../../types";
import Social from "../social.entity";
import { omit } from "lodash";
import { InternalServerError } from "http-errors";

@Entity()
@Index(["id"], { unique: true })
export default class FacebookUser implements IResponsible<FacebookUser>, IAfterInserter, IBeforeRemover {
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
   page: Page[];

   //from facebook api after toResponse method call
   name?: string;
   picture?: IFacebookPicture;
   email?: string;

   //#region IResponsable
   public async toResponse(): Promise<FacebookUser> {
      try {
         const apiUser = await fb.getUser(this.accessToken);
         this.name = apiUser.name;
         this.picture = apiUser.picture;
         this.email = apiUser.email;
         return <FacebookUser>omit(<FacebookUser>this, ["accessToken", "user"]);
      } catch (err) {
         console.log(err);
         console.log(`Error in FacebookUser toResponse ${err.message}`);
         const serverErr = new InternalServerError("Error with facebook api call");
         throw serverErr;
      }
   }
   //#endregion IResposable
   //#region typeorm events
   @AfterInsert()
   async _create?() {
      const socialRepository = getManager().getRepository(Social);
      const newSocial = new Social();
      newSocial.type = "facebook";
      newSocial.user = this.user;
      newSocial.socialId = this.id;

      const saved = await socialRepository.save(newSocial);
      console.log(`to user {${saved.user.id}} connected new social {${saved.socialId}} with type ${saved.type}`);
   }

   @BeforeRemove()
   async _delete?() {
      const socialRepository = getManager().getRepository(Social);
      const social = await socialRepository.findOne({ where: { socialId: this.id, user: this.user }, relations: ["user"] });
      if (!social) {
         console.log(`throw error with beforeRemove in facebook social`);
         console.log(this);
      } else {
         console.log(social);
         const removed = await socialRepository.remove(social);
         console.log(`from user {${removed.user.id}} disconnected social {${removed.socialId}} with type ${removed.type}`);
      }
   }
   //#endregion typeorm events
   /**
    * Before disconnect facebook-social delete all pages with dat social. {onDeleting: "CASCADE"} - doesn't emit BeforeRemove in facebookPages entities
    */
   @BeforeRemove()
   private async delPages?() {
      const pageRepository: Repository<Page> = getManager().getRepository(Page);
      const pages: Array<Page> = await pageRepository.find({ where: { fbUser: this }, relations: ["fbUser"] });
      try {
         const removed = await pageRepository.remove(pages);
      } catch (err) {
         //Need logger or catch???
         console.log(`Error in @BeforeRemove Facebook user with pages removing`);
         console.log(err);
      }
   }
}

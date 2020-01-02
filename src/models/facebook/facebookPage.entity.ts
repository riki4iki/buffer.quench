import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { fbService as fb } from "../../lib";
import FbUser from "./facebookUser.entity";
import { ISocialPage } from "../../types";
import { IsUrl } from "class-validator";
@Entity()
export default class FacebookPage implements ISocialPage {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   fbId: string;

   @ManyToOne(
      () => FbUser,
      FbUser => FbUser.page,
      { onDelete: "CASCADE" }
   )
   @JoinColumn()
   fbUser: FbUser;

   @Column()
   @IsUrl()
   source: string;

   @Column()
   accessToken: string;

   @Column("simple-array")
   tasks: string[];

   @Column()
   category: string;

   @Column()
   name: string;

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
      console.log(post);
   }
}

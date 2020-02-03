import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, OneToMany, BeforeInsert, BeforeUpdate, Repository, getManager } from "typeorm";
import { Length, IsEmail } from "class-validator";
import { HmacSHA1 } from "crypto-js";
import { Unauthorized } from "http-errors";
import { omit } from "lodash";

import { IResponsible } from "../types/";
import Refresh from "./refresh.entity";
import FacebookUser from "./facebook/facebookUser.entity";
import Thread from "./thread.entity";
import Social from "./social.entity";

@Entity()
@Index(["email"], { unique: true })
export default class User implements IResponsible<User> {
   //#region Body
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   @IsEmail()
   email: string;

   @Column()
   @Length(5, 30)
   password: string;

   //#endregion Body

   //#region Relations
   @OneToOne(
      () => Refresh,
      refresh => refresh.user,
      { onDelete: "CASCADE" },
   )
   refresh: Refresh;
   //#region  socials
   @OneToMany(
      () => Social,
      social => social.user,
      { onDelete: "CASCADE" },
   )
   social: Social[];

   @OneToMany(
      () => FacebookUser,
      facebookUser => facebookUser.user,
      { onDelete: "CASCADE" },
   )
   facebookUser: FacebookUser[];
   //#endregion socials
   @OneToMany(
      () => Thread,
      thread => thread.user,
      { onDelete: "CASCADE" },
   )
   thread: Thread[];

   //#endregion Relations

   //#region Methods
   public async toResponse(): Promise<User> {
      const cutted = omit(this as User, "password");
      return cutted as User;
   }

   public async checkPassword(target: string): Promise<boolean> {
      if (!(this.password === HmacSHA1(target, process.env.hash_key).toString())) {
         const error = new Unauthorized("invalid password");
         throw error;
      } else {
         return true;
      }
   }

   public async withSocials(): Promise<User> {
      if (!this.social) {
         const socialRepository: Repository<Social> = getManager().getRepository(Social);
         const socials = await socialRepository.find({ user: this });
         this.social = socials.map(social => omit(social, "id") as Social);
      } else {
         this.social = this.social.map(social => omit(social, "id") as Social); //chanhe to response(social.toREposnse())
      }
      return await this.toResponse();
   }

   //#region typeorm events
   @BeforeInsert()
   @BeforeUpdate()
   private async createHash?() {
      this.password = HmacSHA1(this.password, process.env.hash_key).toString();
   }

   //#endregion typeorm events

   //#endregion Methods
}

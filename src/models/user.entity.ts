import {
   Entity,
   Column,
   PrimaryGeneratedColumn,
   Index,
   OneToOne,
   OneToMany,
   BeforeInsert,
   BeforeUpdate,
   AfterLoad,
   Repository,
   getManager,
   getRepository,
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import { HmacSHA1 } from "crypto-js";
import { Unauthorized } from "http-errors";
import { omit } from "lodash";

import Refresh from "./refresh.entity";
import FacebookUser from "./facebook/facebookUser.entity";
import Thread from "./thread.entity";
import Social from "./social.entity";

@Entity()
@Index(["email"], { unique: true })
export default class User {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   @IsEmail()
   email: string;

   @Column()
   @Length(5, 30)
   password: string;

   @OneToOne(
      () => Refresh,
      refresh => refresh.user,
      { onDelete: "CASCADE" },
   )
   refresh: Refresh;

   @OneToMany(
      () => FacebookUser,
      facebookUser => facebookUser.user,
      { onDelete: "CASCADE" },
   )
   facebookUser: FacebookUser[];

   @OneToMany(
      () => Thread,
      thread => thread.user,
      { onDelete: "CASCADE" },
   )
   thread: Thread[];

   @OneToMany(
      () => Social,
      social => social.user,
      { onDelete: "CASCADE" },
   )
   social: Social[];

   public async removePassword(): Promise<User> {
      const cutted = omit(<User>this, "password");
      return <User>cutted;
   }

   public async checkPassword(target: string): Promise<boolean> {
      if (!(this.password === HmacSHA1(target, process.env.hash_key).toString())) {
         const error = new Unauthorized("invalid password");
         throw error;
      } else {
         return true;
      }
   }

   @BeforeInsert()
   @BeforeUpdate()
   private async createHash?() {
      this.password = HmacSHA1(this.password, process.env.hash_key).toString();
   }

   public async withSocials(): Promise<User> {
      if (!this.social) {
         const socialRepository: Repository<Social> = getManager().getRepository(Social);
         const socials = await socialRepository.find({ user: this });
         this.social = socials.map(social => <Social>omit(social, "id"));
      } else {
         this.social = this.social.map(social => <Social>omit(social, "id"));
      }
      return <User>omit(<User>this, "password");
   }
}

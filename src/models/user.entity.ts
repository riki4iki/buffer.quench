import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Length, IsEmail } from "class-validator";
import { HmacSHA1 } from "crypto-js";
import { Unauthorized } from "http-errors";

import Refresh from "./refresh.entity";
import FacebookUser from "./facebook/facebookUser.entity";
import Thread from "./thread.entity";

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
      { onDelete: "CASCADE" }
   )
   refresh: Refresh;

   @OneToMany(
      () => FacebookUser,
      facebookUser => facebookUser.user,
      { onDelete: "CASCADE" }
   )
   facebookUser: FacebookUser;

   @OneToMany(
      () => Thread,
      thread => thread.user,
      { onDelete: "CASCADE" }
   )
   thread: Thread;

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
}

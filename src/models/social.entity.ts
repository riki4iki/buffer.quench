import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getManager, Repository } from "typeorm";
import { ISocial, SocialType } from "../types";
import SystemUser from "./user.entity";

@Entity()
export default class Social {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @ManyToOne(
      () => SystemUser,
      sysUser => sysUser.social,
      { onDelete: "CASCADE" },
   )
   user: SystemUser;

   @Column("enum", { enum: SocialType, name: "page_type" })
   type: string;

   @Column("uuid")
   socialId: string;
}

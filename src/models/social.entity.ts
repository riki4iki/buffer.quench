import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getManager, Repository } from "typeorm";

import { omit } from "lodash";
import { IResponsible } from "../types";
import { SocialType } from "../types/architecture/SocialTypes";
import SystemUser from "./user.entity";
@Entity()
export default class Social implements IResponsible<Social> {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @ManyToOne(
      () => SystemUser,
      sysUser => sysUser.social,
      { onDelete: "CASCADE" },
   )
   user: SystemUser;

   @Column("enum", { enum: SocialType })
   type: string;

   @Column("uuid")
   socialId: string;

   public async toResponse(): Promise<Social> {
      const cutted = omit(this as Social, "id");
      return cutted as Social;
   }
}

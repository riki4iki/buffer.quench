import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getManager, Repository } from "typeorm";

import { omit } from "lodash";
import { SocialType, IResponsable } from "../types";
import SystemUser from "./user.entity";

@Entity()
export default class Social implements IResponsable<Social> {
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

   public async toResponse(): Promise<Social> {
      const cutted = omit(<Social>this, "id");
      return <Social>cutted;
   }
}

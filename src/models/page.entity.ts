import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { omit } from "lodash";

import { ISocialPage, IResponsible, PageGetterFactory } from "types";
import { SocialType } from "types/architecture/SocialTypes"; //import directly because from indexs chains return 'undefined' in tests.....

import Thread from "./thread.entity";

@Entity()
export default class Page implements IResponsible<Page> {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @ManyToOne(
      () => Thread,
      thread => thread.page,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   thread: Thread;

   @Column("enum", { enum: SocialType })
   type: string;

   @Column("uuid")
   pageId: string;

   async toSocial(): Promise<ISocialPage> {
      const getter = await PageGetterFactory.createGetter(this.type);
      const social = await getter(this.thread, this.pageId);
      return social;
   }

   public async toResponse(): Promise<Page> {
      const response = omit(this as Page, "id");
      return response as Page;
   }
}

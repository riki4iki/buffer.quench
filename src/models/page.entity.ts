import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Repository, getManager } from "typeorm";
import Thread from "./thread.entity";
import { SocialType, ISocialPage, IResponsable, PageGetterFactory } from "../types";
import { omit } from "lodash";
@Entity()
export default class Page implements IResponsable<Page> {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @ManyToOne(
      () => Thread,
      thread => thread.page,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   thread: Thread;

   @Column("enum", { enum: SocialType, name: "page_type" })
   type: string;

   @Column("uuid")
   pageId: string;

   async toSocial(): Promise<ISocialPage> {
      const getter = await PageGetterFactory.createGetter(this.type);
      const social = await getter(this.thread, this.pageId);
      return social;
   }

   public async toResponse(): Promise<Page> {
      const response = omit(<Page>this, "id");
      return <Page>response;
   }
}

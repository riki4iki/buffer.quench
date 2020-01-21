import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Repository, getManager } from "typeorm";
import Thread from "./thread.entity";
import { SocialType, ISocialPage } from "../types";
import FacebookPage from "./facebook/facebookPage.entity";
@Entity()
export default class Page {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @ManyToOne(
      () => Thread,
      thread => thread.posts,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   thread: Thread;

   @Column("enum", { enum: SocialType, name: "page_type" })
   type: string;

   @Column("uuid")
   pageId: string;

   async toSocial(): Promise<ISocialPage> {
      const page: Page = this;
      if (page.type === SocialType.Facebook) {
         const facebookPageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);
         const facebookPage = await facebookPageRepository.findOne(page.pageId);
         if (!facebookPage) {
            console.log(`error with converting to social page type: ${page.type}, id in social table should be ${page.pageId}`);
         } else {
            return facebookPage;
         }
      } else if (page.type === SocialType.Instagram) {
         console.log("no handler for instagram page");
      } else if (page.type === SocialType.Twitter) {
         console.log("no handler for instagram page");
      }
   }
}

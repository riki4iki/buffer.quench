import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import Thread from "./thread";
import { PageType, ISocialPage } from "../interfaces";
@Entity()
export default class Page {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => Thread,
    thread => thread.posts,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  thread: Thread;

  @Column("enum", { enum: PageType, name: "page_type" })
  type: string;

  @Column("uuid")
  pageId: string;

  async toSocial() {
    console.log(this);
  }
}

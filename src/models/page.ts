import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import Thread from "./thread";
import { IPage, IPageType } from "../interfaces";
@Entity()
export default class Page implements IPage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => Thread,
    thread => thread.posts,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  thread: Thread;

  @Column("text")
  type: IPageType;

  @Column()
  accessToken: string;
}

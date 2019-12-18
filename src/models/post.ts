import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from "typeorm";
import Thread from "./thread";

@Entity()
export default class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  body: string;

  @Column("timestamptz")
  expireIn: Date;

  @ManyToOne(
    () => Thread,
    thread => thread.posts,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  thread: Thread;
}

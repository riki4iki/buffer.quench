import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from "typeorm";
import Thread from "./thread";
import { IsDate, IsNotEmpty } from "class-validator";

@Entity()
export default class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  @Column("text")
  context: string;

  @IsDate()
  @Column("timestamptz")
  expireDate: Date;

  @ManyToOne(
    () => Thread,
    thread => thread.posts,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  thread: Thread;
}

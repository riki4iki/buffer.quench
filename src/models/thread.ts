import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { MinLength, MaxLength, IsString } from "class-validator";
import User from "./user";
import Post from "./post";
import Legend from "./legend";
@Entity()
export default class Thread {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString()
  @MinLength(6, { message: "Thread name is too short, min size is 6 symbols" })
  @MaxLength(30, { message: "Thread name is too long, max size is 30 symbols" })
  name: string;

  @ManyToOne(
    () => User,
    user => user.thread,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  user: User;

  @OneToMany(
    () => Post,
    post => post.thread,
    { onDelete: "CASCADE" }
  )
  posts: Post[];
  @OneToMany(
    () => Legend,
    history => history.thread,
    { onDelete: "CASCADE" }
  )
  hisotry: Legend;
}

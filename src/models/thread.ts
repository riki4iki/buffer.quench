import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import User from "./user";
import Post from "./post";
@Entity()
export default class Thread {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
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
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  ManyToMany
} from "typeorm";
import User from "../user";
import Page from "./facebookPage";

@Entity()
@Index(["id"], { unique: true })
export default class FacebookUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fbId: string;

  @Column()
  accessToken: string;

  @ManyToOne(
    () => User,
    user => user.facebookUser,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  user: User;

  @OneToMany(
    () => Page,
    page => page.fbUser,
    { onDelete: "CASCADE" }
  )
  page: Page;
}

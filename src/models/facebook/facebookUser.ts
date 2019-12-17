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
    type => User,
    user => user.facebookUser
  )
  @JoinColumn()
  user: User;

  @OneToMany(
    type => Page,
    page => page.fbUser
  )
  page: Page;
}

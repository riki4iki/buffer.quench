import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from "typeorm";
import User from "../user";
import Page from "./facebookPage";

@Entity()
@Index(["id"], { unique: true })
export default class FacebookUser {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  accessToken: string;

  @OneToOne(
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

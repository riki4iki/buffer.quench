import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  ManyToMany,
  JoinTable
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

  @ManyToMany(type => User)
  @JoinTable()
  users: User[];

  @OneToMany(
    type => Page,
    page => page.fbUser
  )
  page: Page;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index
} from "typeorm";
import User from "./user";

@Entity()
@Index(["fb_id"], { unique: true })
export default class FacebookUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  picture: string;

  @Column()
  email: string;

  @Column()
  fb_id: string;

  @Column()
  fb_token: string;

  @Column()
  @ManyToOne(
    type => User,
    user => user.id
  )
  user: string;
}

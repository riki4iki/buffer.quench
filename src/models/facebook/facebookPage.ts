import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import FbUser from "./facebookUser";
import { ISocialPage } from "interfaces";
import { IsUrl } from "class-validator";
@Entity()
export default class FacebookPage implements ISocialPage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fbId: string;

  @ManyToOne(
    () => FbUser,
    FbUser => FbUser.page,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  fbUser: FbUser;

  @Column()
  @IsUrl()
  source: string;

  @Column()
  accessToken: string;

  @Column("simple-array")
  tasks: string[];

  @Column()
  category: string;

  @Column()
  name: string;

  async post(token) {
    console.log(token);
  }
}

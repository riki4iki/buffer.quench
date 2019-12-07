import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";
import FbUser from "./facebookUser";

@Entity()
export default class FacebookPage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  page_token: string;

  @Column()
  page_id: string;

  @Column()
  @ManyToOne(
    type => FbUser,
    FbUser => FbUser.id
  )
  @JoinColumn()
  fbUser: string;
}

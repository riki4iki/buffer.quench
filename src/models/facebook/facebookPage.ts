import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne
} from "typeorm";
import FbUser from "./facebookUser";
import Page from "../page";

@Entity()
export default class FacebookPage {
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

  @OneToOne(
    () => Page,
    page => page.id,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  page: string;
}

import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import FbUser from "./facebookUser";
import Page from "../page";

@Entity()
export default class FacebookPage extends Page {
  @Column()
  fbId: string;

  @ManyToOne(
    () => FbUser,
    FbUser => FbUser.page,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  fbUser: FbUser;
}

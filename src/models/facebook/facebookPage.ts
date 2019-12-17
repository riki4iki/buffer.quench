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
  fbId: string;

  @Column()
  accessToken: string;

  @Column()
  name: string;

  @Column("simple-array")
  tasks: string[];

  @ManyToOne(
    () => FbUser,
    FbUser => FbUser.page,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  fbUser: FbUser;
}

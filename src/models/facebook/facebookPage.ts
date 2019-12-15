import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn
} from "typeorm";
import FbUser from "./facebookUser";

@Entity()
export default class FacebookPage {
  @PrimaryColumn()
  id: string;

  @Column()
  accessToken: string;

  @Column()
  name: string;

  @Column("simple-array")
  tasks: string[];

  @ManyToOne(
    type => FbUser,
    FbUser => FbUser.page
  )
  @JoinColumn()
  fbUser: FbUser;
}

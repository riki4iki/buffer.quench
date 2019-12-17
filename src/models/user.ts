import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  OneToMany
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import Refresh from "./refresh";
import FacebookUser from "./facebook/facebookUser";
@Entity()
@Index(["email"], { unique: true })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(5, 30)
  password: string;

  @OneToOne(
    () => Refresh,
    refresh => refresh.user,
    { onDelete: "CASCADE" }
  )
  refresh: Refresh;

  @OneToMany(
    () => FacebookUser,
    facebookUser => facebookUser.user,
    { onDelete: "CASCADE" }
  )
  facebookUser: FacebookUser;
}

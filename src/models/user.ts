import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
import { Length, IsEmail } from "class-validator";
import Refresh from "./refresh";
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
}

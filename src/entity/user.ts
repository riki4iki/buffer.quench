import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  Index
} from "typeorm";
import { Length, IsEmail, IsUUID, IsArray } from "class-validator";

@Entity()
@Index(["email"], { unique: true })
export default class User {
  @PrimaryGeneratedColumn("uuid")
  @Generated("uuid")
  id: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(5, 30)
  password: string;
}

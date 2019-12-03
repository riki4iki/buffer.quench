import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from "typeorm";
import User from "./user";
@Entity()
export default class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @OneToOne(
    type => User,
    user => user.id
  )
  @JoinColumn()
  user: string;

  @Column()
  token: string;
}

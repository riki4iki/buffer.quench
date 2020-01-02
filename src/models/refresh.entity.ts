import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import User from "./user.entity";
@Entity()
export default class RefreshToken {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @OneToOne(
      () => User,
      user => user.refresh,
      { onDelete: "CASCADE" }
   )
   @JoinColumn()
   user: User;

   @Column()
   token: string;
}

import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import Thread from "./thread.entity";

import { IsDate, IsNotEmpty, ValidatorConstraint, ValidatorConstraintInterface, Validate } from "class-validator";
@ValidatorConstraint({ name: "isFuture", async: false })
class IsFuture implements ValidatorConstraintInterface {
   validate(date: Date) {
      const now = new Date();
      return date > now;
   }
   defaultMessage() {
      return "impossible set date in past time";
   }
}
@Entity()
export default class Post {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @IsNotEmpty()
   @Column("text")
   context: string;

   @IsDate()
   @Validate(IsFuture)
   @Column("timestamptz")
   expireDate: Date;

   @ManyToOne(
      () => Thread,
      thread => thread.posts,
      { onDelete: "CASCADE" },
   )
   @JoinColumn()
   thread: Thread;
}

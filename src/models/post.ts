import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from "typeorm";
import Thread from "./thread";

import {
  IsDate,
  IsNotEmpty,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate
} from "class-validator";
@ValidatorConstraint({ name: "isNow", async: false })
class IsNow implements ValidatorConstraintInterface {
  validate(date: Date) {
    const now = new Date();
    return date > now;
  }
  defaultMessage() {
    return "Imposible set date before current";
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
  @Validate(IsNow)
  @Column("timestamptz")
  expireDate: Date;

  @ManyToOne(
    () => Thread,
    thread => thread.posts,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  thread: Thread;
}

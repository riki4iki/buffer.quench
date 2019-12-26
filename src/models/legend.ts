import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsDate, IsNotEmpty, IsBoolean } from "class-validator";
import Thread from "./thread";

@Entity()
export default class Legend {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsNotEmpty()
  @Column("text")
  context: string;

  @IsDate()
  @Column("timestamptz")
  expireDate: Date;

  @Column()
  @IsBoolean()
  status: boolean;

  @ManyToOne(
    () => Thread,
    thread => thread.hisotry,
    { onDelete: "CASCADE" }
  )
  thread: Thread;

  //In future need to add property for post id in social.....
  //In future need to add error property
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsDate, IsNotEmpty, IsBoolean, ValidatorConstraint, ValidatorConstraintInterface, Validate } from "class-validator";
import Thread from "./thread.entity";

@ValidatorConstraint({ name: "isPast", async: false })
class IsPast implements ValidatorConstraintInterface {
   validate(date: Date) {
      const now = new Date();
      return date < now;
   }
   defaultMessage() {
      return "impossible set date in past time";
   }
}

@Entity()
export default class Legend {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @IsNotEmpty()
   @Column("text")
   context: string;

   @IsDate()
   @Validate(IsPast)
   @Column("timestamptz")
   expireDate: Date;

   @Column()
   @IsBoolean()
   status: boolean;

   @ManyToOne(
      () => Thread,
      thread => thread.legend,
      { onDelete: "CASCADE" },
   )
   thread: Thread;

   //In future need to add property for post id in social.....
   //In future need to add error property
}

import { BaseEntity } from "./BaseEntity";
import { Entity, Property } from "@mikro-orm/core";

@Entity()
export class Exam extends BaseEntity {
  constructor() {
    super();
  }

  @Property()
  name!: string;


  @Property()
  code!: string;

  @Property()
  duration!: number; //minutes

  @Property()
  numberOfQuestions!: number;

  @Property()
  subjectId!: number;


}
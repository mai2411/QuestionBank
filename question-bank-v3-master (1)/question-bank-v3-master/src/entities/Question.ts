import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Question extends BaseEntity {
  constructor() {
    super();
  }

  @Property()
  question!: string;

  @Property()
  answerA!: string;

  @Property()
  answerB!: string;

  @Property()
  answerC!: string;

  @Property()
  answerD!: string;

  @Property()
  correctAnswer!: string;

  @Property()
  subjectId!: number;

}
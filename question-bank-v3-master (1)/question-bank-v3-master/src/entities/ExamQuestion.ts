import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class ExamQuestion extends BaseEntity {
  constructor() {
    super();
  }

  @Property()
  examId!: number;

  @Property()
  questionId!: number;

  @Property()
  questionOrder!: number;

  @Property()
  variantCode!: string;

  @Property()
  questionText!: string;

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

}
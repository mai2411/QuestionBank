import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
@Entity()
export class Subject extends BaseEntity {
  constructor() {
    super();
  }

  @Property()
  name!: string;

  @Property()
  code!: string;

  @Property({
    nullable: true,
    type: 'text',
  })
  description?: string;

}
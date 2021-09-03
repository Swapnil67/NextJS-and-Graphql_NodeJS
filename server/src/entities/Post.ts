import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";


@ObjectType() // Used to convert the class to graphql type
@Entity()
export class Post {
  @Field(() => Int) // Exposing id to graphql schema
  @PrimaryKey()
  id!: number;
  
  @Field() // Exposing title to graphql schema
  @Property({type: 'text'})
  title!: string;
  
  @Field(() => String) // Exposing createdAt to graphql schema
  @Property({type: "date"})
  createdAt = new Date();
  
  @Field(() => String) // Exposing updatedAt to graphql schema
  @Property({type: "date", onUpdate: () => new Date()})
  updatedAt = new Date();
}
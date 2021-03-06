import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";


@ObjectType() // Used to convert the class to graphql type
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int) // Exposing id to graphql schema
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field() // Exposing title to graphql schema
  @Column()
  title!: string;
 
  @Field() // Exposing title to graphql schema
  @Column()
  text!: string;
 
  @Field() // Exposing title to graphql schema
  @Column({type: "int", default: 0})
  points!: number;

  @Field()
  @Column()
  creatorId: number;
  
  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @Field(() => String) // Exposing createdAt to graphql schema
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt = Date;
  
  @Field(() => String) // Exposing updatedAt to graphql schema
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt = Date;
}

// ---------------------------- Schema Using Mikro-ORM -----------------------------

/*
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
*/
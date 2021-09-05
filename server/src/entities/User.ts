import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;
  
  @Field()
  @Column({ unique: true })
  email!: string;
  
  @Column()
  password!: string;
 
  @Field(() => String)
  @Column({ nullable: true, default: null })
  forgotPassToken!: string;
  
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
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({type: "text", unique: true})
  username!: string;
  
  @Field()
  @Property({type: "text", unique: true})
  email!: string;
  
  @Property({type: "text"})
  password!: string;
 
  @Field(() => String)
  @Property({type: "date", onUpdate: () => new Date()})
  updatedAt = new Date();

  @Field(() => String)
  @Property({type: "date"})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: "text", nullable: true})
  forgotPassToken!: string;
}
*/
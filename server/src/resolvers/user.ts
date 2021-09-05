import { User } from "../entities/User";
import { MyContext } from "../types";
import argon2 from "argon2";
import { Arg, Args, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
import {sign} from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/registerValidator";
import { sendEmail } from "../utils/sendEmail";



@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];
  @Field(() => User, {nullable: true})
  user?: User;
  @Field(() => String, {nullable: true})
  token?: String;
}

@Resolver()
export class UserResolver {

  @Mutation(() => UserResponse)
  async updatePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() {em} : MyContext
  ): Promise<UserResponse> {
    if(newPassword.length <= 2) {
      return {
        errors: [{
          field: "newPassword",
          message: "Length must be greater than 2"
        }]
      } 
    } 

    const decoded = jwt.verify(token,  "keep_it_secret")
    const user = await em.findOne(User, {id: Number(decoded?.sub)})
    console.log(jwt.verify(token,  "keep_it_secret"));
    
    if(!user || user?.forgotPassToken !== token) {
      return {
        errors: [{
          field: "token",
          message: "Token Expired"
        }]
      }
    }
    user.password = await argon2.hash(newPassword);
    console.log(user);
    user.forgotPassToken = "Your token is now Expired";
    await em.persistAndFlush(user);
    return {
      user
    };
  }

  @Mutation(() => Boolean) 
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {em} : MyContext
  ) {
    console.log("Sending Mail");
    
    const user = await em.findOne(User, {email});
    if(!user) return true; // No User Exists with that Email
    const tokenSetDate = new Date();
    const tokenExpiresTimeStamp = tokenSetDate.setDate(tokenSetDate.getDate() + 3);
    const tokenExpiresDate = new Date(tokenExpiresTimeStamp)
    const token = sign({ sub: user.id, expires:  tokenExpiresDate}, "keep_it_secret")
    user.forgotPassToken = token;
    await em.persistAndFlush(user);
    const changePass = `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
    await sendEmail(email, changePass);
    return true;
  }

  @Query(() => User, {nullable: true})
  async me(
    @Ctx() { req, res, em, userId}: MyContext
  ): Promise<User | null> {
    console.log(req?.headers);
    let token = req?.headers?.cookie?.split('=')[1]
    console.log("Token from me: ", token);
    let user = null;
    if(token) {
      const { sub }: any = jwt.verify(token, "keep_it_secret");
      user = await em.findOne(User, {id: sub});
    }else if(userId && req?.headers?.authorization){
      user = await em.findOne(User, {id: userId});
    }
    return user;
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ): Promise<UserResponse> {
    
    const errors = validateRegister(options)
    if(errors) {
      return { errors }
    }

    if(await em.findOne(User, {username: options.username})){
      return {
        errors: [{
          field: "username",
          message: "Username is already taken"
        }]
      }
    }
    const hashedPassword = await argon2.hash(options.password)
    let user;
    try {
      // await em.persistAndFlush(user);
     const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          email: options.email,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning("*")
        console.log(result);
        
     user = result[0];
    } catch (err) {
      console.log(err);
      return {
        errors: [{
          field: "username",
          message: "Something Bad Happened!"
        }]
      }
    }
    return {
      user
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { em, req, res }: MyContext
  ): Promise<UserResponse> {
    let query = undefined;
    if(usernameOrEmail.includes('@'))  query = {email: usernameOrEmail}
    else  query = {username: usernameOrEmail}
    console.log("Login Process", query);
    
    const user = await em.findOne(User, query);
    if(!user) {
      return {
        errors: [{
          field: "usernameOrEmail",
          message: "That username doesn't exists"
        }]
      }
    }
    const isValid = await argon2.verify(user.password, password);
    if(!isValid) {
      return {
        errors: [{
          field: "password",
          message: "Incorrrect"
        }]
      }
    }
    
    const token = sign({ sub: user.id }, "keep_it_secret")
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,  // and won't be usable outside of my domain
      maxAge: 1000 * 60 * 60 * 24 //10 years
    })
    console.log(token);
    
    return {
      user,
      token
    }
  }

  
  @Mutation(() => Boolean)
  async logout(
    @Ctx() {res, req}: MyContext
  ) {
    console.log("Logged Out");
    // res.clearCookie("token", {domain: "http://localhost:3000", path: "/"});
    res.clearCookie('mycookies', { expires: new Date(), path: '/' });
    return true
  }

  @Query(() => [User])
  async allUser(
    @Ctx() {em}: MyContext
  ): Promise<User[]> {
    const users = await em.find(User, {});
    return users;
  }
}

/*
mutation LoginUser($loginOptions: UsernamePasswordInput!) {
  login(options: $loginOptions) {
    errors {
      field,
      message
    }
    user {
      id,
      username
    }
  }
}

{
  "loginOptions": {
    "username": "vegeta",
    "password": "test1234"
  }
}
*/

// https://www.youtube.com/watch?v=Aw3G2jR-5IM
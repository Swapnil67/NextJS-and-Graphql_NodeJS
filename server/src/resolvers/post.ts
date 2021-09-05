import { Post } from "../entities/Post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";

@Resolver()
export class PostResolver {

  @Query(() => [Post]) // Graphql type
  async posts(): Promise<Post[]> {
    const posts = await Post.find();
    // console.log(posts);
    return posts;
  }

  @Query(() => Post, {nullable: true}) // Similar to type script <Post | null>
  async post(
    @Arg('id') id: number,
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id)
    return post;
  }

  @Mutation(() => Post) 
  async createPost(
    @Arg("title") title: string,
  ): Promise<Post> {
    // const post = Post.create({title}).save();
    const result = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Post)
    .values({
     title
    })
    .returning('*')
    .execute();
    let post = result.raw[0];
    return post;
  }
  
  @Mutation(() => Post) 
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, {nullable: true}) title: string,
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if(!post){
      return null;
    }
    if(typeof title !== 'undefined') {
      await Post.update({id}, {title});
    }
    return post;
  }
 
  @Mutation(() => Boolean) 
  async deletePost(
    @Arg("id") id: number,
  ): Promise<Boolean> {
    try {
      await Post.delete(id);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}


// -------------------------- Using Mikro-ORM ----------------------
/*
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx,Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {

  @Query(() => [Post]) // Graphql type
  async posts(@Ctx() {em}: MyContext): Promise<Post[]> {
    const posts = await em.find(Post, {});
    // console.log(posts);
    return posts;
  }

  @Query(() => Post, {nullable: true}) // Similar to type script <Post | null>
  async post(
    @Arg('id') id: number,
    @Ctx() {em}: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, {id})
    return post;
  }

  @Mutation(() => Post) 
  async createPost(
    @Arg("title") title: string,
    @Ctx() {em}: MyContext
  ): Promise<Post> {
    const post = em.create(Post, {title});
    await em.persistAndFlush(post);
    return post;
  }
  
  @Mutation(() => Post) 
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, {nullable: true}) title: string,
    @Ctx() {em}: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, {id});
    if(!post){
      return null;
    }
    if(typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }
 
  @Mutation(() => Boolean) 
  async deletePost(
    @Arg("id") id: number,
    @Ctx() {em}: MyContext
  ): Promise<Boolean> {
    try {
      await em.nativeDelete(Post, {id});
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}
*/
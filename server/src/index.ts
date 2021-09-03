import "reflect-metadata";
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constant';
import express, { Request } from 'express';
import microConfig from "./mikro-orm.config";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from 'cors';
import { MyContext } from "./types";
import { getUserId } from "./utils/setTokens"
 

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up() // Running the migrator
  const app = express();
  // CORS configuration
  // const corsOptions = {
  //   // origin: 'https://studio.apollographql.com',
  //   origin: "http://localhost:3000",
  //   credentials: true
  // }
  app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://studio.apollographql.com"]
  }));
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
    }),
    context: ({req, res}): MyContext => ({ 
      em: orm.em,
      req,
      res,
      cookie: req?.cookies?.id,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    })
  });
  // Starting the apolloServer
  await apolloServer.start();

  // Creating graphql endpoint on express
  apolloServer.applyMiddleware({ app,  path: "/graphql", cors: false })

  app.listen(4000, () => {
    console.log("Server Running on Port: 4000🔥");
  })
}

main().catch(err => {
  console.log("Errors from Index.ts");
  
  console.log(err);
})

/*
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up() // Running the migrator
  // const post = orm.em.create(Post, {title: "My first Post"}); // Nothing Changes in DB
  // await orm.em.persistAndFlush(post) // Saves to DB
  // console.log("----------------sql 2--------------------");  
  // await orm.em.nativeInsert(Post, {title: "my first post 2"}); // This will not work  
  // const posts = await orm.em.find(Post, {});
  // console.log(posts); 
}
path: '/specialUrl'
*/
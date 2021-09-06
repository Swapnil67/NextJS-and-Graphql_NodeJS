import "reflect-metadata";
import { __prod__ } from './constant';
import express, { Request } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from 'cors';
import { MyContext } from "./types";
import { getUserId } from "./utils/setTokens"
import { createConnection } from "typeorm"; 
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const main = async () => {

  const conn = await createConnection({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5433,
    username: 'postgres',
    database: 'lireddit2',
    password: 'sanswaptill90',
    synchronize: true,
    logging: true,
    entities: [Post, User]
  });

  // await Post.delete({})

  const app = express();
  app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://studio.apollographql.com"]
  }));
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
    }),
    context: ({req, res}): MyContext => ({ 
      req,
      res,
      userId:
        req && req.headers.cookie
          ? getUserId(req,res)
          : null
    })
  });
  // Starting the apolloServer
  await apolloServer.start();

  // Creating graphql endpoint on express
  apolloServer.applyMiddleware({ app,  path: "/", cors: false })

  app.listen(4000, () => {
    console.log("Server Running on Port: 4000🔥");
  })
}

main().catch(err => {
  console.log("Errors from Index.ts");
  
  console.log(err);
})

// --------------------------------------- Using Mikro-ORM -------------------------------
/*
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
import { User } from "./entities/User";
 

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // await orm.em.nativeDelete(User, {});
  await orm.getMigrator().up() // Running the migrator
  const app = express();
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
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    })
  });
  // Starting the apolloServer
  await apolloServer.start();

  // Creating graphql endpoint on express
  apolloServer.applyMiddleware({ app,  path: "/", cors: false })

  app.listen(4000, () => {
    console.log("Server Running on Port: 4000🔥");
  })
}

main().catch(err => {
  console.log("Errors from Index.ts");
  
  console.log(err);
})
*/
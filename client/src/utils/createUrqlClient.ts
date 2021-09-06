import { dedupExchange, fetchExchange, makeResult } from "@urql/core";
import {Cache, cacheExchange, QueryInput} from '@urql/exchange-graphcache';
import { LoginUserMutation, MeDocument, MeQuery } from "../generated/graphql";
import  Router from 'next/router';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';

// Properly typed Function
// Function for proper type casting
function betterUpdateQuery<Result, Query> (
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}

// export const createUrqlClient = (ssrExchange : any) => ({
//   url: 'http://localhost:4000/graphql',
//   fetchOptions: {
//     credentials: 'include' as const,
//   },
//   exchanges: [dedupExchange,
//     cacheExchange({
//       updates: {
//         Mutation: {
//           login: (_result, args, cache, info) => {
//             betterUpdateQuery<LoginUserMutation, MeQuery>(cache,
//               {query: MeDocument},
//               _result,
//               (result, query) => {
//                 if(result.login.errors) {
//                   return query;
//                 }else {
//                   return {
//                     me: result.login.user,
//                   }
//                 }
//               }
//             )
//           }
//         }
//       }
//     }),
//     ssrExchange, fetchExchange]
// });


export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if(error.message.includes('Not Authenticated')){
          Router.replace("/login");
        }
      }
    })
  );
};

export const createUrqlClient = (ssrExchange : any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [dedupExchange, errorExchange, ssrExchange, fetchExchange]
});
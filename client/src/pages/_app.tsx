import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { Provider, createClient, fetchExchange } from 'urql';
import theme from '../theme';

// This function allows us to properly cast the types
// function betterUpdateQuery<Result, Query>(
//   cache: Cache,
//   qi: QueryInput,
//   result: any,
//   fn: (r: Result, q: Query) => Query
// ){
//   return cache.updateQuery(qi, data => fn(result, data as any) as any)
// }

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [fetchExchange]
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{ useSystemColorMode: true}}>
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp


/*
const client = createClient({
    url: `https://example.org/graphql`,
    fetch: (...args) =>
      fetch(...args).then((response) => {
        const myHeader = response.headers.get('my-header');
        if (myHeader) {
         // Do stuff
        }

        return response;
      }),
    fetchOptions: { credentials: 'include' },
  });
*/
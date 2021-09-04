import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { Provider } from 'urql';
import theme from '../theme';


function MyApp({ Component, pageProps }: any) {
  return (
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{ useSystemColorMode: true}}>
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
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
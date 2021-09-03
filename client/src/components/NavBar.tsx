import { Box } from '@chakra-ui/layout';
import { Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

interface NavBarProps {
  
}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  const [{data, fetching}] = useMeQuery();
  console.log("IsLoggedIn: ", data);
  
  let body = null;
  if(fetching){
    // Data is Loading
    body = null;
  }else if(!data?.me) {
    // User is not Logged In    
    body = (
      <>
      <NextLink href="/login">
        <Link color="white" mr={2}>Login</Link>
      </NextLink>
      <NextLink href="/register">
        <Link color="white">Register</Link>
      </NextLink>
    </>
    )
  }else{
    // User is Logged In    
    body = (
      <>
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link" onClick={() => {
          logout();
        }}
        isLoading={logoutFetching}
        >
          Logout</Button>
      </Flex>
      </>
    )
  }
  return (
    <Flex p={4} bg="tomato">
      <Box ml={'auto'}>
       {body}
      </Box>
    </Flex>
  )
}


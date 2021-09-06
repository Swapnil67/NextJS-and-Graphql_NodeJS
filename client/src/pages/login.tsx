import React from 'react';
import {Formik, Form} from 'formik'
import {  Box, Button, FormControl, FormLabel, Input, Flex, Spacer, Link  } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import InputField from '../components/inputFieldProp';
// import { useMutation } from 'urql';
import { useLoginUserMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
  const [, login] = useLoginUserMutation();  // created using Graphql Code Generator [yarn gen]
  
  const router = useRouter();
  // console.log("From login: ", router);
  return (
    <Wrapper variant='small'>
      <Formik initialValues={{usernameOrEmail: "", password: ""}} 
      onSubmit={(async (values, {setErrors}) => {
        const opt = {loginOptions: {username: values.usernameOrEmail, password: values.password}}
        console.log(opt);
        const response = await login(values);
        console.log(response);
        if(response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors)); // Here we didn't used ? maek cuz its there in if statement
        }else if(response.data?.login.user) {
          // Worked
          if(typeof router.query.next === "string") {
            router.push(router.query.next)
          }else {
            router.push('/');
          }
        }
      })}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="usernameOrEmail" placeholder="Username or Email" label="Username or Email" />
            <Box mt={4}>
              <InputField name="password" placeholder="password" label="password" type="password"/>
            </Box>
            <Flex>
              <Button mt={4} mr={8} isLoading={isSubmitting} type="submit" colorScheme="teal">
                Login
              </Button>
              <Spacer />
              <Button mt={4} colorScheme="teal">
               <NextLink  href="/forgot-password">
                 <Link> Forgot Password </Link>
               </NextLink>
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login);
/*
The reason to call createUrqlClient is to run Mutations and Queries
*/
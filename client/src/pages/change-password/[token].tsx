import { Button } from '@chakra-ui/button';
import { Box, Link, Flex } from '@chakra-ui/react';
import NextLink from 'next/link'
import { Formik, Form } from 'formik';
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react'
import InputField from '../../components/inputFieldProp';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage<{token: string}> = () => {
  const router = useRouter();
  const [, updatePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('');
  console.log('change password from token.tsx');
  console.log("Token: ", router.query);
  
  return (
    <Wrapper variant='small'>
    <Formik initialValues={{ newPassword: "" }} 
    onSubmit={(async (values, {setErrors}) => {
      const response = await updatePassword({
        token: typeof router.query.token === "string" ? router.query.token : '',
        newPassword: values.newPassword
      });
      console.log('Response: ', response);
      if(response.data?.updatePassword.errors) {
        const errorMap = toErrorMap(response.data.updatePassword.errors); // Here we didn't used ? make cuz its there in if statement
        if('token' in errorMap) {
          setTokenError(errorMap.token)
        }
        setErrors(errorMap)
      }else if(response.data?.updatePassword.user) {
        // Worked
        router.push('/login');
      }
    })}>
      {({isSubmitting}) => (
        <Form>
          <InputField name="newPassword" placeholder="New Password" label="New Password" type="password"/>
          {
            tokenError ? 
            (
              <Flex>
                <Box mr={2} color='red' >{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Click here to get new one</Link>
                </NextLink>
              </Flex>
            )
            : null
          }
          <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">
            Update Password
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
}

// No need Because we used Query Params
// ChangePassword.getInitialProps = ({query}) => {
//   return {
//     token: query.token as string
//   }
// }

export default withUrqlClient(createUrqlClient)(ChangePassword);
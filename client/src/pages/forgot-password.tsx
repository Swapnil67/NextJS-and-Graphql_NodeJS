import React, { useState } from "react";
import { Box, Flex, Button, Spacer, Link } from "@chakra-ui/react";
import NextLink from 'next/link'
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import InputField from "../components/inputFieldProp";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Wrapper variant='small'>
      <Formik initialValues={{email: ""}} 
      onSubmit={(async (values) => {
       await forgotPassword(values);
       setComplete(true)
      })}>
        {({isSubmitting}) => complete ? (
          <Box>
            If an account with the Email Exists, You will be sent an email with Update Password Link
          </Box>
        ) : (
          <Form>
            <InputField name="email" placeholder="Email" label="Email" />
            <Flex>
              <Button mt={4} mr={8} isLoading={isSubmitting} type="submit" colorScheme="teal">
                Forgot Password
              </Button>
              <Spacer />
              <Button mt={4} colorScheme="teal">
               <NextLink  href="/login">
                 <Link> Login </Link>
               </NextLink>
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);
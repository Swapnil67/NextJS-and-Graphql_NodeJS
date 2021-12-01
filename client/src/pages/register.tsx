import React from 'react';
import {Formik, Form} from 'formik'
import {  Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import InputField from '../components/inputFieldProp';
// import { useMutation } from 'urql';
import { useRegisterUserMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}



const Register: React.FC<registerProps> = ({}) => {
  // const [, register] = useMutation(REGISTER_MUT);
  const [, register] = useRegisterUserMutation();  // created using Graphql Code Generator [yarn gen]
  const router = useRouter();
  return (
    <Wrapper variant='small'>
      <Formik initialValues={{email: "", username: "", password: ""}} 
      onSubmit={(async (values, {setErrors}) => {
        const response = await register({registerOptions: values});
        console.log(response);
        if(response.data?.register.errors) {
          setErrors(toErrorMap(response.data.register.errors)); // Here we didn't used ? maek cuz its there in if statement
        }else if(response.data?.register.user) {
          // Worked
          router.push('/login');
        }
      })}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="username" placeholder="Username" label="Username" />
            <Box mt={4}>
              <InputField name="email" placeholder="Email" label="Email" type="email"/>
            </Box>
            <Box mt={4}>
              <InputField name="password" placeholder="password" label="password" type="password"/>
            </Box>
            <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register);

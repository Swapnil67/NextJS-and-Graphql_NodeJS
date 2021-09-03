import React from 'react';
import {Formik, Form} from 'formik'
import {  Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import InputField from '../components/inputFieldProp';
// import { useMutation } from 'urql';
import { useLoginUserMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';

interface LoginProps {

}

const Login: React.FC<LoginProps> = ({}) => {
  // const [, register] = useMutation(REGISTER_MUT);
  const [, login] = useLoginUserMutation();  // created using Graphql Code Generator [yarn gen]
  
  const router = useRouter();
  return (
    <Wrapper variant='small'>
      <Formik initialValues={{username: "", password: ""}} 
      onSubmit={(async (values, {setErrors}) => {
        const opt = {loginOptions: {username: values.username, password: values.password}}
        console.log(opt);
        const response = await login(opt);
        console.log(response);
        if(response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors)); // Here we didn't used ? maek cuz its there in if statement
        }else if(response.data?.login.user) {
          // Worked
          router.push('/');
        }
      })}>
        {({isSubmitting}) => (
          <Form>
            <InputField name="username" placeholder="username" label="username" />
            <Box mt={4}>
              <InputField name="password" placeholder="password" label="password" type="password"/>
            </Box>
            <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Login;
import { Button } from '@chakra-ui/button';
import { Box, Flex, Spacer, Link } from '@chakra-ui/layout';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import InputField from '../components/inputFieldProp';
import { Layout } from '../components/Layout';
import TextAreaField from '../components/textareaFieldProp';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';
import login from './login';

const CreatePost: React.FC<{}> = ({}) => {
  console.log("Shut up and create post");
  
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation()
  return (
    <Layout variant="small">
       <Formik initialValues={{title: "", text: ""}} 
          onSubmit={(async (values) => {
              console.log("post Values: ", values);
              const { error } = await createPost({postInput: values})
              if(!error) {
                router.push("/");
              }
          })}
        >
        {({isSubmitting}) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <Box mt={4}>
              <TextAreaField name="text" placeholder="...text" label="Body" />
            </Box>
            <Button mt={4} mr={8} isLoading={isSubmitting} type="submit" colorScheme="teal">
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
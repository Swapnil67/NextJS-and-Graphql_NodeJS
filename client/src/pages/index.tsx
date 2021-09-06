import { NavBar } from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Link } from "@chakra-ui/react";
import NextLink from 'next/link';
import { Layout } from "../components/Layout";

const Index = () => {
  const [{data}] = usePostsQuery();
  console.log(data);
  
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      {
        !data ? (<div>  Loading... </div>) : ( data.posts.map((p) => <div key={p.id}>{p.title}</div>))
      }
    </Layout>
  )
  }

export default withUrqlClient(createUrqlClient)(Index)
/*
1.
If the data I'm using needs to be found by Google (For Good SEO)
then I will server side render the queries
2.
Only Dynamic should be server side rendered (not Login/Register pages)
*/

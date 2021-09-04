import { NavBar } from "../components/NavBar";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <>
      <NavBar/>
      {
        !data ? (<div>  Loading... </div>) : ( data.posts.map((p) => <div key={p.id}>{p.title}</div>))
      }
    </>
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

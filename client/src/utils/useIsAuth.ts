import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const router = useRouter();
  // console.log(router);
  
  const [{ data, fetching }] = useMeQuery();
  useEffect(() => {
    // If we are not loading and we don't have the user.
    if(!fetching && !data?.me){
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router])
}
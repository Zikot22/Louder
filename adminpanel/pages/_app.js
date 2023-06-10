import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavigation from "../components/navbar";
import "../styles/global.css";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'; 
import { deleteCookie, getCookie } from "cookies-next";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    if(isLoginPage) return;

    const token = getCookie('token');
    if(!token) {
      router.push('/login');
    }
    else {
      const decodedToken = jwtDecode(token);
      if(decodedToken.exp >= Date.now()) {
        deleteCookie('token');
        router.push('/login');
      }
      else setIsLogIn(true);
    }
  });

  return <>
    {!isLoginPage && <AdminNavigation/>}
    {(isLoginPage || isLogIn) && <Component {...pageProps}/>}
  </>
}

export default MyApp;
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import jwt_decode from "jwt-decode";

function MyApp({ Component, pageProps }) {
  const [jwt, setJWT] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setJWT(localStorage.getItem('token'));
  })

  useEffect(() => {
    if(jwt) {
      const decodedToken = jwt_decode(jwt);
      if(decodedToken.exp >= Date.now()) {
        localStorage.setItem('token');
        localStorage.setItem('userId')
        localStorage.setItem('username')
        setIsLoggedIn(false);
      }
      else{
        localStorage.setItem('userId', decodedToken.Id);
        localStorage.setItem('username', decodedToken.Name);
        setIsLoggedIn(true);
      }
    }
    else
      setIsLoggedIn(false);
  }, [jwt]);
  
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  
  return <>
    <Header isLoggedIn={isLoggedIn}/>
      <div className="background-color-primary no-ws">
        <Component {...pageProps}/>
      </div>
    <Footer/>
  </>
}

export default MyApp;
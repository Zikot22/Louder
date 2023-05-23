import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import { useEffect } from "react";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return <>
  <Header/>
  <Component {...pageProps}/>
  </>
}

export default MyApp;
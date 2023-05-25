import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/footer";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return <>
  <Header/>
  <Component {...pageProps}/>
  <Footer/>
  </>
}

export default MyApp;
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
  <div className="background-color-primary no-ws">
    <Component {...pageProps}/>
  </div>
  <Footer/>
  </>
}

export default MyApp;
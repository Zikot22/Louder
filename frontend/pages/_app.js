import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import jwt_decode from 'jwt-decode';
import { getCookie, deleteCookie } from 'cookies-next';
import Head from 'next/head';
import { SSRProvider } from 'react-bootstrap';
import CookieWarning from '../components/cookie-warning';

function MyApp({ Component, pageProps }) {
  const [jwt, setJWT] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setJWT(getCookie('token'));
  })

  useEffect(() => {
    if(jwt) {
      const decodedToken = jwt_decode(jwt);
      if(decodedToken.exp >= Date.now()) {
        deleteCookie('token');
        deleteCookie('userId');
        setIsLoggedIn(false);
      }
      else{
        setIsLoggedIn(true);
      }
    }
    else
      setIsLoggedIn(false);
  }, [jwt]);
  
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  
  return <SSRProvider>
    <Head>
      <meta name='Copyright' content='ООО «Быстрые отчеты»'/>
      <meta name='Address' content='г. Ростов-на-Дону, Россия, 344082, ул.Обороны 24, офис 311'/>
      <meta httpEquiv='Content-type' content='text/html;charset=windows-1251'/>
      <meta httpEquiv='Content-Language' content='ru'/>
      <meta name='robots' content='all'/>
      <meta property='og:image' content='/meta.png' />
      <link rel="icon" type="image/x-icon" href='/favicon.ico'></link>
      <meta property='og:image:alt' content='Быстрые отчеты Louder' />
      <meta property='og:site_name' content='Louder'/>
    </Head>
    <Header isLoggedIn={isLoggedIn}/>
      <main className='background-color-primary no-ws'>
        <Component {...pageProps}/>
      </main>
    <Footer/>
    <CookieWarning/>
  </SSRProvider>
}

export default MyApp;
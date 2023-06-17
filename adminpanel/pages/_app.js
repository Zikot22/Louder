import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavigation from '../components/navbar';
import '../styles/global.css';
import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; 
import { deleteCookie, getCookie } from 'cookies-next';
import Head from 'next/head';

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
    <Head>
      <meta name='Copyright' content='ООО «Быстрые отчеты»'/>
      <meta name='Address' content='г. Ростов-на-Дону, Россия, 344082, ул.Обороны 24, офис 311'/>
      <meta httpEquiv='Content-type' content='text/html;charset=windows-1251'/>
      <meta httpEquiv='Content-Language' content='ru'/>
      <meta name='robots' content='all'/>
      <meta property='og:image' content='/meta.png' />
      <link rel="icon" type="image/x-icon" href='/favicon.ico'></link>
      <meta property='og:image:alt' content='Быстрые отчеты Louder-Админ' />
      <meta property='og:site_name' content='Louder-Админ'/>
    </Head>
    {!isLoginPage && <AdminNavigation/>}
    <main>
      {(isLoginPage || isLogIn) && <Component {...pageProps}/>}
    </main>
  </>
}

export default MyApp;
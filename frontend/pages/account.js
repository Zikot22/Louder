import { useEffect, useState } from 'react';
import Purchases from '../components/account/purchases';
import PurchasesFilter from '../components/account/purchase-filter';
import UserProfileComponent from '../components/account/user';
import packageInfo from '../package.json';
import * as cookie from 'cookie'
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import Head from 'next/head';

const domain = packageInfo.domain;

const Account = ({ purchases, urlSearchPattern }) => {
  const [searchPattern, setSearchPattern] = useState(urlSearchPattern || '');
  const router = useRouter();

  useEffect(() => {
    if (getCookie('token') == null) {
      router.push({ pathname: '/' });
    }
  });

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('searchpattern', searchPattern);
    const query = queryParams.toString();
    router.push({ pathname: '/account', query });
  }, [searchPattern]);

  return (
    <>
      <Head>
        <title>Личный кабинет</title>

        <meta name='title' content='Личный кабинет'/>
        <meta name='description' content='Личный кабинет пользователя, где вы можете скачать купленные билеты'/>
        <meta name='keywords' content='аккаунт, пользователь, профиль, личный кабинет'/>

        <meta property='og:title' content='Личный кабинет'/>
        <meta property='og:description' content='Личный кабинет пользователя, где вы можете скачать купленные билеты'/>
        <meta property='og:url' content='todo'/>
        <meta property='og:type' content='profile'/>
        <meta property='og:keywords' content='аккаунт, пользователь, профиль, личный кабинет'/>
      </Head>
      <UserProfileComponent/>
      <PurchasesFilter searchPattern={searchPattern} setSearchPattern={setSearchPattern}/>
      <Purchases purchases={purchases}/>
    </>
  );
};

export default Account;

export async function getServerSideProps(context) {
  const { req, query } = context;
  const { searchpattern } = query;

  const parsedCookies = cookie.parse(req.headers.cookie);

  let purchases = null;

  if (parsedCookies.token) {
    const response = await fetch(`${domain}/Purchase/user/${parsedCookies.userId}?searchPattern=${searchpattern || ''}`, {
      headers: {
        'Authorization': 'Bearer ' + parsedCookies.token,
      },
    });
    purchases = await response.json();
  }

  return {
    props: {
      purchases: purchases,
      urlSearchPattern: searchpattern || '',
    },
  };
};
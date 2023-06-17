import { useEffect, useState } from 'react';
import Events from '../components/index/events';
import EventsFilter from '../components/index/events-filter';
import Information from '../components/index/information';
import packageInfo from '../package.json';
import { useRouter } from 'next/router';
import Head from 'next/head';

const domain = packageInfo.domain;

const Index = ({ events, urlSearchPattern, urlPrice, urlDate, urlAmount }) => {
  const [searchPattern, setSearchPattern] = useState(urlSearchPattern || '');
  const [price, setPrice] = useState(urlPrice || 'default');
  const [date, setDate] = useState(urlDate || 'default');
  const [amount, setAmount] = useState(urlAmount || 'default');

  const router = useRouter();
  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('searchpattern', searchPattern);
    queryParams.append('price', price);
    queryParams.append('date', date);
    queryParams.append('amount', amount);

    const query = queryParams.toString();
    router.push({ pathname: '/', query }, undefined);
  }, [searchPattern, price, date, amount]);

  return (
    <>
      <Head>
        <title>Louder</title>

        <meta name='title' content='Купить билеты на мероприятия, купить билет на концерт недорого'/>
        <meta name='description' content='На нашем сайте предоставлен широкий выбор билетов на различные мероприятия,
          концерты, сходки и митапы по всей России. Моментальное получение, гарантия, удобный поиск, низкие цены.'/>
        <meta name='keywords' content='билеты, мероприятия, купить, недорого'/>

        <meta property='og:title' content='Билеты на мероприятия'/>
        <meta property='og:description' content='Концерты, сходки и митапы по всей России'/>
        <meta property='og:url' content='todo'/>
        <meta property='og:type' content='website'/>
        <meta property='og:keywords' content='мероприятия, билеты, каталог'/>
      </Head>
      <Information/>
      <EventsFilter
        searchPattern={searchPattern}
        setSearchPattern={setSearchPattern}
        setAmount={setAmount}
        setDate={setDate}
        setPrice={setPrice}
      />
      <Events events={events}/>
    </>
  );
};

export default Index;

export async function getServerSideProps(context) {
  const { query } = context;
  const selectedCity = context.req.cookies.selectedCity;
  const { searchpattern, price, date, amount } = query;

  const response = await fetch(`${domain}/Event/filter?searchPattern=${searchpattern || ''}
    &price=${price || ''}&date=${date || ''}&amount=${amount || ''}&city=${selectedCity || ''}`);
  const events = await response.json();
  return {
    props: {
      events,
      urlSearchPattern: searchpattern || '',
      urlPrice: price || '',
      urlDate: date || '',
      urlAmount: amount || '',
    },
  };
};
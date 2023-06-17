import EventInformationComponent from '../../components/event/event-information';
import SeatSelectorComponent from '../../components/event/seat-selector';
import { useRouter } from 'next/router';
import packageInfo from '../../package.json';
import ErrorMessage from '../../components/error-modal';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import Head from 'next/head';

const domain = packageInfo.domain;

const Event = ({ event, tickets }) => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleCloseError = () => {
    setError('');
  };

  const onBuy = async (purchases) => {
    if (getCookie('token') != null) {
      try {
        const userId = getCookie('userId');
        purchases = purchases.map(ticketId => ({ ...ticketId, userId: userId }));
        const response = await fetch(`${domain}/Purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getCookie('token')
          },
          body: JSON.stringify(purchases)
        });
        if (response.ok) {
          router.push('/account');
        } else {
          var answer = await response.json();
          setError(answer.error);
        }
      } catch (ex) {
        setError(ex);
      }
    } else {
      setError('Авторизуйтесь для покупки');
    }
  };

  return (
    <>
      <Head>
        <title>Билеты на {event.name}</title>

        <meta name='title' content={`Купить билеты на ${event.name}`}/>
        <meta name='description' content={`${event.name} скоро пройдет в городе ${event.city}, успей купить билеты по выгодной цене`}/>
        <meta name='keywords' content={`билеты, ${event.name}, купить, недорого, ${event.city}`}/>

        <meta property='og:title' content={`Билеты на ${event.name}`}/>
        <meta property='og:description' content={`${event.name} в городе ${event.city}`}/>
        <meta property='og:url' content='todo'/>
        <meta property='og:type' content='website'/>
        <meta property='og:keywords' content={`билеты, ${event.name}, купить, ${event.city}`}/>
      </Head>
      <EventInformationComponent event={event}/>
      <SeatSelectorComponent onBuy={onBuy} tickets={tickets}/>
      {error && <ErrorMessage error={error} onClose={handleCloseError}/>}
    </>
  );
};

export default Event;

export async function getServerSideProps({ params }) {
  const eventResponse = await fetch(`${domain}/Event/${params.id}`);
  const event = await eventResponse.json();

  const ticketsResponse = await fetch(`${domain}/Event/${event.id}/tickets`);
  const tickets = await ticketsResponse.json();

  return {
    props: { event, tickets },
  };
}
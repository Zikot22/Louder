import EventInformationComponent from "../../components/event/event-information";
import SeatSelectorComponent from "../../components/event/seat-selector";
import { useRouter } from 'next/router';
import packageInfo from "../../package.json";
import ErrorMessage from "../../components/error";
import { getCookie } from "cookies-next";
import { useState } from "react";

const domain = packageInfo.domain;

const Event = ({ event, tickets }) => 
{
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleCloseError = () => {
        setError('');
    };

    const onBuy = async (purchases) =>
    {
        if(getCookie('token') != null)
        {
            try
            {
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
                if(response.ok) {
                    router.push('/account');
                }
                else {
                    var answer = await response.json();
                    setError(answer.error)
                };
            }
            catch (ex)
            {
                setError(ex);            
            }
        }
        else
        {
            setError('Авторизуйтесь для покупки');
        }
    }

    return (
        <div>
            {error && <ErrorMessage error={error} onClose={handleCloseError}/>}
            <EventInformationComponent event={event}/>
            <SeatSelectorComponent onBuy={onBuy} tickets={tickets}/>
        </div>
    );    
};

export default Event;

export async function getServerSideProps({params}) {
    const eventResponse = await fetch(`${domain}/Event/${params.id}`,)
    const event = await eventResponse.json()

    const ticketsResponse = await fetch(`${domain}/Event/${event.id}/tickets`,)
    const tickets = await ticketsResponse.json()
    return {
        props: {event, tickets},
    }
}
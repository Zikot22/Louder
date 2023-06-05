import EventInformationComponent from "../../components/event/event-information";
import SeatSelectorComponent from "../../components/event/seat-selector";
import { useRouter } from 'next/router';
import packageInfo from "../../package.json";

const domain = packageInfo.domain;

const Event = ({ event, tickets }) => 
{
    const router = useRouter();

    const onBuy = async (quantity) =>
    {
        try
        {
            await fetch(`${domain}/Event/${event.id}/amount/decrease?amount=${quantity}`, {  
                method: 'POST',
                headers: {  
                    'Content-Type': 'application/json',
                }
            });

            router.push('/account');
    
        }
        catch {}
    }

    return (
        <div>
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
import EventInformationComponent from "../../components/event/event-information";
import SeatSelectorComponent from "../../components/event/seat-selector";
import { useRouter } from 'next/router';
import packageInfo from "../../package.json";

const domain = packageInfo.domain;

const Event = ({event}) => 
{
    const {query} = useRouter()
    return (
        <div>
            <EventInformationComponent event={event}/>
            <SeatSelectorComponent name={"Стандарт"} price={1200} description={"Комфортные мягкие сидения и вкусное печенье"}/>
        </div>
    );    
};

export default Event;

export async function getServerSideProps({params}) {
    const response = await fetch(`${domain}/Event/${params.id}`,)
    const event = await response.json()
    return {
        props: {event},
    }
}
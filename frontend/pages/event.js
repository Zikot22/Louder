import EventInformationComponent from "../components/event/event-information";
import SeatSelectorComponent from "../components/event/seat-selector";

const Event = () => 
{
    return (
        <div>
            <EventInformationComponent/>
            <SeatSelectorComponent name={"Стандарт"} price={1200} description={"Комфортные мягкие сидения и вкусное печенье"}/>
        </div>
    );    
};

export default Event;
import Events from "../components/index/events";
import EventsFilter from "../components/index/events-filter";
import Information from "../components/index/information";

const Index = () => 
{
    return (
        <div>
            <Information/>
            <EventsFilter/>
            <Events/>
        </div>
    );    
};

export default Index;
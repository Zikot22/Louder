import Tickets from "../components/account/tickets";
import TicketsFilter from "../components/account/tickets-filter";
import UserProfileComponent from "../components/account/user";

const Account = () => 
{
    return (
        <div className="pb-2 pt-4">
            <UserProfileComponent avatarSrc="ava.jpg"  name="Михаил Михаил"/>
            <TicketsFilter/>    
            <Tickets/>
        </div>
    );    
};

export default Account;
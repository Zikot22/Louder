import { useEffect, useState } from "react";
import Events from "../components/index/events";
import EventsFilter from "../components/index/events-filter";
import Information from "../components/index/information";
import packageInfo from "../package.json";
import { useRouter } from 'next/router';

const domain = packageInfo.domain;

const Index = ({ events,  urlSearchPattern, urlPrice, urlDate, urlAmount }) => 
{
    const [searchPattern, setSearchPattern] = useState(urlSearchPattern || '');
    const [price, setPrice] = useState(urlPrice || 'default');
    const [date, setDate] = useState(urlDate || 'default');
    const [amount, setAmount] = useState(urlAmount || 'default');

    const router = useRouter();
    useEffect(() => {
        console.log(urlSearchPattern);
        const queryParams = new URLSearchParams();
        queryParams.append('searchpattern', searchPattern);
        queryParams.append('price', price);
        queryParams.append('date', date);
        queryParams.append('amount', amount);
        
        const query = queryParams.toString();
        router.push({ pathname: '/', query }, undefined);
      }, [searchPattern, price, date, amount]);

    return (
        <div>
            <Information/>
            <EventsFilter searchPattern={searchPattern} setSearchPattern={setSearchPattern}
                setAmount={setAmount} setDate={setDate} setPrice={setPrice}/>
            <Events events={events}/>
        </div>
    );    
};

export default Index;

export async function getServerSideProps(context) {
    const { query } = context;
    const selectedCity = context.req.cookies.selectedCity;
    const { searchpattern, price, date, amount } = query;
    
    const responce = await fetch(`${domain}/Event/filter?searchPattern=${searchpattern || ''}
        &price=${price || ''}&date=${date || ''}&amount=${amount || ''}&city=${selectedCity || ''}`);
    const events = await responce.json();
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
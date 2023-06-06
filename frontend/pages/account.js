import { useEffect, useState } from "react";
import Purchases from "../components/account/purchases";
import PurchasesFilter from "../components/account/purchase-filter";
import UserProfileComponent from "../components/account/user";
import packageInfo from "../package.json";
import * as cookie from 'cookie'
import { useRouter } from 'next/router';
import { getCookie } from "cookies-next";

const domain = packageInfo.domain;

const Account = ({ purchases, urlSearchPattern }) => 
{
    const [searchPattern, setSearchPattern] = useState(urlSearchPattern || '');
    
    const router = useRouter();

    useEffect(() => {
        if(getCookie('token') == null) {
            router.push({pathname: '/'});
        };
    });

    useEffect(() => {
        const queryParams = new URLSearchParams();
        queryParams.append('searchpattern', searchPattern);
        const query = queryParams.toString();
        router.push({ pathname: '/account', query });
      }, [searchPattern]);

    return (
        <div className="pb-2 pt-4">
            <UserProfileComponent/>
            <PurchasesFilter searchPattern={searchPattern} setSearchPattern={setSearchPattern}/>    
            <Purchases purchases={purchases}/>
        </div>
    );
};

export default Account;

export async function getServerSideProps(context) {
    const { req, query } = context;
    const {searchpattern} = query;

    const parsedCookies = cookie.parse(req.headers.cookie);

    var purchases = null;

    if(parsedCookies.token)
    {
        const responce = await fetch(`${domain}/Purchase/user/${parsedCookies.userId}?searchPattern=${searchpattern || ''}`, {
            headers: {
                'Authorization': 'Bearer ' + parsedCookies.token,
              },
        });
        purchases = await responce.json();
    }
    return { 
        props: {
            purchases: purchases,
            urlSearchPattern: searchpattern || '',
          },
    };
};
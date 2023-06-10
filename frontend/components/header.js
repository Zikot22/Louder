import { Container, Button, Navbar, Modal} from "react-bootstrap";
import LogoIcon from "./icons/LogoIcon";
import { useEffect, useState } from "react";
import LoginRegistrationForm from "./authorization-modal";
import { useRouter } from 'next/router';
import { FaSignInAlt } from 'react-icons/fa';
import packageInfo from "../package.json";
import { getCookie } from 'cookies-next';

const Header = ( {isLoggedIn} ) => {
    const router = useRouter();
    const [modalAuthorization, setModalAuthorization] = useState(false);
    const handleOpenAuthorization = () => setModalAuthorization(true);
    const handleCloseAuthorization = () => setModalAuthorization(false);
    const domain = packageInfo.domain;

    useEffect(() => {
        var img = document.getElementById("header-avatar");
        var userId = getCookie('userId')
        if (img) {
            img.srcset = `${domain}/images/avatars/${userId}.jpg`;
        img.src = `${domain}/images/avatars/${userId}.jpg`;
        }
    });

    return (
        <>
        <Navbar>
            <Container>
                <Navbar.Brand href="/">
                    <LogoIcon/> Быстрые отчеты
                    &nbsp; &nbsp;
                    <LogoIcon/><Button variant="link" className="text-decoration-none px-0"><p className="m-0">Москва</p></Button>
                    </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text style={{cursor: 'pointer'}} className="py-0">
                        { 
                            isLoggedIn
                            ? <a onClick={() => {router.push('/account')}} className="pe-2 pointer">
                                <img id="header-avatar" className="rounded-circle" style={{ width: '40px', height: '40px' }} 
                                onError={({ currentTarget }) =>
                                  { currentTarget.onerror = null; currentTarget.src="no_avatar.jpg"; currentTarget.srcset="no_avatar.jpg"}}/>
                            </a> 
                            : <a className="pe-2" onClick={handleOpenAuthorization}>
                                <FaSignInAlt size={28}/>
                            </a> 
                        }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        { modalAuthorization && <LoginRegistrationForm onClose={handleCloseAuthorization}/> }
        </>
    );
}
 
export default Header;

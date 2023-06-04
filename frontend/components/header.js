import { Container, Button, Navbar, Modal} from "react-bootstrap";
import LogoIcon from "./icons/LogoIcon";
import { useEffect, useState } from "react";
import LoginRegistrationForm from "./authorization";
import { useRouter } from 'next/router';
import { FaSignInAlt } from 'react-icons/fa';
import packageInfo from "../package.json";

const Header = ( {isLoggedIn} ) => {

    const [modalOpen, setModal] = useState(false);
    const router = useRouter();
    const showModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const domain = packageInfo.domain;

    useEffect(() => {
        var img = document.getElementById("header-avatar");
        if (img) {
            img.srcset = `${domain}/images/avatars/${localStorage.getItem('userId')}.jpg`;
        img.src = `${domain}/images/avatars/${localStorage.getItem('userId')}.jpg`;
        }
    })

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
                    <Navbar.Text className="py-0">
                        { 
                            isLoggedIn
                            ? <a onClick={() => {router.push('/account')}} className="pe-2">
                                <img id="header-avatar" className="rounded-circle" style={{ width: '40px', height: '40px' }} 
                                onError={({ currentTarget }) =>
                                 { currentTarget.onerror = null; currentTarget.src="no_avatar.jpg"; currentTarget.srcset="no_avatar.jpg"}}/>
                            </a> 
                            : <a href="#" className="pe-2" onClick={showModal}>
                                <FaSignInAlt size={28}/>
                            </a> 
                        }
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Modal show={modalOpen} size="sm" onHide={closeModal}>
            <Modal.Body className="p-0">
                <LoginRegistrationForm onClose={closeModal}/>
            </Modal.Body>
        </Modal>
        </>
    );
}
 
export default Header;

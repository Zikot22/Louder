import { Container, Button, Navbar, Modal} from "react-bootstrap";
import LogoIcon from "./icons/LogoIcon";
import { useState } from "react";
import LoginRegistrationForm from "./authorization";

const Header = () => {

    const [modalOpen, setModal] = useState(false);

    const showModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <>
        <Navbar>
            <Container>
                <Navbar.Brand href="#home">
                    <LogoIcon/> Быстрые отчеты
                    &nbsp; &nbsp;
                    <LogoIcon/><Button variant="link" className="text-decoration-none px-0"><p className="m-0">Москва</p></Button>
                    </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        <a href="#" onClick={showModal}><LogoIcon/></a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Modal show={modalOpen} size="sm" onHide={closeModal}>
            <Modal.Body className="p-0">
                <LoginRegistrationForm/>
            </Modal.Body>
        </Modal>
        </>
    );
}
 
export default Header;

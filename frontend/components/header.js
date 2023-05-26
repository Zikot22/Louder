import { Container, Button, Navbar} from "react-bootstrap";
import LogoIcon from "./icons/LogoIcon";

const Header = () => {
    return (
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
                    <a href="#login"><LogoIcon/></a>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
 
export default Header;

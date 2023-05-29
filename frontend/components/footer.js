import { Container, Row, Col} from "react-bootstrap";
import { FaGithub, FaVk, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="py-1 my-2">
            <Container>
                <Row>
                    <Col xs="12" md="6" className="d-flex justify-content-start align-items-center">
                        <p className="text-muted small-text mb-0">© 1998-2023 OOO «Быстрые отчеты»</p>
                    </Col>
                    <Col xs="8" md="6" className="d-flex justify-content-end align-items-center">
                        <a href="https://vk.com/fastreport" className="me-3">
                            <FaVk size={20} />
                        </a>
                        <a href="https://rutube.ru/channel/25338563/" className="me-3">
                            <FaYoutube size={20}/>
                        </a>
                        <a href="https://github.com/Zikot22/Louder">
                            <FaGithub size={20}/>
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
        
    );
}
 
export default Footer;
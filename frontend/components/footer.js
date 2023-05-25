import { Container, Row, Col} from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaVk, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="py-1 mt-3">
            <Container>
                <Row>
                    <Col xs="8" md="6" className="d-flex justify-content-start align-items-center">
                        <p className="text-muted small-text mb-0">© 1998-2023 OOO «Быстрые отчеты»</p>
                    </Col>
                    <Col xs="4" md="6" className="d-flex justify-content-end align-items-center">
                        <a href="https://www.facebook.com" className="me-3">
                        <FaVk size={20} />
                        </a>
                        <a href="https://www.twitter.com">
                        <FaYoutube size={20}/>
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
        
    );
}
 
export default Footer;
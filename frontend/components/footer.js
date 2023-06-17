import { Container, Row, Col } from 'react-bootstrap';
import { FaVk } from 'react-icons/fa';
import styles from '../styles/components/footer.module.css'

const Footer = () => {
  return (
    <footer className='py-1 my-2'>
      <Container>
        <Row>
          <Col sm='12' md='6' className={styles.company}>
            <p className='text-muted small-text mb-0'>© 1998-2023 OOO «Быстрые отчеты»</p>
          </Col>
          <Col sm='12' md='6' className={styles.social_links} as='adress'>
            <a href='https://vk.com/fastreport'>
              <FaVk size={20} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
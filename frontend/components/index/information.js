import { Container, Row, Col } from "react-bootstrap";
import styles from "../../styles/components/information.module.css"

const Information = () => {
  return (
    <div className={styles.information}>
      <Container>
        <Row className="align-items-center">
          <Col xs="12" sm="6">
            <h2 className={styles.header_text}>Быстрая покупка билетов</h2>
            <p className={styles.text}>Купите билет, а МоиОтчеты Облако сгенерируют его! Купите билет, а МоиОтчеты Облако сгенерируют его! Купите билет, а МоиОтчеты Облако сгенерируют его! Купите билет, а МоиОтчеты Облако сгенерируют его!</p>
            <a className={[styles.text, styles.link_text]} href="https://xn--90aia9aifhdb2cxbdg.xn--p1ai/ru/product/fast-report-cloud/">Узнайте больше на официальном сайте!</a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Information;
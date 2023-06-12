import { Container, Col } from 'react-bootstrap';
import styles from '../../styles/components/index/information.module.css'

const Information = () => {
  return (
    <section className={styles.information}>
      <Container>
          <Col xs='12' sm='6' className='align-items-center'>
            <h2 className={styles.header_text}>Быстрая покупка билетов</h2>
            <p className={styles.text}>Купите билет, а МоиОтчеты Облако сгенерируют его! <br/> МоиОтчеты Облако — облачный сервис (SaaS), предназначенный для хранения, редактирования, построения и отправки отчётов для вашего бизнеса, доступ к которым организован из любой точки мира для всей вашей команды без необходимости создания собственного приложения.</p>
            <a className={[styles.text + ' ' + styles.link_text]} href='https://xn--90aia9aifhdb2cxbdg.xn--p1ai/ru/product/fast-report-cloud/'>Узнайте больше на официальном сайте!</a>
          </Col>
      </Container>
    </section>
  );
};

export default Information;
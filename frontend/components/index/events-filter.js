import { Container, Row, Col, Button, Dropdown} from "react-bootstrap";
import styles from "../../styles/components/index/events-filter.module.css"

const EventsFilter = () => {
  return (
    <div className="bg-white">
        <Container className="pt-2">
            <Col>
                <Row>
                    <Col lg="2" xs="12" className={styles.search_col}>
                        <input className="w-100" type="text" placeholder="Search"/>
                    </Col>
                    <Col lg="1" xs="4" className={styles.filter_col}>
                        <Dropdown>
                        <Dropdown.Toggle className={styles.dropdown}>Тип</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Option 1</Dropdown.Item>
                            <Dropdown.Item>Option 2</Dropdown.Item>
                            <Dropdown.Item>Option 3</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col lg="1" xs="4" className={styles.filter_col}>
                        <Dropdown>
                        <Dropdown.Toggle className={styles.dropdown}>Цена</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Option 1</Dropdown.Item>
                            <Dropdown.Item>Option 2</Dropdown.Item>
                            <Dropdown.Item>Option 3</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col lg="1" xs="4" className={styles.filter_col}>
                        <Dropdown>
                        <Dropdown.Toggle className={styles.dropdown}>Дата</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Option 1</Dropdown.Item>
                            <Dropdown.Item>Option 2</Dropdown.Item>
                            <Dropdown.Item>Option 3</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Col>
        </Container>
    </div>
  );
}

export default EventsFilter;
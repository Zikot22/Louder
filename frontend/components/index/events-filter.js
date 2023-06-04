import { Container, Row, Col, Dropdown} from "react-bootstrap";
import styles from "../../styles/components/index/events-filter.module.css"
import { useState, useEffect } from "react";

const EventsFilter = ({setSearchPattern, searchPattern, setDate, setPrice, setAmount}) => {
    const [inputSearch, setInputSearch] = useState(searchPattern);

    useEffect(() => {
        setSearchPattern(inputSearch);
    }, [inputSearch])
    

    const handlePriceChange = (selectedPrice) => {
        setPrice(selectedPrice);
    };

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const handleAmountChange = (selectedAmount) => {
        setAmount(selectedAmount);
    };

  return (
    <div className="bg-white">
        <Container className="pt-2">
            <Col>
                <Row>
                    <Col lg="2" xs="12" className={styles.search_col}>
                        <input className="w-100" type="text" placeholder="Search" value={inputSearch} onChange={e => setInputSearch(e.target.value)}/>
                    </Col>
                    <Col lg="1" xs="4" className={styles.filter_col}>
                        <Dropdown>
                        <Dropdown.Toggle className={styles.dropdown}>Цена</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handlePriceChange("default")}>По умолчанию</Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePriceChange("asc")}>По возрастанию</Dropdown.Item>
                            <Dropdown.Item onClick={() => handlePriceChange("desc")}>По убыванию</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col lg="1" xs="4" className={styles.filter_col}>
                        <Dropdown>
                        <Dropdown.Toggle className={styles.dropdown}>Дата</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleDateChange("default")}>По умолчанию</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDateChange("asc")}>Ближайшие</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDateChange("desc")}>Поздние</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col lg="1" xs="4" className={styles.filter_col}>
                        <Dropdown>
                        <Dropdown.Toggle className={styles.dropdown}>Наличие</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleAmountChange("default")}>По умолчанию</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAmountChange("asc")}>Больше</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAmountChange("desc")}>Меньше</Dropdown.Item>
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
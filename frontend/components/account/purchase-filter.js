import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';

const PurchasesFilter = ({ setSearchPattern, searchPattern }) => {
  const [inputSearch, setInputSearch] = useState(searchPattern);

  useEffect(() => {
    setSearchPattern(inputSearch);
  }, [inputSearch]);

  return (
    <section className='bg-white'>
      <Container className='pt-2'>
        <Col>
          <Row className='d-flex justify-content-between'>
            <Col lg='4' xxl='3' xl='3' md='5' sm='6' xs='6' className='mb-2'>
              <h3>Купленные билеты</h3>
            </Col>
            <Col lg='2' xxl='2' xl='2' md='3' sm='4' xs='5' className='d-flex align-items-center mb-2 me-3 p-0'>
              <input
                type='text'
                placeholder='Поиск'
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
              />
            </Col>
          </Row>
        </Col>
      </Container>
    </section>
  );
};

export default PurchasesFilter;
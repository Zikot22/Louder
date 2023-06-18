import {Card, Row, Col, Container} from 'react-bootstrap';
import { useState } from 'react';
import styles from '../../styles/components/index/events.module.css'
import packageInfo from '../../package.json';
import DownloadModal from './downloal-modal';
import { getCookie } from 'cookies-next';

const Purchases = ({purchases}) => {
  const domain = packageInfo.domain;
  const [download, setDownload] = useState(null);

  const handleDownload = async (purchase) => {
    const response = await fetch(`${domain}/Purchase/${purchase.id}/download`, {
      headers: {
        'Authorization': 'Bearer ' + getCookie('token'),
      },
    });
    var link = await response.text();
    console.log(link); 
    setDownload(link);
  };

  const handleDownloadClose = () => {
    setDownload('');
  };

  return (
    <Container className='d-flex justify-content-center mt-3' as='section'>
      <Row className='col-12'>
        {purchases?.map((purchase, index) => (
          <Col xs='6' sm='4' md='3' lg='2' xl='2' key={index} className='d-flex align-items-stretch mb-3' as='article'>
            <a onClick={() => handleDownload(purchase)} className={styles.link}>
              <Card className='h-100'>
                <Card.Img variation='top' style={{ maxWidth: '300px'}} src={`${domain}/images/covers/${purchase.ticket.event.id}.jpg`} className='img-fluid'/>
                <Card.Body>
                  <Card.Title tag='h5'>{purchase.ticket.event.name}</Card.Title>
                  <Card.Subtitle tag='h6' className='mb-2 text-muted'>{purchase.ticket.typeName}</Card.Subtitle>
                  <Card.Text>{'Билетов: ' + purchase.count}</Card.Text>
                  <Card.Text>{'город ' + purchase.ticket.event.city}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      {download && <DownloadModal downloadLink={download} onClose={handleDownloadClose}/>}
      </Row>
    </Container>
  );
};

export default Purchases;
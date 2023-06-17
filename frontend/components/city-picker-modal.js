import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { Modal, ListGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';

const CityPicker = ({ onClose }) => {
  const cities = ['Москва', 'Санкт-Петербург', 'Ростов-на-Дону'];
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectCity = (city) => {
    setCookie('selectedCity', city);
    onClose();
    router.reload();
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Modal show={true} onHide={onClose} as='dialog'>
      <Modal.Header>
        <Modal.Title as='h4'>Выбор города</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type='text'
          placeholder='Поиск'
          value={searchValue}
          onChange={handleSearchChange}
          className='mb-3'
        />
        <ListGroup className='cities' as='ul'>
            {filteredCities.map((city) => (
                <ListGroup.Item key={city} onClick={() => handleSelectCity(city)} as='li'>
                {city}
                </ListGroup.Item>
            ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default CityPicker;
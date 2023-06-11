import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { Modal, FormControl, ListGroup } from 'react-bootstrap';
import { useRouter } from 'next/router';

const CityPicker = ({ onClose }) => {
  const [searchValue, setSearchValue] = useState('');
  const cities = ['Москва', 'Санкт-Петербург', 'Ростов-на-Дону'];
  const router = useRouter();
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectCity = (city) => {
    setCookie('selectedCity', city)
    onClose();
    router.reload();
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Выбор города</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          type="text"
          placeholder="Поиск"
          value={searchValue}
          onChange={handleSearchChange}
          className='mb-3'
        />
        <ListGroup className="cities">
            {filteredCities.map((city) => (
                <ListGroup.Item key={city} onClick={() => handleSelectCity(city)}>
                {city}
                </ListGroup.Item>
            ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default CityPicker;
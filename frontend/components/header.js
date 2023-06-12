import { Container, Navbar } from 'react-bootstrap';
import LogoIcon from './icons/LogoIcon';
import { useEffect, useState } from 'react';
import LoginRegistrationForm from './authorization-modal';
import { useRouter } from 'next/router';
import { FaSignInAlt, FaMapMarkerAlt } from 'react-icons/fa';
import packageInfo from '../package.json';
import { getCookie, setCookie } from 'cookies-next';
import CityPicker from './city-picker-modal';

const Header = ({ isLoggedIn }) => {
  const router = useRouter();
  const domain = packageInfo.domain;
  const [modalAuthorization, setModalAuthorization] = useState(false);
  const handleOpenAuthorization = () => setModalAuthorization(true);
  const handleCloseAuthorization = () => setModalAuthorization(false);
  const [selectedCity, setSelectCity] = useState('');
  const [modalCityPicker, setModalCityPicker] = useState(false);
  const handleOpenCityPicker = () => setModalCityPicker(true);
  const handleCloseCityPicker = () => setModalCityPicker(false);

  useEffect(() => {
    var img = document.getElementById('header-avatar');
    var userId = getCookie('userId');
    if (img) {
      img.srcset = `${domain}/images/avatars/${userId}.jpg`;
      img.src = `${domain}/images/avatars/${userId}.jpg`;
    }
  });

  useEffect(() => {
    var city = getCookie('selectedCity');

    if (!city) {
      setCookie('selectedCity', 'Ростов-на-Дону');
      setSelectCity('Ростов-на-Дону');
    }
    else {
      setSelectCity(city);
    }
  });

  return (
    <header>
      <Navbar as='nav'>
        <Container>
          <Navbar.Brand className='d-flex align-items-center'>
              <h4 className='brand fw-bold mb-0 text-decoration-none pe-2'>
                <a className='brand' href='/'><LogoIcon /> LOUDER</a>
              </h4>
              <button className='city-picker brand' onClick={handleOpenCityPicker}>
                <FaMapMarkerAlt className='mb-1' />{selectedCity}
              </button>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text style={{ cursor: 'pointer' }} className='py-0'>
              {
                isLoggedIn
                  ? <button onClick={() => { router.push('/account') }} className='pe-2 pointer'>
                    <img id='header-avatar' className='rounded-circle' style={{ width: '40px', height: '40px' }}
                      onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = '/no_avatar.jpg'; currentTarget.srcset = '/no_avatar.jpg' }} />
                  </button>
                  : <button className='pe-2' onClick={handleOpenAuthorization}>
                    <FaSignInAlt size={28} />
                  </button>
              }
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {modalCityPicker && <CityPicker onClose={handleCloseCityPicker} />}
      {modalAuthorization && <LoginRegistrationForm onClose={handleCloseAuthorization} />}
    </header>
  );
};

export default Header;
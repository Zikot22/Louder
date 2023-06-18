import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const CookieWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const acceptCookie = localStorage.getItem('cookieAccepted');

    if (!acceptCookie) {
      setShowWarning(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');

    setShowWarning(false);
  };

  if (!showWarning) {
    return null;
  }

  return (
    <Alert className="cookie-alert">
      <Alert.Heading as='h4'>Мы используем куки</Alert.Heading>
      <p>
        Посещая данный сайт вы соглашаетесь с <a href='/personaldata'>политикой в отношении персональных данных</a>
      </p>
      <Button className='button-fr' onClick={handleAccept}>Принять</Button>
    </Alert>
  );
};

export default CookieWarning;
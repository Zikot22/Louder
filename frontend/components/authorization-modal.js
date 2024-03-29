import { useState } from 'react';
import { Tabs, Tab, Form, Button, Alert, Modal } from 'react-bootstrap';
import styles from '../styles/components/authorization.module.css';
import { useRouter } from 'next/router';
import packageInfo from '../package.json';
import { setCookie } from 'cookies-next';
import jwtDecode from 'jwt-decode';

const LoginRegistrationForm = ({onClose})  => {
  const router = useRouter();
  const domain = packageInfo.domain;
  const [show, setShow] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registrationData, setRegistrationData] = useState({ name: '', email: '', password: ''});
  const [registrationErrors, setRegistrationErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${domain}/User/login`, {  
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const token = await response.json();
        const decodedToken = jwtDecode(token);
        
        setCookie('token', token, { maxAge: 60 * 60 * 24 * 7 * 2})
        setCookie('userId', decodedToken.Id, { maxAge: 60 * 60 * 24 * 7 * 2});
        
        router.push('/account');
        onClose(); 
      } 
      else {
        setLoginError('Неправильный email или пароль');
      }
    } 
    catch {
      setLoginError('Во время входа произошла ошибка');
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = registrationData;
    const errors = {};

    if (!name) {
      errors.name = 'Заполните имя';
    } else if (name.length > 100) {
      errors.name = 'Имя должно быть менее 100 символов';
    }

    if (!email) {
      errors.email = 'Заполните почту';
    }

    if (!password) {
      errors.password = 'Заполните пароль';
    } else if (password.length < 8 || password.length > 16) {
      errors.password = 'Пароль должен содержать от 8 до 16 символов';
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch(`${domain}/User/register`, {  
          method: 'PUT',
          headers: {  
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        });
  
        if (response.ok) {
          const token = await response.json();
          const decodedToken = jwtDecode(token);

          setCookie('token', token, { maxAge: 60 * 60 * 24 * 7 * 2});
          setCookie('userId', decodedToken.Id, { maxAge: 60 * 60 * 24 * 7 * 2});

          router.push('/account');
          onClose(); 
        } 
        else {
          errors.other = 'Ошибка в указанных данных';
          setRegistrationErrors(errors);
        }
      } 
      catch {
        errors.other = 'Во время регистрации произошла ошибка';
        setRegistrationErrors(errors);
      }
    } 
    else {
      setRegistrationErrors(errors);
    }
  };

  return (
    <Modal size='sm' show={show} onHide={handleClose} as='dialog'>
      <Modal.Body className='p-0'>
        <Tabs defaultActiveKey='login' fill>
          <Tab eventKey='login' title='Вход'>
            <Form onSubmit={handleLoginSubmit} className='pt-4 px-0' as='form'>
              <Form.Group className={styles.form_text} as='p'>
                <input className='col-10 px-2 py-1'
                  placeholder='Электронная почта'
                  type='email'
                  name='email'
                  id='loginEmail'
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  />
                </Form.Group>
                <Form.Group className={styles.form_text} as='p'>
                  <input className='col-10 px-2 py-1'
                    placeholder='Пароль'
                    type='password'
                    name='password'
                    id='loginPassword'
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    />
                </Form.Group>
                {loginError && <Alert className='text-center' variant='danger'>{loginError}</Alert>}
                <Form.Group className='d-flex justify-content-center' as='p'>
                  <Button type='submit' className='col-3 button-fr'>
                    Войти
                  </Button>
                </Form.Group>
            </Form>
          </Tab>
          <Tab eventKey='password' title='Регистрация'>
            <Form onSubmit={handleRegistrationSubmit} className='pt-4 px-0' as='form'>
              <Form.Group className={styles.form_text} as='p'>
                <input type='text' className='col-10 px-2 py-1'
                  placeholder='Имя'
                  name='name'
                  id='registrationName'
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  required
                  />
              </Form.Group>
              {registrationErrors.name && <Alert className='text-center' variant='danger'>{registrationErrors.name}</Alert>}
              <Form.Group className={styles.form_text} as='p'>
                <input type='email' className='col-10 px-2 py-1'
                  placeholder='Электронная почта'
                  name='email'
                  id='registrationEmail'
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  required
                />
              </Form.Group>
              {registrationErrors.email && <Alert className='text-center' variant='danger'>{registrationErrors.email}</Alert>}
              <Form.Group className={styles.form_text + ' mb-2'} as='p'>
                <input type='password' className='col-10 ml-2 px-2 py-1'
                  placeholder='Пароль'
                  name='password'
                  id='registrationPassword'
                  value={registrationData.password}
                  onChange={handleRegistrationChange}
                  required
                  />
              </Form.Group>
              {registrationErrors.password && <Alert className='text-center' variant='danger'>{registrationErrors.password}</Alert>}
              <Form.Group className={styles.form_text + ' mb-2'} as='p'>
                <label className='col-10'> 
                  <input type='checkbox' required className='col-1'/>&nbsp;
                  Я принимаю <a href='/personaldata'>соглашение о персональных данных</a>
                </label>
              </Form.Group>
              {registrationErrors.other && <Alert className='text-center' variant='danger'>{registrationErrors.other}</Alert>}
              <Form.Group className='d-flex justify-content-center' as='p'>
                <Button type='submit' className='col-8 button-fr'>
                  Зарегистрироваться
                </Button>
              </Form.Group>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default LoginRegistrationForm;
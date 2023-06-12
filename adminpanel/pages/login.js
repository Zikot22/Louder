import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { setCookie } from 'cookies-next';
import packageInfo from '../package.json';  
import jwtDecode from 'jwt-decode';

function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const domain = packageInfo.domain;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
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
        if(decodedToken.Role == 'Admin'){
          setCookie('token', token, { maxAge: 60 * 60 * 24 * 7 * 2});
          window.location.href = '/';
        }
        else {
          setLoginError('Вы не администратор');
        }
      }
      else {
        setLoginError('Неправильный email или пароль');
      }
      
    } 
    catch (error) {
      setLoginError('Во время входа произошла ошибка');
    }
  };

  return (
    <Container className='d-flex align-items-center justify-content-center' style={{ height: '100vh' }}>
      <div className='text-center pb-5'>
        <h1>Вход</h1>
        <Form className='pt-2' onSubmit={handleLoginSubmit}>
          <Form.Group className='my-2'>
              <input className='col-12 form-control-lg'
                  placeholder='Электронная почта'
                  type='email'
                  name='email'
                  id='loginEmail'
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  />
          </Form.Group>
          <Form.Group className='my-2'>
            <input className='col-12 form-control-lg'
                  placeholder='Пароль'
                  type='password'
                  name='password'
                  id='password'
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  />
          </Form.Group>
          {loginError && <Alert className='text-center' variant='danger'>{loginError}</Alert>}
          <Button className='btn-lg mt-1' type='submit'>Войти</Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
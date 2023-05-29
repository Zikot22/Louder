import React, { useState } from 'react';
import { Container, Tabs, Tab, Form, Button, Alert, TabPane } from "react-bootstrap";
import styles from "../styles/components/authorization.module.css";

const LoginRegistrationForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registrationData, setRegistrationData] = useState({ name: '', email: '', password: '', checkbox: false });
  const [errors, setErrors] = useState({});

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setErrors({});
    }
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

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setRegistrationData((prevState) => ({
      ...prevState,
      checkbox: checked,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login Data:', loginData);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Validate registration form
    const { name, email, password, checkbox } = registrationData;
    const errors = {};

    if (!name) {
      errors.name = 'Name is required';
    } else if (name.length > 100) {
      errors.name = 'Name should be less than 100 characters';
    }

    if (!email) {
      errors.email = 'Email is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8 || password.length > 16) {
      errors.password = 'Password should be between 8 and 16 characters';
    }

    if (!checkbox) {
      errors.checkbox = 'Please accept the terms and conditions';
    }

    if (Object.keys(errors).length === 0) {
      // Registration form is valid
      console.log('Registration Data:', registrationData);
    } else {
      setErrors(errors);
    }
  };

  return (
    <Container className="p-0">
      <Tabs defaultActiveKey="login" justify>
        <Tab eventKey="login" title="Вход">
        <Form onSubmit={handleLoginSubmit} className="pt-4 pb-3 px-0">
           <Form.Group className={styles.form_text}>
                 <input className="col-10  px-2 py-1"
                    placeholder="Электронная почта"
                    type="email"
                    name="email"
                    id="loginEmail"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    />
            </Form.Group>
            <Form.Group className={styles.form_text}>
                <input className="col-10 px-2 py-1"
                    placeholder="Пароль"
                    type="password"
                    name="password"
                    id="loginPassword"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                />
            </Form.Group>
            <Form.Group className="d-flex justify-content-center">
              <Button color="primary" type="submit" className="col-3">
                  Войти
              </Button>
            </Form.Group>
        </Form>
        </Tab>
        <Tab eventKey="password" title="Регистрация">
        <Form onSubmit={handleRegistrationSubmit} className="pt-4 pb-3 px-3">
                 <Form.Group className={styles.form_text}>
                     <input type="text" className="col-10 px-2 py-1"
                        placeholder="Имя"
                        name="name"
                        id="registrationName"
                        value={registrationData.name}
                        onChange={handleRegistrationChange}
                        required
                    />
                    {errors.name && <Alert color="danger">{errors.name}</Alert>}
                </Form.Group>
                <Form.Group className={styles.form_text}>
                  <input type="email" className="col-10 px-2 py-1"
                    placeholder="Электронная почта"
                    name="email"
                    id="registrationEmail"
                    value={registrationData.email}
                    onChange={handleRegistrationChange}
                    required
                  />
                  {errors.email && <Alert color="danger">{errors.email}</Alert>}
                </Form.Group>
                <Form.Group className={styles.form_text + ' mb-2'}>
                  <input type="password" className="col-10 ml-2 px-2 py-1"
                    placeholder="Пароль"
                    name="password"
                    id="registrationPassword"
                    value={registrationData.password}
                    onChange={handleRegistrationChange}
                    required
                  />
                  {errors.password && <Alert color="danger">{errors.password}</Alert>}
                </Form.Group>
                <Form.Group check className={styles.form_text + ' mb-2'}>
                  <label check className="col-10"> 
                    <input type="checkbox" onChange={handleCheckboxChange} required/>{' '}
                    Я принимаю <a href="#">соглашение об обработке данных</a>
                  </label>
                  {errors.checkbox && <Alert color="danger">{errors.checkbox}</Alert>}
                </Form.Group>
                <Form.Group className="d-flex justify-content-center">
                  <Button color="primary" type="submit" className="col-8">
                    Зарегистрироваться
                  </Button>
                </Form.Group>
              </Form>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LoginRegistrationForm;
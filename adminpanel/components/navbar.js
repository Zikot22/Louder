import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const AdminNavigation = () => {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token');
    router.push('/login');
  };

  return (
    <header style={{ backgroundColor: 'white' }}>
      <Navbar expand='md' as='nav'>
        <Container>
          <Navbar.Brand className='mb-0' as='h3'>Louder Admin</Navbar.Brand>
          <Navbar.Toggle style={{ backgroundColor: 'white !important' }} aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav as='ul' className='me-auto'>
              <Nav.Link as='a' href='/'>Пользователи</Nav.Link>
              <Nav.Link as='a' href='tickets'>Билеты</Nav.Link>
              <Nav.Link as='a' href='events'>Мероприятия</Nav.Link>
            </Nav>
            <Button onClick={handleLogout}>
              Выйти
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminNavigation;
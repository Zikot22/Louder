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
      <Container>
        <Navbar expand='md'>
          <Navbar.Brand>Louder Admin</Navbar.Brand>
          <Navbar.Toggle style={{ backgroundColor: 'white !important' }} aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link href='/'>Пользователи</Nav.Link>
              <Nav.Link href='tickets'>Билеты</Nav.Link>
              <Nav.Link href='events'>Мероприятия</Nav.Link>
            </Nav>
            <Button onClick={handleLogout}>
              Выйти
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </header>
  );
};

export default AdminNavigation;
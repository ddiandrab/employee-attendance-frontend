import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
} from 'react-bootstrap';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../auth/auth.context';

export function Navigation() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="fw-bold"
        >
          Employee Attendance
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navigation"
        />

        <Navbar.Offcanvas
          id="main-navigation"
          aria-labelledby="main-navigation-label"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="main-navigation-label"
            >
              Employee Attendance
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/dashboard"
              >
                Dashboard
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/attendance"
              >
                My Attendance
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/profile"
              >
                My Profile
              </Nav.Link>

              {(user?.role === 'HR' ||
                user?.role === 'ADMIN') && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/employees"
                  >
                    Employees
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/attendance/all"
                  >
                    All Attendance
                  </Nav.Link>
                </>
              )}

              {user?.role === 'ADMIN' && (
                <Nav.Link
                  as={Link}
                  to="/departments"
                >
                  Departments
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-lg-center gap-3 mt-3 mt-lg-0">
              <div className="text-light">
                <div className="fw-semibold">
                  {user?.email}
                </div>

                <small className="text-secondary">
                  {user?.role}
                </small>
              </div>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
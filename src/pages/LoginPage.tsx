import {
  useState,
} from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';

import {
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../auth/auth.context';

export function LoginPage() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(
        email,
        password,
      );

      navigate('/dashboard');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Login failed',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col
            xs={12}
            sm={10}
            md={7}
            lg={5}
            xl={4}
          >
            <Card className="shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="fw-bold mb-2">
                    Employee Attendance
                  </h1>

                  <p className="text-muted mb-0">
                    Sign in to your account
                  </p>
                </div>

                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() =>
                      setError('')
                    }
                  >
                    {error}
                  </Alert>
                )}

                <Form
                  onSubmit={
                    handleSubmit
                  }
                >
                  <Form.Group
                    className="mb-3"
                    controlId="email"
                  >
                    <Form.Label>
                      Email
                    </Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value,
                        )
                      }
                      autoComplete="email"
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-4"
                    controlId="password"
                  >
                    <Form.Label>
                      Password
                    </Form.Label>

                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      autoComplete="current-password"
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            size="sm"
                            className="me-2"
                          />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <p className="text-center text-muted small mt-3">
              Employee Attendance System
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
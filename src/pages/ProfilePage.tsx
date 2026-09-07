import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';

import {
  getMyEmployee,
  updateMyProfile,
  type Employee,
} from '../api/employees.api';

import {
  useAuth,
} from '../auth/auth.context';

import {
  changePassword,
} from '../api/auth.api';

export function ProfilePage() {
  const { user } = useAuth();

  // Profile state
  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [phone, setPhone] =
    useState('');

  const [photoUrl, setPhotoUrl] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  // Password modal state
  const [
    showPasswordModal,
    setShowPasswordModal,
  ] = useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('');

  const [
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    passwordSaving,
    setPasswordSaving,
  ] = useState(false);

  const [
    passwordError,
    setPasswordError,
  ] = useState('');

  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState('');

  // Effects
  useEffect(() => {
    getMyEmployee()
      .then((data) => {
        setEmployee(data);
        setPhone(data.phone ?? '');
        setPhotoUrl(data.photoUrl ?? '');
      })
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load profile',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Functions
   function openPasswordModal() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordMessage('');

    setShowPasswordModal(true);
  }

  function closePasswordModal() {
    if (passwordSaving) {
      return;
    }

    setShowPasswordModal(false);
  }

  async function handleChangePassword(
    event: FormEvent,
  ) {
    event.preventDefault();

    setPasswordError('');
    setPasswordMessage('');

    if (
      newPassword !== confirmPassword
    ) {
      setPasswordError(
        'New password and confirmation do not match.',
      );

      return;
    }

    try {
      setPasswordSaving(true);

      await changePassword(
        currentPassword,
        newPassword,
      );

      setPasswordMessage(
        'Password changed successfully.',
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : 'Failed to change password',
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const updated =
        await updateMyProfile({
          phone,
          photoUrl,
        });

      setEmployee(updated);

      setMessage(
        'Profile updated successfully.',
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update profile',
      );
    } finally {
      setSaving(false);
    }
  }

  // Conditional rendering
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (!employee) {
    return (
      <Alert variant="danger">
        Profile not found.
      </Alert>
    );
  }

  // Normal rendering
  const fullName = [
    employee.firstName,
    employee.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">
          My Profile
        </h1>

        <p className="page-subtitle mb-0">
          Manage your personal information
        </p>
      </div>

      {message && (
        <Alert
          variant="success"
          dismissible
          onClose={() =>
            setMessage('')
          }
        >
          {message}
        </Alert>
      )}

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

      <Row className="g-4">
        <Col
          xs={12}
          lg={4}
        >
          <Card className="h-100">
            <Card.Body className="text-center p-4">
              {employee.photoUrl ? (
                <Image
                  src={employee.photoUrl}
                  alt={fullName}
                  roundedCircle
                  width={160}
                  height={160}
                  className="mb-4"
                  style={{
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{
                    width: 160,
                    height: 160,
                    fontSize: '3rem',
                  }}
                >
                  {employee.firstName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <h3 className="fw-bold mb-1">
                {fullName}
              </h3>

              <p className="text-muted mb-2">
                {employee.position ??
                  'Employee'}
              </p>

              <span className="badge text-bg-primary">
                {employee.employeeNumber}
              </span>

              <hr className="my-4" />

              <div className="text-start">
                <small className="text-muted">
                  Account
                </small>

                <div className="fw-semibold">
                  {user?.email}
                </div>

                <small className="text-muted">
                  {user?.role}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col
          xs={12}
          lg={8}
        >
          <Card className="mb-4">
            <Card.Body className="p-4">
              <Card.Title className="fw-bold">
                Personal Information
              </Card.Title>

              <Card.Text className="text-muted">
                Update the information you
                are allowed to change.
              </Card.Text>

              <Form
                onSubmit={handleSubmit}
              >
                <Row className="g-3">
                  <Col
                    xs={12}
                    md={6}
                  >
                    <Form.Group>
                      <Form.Label>
                        First Name
                      </Form.Label>

                      <Form.Control
                        value={
                          employee.firstName
                        }
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col
                    xs={12}
                    md={6}
                  >
                    <Form.Group>
                      <Form.Label>
                        Last Name
                      </Form.Label>

                      <Form.Control
                        value={
                          employee.lastName ??
                          ''
                        }
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        Email
                      </Form.Label>

                      <Form.Control
                        value={
                          employee.email ??
                          user?.email ??
                          ''
                        }
                        disabled
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        Phone
                      </Form.Label>

                      <Form.Control
                        value={phone}
                        onChange={(event) =>
                          setPhone(
                            event.target.value,
                          )
                        }
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>
                        Photo URL
                      </Form.Label>

                      <Form.Control
                        value={photoUrl}
                        onChange={(event) =>
                          setPhotoUrl(
                            event.target.value,
                          )
                        }
                        placeholder="https://example.com/photo.jpg"
                      />

                      <Form.Text className="text-muted">
                        Photo upload will be
                        added later.
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex justify-content-end">
                      <Button
                        type="submit"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Spinner
                              size="sm"
                              className="me-2"
                            />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    Password
                  </h5>

                  <p className="text-muted mb-0">
                    Keep your account secure
                    by using a strong password.
                  </p>
                </div>

                <Button
                  variant="outline-primary"
                  onClick={openPasswordModal}                
                >
                  Change Password
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showPasswordModal}
        onHide={closePasswordModal}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Change Password
          </Modal.Title>
        </Modal.Header>

        <Form
          onSubmit={handleChangePassword}
        >
        <Modal.Body>
              <p className="text-muted">
                Enter your current password and
                choose a new password.
              </p>

              {passwordError && (
                <Alert variant="danger">
                  {passwordError}
                </Alert>
              )}

              {passwordMessage && (
                <Alert variant="success">
                  {passwordMessage}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>
                  Current Password
                </Form.Label>

                <Form.Control
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="current-password"
                  required
                  disabled={passwordSaving}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  New Password
                </Form.Label>

                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  required
                  disabled={passwordSaving}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Confirm New Password
                </Form.Label>

                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  autoComplete="new-password"
                  required
                  disabled={passwordSaving}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={closePasswordModal}
                disabled={passwordSaving}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={passwordSaving}
              >
                {passwordSaving ? (
                  <>
                    <Spinner
                      size="sm"
                      className="me-2"
                    />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </Modal.Footer>
          </Form>
      </Modal>
    </div>
  );
}
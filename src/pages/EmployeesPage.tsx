import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';

import {
  deleteEmployee,
  getEmployees,
  updateEmployee,
  type Employee,
} from '../api/employees.api';

import { useAuth } from '../auth/auth.context';

export function EmployeesPage() {
  const { user } = useAuth();

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [editError, setEditError] =
    useState('');

  const [message, setMessage] =
    useState('');

  // Form state
  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [position, setPosition] =
    useState('');

  const [employeeNumber, setEmployeeNumber] =
    useState('');

  const [joinDate, setJoinDate] =
    useState('');

  const [isActive, setIsActive] =
    useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError('');

      const data =
        await getEmployees();

      setEmployees(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load employees',
      );
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(
    employee: Employee,
  ) {
    setSelectedEmployee(employee);

    setEmployeeNumber(
      employee.employeeNumber,
    );

    setFirstName(
      employee.firstName,
    );

    setLastName(
      employee.lastName ?? '',
    );

    setEmail(
      employee.email ?? '',
    );

    setPhone(
      employee.phone ?? '',
    );

    setPosition(
      employee.position ?? '',
    );

    setJoinDate(
      employee.joinDate ?? '',
    );

    setIsActive(
      employee.isActive,
    );

    setEditError('');
    setShowEditModal(true);
  }

  function closeEditModal() {
    if (saving) {
      return;
    }

    setShowEditModal(false);
    setSelectedEmployee(null);
    setEditError('');
  }

  async function handleUpdate(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!selectedEmployee) {
      return;
    }

    try {
      setSaving(true);
      setEditError('');
      setMessage('');

      await updateEmployee(
        selectedEmployee.id,
        {
          employeeNumber,
          firstName,
          lastName: lastName || undefined,
          email: email || undefined,
          phone: phone || undefined,
          position: position || undefined,
          joinDate: joinDate || undefined,
          isActive,
        },
      );

      setMessage(
        'Employee updated successfully.',
      );

      setShowEditModal(false);
      setSelectedEmployee(null);

      await loadEmployees();
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : 'Failed to update employee',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    employee: Employee,
  ) {
    const confirmed =
      window.confirm(
        `Delete employee ${employee.firstName} ${employee.lastName ?? ''}?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setMessage('');

      await deleteEmployee(
        employee.id,
      );

      setMessage(
        'Employee deleted successfully.',
      );

      await loadEmployees();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete employee',
      );
    } finally {
      setDeleting(false);
    }
  }

  const filteredEmployees =
    employees.filter((employee) => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return true;
      }

      const fullName = [
        employee.firstName,
        employee.lastName,
      ]
        .filter(Boolean)
        .join(' ');

      return (
        fullName
          .toLowerCase()
          .includes(keyword) ||
        employee.employeeNumber
          .toLowerCase()
          .includes(keyword) ||
        employee.email
          ?.toLowerCase()
          .includes(keyword) ||
        employee.position
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="page-title mb-1">
              Employees
            </h1>

            <p className="page-subtitle mb-0">
              Manage employee information
            </p>
          </div>

          <Badge
            bg="primary"
            className="align-self-start align-self-md-center"
          >
            {user?.role}
          </Badge>
        </div>
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

      {/* Employee List */}
      <Card>
        <Card.Body className="p-4">
          <Row className="g-3 mb-4">
            <Col
              xs={12}
              md={6}
              lg={5}
            >
              <Form.Control
                placeholder="Search by name, employee number, email..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
              />
            </Col>

            <Col
              xs={12}
              md={6}
              lg={7}
              className="d-flex justify-content-md-end align-items-center"
            >
              <span className="text-muted">
                {filteredEmployees.length}{' '}
                employee(s)
              </span>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : filteredEmployees.length ===
            0 ? (
            <div className="text-center text-muted py-5">
              No employees found.
            </div>
          ) : (
            <div className="table-responsive">
              <Table
                hover
                className="align-middle mb-0"
              >
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Employee No.</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map(
                    (employee) => {
                      const fullName = [
                        employee.firstName,
                        employee.lastName,
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <tr
                          key={
                            employee.id
                          }
                        >
                          <td>
                            <div className="fw-semibold">
                              {fullName}
                            </div>

                            <small className="text-muted">
                              ID: {employee.id}
                            </small>
                          </td>

                          <td>
                            {
                              employee.employeeNumber
                            }
                          </td>

                          <td>
                            {employee.position ??
                              '-'}
                          </td>

                          <td>
                            {employee.email ??
                              '-'}
                          </td>

                          <td>
                            {employee.isActive ? (
                              <Badge bg="success">
                                Active
                              </Badge>
                            ) : (
                              <Badge bg="secondary">
                                Inactive
                              </Badge>
                            )}
                          </td>

                          <td>
                            <div className="d-flex justify-content-end gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  openEditModal(
                                    employee,
                                  )
                                }
                              >
                                Edit
                              </Button>

                              {user?.role ===
                                'ADMIN' && (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  disabled={
                                    deleting
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      employee,
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={closeEditModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Employee
          </Modal.Title>
        </Modal.Header>

        <Form
          onSubmit={handleUpdate}
        >
          <Modal.Body>
            {editError && (
              <Alert variant="danger">
                {editError}
              </Alert>
            )}

            <Row className="g-3">
              <Col
                xs={12}
                md={6}
              >
                <Form.Group>
                  <Form.Label>
                    Employee Number
                  </Form.Label>

                  <Form.Control
                    value={employeeNumber}
                    onChange={(event) =>
                      setEmployeeNumber(
                        event.target.value,
                      )
                    }
                    required
                  />
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={6}
              >
                <Form.Group>
                  <Form.Label>
                    Status
                  </Form.Label>

                  <Form.Select
                    value={
                      isActive
                        ? 'active'
                        : 'inactive'
                    }
                    onChange={(event) =>
                      setIsActive(
                        event.target.value ===
                          'active',
                      )
                    }
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={6}
              >
                <Form.Group>
                  <Form.Label>
                    First Name
                  </Form.Label>

                  <Form.Control
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value,
                      )
                    }
                    required
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
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={6}
              >
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
                  />
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={6}
              >
                <Form.Group>
                  <Form.Label>
                    Position
                  </Form.Label>

                  <Form.Control
                    value={position}
                    onChange={(event) =>
                      setPosition(
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={6}
              >
                <Form.Group>
                  <Form.Label>
                    Join Date
                  </Form.Label>

                  <Form.Control
                    type="date"
                    value={joinDate}
                    onChange={(event) =>
                      setJoinDate(
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeEditModal}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
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
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';

import {
  getAllAttendance,
  type AllAttendanceRecord,
} from '../api/attendance.api';

function getToday() {
  return new Intl.DateTimeFormat(
    'en-CA',
    {
      timeZone: 'Asia/Jakarta',
    },
  ).format(new Date());
}

function getFirstDayOfMonth() {
  const today = getToday();

  return `${today.substring(0, 7)}-01`;
}

function formatTime(
  timestamp: string | null,
) {
  if (!timestamp) {
    return '-';
  }

  return new Date(
    timestamp,
  ).toLocaleTimeString(
    'id-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );
}

export function AllAttendancePage() {
  const [
    attendance,
    setAttendance,
  ] = useState<AllAttendanceRecord[]>([]);

  const [
    from,
    setFrom,
  ] = useState(
    getFirstDayOfMonth(),
  );

  const [
    to,
    setTo,
  ] = useState(
    getToday(),
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  async function loadAttendance() {
    try {
      setLoading(true);
      setError('');

      const data =
        await getAllAttendance(
          from,
          to,
        );

      setAttendance(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load attendance',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  function handleFilter(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    loadAttendance();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="page-title mb-1">
          All Attendance
        </h1>

        <p className="page-subtitle mb-0">
          View attendance records for all
          employees
        </p>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold mb-3">
            Filter Attendance
          </Card.Title>

          <Form
            onSubmit={handleFilter}
          >
            <Row className="g-3 align-items-end">
              <Col
                xs={12}
                md={5}
              >
                <Form.Group>
                  <Form.Label>
                    From
                  </Form.Label>

                  <Form.Control
                    type="date"
                    value={from}
                    max={to}
                    onChange={(event) =>
                      setFrom(
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={5}
              >
                <Form.Group>
                  <Form.Label>
                    To
                  </Form.Label>

                  <Form.Control
                    type="date"
                    value={to}
                    min={from}
                    max={getToday()}
                    onChange={(event) =>
                      setTo(
                        event.target.value,
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col
                xs={12}
                md={2}
              >
                <div className="d-grid">
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      'Filter'
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Attendance Table */}
      <Card>
        <Card.Body className="p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
            <div>
              <Card.Title className="fw-bold mb-1">
                Attendance Records
              </Card.Title>

              <Card.Text className="text-muted mb-0">
                {from} → {to}
              </Card.Text>
            </div>

            <Badge
              bg="secondary"
              className="align-self-start align-self-md-center"
            >
              {attendance.length} records
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : attendance.length ===
            0 ? (
            <div className="text-center text-muted py-5">
              No attendance records found
              for this period.
            </div>
          ) : (
            <div className="table-responsive">
              <Table
                hover
                className="align-middle mb-0"
              >
                <thead>
                  <tr>
                    <th>
                      Employee
                    </th>

                    <th>
                      Employee No.
                    </th>

                    <th>
                      Position
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Check In
                    </th>

                    <th>
                      Check Out
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map(
                    (record) => (
                      <tr
                        key={
                          record.id
                        }
                      >
                        <td>
                          <div className="fw-semibold">
                            {
                              record.employeeName
                            }
                          </div>

                          <small className="text-muted">
                            ID:{' '}
                            {
                              record.employeeId
                            }
                          </small>
                        </td>

                        <td>
                          {
                            record.employeeNumber
                          }
                        </td>

                        <td>
                          {
                            record.position ??
                              '-'
                          }
                        </td>

                        <td>
                          {
                            record.attendanceDate
                          }
                        </td>

                        <td>
                          {formatTime(
                            record.checkIn,
                          )}
                        </td>

                        <td>
                          {formatTime(
                            record.checkOut,
                          )}
                        </td>

                        <td>
                          {record.checkOut ? (
                            <Badge bg="success">
                              Completed
                            </Badge>
                          ) : (
                            <Badge bg="warning">
                              Working
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
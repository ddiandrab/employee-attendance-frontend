import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';

import {
  getMyAttendance,
  type AttendanceRecord,
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

export function AttendancePage() {
  const [
    attendance,
    setAttendance,
  ] = useState<AttendanceRecord[]>([]);

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
      setError('');
      setLoading(true);

      const data =
        await getMyAttendance(
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
      <div className="mb-4">
        <h1 className="page-title">
          My Attendance
        </h1>

        <p className="page-subtitle mb-0">
          View your attendance history
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

      <Card className="mb-4">
        <Card.Body>
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
                      <Spinner
                        size="sm"
                      />
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

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Card.Title className="fw-bold mb-1">
                Attendance History
              </Card.Title>

              <Card.Text className="text-muted mb-0">
                {from} → {to}
              </Card.Text>
            </div>

            <span className="badge text-bg-secondary">
              {attendance.length} records
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : attendance.length === 0 ? (
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
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map(
                    (record) => (
                      <tr
                        key={record.id}
                      >
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
                            <span className="badge text-bg-success">
                              Completed
                            </span>
                          ) : (
                            <span className="badge text-bg-warning">
                              Checked In
                            </span>
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
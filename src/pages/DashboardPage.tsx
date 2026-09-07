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
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';

import {
  checkIn,
  checkOut,
  getMyAttendance,
  type AttendanceRecord,
} from '../api/attendance.api';

import { useAuth } from '../auth/auth.context';

export function DashboardPage() {
  const {
    user,
  } = useAuth();

  const [
    attendance,
    setAttendance,
  ] = useState<AttendanceRecord[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  async function loadAttendance() {
    try {
      setError('');

      const data =
        await getMyAttendance();

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

  async function handleCheckIn() {
    try {
      setError('');
      setActionLoading(true);

      await checkIn();

      await loadAttendance();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Check-in failed',
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    try {
      setError('');
      setActionLoading(true);

      await checkOut();

      await loadAttendance();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Check-out failed',
      );
    } finally {
      setActionLoading(false);
    }
  }

  function formatTime(timestamp: string | null) {
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

  const today = new Intl.DateTimeFormat(
    'en-CA',
    {
      timeZone: 'Asia/Jakarta',
    },
  ).format(new Date());

  const todayAttendance =
    attendance.find(
      (record) =>
        record.attendanceDate === today,
  );
  
  return (
    <div>
      <div className="mb-4">
        <h1 className="page-title">
          Dashboard
        </h1>

        <p className="page-subtitle mb-0">
          Welcome back, {user?.email}
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

      <Row className="g-4 mb-4">
        <Col
          xs={12}
          md={6}
          lg={4}
        >
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                Today's Attendance
              </Card.Title>

              <div className="mt-3">
                {todayAttendance ? (
                  <Badge
                    bg={
                      todayAttendance.checkOut
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {todayAttendance.checkOut
                      ? 'Completed'
                      : 'Checked In'}
                  </Badge>
                ) : (
                  <Badge bg="secondary">
                    Not Checked In
                  </Badge>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col
          xs={12}
          md={6}
          lg={4}
        >
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                Check In
              </Card.Title>

              <p className="text-muted">
                Record your attendance
                for today.
              </p>

              <Button
                variant="primary"
                onClick={handleCheckIn}
                disabled={
                  actionLoading ||
                  !!todayAttendance
                }
              >
                {todayAttendance
                  ? 'Already Checked In'
                  : 'Check In'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col
          xs={12}
          md={6}
          lg={4}
        >
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                Check Out
              </Card.Title>

              <p className="text-muted">
                Record your checkout
                time for today.
              </p>

              <Button
                variant="outline-primary"
                onClick={handleCheckOut}
                disabled={
                  actionLoading ||
                  !todayAttendance ||
                  !!todayAttendance.checkOut
                }
              >
                {todayAttendance?.checkOut
                  ? 'Already Checked Out'
                  : 'Check Out'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Card.Title className="mb-1">
                Attendance History
              </Card.Title>

              <Card.Text className="text-muted">
                Your recent attendance records
              </Card.Text>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center text-muted py-5">
              No attendance records found.
            </div>
          ) : (
            <div className="table-responsive">
              <Table
                hover
                responsive
                className="align-middle mb-0"
              >
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
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
                          {formatTime(record.checkIn)}
                        </td>

                        <td>
                          {formatTime(record.checkOut)}
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
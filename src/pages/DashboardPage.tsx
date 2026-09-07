import {
  useEffect,
  useState,
} from 'react';

import {
  useAuth,
} from '../auth/auth.context';

import {
  checkIn,
  checkOut,
  getMyAttendance,
  type AttendanceRecord,
} from '../api/attendance.api';

export function DashboardPage() {
  const {
    user,
    logout,
  } = useAuth();

  const [
    attendance,
    setAttendance,
  ] = useState<
    AttendanceRecord[]
  >([]);

  const [
    error,
    setError,
  ] = useState('');

  async function loadAttendance() {
    try {
      const data =
        await getMyAttendance();

      setAttendance(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load attendance',
      );
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  async function handleCheckIn() {
    try {
      setError('');

      await checkIn();

      await loadAttendance();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Check-in failed',
      );
    }
  }

  async function handleCheckOut() {
    try {
      setError('');

      await checkOut();

      await loadAttendance();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Check-out failed',
      );
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Welcome, {user?.email}
      </p>

      <p>
        Role: {user?.role}
      </p>

      <button
        onClick={handleCheckIn}
      >
        Check In
      </button>

      <button
        onClick={handleCheckOut}
      >
        Check Out
      </button>

      <button
        onClick={logout}
      >
        Logout
      </button>

      {error && (
        <p>{error}</p>
      )}

      <h2>
        Attendance History
      </h2>

      <table>
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
              <tr key={record.id}>
                <td>
                  {record.attendanceDate}
                </td>

                <td>
                  {record.checkIn ??
                    '-'}
                </td>

                <td>
                  {record.checkOut ??
                    '-'}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
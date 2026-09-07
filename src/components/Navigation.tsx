import {
  Link,
} from 'react-router-dom';

import {
  useAuth,
} from '../auth/auth.context';

export function Navigation() {
  const { user } =
    useAuth();

  return (
    <nav>
      <Link to="/dashboard">
        Dashboard
      </Link>
      
      <Link to="/profile">
        My Profile
      </Link>

      <Link to="/attendance">
        My Attendance
      </Link>

      {(
        user?.role === 'HR' ||
        user?.role === 'ADMIN'
      ) && (
        <>
          <Link to="/employees">
            Employees
          </Link>

          <Link to="/attendance/all">
            All Attendance
          </Link>
        </>
      )}

      {user?.role === 'ADMIN' && (
        <Link to="/departments">
          Departments
        </Link>
      )}
    </nav>
  );
}
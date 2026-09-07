import {
  useEffect,
  useState,
} from 'react';

import {
  getEmployees,
  type Employee,
} from '../api/employees.api';

export function EmployeesPage() {
  const [
    employees,
    setEmployees,
  ] = useState<Employee[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load employees',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading employees...</p>;
  }

  return (
    <div>
      <h1>Employees</h1>

      {error && (
        <p>{error}</p>
      )}

      <table>
        <thead>
          <tr>
            <th>Employee Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(
            (employee) => (
              <tr key={employee.id}>
                <td>
                  {
                    employee.employeeNumber
                  }
                </td>

                <td>
                  {employee.firstName}{' '}
                  {employee.lastName ?? ''}
                </td>

                <td>
                  {employee.email ?? '-'}
                </td>

                <td>
                  {employee.position ?? '-'}
                </td>

                <td>
                  {employee.isActive
                    ? 'Active'
                    : 'Inactive'}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  getMyEmployee,
  updateMyProfile,
  type Employee,
} from '../api/employees.api';

export function ProfilePage() {
  const [
    employee,
    setEmployee,
  ] = useState<Employee | null>(null);

  const [
    phone,
    setPhone,
  ] = useState('');

  const [
    photoUrl,
    setPhotoUrl,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  useEffect(() => {
    getMyEmployee()
      .then((data) => {
        setEmployee(data);
        setPhone(data.phone ?? '');
        setPhotoUrl(
          data.photoUrl ?? '',
        );
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
        'Profile updated successfully',
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

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!employee) {
    return <p>Profile not found.</p>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      {employee.photoUrl && (
        <img
          src={employee.photoUrl}
          alt="Profile"
          width={120}
          height={120}
        />
      )}

      <div>
        <strong>Name</strong>
        <p>
          {employee.firstName}{' '}
          {employee.lastName ?? ''}
        </p>
      </div>

      <div>
        <strong>Employee Number</strong>
        <p>
          {employee.employeeNumber}
        </p>
      </div>

      <div>
        <strong>Email</strong>
        <p>{employee.email ?? '-'}</p>
      </div>

      <div>
        <strong>Position</strong>
        <p>
          {employee.position ?? '-'}
        </p>
      </div>

      <div>
        <strong>Phone</strong>
        <p>{employee.phone ?? '-'}</p>
      </div>

      <hr />

      <h2>Edit Profile</h2>

      <form
        onSubmit={handleSubmit}
      >
        <div>
          <label>
            Phone
          </label>

          <input
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value,
              )
            }
          />
        </div>

        <div>
          <label>
            Photo URL
          </label>

          <input
            value={photoUrl}
            onChange={(event) =>
              setPhotoUrl(
                event.target.value,
              )
            }
          />
        </div>

        {message && (
          <p>{message}</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
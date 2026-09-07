import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { AuthProvider } from './auth/auth.context';
import { ProtectedRoute } from './auth/protected-route';

import { AppLayout } from './components/AppLayout';

import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AttendancePage } from './pages/AttendancePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            element={<ProtectedRoute />}
          >
            <Route
              element={<AppLayout />}
            >
              <Route
                path="/dashboard"
                element={<DashboardPage />}
              />

              <Route
                path="/attendance"
                element={<AttendancePage />}
              />

              <Route
                path="/profile"
                element={<ProfilePage />}
              />
            </Route>
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  'ADMIN',
                  'HR',
                ]}
              />
            }
          >
            <Route
              element={<AppLayout />}
            >
              <Route
                path="/employees"
                element={<EmployeesPage />}
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
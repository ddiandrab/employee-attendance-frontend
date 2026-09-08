import {
  useEffect,
  useState,
} from 'react';

import {
  Badge,
  Dropdown,
  Spinner,
} from 'react-bootstrap';

import {
  Link,
} from 'react-router-dom';

import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from '../api/notifications.api';

function formatNotificationDate(
  value: string,
) {
  return new Date(value).toLocaleString(
    'id-ID',
    {
      dateStyle: 'short',
      timeStyle: 'short',
    },
  );
}

export function NotificationDropdown() {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  async function loadNotifications() {
    try {
      const data =
        await getNotifications();

      setNotifications(data);
    } catch {
      // Notification failure should not
      // break the main navigation.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleNotificationClick(
    notification: Notification,
  ) {
    if (notification.isRead) {
      return;
    }

    try {
      await markNotificationAsRead(
        notification.id,
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                isRead: true,
              }
            : item,
        ),
      );
    } catch {
      // Ignore for now.
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  const recentNotifications =
    notifications.slice(0, 5);

  return (
    <Dropdown
      align="end"
      className="notification-dropdown"
      onToggle={(isOpen) => {
        if (isOpen) {
          loadNotifications();
        }
      }}
    >
      <Dropdown.Toggle
        variant="link"
        id="notification-dropdown"
        className="notification-toggle text-light text-decoration-none p-0 border-0"
      >
        <span className="notification-icon">
          🔔
        </span>

        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="notification-badge"
          >
            {unreadCount > 9
              ? '9+'
              : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="notification-menu shadow border-0"
      >
        <div className="notification-header">
          <div>
            <div className="fw-semibold">
              Notifications
            </div>

            <small className="text-muted">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : `You're all caught up`}
            </small>
          </div>

          <Link
            to="/notifications"
            className="small text-decoration-none"
          >
            View all
          </Link>
        </div>

        <Dropdown.Divider />

        {loading ? (
          <div className="notification-loading">
            <Spinner size="sm" />

            <span className="text-muted small">
              Loading notifications...
            </span>
          </div>
        ) : recentNotifications.length ===
          0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              🔔
            </div>

            <div className="fw-semibold">
              No notifications
            </div>

            <small className="text-muted">
              New notifications will appear here.
            </small>
          </div>
        ) : (
          <div className="notification-list">
            {recentNotifications.map(
              (notification) => (
                <Dropdown.Item
                  key={notification.id}
                  as="div"
                  className={`notification-item ${
                    notification.isRead
                      ? ''
                      : 'notification-unread'
                  }`}
                >
                  <button
                    type="button"
                    className="notification-button"
                    onClick={() =>
                      handleNotificationClick(
                        notification,
                      )
                    }
                  >
                    <div className="notification-indicator">
                      {!notification.isRead && (
                        <span className="notification-dot" />
                      )}
                    </div>

                    <div className="flex-grow-1 min-width-0">
                      <div className="notification-title">
                        {notification.title}
                      </div>

                      <div className="notification-message">
                        {notification.message}
                      </div>

                      <div className="notification-time">
                        {formatNotificationDate(
                          notification.createdAt,
                        )}
                      </div>
                    </div>
                  </button>
                </Dropdown.Item>
              ),
            )}
          </div>
        )}

        <Dropdown.Divider />

        <Link
          to="/notifications"
          className="notification-footer justify-content-center d-flex text-decoration-none"
        >
          See all notifications
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  );
}
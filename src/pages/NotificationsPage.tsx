import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Badge,
  Button,
  Card,
  Spinner,
} from 'react-bootstrap';

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from '../api/notifications.api';

function formatNotificationDate(
  value: string,
) {
  return new Date(value).toLocaleString(
    'id-ID',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  );
}

export function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  async function loadNotifications() {
    try {
      setError(null);

      const data =
        await getNotifications();

      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load notifications.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkAsRead(
    id: number,
  ) {
    try {
      await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to mark notification as read.',
      );
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to mark notifications as read.',
      );
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="mb-1">
            Notifications
          </h2>

          <div className="text-muted">
            {unreadCount > 0 ? (
              <>
                You have{' '}
                <Badge
                  bg="primary"
                  pill
                >
                  {unreadCount}
                </Badge>{' '}
                unread notification
                {unreadCount > 1
                  ? 's'
                  : ''}
              </>
            ) : (
              'You are all caught up.'
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <div className="notification-page-loading">
          <Spinner />

          <span className="text-muted">
            Loading notifications...
          </span>
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <Card className="border-0 shadow-sm">
          <Card.Body className="notification-page-empty">
            <div className="notification-page-empty-icon">
              🔔
            </div>

            <h5 className="mb-1">
              No notifications
            </h5>

            <p className="text-muted mb-0">
              New notifications will appear
              here.
            </p>
          </Card.Body>
        </Card>
      ) : (
        /* Notification List */
        <div className="notification-page-list">
          {notifications.map(
            (notification) => (
              <Card
                key={notification.id}
                className={`border-0 shadow-sm mb-2 notification-page-card ${
                  !notification.isRead
                    ? 'notification-page-card-unread'
                    : ''
                }`}
              >
                <Card.Body className="p-3 p-md-4">
                  <div className="d-flex gap-3">
                    {/* Unread Indicator */}
                    <div className="notification-page-indicator">
                      {!notification.isRead && (
                        <span className="notification-page-dot" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow-1 min-width-0">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                        <div className="min-width-0">
                          {/* Title */}
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h5 className="mb-0">
                              {notification.title}
                            </h5>

                            {!notification.isRead && (
                              <Badge
                                bg="primary"
                                pill
                              >
                                New
                              </Badge>
                            )}
                          </div>

                          {/* Message */}
                          <p className="text-muted mb-2">
                            {notification.message}
                          </p>

                          {/* Date */}
                          <small className="text-muted">
                            {formatNotificationDate(
                              notification.createdAt,
                            )}
                          </small>
                        </div>

                        {/* Action */}
                        {!notification.isRead && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() =>
                              handleMarkAsRead(
                                notification.id,
                              )
                            }
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  );
}
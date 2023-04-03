import { useState, useEffect } from 'react';

interface NotificationBarProps {
  message: string;
  type?: 'success' | 'error';
}

export default function NotificationBar({
  message,
  type,
}: NotificationBarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    setIsOpen(Boolean(message));
  }, [message]);

  const backgroundColor = type === 'success' ? '#1BEBB9' : '#F63135';
  const textColor = backgroundColor === '#1BEBB9' ? '#121A24' : '#FFFFFF';

  return (
    <>
      {isOpen && (
        <div
          style={{
            backgroundColor,
            color: textColor,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '0px',
          }}
        >
          <p style={{ margin: '0', fontSize: '20px' }}>{message}</p>
          <button
            onClick={handleClose}
            style={{
              padding: '5px 10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: textColor,
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}

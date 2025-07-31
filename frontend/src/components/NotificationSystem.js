import React, { useState, useEffect } from 'react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Fonction pour ajouter une notification
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Supprimer automatiquement après la durée spécifiée
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  };

  // Fonction pour supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Exposer les fonctions globalement
  useEffect(() => {
    window.showNotification = addNotification;
    window.removeNotification = removeNotification;
  }, []);

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '16px 20px',
      borderRadius: '12px',
      marginBottom: '10px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px',
      maxWidth: '400px',
      animation: 'slideInRight 0.3s ease-out',
      position: 'relative',
      overflow: 'hidden'
    };

    const typeStyles = {
      success: {
        background: 'linear-gradient(45deg, #1dd1a1, #10ac84)',
        borderColor: 'rgba(29, 209, 161, 0.3)'
      },
      error: {
        background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
        borderColor: 'rgba(255, 107, 107, 0.3)'
      },
      warning: {
        background: 'linear-gradient(45deg, #ff9ff3, #f368e0)',
        borderColor: 'rgba(255, 159, 243, 0.3)'
      },
      info: {
        background: 'linear-gradient(45deg, #48dbfb, #0abde3)',
        borderColor: 'rgba(72, 219, 251, 0.3)'
      }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={getNotificationStyle(notification.type)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>{getIcon(notification.type)}</span>
            <span>{notification.message}</span>
          </div>
          
          <button
            onClick={() => removeNotification(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
          >
            ✕
          </button>

          {/* Barre de progression */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.3)',
              width: '100%',
              animation: 'progressBar 5s linear'
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSystem; 
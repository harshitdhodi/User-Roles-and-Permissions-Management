// public/service-worker.js
self.addEventListener('push', function(event) {
    if (event.data) {
      const data = event.data.json();
      
      // Don't show notification for subscription checks
      if (data.type === 'check') {
        return;
      }
  
      event.waitUntil(
        self.registration.showNotification(data.title || 'New Message', {
          body:data.message ,
          icon: '/notification-icon.png',
          badge: '/notification-badge.png',
          data: data // Pass through any additional data
        })
      );
    }
  });
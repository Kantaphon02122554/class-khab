// Service worker: รับ Web Push แล้วแสดงแจ้งเตือน (ทำงานได้แม้ปิดหน้าเว็บ)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let d = { title: 'ClassKhab', body: '', url: './' };
  try { d = { ...d, ...event.data.json() }; } catch (e) { /* ใช้ค่าเริ่มต้น */ }
  event.waitUntil(
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'classkhab',
      renotify: true,
      data: { url: d.url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus();
      return self.clients.openWindow(target);
    })
  );
});

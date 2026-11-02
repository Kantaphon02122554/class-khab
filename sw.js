// Service worker: รับ Web Push แล้วแสดงแจ้งเตือน (ทำงานได้แม้ปิดหน้าเว็บ)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('classkhab-') && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

// ---- ใช้ออฟไลน์: "เน็ตก่อน ถ้าเน็ตไม่มีค่อยใช้ที่เก็บไว้" ----
// ออนไลน์ = ได้ไฟล์ล่าสุดเสมอ (อัปโหลดขึ้น GitHub แล้วเห็นทันที) ออฟไลน์ = เปิดหน้าเว็บและตารางที่เคยโหลดไว้ได้
// เก็บเฉพาะไฟล์ของเว็บเอง + ไลบรารี/ฟอนต์ที่หน้าเว็บใช้; ไม่แตะ API ของ Supabase (ตารางสำรองเก็บใน localStorage ฝั่งหน้าเว็บ) และไม่เก็บหน้าแอดมิน
const CACHE = 'classkhab-v1';
const CDN_HOSTS = ['cdn.tailwindcss.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && (res.status === 200 || res.type === 'opaque')) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    const hit = (await cache.match(req)) || (req.mode === 'navigate' ? (await cache.match('./')) || (await cache.match('index.html')) : undefined);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const u = new URL(req.url);
  const same = u.origin === self.location.origin;
  if (!same && !CDN_HOSTS.includes(u.hostname)) return;
  if (same && /\/(admin\.html|sw\.js|music\.mp4)$/.test(u.pathname)) return;
  event.respondWith(networkFirst(req));
});

self.addEventListener('push', (event) => {
  let d = { title: 'ClassKhab', body: '', url: './' };
  try { d = { ...d, ...event.data.json() }; } catch (e) { /* ใช้ค่าเริ่มต้น */ }
  event.waitUntil(
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      vibrate: [400, 150, 400, 150, 700],   // สั่นยาวขึ้นให้รู้ตัว (เสียงกำหนดโดยเครื่อง เว็บเปลี่ยนเสียงเองไม่ได้)
      silent: false,
      requireInteraction: true,             // คอม: แจ้งเตือนค้างจนกดปิด ไม่หายเองใน 5 วิ
      tag: d.tag || 'classkhab',
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

self.addEventListener('push', (event) => {
  let payload = { title: 'Scheduler', body: 'Напоминание', url: '/calendar' }
  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() }
    }
  } catch {
    /* keep defaults */
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: `scheduler-${payload.body}-${Date.now()}`,
      data: { url: payload.url ?? '/calendar' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/calendar'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    }),
  )
})

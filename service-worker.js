importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox){
  console.log('Workbox berhasil dimuat');

  workbox.precaching.precacheAndRoute([    
    { url: '/pwa/', revision: '1' },
    { url: '/pwa/nav.html', revision: '1' },
    { url: '/pwa/index.html', revision: '1' },
    { url: '/pwa/team.html', revision: '1' },
    { url: '/pwa/css/materialize.min.css', revision: '1' },
    { url: '/pwa/js/materialize.min.js', revision: '1' },
    { url: '/pwa/js/nav.js', revision: '1' },
    { url: '/pwa/js/script.js', revision: '1' },
    { url: '/pwa/js/db.js', revision: '1' },
    { url: '/pwa/js/vendor/idb.js', revision: '1' },
    { url: '/pwa/manifest.json', revision: '1' }
    ], {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/]
  });

  workbox.routing.registerRoute(
    new RegExp('/pwa/'),
    new workbox.strategies.StaleWhileRevalidate()
    );

  workbox.routing.registerRoute(
    new RegExp('/pwa/pages/'),
    new workbox.strategies.StaleWhileRevalidate()
    );

  workbox.routing.registerRoute(
    new RegExp('/pwa/asset/'),
    new workbox.strategies.StaleWhileRevalidate()
    );

  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2'),
    new workbox.strategies.NetworkFirst({
      networkTimeoutSeconds: 3     // 3 detik
    })
    );

  // workbox.routing.registerRoute(
  //   /^(http(s)?:)?\/\/api\.football-data\.org\/\v2\/.*/,
  //   ({url, event}) => {
  //     return caches.open(`${prefix}-${runtime}-${suffix}`).then((cache) => {
  //       const customRequest = `${url.origin}${url.pathname}`;
  //       return cache.match(customRequest).then((cacheRes) => {
  //         if (cacheRes) {
  //           return cacheRes;
  //         }
  //         return fetch(event.request).then((fetchRes) => {
  //           cache.put(customRequest, fetchRes.clone());
  //           return fetchRes;
  //         });
  //       });
  //     });
  //   }
  //   );
}
else{
  console.log('Workbox gagal dimuat'); 
}

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
    );
});
const CACHE_NAME = 'my-web-app-cache';
const urlsToCache = [
    '/',
    '/market.html',
    '/styles/collapse.css',
    '/styles/dialogs.css',
    '/styles/header.css',
    '/styles/index.css',
    '/styles/market.css',
    '/styles/profile.css',
    '/styles/achievements.css',
    '/styles/themes.css',
    '/scripts/collapse.js',
    '/scripts/index.js',
    '/scripts/market.js',
    '/scripts/profile.js',
    '/scripts/achievements.js',
    '/scripts/progress.js',
    '/scripts/theme.js',
    '/imgs/gacha.png',
    '/imgs/lock.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                let fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        let responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});
/**
 * service-worker.js
 * Service Worker management functions.
 * Copyright 2016 Google Inc.
 * @author Rufus Cope, Will Garside
 */

const dataCacheName = 'restaurantData-v2';
const cacheName = 'restaurantCritique-2';
const filesToCache = [
    '/',
    './stylesheets/roboto.css',
    './stylesheets/style.css',
    './stylesheets/KFOlCnqEu92Fr1MmSU5fBBc4.woff2',
    './stylesheets/KFOmCnqEu92Fr1Mu4mxK.woff2',
    './stylesheets/S6uyw4BMUTPHjx4wXg.woff2',
    './scripts/css/bootstrap.min.css',
    './scripts/font/css/open-iconic-bootstrap.min.css',
    './scripts/popper.js',
    './scripts/jquery.min.js',
    './scripts/js/bootstrap.min.js',
    './scripts/font/fonts/open-iconic.woff',
    './javascripts/index.js',
    './javascripts/contact.js',
    './javascripts/signup.js',
    './javascripts/layout.js',
    './javascripts/init_service_worker.js',
    './offline',
    './accessibility',
    './about',
    './images/site/BG1.jpg',
    './images/site/gmaps-custom-pin-small.png',
    './images/site/index-image-1.jpg',
    './images/site/index-image-2.jpg',
    './images/site/index-image-3.jpg',
    './images/site/logo-square-white.png',
    './images/site/logo-wide-white.png'
];

/**
 * Service Worker Installation, caching filesToCache
 * @function installServiceWorker
 */
self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                try {
                    cache.addAll(filesToCache);
                } catch (e) {
                    console.log(JSON.stringify(e))
                }
            })
            .catch((err) => {
                console.log(`[Service Worker] ${err} URL: ${JSON.stringify(err, ['message', 'arguments', 'type', 'name'])}`);
            })
    );
});

/**
 * activation of service worker: it removes all cached files if necessary, due to a new version.
 * @function activateServiceWorker
 */
self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== cacheName && key !== dataCacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
            .catch((err) => {
                console.log(`Service Worker Error2: ${err}`)
            })
    );
    /*
     *  The code below essentially lets you activate the service worker faster.
     * This is because as soon as the worker is loaded it takes over control from the browser,
     * instead of waiting for a page refresh
     */
    return self.clients.claim();
});

/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser. Different requests are handled by different approaches.
 * @function fetchServiceWorker
 */
self.addEventListener('fetch', (e) => {
    const searchURL = '/search';
    const contactURL = '/contact';

    if (e.request.url.indexOf(searchURL) > -1 || e.request.url.indexOf(contactURL) > -1) {
        e.respondWith(
            // Firstly if the page is reliant on a POST, a Network then offline approach is used.
            // e.g. Search or Contact
            fetch(e.request).then((response) => {
                return response;
            }).catch(() => {
                return caches.match('/offline');
            })
        )
    } else if (e.request.clone().method === "GET") {
        e.respondWith(
            //This is a Cache, then Network approach for plain site pages. A copy is first looked for in the cache
            //If there is not a copy in the cache, then a fetch event is called, and
            //the result is cached before being displayed.
            caches.match(e.request).then((res) => {
                return res || fetch(e.request).then((response) => {
                    //Response cloned as they are consumed
                    let responseClone = response.clone();
                    caches.open(cacheName).then((cache) => {
                        cache.put(e.request, responseClone);
                    }).catch((err) => {
                        console.log(`Service Worker Error2: ${err}`)
                    });
                    return response;

                });
            }).catch(() => {
                return caches.match('/offline');
            })
        );
    } else if (e.request.clone().method === 'POST') {
        //Finally POST requests are network only, else fail. Failure is then handled where it occurs.
        fetch(e.request)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                console.log(`[Service Worker] Failed to POST: ${err}`);
            });
    }
});

/**
 * Synchronises service worker to upload content previously added offline
 * @function syncServiceWorker
 */
self.addEventListener('sync', (event) => {
    console.log('Synchronising service worker');

    if (event.tag === 'syncData') {
        event.waitUntil(
            new Promise((resolve) => {
                const open = indexedDB.open('cachePOSTs');

                //Connect to DB
                open.onsuccess = function () {
                    const db = open.result;
                    const tx = db.transaction('reviews', 'readwrite');
                    const store = tx.objectStore('reviews');
                    const requesting = store.getAll();

                    requesting.onsuccess = function (event) {
                        let results = event.target.result;
                        //If there is any entry in the reviews IndexedDB
                        if (event.target.result.length > 0) {
                            results.forEach((review) => {
                                console.log(review);

                                //POST review by AJAX to server side Javascript
                                fetch('/restaurant/submit_review', {
                                    method: 'POST',
                                    body: review,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .catch((error) => {
                                        console.error(`Error: ${error}`);
                                    })
                                    .then((response) => {
                                        console.log(`Success: ${response}`);
                                        //IF Success remove review from IndexedDB so not resent
                                        store.delete(review.restaurantId)
                                            .catch((error) => {
                                                console.error(`Error: ${error}`);
                                        });
                                        resolve();
                                    });
                            })
                        }
                    };
                    // Close the db when the transaction is done
                    tx.oncomplete = function () {
                        db.close();
                    };
                }
            })
        )

    }
});

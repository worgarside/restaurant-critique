// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const dataCacheName = 'restaurantData-v1';
const cacheName = 'restaurantCritique-1';
const filesToCache = [
    '/contact',
    './javascripts/*',
    './stylesheets/style.css',
    './scripts/js/bootstrap.min.js',
    './scripts/css/bootstrap.min.css',
    './scripts/popper.js',
    './scripts/jquery.min.js'
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
            .catch((err) => {
                console.log(`Service Worker Error1: ${err} URL: ${JSON.stringify(e)}`);
            })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
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
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * all the other pages are searched for in the cache. If not found, they are returned
 */

self.addEventListener('fetch', function (event) {
    event.respondWith(
        //First fetch live data from web, if this fails fall back to cache.
        //NOTE this is not best practice, but just trying to get it up and running
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = response.clone();

                        caches.open(cacheName)
                            .then(function (cache) {
                                cache
                                    .put(event.request, responseToCache)
                                    .then(()=>{})
                                    .catch((err)=>{console.log("EROR"+err)});
                            })
                            .catch((err) => {
                                console.log("ERoRR" + err);
                            });

                        return response;
                    }
                );
            })
            .catch((err) => {
                    console.log("Error22" + err);
                    //if page can't be got online, plus not in cache, serve offline page
            }));

});

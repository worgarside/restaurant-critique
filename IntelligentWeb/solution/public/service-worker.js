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

const dataCacheName = 'restaurantData-v2';
const cacheName = 'restaurantCritique-2';


/*
filesToCache commented out as trying to cache files always caused an error TypeError in fetch statements.
In light of this we have opted for a Network First, Then Cache Service Worker.
TypeError: Failed to fetch URL: {"message":"Failed to fetch","name":"TypeError"}
 */
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
    './images/site/logo-square-white.png'
];

/**
 * Service Worker Installation, caching filesToCache
 */
self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                try {
                    cache.addAll(filesToCache);
                } catch (e){
                    console.log(JSON.stringify(e))
                }
            })
            .catch((err) => {
                console.log(`Service Worker Error1: ${err} URL: ${JSON.stringify(err, ["message", "arguments", "type", "name"])}`);
            })
    );
});


/**
 * activation of service worker: it removes all cached files if necessary
 */
self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys()
            .then((keyList) => {
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
     *  The code below essentially lets you activate the service worker faster.
     * This is because as soon as the worker is loaded it takes over control from the browser,
     * instead of waiting for a page refresh
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * all the other pages are searched for in the cache. If not found, they are returned
 */

self.addEventListener('fetch', (e) => {
    let searchURL = "/search"
    let contactURL = "/contact"

    if (e.request.url.indexOf(searchURL) > -1 || e.request.url.indexOf(contactURL) > -1) {
        e.respondWith(
            //Note this is a Network then offline approach, for form submission pages like Search or Contact
            fetch(e.request).then((response) => {
                return response;
            }).catch((err) => {
                return caches.match('/offline');
            })
        )
    }

    else if (e.request.clone().method === "GET"){
        e.respondWith(
            //if GET or POST needed to filter out requests
            //Note this is a Cache, then Network approach. A copy is first looked for in the cache
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
            }).catch(function() {
                return caches.match('/offline');
            })
        );

    } else if (e.request.clone().method === "POST"){
        //console.log("oh a POST");
        fetch(e.request).then((response) => {
                if (!response.ok) {
                    console.log("response not ok, going offline");
                    return caches.match('/offline');
                }else{
                    return response;
                }
            }).catch((err) => {
                return caches.match('/offline');
            });

    }
});


// self.addEventListener('sync', function(event) {
//     if (event.tag === 'syncData') {
//         event.waitUntil(true);
//     }
// });

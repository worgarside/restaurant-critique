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


/*
filesToCache commented out as trying to cache files always caused an error TypeError in fetch statements.
In light of this we have opted for a Network First, Then Cache Service Worker.
TypeError: Failed to fetch URL: {"message":"Failed to fetch","name":"TypeError"}
 */
const filesToCache = [
    // './contact',
    '/stylesheets/'
    // '/scripts/js/bootstrap.min.js'
    // './scripts/css/bootstrap.min.css',
    // './scripts/font/css/open-iconic-bootstrap.min.css',
    // './scripts/popper.js',
    // './scripts/jquery.min.js',
    // './javascripts/index.js',
    // './javascripts/contact.js',
    // './javascripts/signup.js',
    // './search'

];

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[ServiceWorker] Cacing app shell');
                return cache.addAll(filesToCache);
            })
            .catch((err) => {
                console.log(`Service Worker Error1: ${err} URL: ${JSON.stringify(err, ["message", "arguments", "type", "name"])}`);
            })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
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
     *  The code below essentially lets
     * you activate the service worker faster.
     * this is because as soon as the service worker loads it "claims" control of the site
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * all the other pages are searched for in the cache. If not found, they are returned
 */

self.addEventListener('fetch', (e) => {
    let searchURL = '/search';
    let socketURL = 'socket';
    let mapsURL = 'maps.';
    e.respondWith(
        caches.match(e.request).then((resp) => {return resp || fetch(e.request).then((response) => {
                    let responseClone = response.clone();

                    caches.open(cacheName).then((cache) => {
                        cache.put(e.request, responseClone);
                    });

                    return response;

            });
        }).catch(function() {
            return caches.match('/offline');
        })
    );
});
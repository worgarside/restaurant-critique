/**
 * init_service_worker.js
 * called by the HTML onload
 * Declaring the service worker
 * @author Rufus Cope
 */

if ('serviceWorker' in navigator && navigator.onLine) {
    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support IndexedDB");
    } else {
        let open = indexedDB.open('cachePOSTs', 1);
        open.onupgradeneeded = function () {
            let db = open.result;
            const store = db.createObjectStore("reviews", {keyPath: "restaurantId"});
            console.log("IndexedDB created");
        };
    }

    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register(`${window.location.origin}/service-worker.js`)
            .then(() => {
                console.log('[Service Worker] Registered');
            })
            .catch((err) => {
                    console.log(`${window.location.origin}`);
                    console.log(err);
                }
            );

        navigator.serviceWorker.ready
            .then((swRegistration) => {
            return swRegistration.sync.register('syncData');
        });
    });
}
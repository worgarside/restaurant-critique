/**
 * called by the HTML onload
 * Declaring the service worker
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker
            .register(`${window.location.origin}/service-worker.js`)
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch((err) => {
                    console.log(`${window.location.origin}`);
                    console.log("hiya");
                    console.log(err);
                }
            );
        // navigator.serviceWorker.ready.then(function(swRegistration) {
        //     return swRegistration.sync.register('syncData');
        // });
    });
}

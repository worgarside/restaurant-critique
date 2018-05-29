/**
 * called by the HTML onload
 * Declaring the service worker
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch((err) => {
                    console.log(err);
                }
            );
    });
}

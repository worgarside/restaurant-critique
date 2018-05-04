/**
 * called by the HTML onload
 * showing any cached forecast data and declaring the service worker
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () {
            console.log('Service Worker Registered');
        })
        .catch((err) => {
                console.log(err);
            }
        );
}

/**
 * user-verification.js
 * Client-side JS
 * @author Will Garside
 */

/**
 * Redirects the USer after they have read the verification confirmation message
 * @function redirectAfterVerified
 */
$(() => {
    setTimeout(() => {
        console.log('redirect');
        $('#redirect-link')[0].click();
    }, 4500);
});

console.log('Loaded user-verification.js');
console.log('Loaded user-verification.js');
$(() => {
    setTimeout(() => {
        console.log('redirect');
        $('#redirect-link')[0].click();
    }, 4500);
});
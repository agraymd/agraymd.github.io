$('form').submit(function(event) {
    if ( $('#g-recaptcha-response').val() === '' ) {
        event.preventDefault();
        alert('Please check the recaptcha');
    }
});
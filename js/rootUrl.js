// Get base URL of page
var rootUrl = window.location.origin;

// Get all elements with CLASS rootLink
var elements = document.querySelectorAll('.rootLink')

// Iterate through each element replace href with rootUrl
elements.forEach(function(element) {
    element.setAttribute('href', rootUrl);
});  
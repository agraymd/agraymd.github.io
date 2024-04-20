// Get base URL of page
var rootUrl = window.location.origin;
console.log(rootUrl)
// Get all elements with CLASS rootLink
var elements = document.querySelectorAll('.rootLink')
console.log(rootUrl)
// Iterate through each element replace href with rootUrl
elements.forEach(function(element) {
    element.setAttribute('href', rootUrl);
    console.log(rootUrl)
});  
    var rootUrl = window.location.origin;

    // Get  each anchor element by its CLASS and replace href with rootUrl
    var elements = document.querySelectorAll('.rootLink')
    console.log(elements);
    elements.forEach(function(element) {
      element.setAttribute('href', rootUrl);
      console.log(rootUrl);
    });  
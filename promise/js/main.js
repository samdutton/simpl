(function() {

    // Helper function to fetch a url
    function getUrl(url) {
      // Return a new promise.
      return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('GET', url);
 
        req.onload = function() {
          // This is called even on 404 etc
          // so check the status
          if (req.status === 200) {
            // Resolve the promise with the response text
            resolve(req.response);
          }
          else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error
            reject(Error(req.statusText));
          }
        };
 
        // Handle network errors
        req.onerror = function() {
          reject(Error('Network Error'));
        };
 
        // Make the request
        req.send();
      });
    }
 
    // Fetching 'our' feed - better be save than sorry, right? :)
    var newsEndPointUrl = 'js/feed.json';
    getUrl(newsEndPointUrl).then(function(response) {
      console.log('Success! We got the feed.', JSON.parse(response));

      // Parse the feed and build a nice list of items
      var feed = JSON.parse(response);
      var stories = feed.value.items;
      var ul = '<ul>';
      for (var i = 0; i < stories.length; i++) {
        var title = stories[i].title;
        var link  = stories[i].link;
         ul += '<li><h3><a href=\"' + link + '\" class=\"story\">' + 
               title + '</a></h3>';
      }
      ul += '</ul>';

      var mainFeed = document.querySelector('.main-feed');

      // Helper function to append content to the new div
      function addHtmlToPage(content) {
        var div = document.createElement('div');
        div.innerHTML = content;
        mainFeed.appendChild(div);
      }
      
      // Now let's add our nice list to the page
      addHtmlToPage(ul);
      
    }, function(error) {
      console.error('Failed! No feed for you :(', error);
    });

})();
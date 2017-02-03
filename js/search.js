;(function(win, doc) {
  'use strict';

  // We need these three Array methods and DOMParser() for search to work;
  // The fifth test reliably rules out IE9, which doesn't support text/html in DOMParser().parseFromString()
  // The ability to parse text/html landed in IE10, but we can't test for that without try/catch obliterating V8 optimization.
  if (!('map' in [] && 'filter' in [] && 'reduce' in [] && 'DOMParser' in win && 'compile' in RegExp.prototype)) { return; }

  // Keep a reference to <html> for later
  var _root = doc.documentElement;

  // These don't exist yet
  var _searchbutton, _search, _results, _close, _links;

  // This could always be put into main.css, but for now we can insert it dynamically:
  doc.head.insertAdjacentHTML('beforeend', '<style>#searchbutton,#search,#search>input,#results,#close{box-sizing:border-box}#searchbutton,#search{position:fixed;transition-property:-webkit-transform,opacity,visibility;transition-property:transform,opacity,visibility;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4,0,0.2,1);}#searchbutton,#close{-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;appearance:none;}#searchbutton{top:2.5em;right:3em;background-color:#4183C4;background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cg%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M15.5%2014h-.79l-.28-.27C15.41%2012.59%2016%2011.11%2016%209.5%2016%205.91%2013.09%203%209.5%203S3%205.91%203%209.5%205.91%2016%209.5%2016c1.61%200%203.09-.59%204.23-1.57l.27.28v.79l5%204.99L20.49%2019l-4.99-5zm-6%200C7.01%2014%205%2011.99%205%209.5S7.01%205%209.5%205%2014%207.01%2014%209.5%2011.99%2014%209.5%2014z%22%3E%3C/path%3E%3C/g%3E%3C/svg%3E);background-repeat:no-repeat;background-size:1.5em 1.5em;background-position:50% 50%;color:#fff;width:2.75em;height:2.75em;box-shadow:0 0 30px -10px rgba(0,0,0,0.4);z-index:100;margin:0;padding:0;cursor:pointer;}#search{top:2em;right:2.5em;border:0.25em solid #4183C4;width:auto;height:auto;opacity:0;visibility:hidden;-webkit-transform:scaleX(0);transform:scaleX(0);-webkit-transform-origin:100% 50%;transform-origin:100% 50%;}html[data-searchinit] #search{opacity:1;visibility:visible;-webkit-transform:scaleX(1);transform:scaleX(1);}html[data-searchinit] #searchbutton,#close{background-image:url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cpath%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%223%22%20stroke-miterlimit%3D%2210%22%20d%3D%22M32.5%2016.5l-16%2016m16%200l-16-16%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E);background-size:2em 2em;background-repeat:no-repeat;background-position:50% 50%;}#searchbutton:hover{background-color:#3e7ab6}#search>input{display:block;border:0;padding:0.25em 0.75em;height:2em;width:auto;-webkit-border-radius:0;border-radius:0;}#results{display:none;position:fixed;top:0;left:0;right:0;bottom:0;height:100vh;padding:1em;background:rgba(0,0,0,.8);-webkit-overflow-scrolling:touch;}#results>div>a{display:block;background:#fff;padding:1em;line-height:1.3;margin-bottom:1em;}#close{position:fixed;top:2.5em;right:4em;box-shadow:0 0 30px -10px rgba(0,0,0,0.4);width:2.75em;height:2.75em;margin:0;padding:0;cursor:pointer;}#results>div{margin:0 auto 0 auto;max-width:40em;padding:1em 1.5em 1.3em 1.5em;}#results>div>h2{color:#fff;font-size:22px;margin:0.2em 0 0.8em 0;padding:0 1.5em 0.2em 0;}html[data-displayresults]{overflow:hidden}html[data-displayresults] #searchbutton{display:none;}html[data-displayresults] #results{display:block;overflow-x:hidden;overflow-y:scroll;}</style>');

  // If the browser seems like it will cut the mustard, add the search button, input bar and results panel
  doc.getElementById('container').insertAdjacentHTML('beforeend', '<button id="searchbutton" tabindex="1"></button><form method="GET" action="/" id="search"><input type="text" title="Search for a particular example" required></form><div id="results" aria-hidden="true" hidden><button id="close" tabindex="1"></button><div><h2></h2></div></div>');

  // Now we've added that HTML, let's store some references
  _searchbutton = doc.getElementById('searchbutton');
  _search = doc.getElementById('search');
  _results = doc.getElementById('results');
  _close = doc.getElementById('close');

  // Initiate request for index and attach submit events
  init();

  // Search button event wireup, enabling the user to open the search input box
  _searchbutton.addEventListener('click', showForm, false);

  // Index available content by scraping the homepage and retrieving HTMLAnchor elements within
  // the #links element.
  // Attach the remaining event listeners only upon successful downloading of the document index
  function init() {
    var _xhr = new XMLHttpRequest();
    _xhr.open('GET', 'https://simpl.info/', true);

    // We're using DOMParser, but the same effect could be achieved with responseType = 'document'
    // Using responseType is cleaner, but we'd be throwing already limited IE support out of the window
    _xhr.onload = function() {
      var _doc = new DOMParser().parseFromString(this.responseText, 'text/html')
      if (!_doc.getElementById('links')) { return; }
      _links = [].slice.call(_doc.getElementById('links').getElementsByTagName('a'));

      // We don't need or want to wire up these events until we have an index of links to search through
      _search.addEventListener('submit', handleSearchAttempt, false);
      _close.addEventListener('click', resetSearchResults, false);
    };
    _xhr.onerror = _xhr.ontimeout = _xhr.onabort = function() {
      console.warn('Error with request: ' + this.status);
    };
    _xhr.send(null);
  }

  // Handle the submission of the search form
  function handleSearchAttempt (e) {
    var _query;

    // If there's no index, exit immediately and re-initialise:
    if (typeof _links !== 'object' || !Array.isArray(_links) || !_links) { return init(); }

    // Prevent default submit behaviour
    typeof e !== 'undefined' && e.preventDefault();

    // Retrieve the search query from the input element
    _query = e.target.querySelector('input').value;

    // Suffice it to say that we should quit if there's no query
    if (typeof _query !== 'string' || !_query) { return; }

    displaySearchResults(_query, getSearchResults(_query, _links));
    return false;
  }

  // Reveal search results panel and populate with data
  function displaySearchResults(query, results) {
    // We're using data-attributes to govern CSS properties of the search form/results panel
    _root.setAttribute('data-displayresults','true');
    _root.removeAttribute('data-searchinit');
    _results.removeAttribute('aria-hidden');

    // Display number of results found above the results list
    _results
      .querySelector('div>h2')
        .textContent = results.length +
          (results.length === 1 ? ' result' : ' results') +
            ' found for "' + query + '"';

    if (results.length < 1) { return; }
    _results.querySelector('div').insertAdjacentHTML('beforeend',
      // The fun part:
      generateMarkup(results)
    );
  }

  // Grind the index down using clean, functional methods
  function getSearchResults (query, data) {
    return data.filter(function(link) {
      return !!occursAtLeastOnce(query.toLowerCase(), [link.getAttribute('href').toLowerCase(), link.textContent.toLowerCase(), link.getAttribute('title').toLowerCase()]);
    }).map(function(link) {
      var _title = link.getAttribute('title');
      var _url = link.getAttribute('href');
      var _content = sanitize(link.textContent);
      return {
        'title': _title,
        'url': _url,
        'content': _content,
        'ldistance': bestOfThree(query.toLowerCase(), [_title.toLowerCase(), _url.toLowerCase(), _content.toLowerCase()])
      };
    }).sort(function(p, q) {
      if (p.ldistance < q.ldistance) { return -1; }
      if (p.ldistance > q.ldistance) { return 1; }
      return 0;
    });
  }

  function generateMarkup (results) {
    return results.map(function(result) {
      return '<a href="https://simpl.info/' + result.url +
             '" title="' + result.title +
             '">' + result.content + '</a>';
    }).reduce(function(acc, nxt) {
      return acc + nxt;
    });
  }

  // Find the Levenshtein distance for each of an array of strings compared to a query
  // Sort the array by shortest distance and return shortest distance item
  // This enables us to check href, title attributes and textContent for
  // indications of a good match.
  function bestOfThree (query, candidates) {
    return candidates.map(function(candidate) {
      return getLevenshteinDistance(query, candidate);
    }).sort(function(p, q) {
      if (p < q) { return -1; }
      if (p > q) { return 1; }
      return 0;
    }).filter(function(item, idx) {
      return idx === 0;
    });
  }

  // Substitute for String.protoype.includes(), but for an array of strings
  function occursAtLeastOnce (query, data) {
    return data.map(function(datum) {
      if (datum.length < query.length) { return false; }
      return datum.indexOf(query) !== -1;
    }).reduce(function(w, x) {
      return !!(w || x);
    });
  }

  // Calculate levenshtein distance reasonably quickly
  // This could probably be faster
  function getLevenshteinDistance(string, to_match) {
    var distance, row1, row2, i, j;
    for (row2 = [i = 0]; string[i]; ++i) {
      for (row1 = [j = 0]; to_match[++j];) {
        distance = row2[j] = i ?
          Math.min(
            row2[--j],
            Math.min(
              row1[j] - (string[i - 1] === to_match[j]),
              row1[++j] = row2[j]
            )
          ) + 1 : j;
      }
    }
    return distance;
  }

  // Basic sanitizer for element.textContent
  // This would ideally need to be stricter/more rigorous
  function sanitize(text) {
    return text.split('').map(function(char) {
      return char === '<' ? '&lt;' : char === '>' ? '&gt;' : char
    ;}).join('');
  }

  // Delete all the results and close the search panel
  function resetSearchResults() {
    [].slice.call(
      _results.getElementsByTagName('a')
    ).forEach(function(result) {
      result.parentNode.removeChild(result);
    });
    _results.setAttribute('aria-hidden', 'true');
    _root.removeAttribute('data-displayresults');
  }

  // Reveal the search bar and autofocus
  // NB: use setTimeout to time the autofocus such that the CSS transition
  // completes first, as the input element will not focus while transforming
  function showForm() {
    if (typeof _links !== 'object' || !Array.isArray(_links) || !_links) { return init(); }
    if (!_root.getAttribute('data-searchinit')) {
      _root.setAttribute('data-searchinit','true');
      win.setTimeout(function() {
        _search.querySelector('input').focus();
      }, 220);
    } else {
      _root.removeAttribute('data-searchinit');
    }
  }

})(window, document);

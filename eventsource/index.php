<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache'); // prevent caching of event data

do {

  $id = time().PHP_EOL;
  $data = 'Server time: '.date('h:i:s', time()).PHP_EOL;

  echo "id: $id";
  echo "data: $data";
  echo PHP_EOL;

  ob_flush();
  flush();

  sleep(5);

} while (true);

// The while loop keeps the connection open.
// Without this, the browser polls roughly every three seconds.
// To see this in action, take a look at your browser's dev tools network panel
// - if you remove the while loop, a new request is made every five seconds.

?>
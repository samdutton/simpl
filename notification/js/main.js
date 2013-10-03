// More information at https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications

// Tags are used to avoid excessive notifications: if a tag is set in the options, only the most recent notification for this tag will be displayed.

var button = document.querySelector('button');
var input = document.querySelector('input');

if (typeof Notification !== 'undefined') {
  button.onclick = function(){
    var options = {
      body: input.value,
      icon: 'icon.png',
      tag: 'foo',
      type: 'basic'
    };
    var n = new Notification('Greetings from simpl.info!', options);
    n.onclick = function(){console.log('Clicked.');};
    n.onclose = function(){console.log('Closed.');};
    n.onshow = function(){console.log('Shown.');};

  };
} else {
  alert('This browser does not support the Notification API.');
}

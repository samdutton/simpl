// based on code from addyosmani.com

getUserMedia = function (options, successCallback, errorCallback) {
  var source, el, cam;

  source = '<object id="XwebcamXobjectX" type="application/x-shockwave-flash" data="' +
    options.swffile + '" width="' + options.width + '" height="' + options.height +
    '"><param name="movie" value="' + options.swffile +
    '" /><param name="FlashVars" value="mode=' + options.mode +
    '&amp;quality=' + options.quality +
    '" /><param name="allowScriptAccess" value="always" /></object>';
  el = document.getElementById(options.el);
  el.innerHTML = source;

  (_register = function (run) {

    cam = document.getElementById('XwebcamXobjectX');

    if (cam.capture !== undefined) {

      /* Simple callback methods are not allowed :-/ */
      options.capture = function (x) {
        try {
          return cam.capture(x);
        } catch (e) {}
      }
      options.save = function (x) {
        try {
          return cam.save(x);
        } catch (e) {}
      }
      options.setCamera = function (x) {
        try {
          return cam.setCamera(x);
        } catch (e) {}
      }
      options.getCameraList = function () {
        try {
          return cam.getCameraList();
        } catch (e) {}
      }

      //options.onLoad();
      options.context = 'flash';
      options.onLoad = successCallback;

    } else if (0 == run) {
      //options.debug("error", "Flash movie not yet registered!");
      errorCallback();
    } else {
      /* Flash interface not ready yet */
      window.setTimeout(_register, 1000 * (4 - run), run - 1);
    }
  })(3);

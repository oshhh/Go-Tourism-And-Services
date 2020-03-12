/* eslint-env browser */
(function() {

  var Tracker = function() {

  };

  Tracker.prototype.collect = function() {
    var data = '?' +
      'user-agent=' + encodeURIComponent(navigator.userAgent) +
      '&referrer=' + encodeURIComponent(document.referrer) +
      '&screen=' + screen.width + 'x' + screen.height +
      '&availScreen=' + screen.availWidth + 'x' + screen.availHeight +
      '&page=' + encodeURIComponent(location.href) +
      '&pixelRatio=' + window.devicePixelRatio +
      '&colorDepth=' + screen.colorDepth +
      '&localTime=' + (new Date()).toString() +
      '&lang=' + encodeURIComponent(navigator.language);

    this.send(data);
  };

  Tracker.prototype.send = function(data) {
    var xhr;

    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      // eslint-disable-next-line
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open("get", "/track" + data);
    xhr.send();
  };


  var tracker = new Tracker();
  if (!sessionStorage.getItem('es-tracker')) {
    tracker.collect();
  }

  sessionStorage.setItem('es-tracker', true);
})();

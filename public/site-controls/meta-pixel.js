(function (f, b, e, v) {
  if (f.fbq) return;
  var n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  var t = b.createElement(e);
  t.async = true;
  t.src = v;
  var s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
window.fbq('init', '1066143976321475');
window.fbq('track', 'PageView');

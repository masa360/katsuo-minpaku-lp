/* Zen & Iki — guesthouse LP */
(function () {
  'use strict';

  /* ============================================================
     予約ページURL（Googleカレンダー予約ページ）
     - default : ? なしでLPを開いたとき／共通
     - 宿ごとに別ページを使う場合は、宿のキーを足す
         例）'stay-a': 'https://calendar.google.com/calendar/appointments/schedules/XXXX'
       → チラシ・ショップカードのQRは  LPのURL + ?stay=stay-a  にする
     ※ 今は藤田商店の1ページを全民泊で共通に使う（default のみ）。?stay= は将来の宿別ページ用で、今は使わない
     ※ URL が空だと「準備中」表示になる
     ============================================================ */
  var BOOKING = {
    // 1軒目の予約ページ（短縮リンク https://calendar.app.google/UUY51NVoPz2gbgbYA の展開先。iframe埋め込み可）
    'default': 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1LjhpVyea3j7c7x82Ejl55m2KW5gnhNO9E4vzw8EYK0h_DMXr3eSSbn1zgBUBV4Y9M4wS25qx1'
  };

  var params = new URLSearchParams(window.location.search);
  var stay = params.get('stay');
  var url = (stay && BOOKING[stay]) || BOOKING['default'] || '';

  var links = document.querySelectorAll('[data-book]');
  var frameBox = document.getElementById('booking-frame');
  var root = document.documentElement;

  if (url) {
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', url);
      links[i].setAttribute('target', '_blank');
      links[i].setAttribute('rel', 'noopener noreferrer');
    }
    if (frameBox) {
      var src = url.indexOf('gv=true') === -1 ? url + (url.indexOf('?') === -1 ? '?' : '&') + 'gv=true' : url;
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = 'Booking calendar';
      iframe.loading = 'lazy';
      frameBox.appendChild(iframe);
    }
  } else {
    root.classList.add('is-pending');
    for (var j = 0; j < links.length; j++) {
      links[j].setAttribute('href', '#book');
    }
  }

  /* Sticky CTA: show after the hero, hide while the booking section is on screen */
  var sticky = document.getElementById('sticky');
  var hero = document.getElementById('hero');
  var book = document.getElementById('book');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroOut = false, bookIn = false;
    var update = function () { sticky.classList.toggle('show', heroOut && !bookIn); };
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(hero);
    if (book) new IntersectionObserver(function (e) { bookIn = e[0].isIntersecting; update(); }, { threshold: 0.1 }).observe(book);
  }
})();

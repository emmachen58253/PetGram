'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {
    document.getElementById('home-btn').addEventListener('click', hello);
  }

  function hello() {
    console.log('yo');
  }
})();
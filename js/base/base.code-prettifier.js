var Base = Base || {};

// Style code snippets.
Base.CodePrettifier = function() {

  // Load the code prettifier in from Google.
  if($('.code').length > 0) {
    (function() {
      var cp = document.createElement('script');
      cp.type = 'text/javascript';
      cp.async = true;
      // cp.src = "https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?lang=css&skin=sunburst";
      cp.src = 'https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(cp, s);
    })();
  }

  // Automatically add prettyprint trigger class to all code examples.
  $('.code').each(function() {
    var $this = $(this);
    $this.html($this.html().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    $this.addClass('prettyprint');
  });
};

$(function(){
  Base.CodePrettifier();
});

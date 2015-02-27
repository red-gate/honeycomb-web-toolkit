var Base = Base || {};

Base.Navigation = Base.Navigation || {};

Base.Navigation.Base = function(options) {

  // User specified options
  this.options = options;

  // Default settings.
  this.defaults = {
    type: 'drawer',
    drill: false,
    tree: {
      path: '/assets/nav-maps/site-map.htm',
      html: false
    },
    triggers: {
      open: 'nav--drawer__open',
      close: 'nav--drawer__close',
    },
    callbacks: {
      open: false,
      close: false
    }
  };

  // Customised settings.
  this.settings = {};

  // Cache jQuery objects.
  this.$body = $('body');
  this.$navContainer = false;
  this.$pageContainer = false;

  // The tree.
  this.tree = false;

  // Init.
  this.init = function init(options) {
    var self = this;

    // Merge defaults with user specified options.
    $.extend(true, self.settings, self.defaults, self.options, options);

    // Add a nav container.
    self.$navContainer = $('<nav />').addClass('nav--' + self.settings.type).html($('<div />').addClass('nav--' + self.settings.type + '__content'));
    self.$body.append(this.$navContainer);

    // Add a container around all of the page content.
    // This is used for scaling content when the lightbox is opened.
    if($('.base-page-container').length === 0) {
      // $('header, .page-wrapper, .footer--page').wrapAll($('<div />').addClass('base-page-container'));
      self.$body.wrapInner($('<div />').addClass('base-page-container'));
      self.$contentContainer = $('.base-page-container');
    }

    // Add an overlay, to prevent user interaction of page while menu open.
    $('<span />').addClass('nav--' + self.settings.type + '__content-overlay').appendTo(self.$body);

    // Open nav trigger.
    self.$body.on('click', '.' + self.settings.triggers.open, function(e) {
      e.preventDefault();
      self.open();
    });

    // Close the nav when content overlay, or close trigger is clicked.
    self.$body.on('click', '.nav--' + self.settings.type + '__content-overlay, .' + self.settings.triggers.close , function(e) {
      e.preventDefault();
      self.close();
    });

    // Click handler for previous link.
    self.$body.on('click', '.nav--' + self.settings.type + '__prev', function(e) {
      e.preventDefault();
      self.updateNav($(this).attr('href'), 'back');
    });

    // Click handler for next link.
    self.$body.on('click', '.nav--' + self.settings.type + '__next', function(e) {
      e.preventDefault();
      self.updateNav($(this).attr('href'), 'forward');
    });

    // Enable drill down.
    self.$body.on('click', '.nav--' + self.settings.type + '__parent', function(e) {
        if(self.settings.drill) {
            e.preventDefault();
            self.updateNav($(this).attr('href'), 'forward');
        }
    });

    // Get the nav tree, from user supplied HTML, or from ajax path.
    if(self.settings.tree.html !== false) {
      self.tree = $(self.settings.tree.html);
      self.updateNav(window.location.pathname + window.location.hash, 'forward');
    } else {
      $.get(this.settings.tree.path, function(data, status, request) {
        self.tree = $(data);
        self.updateNav(window.location.pathname  + window.location.hash, 'forward');
      }, 'html');
    }
  };

  // Open the nav.
  this.open = function open() {
    this.$body.addClass('nav--'  + this.settings.type + '-open');

    // Callback
    if(typeof(this.settings.callbacks.open) === 'function') {
      this.settings.callbacks.open.apply();
    }
  };

  // Close the nav.
  this.close = function close() {
    this.$body.removeClass('nav--' + this.settings.type + '-open');

    // Callback
    if(typeof(this.settings.callbacks.close) === 'function') {
      this.settings.callbacks.close.apply();
    }
  };

  // Build the nav menu from a pathname (URL), and return the formatted markup.
  this.buildNav = function buildNav(pathname) {
    var $li = this.tree.find('a[href=\'' + pathname + '\']').parent('li');

    // If can't find the link, then get the first link in the tree.
    if($li.length === 0) {
      $li = this.tree.find('ul a').first().parent('li');
    }

    var $list = ($li.children('ul').length !== 0) ? $li.children('ul') : $li.parent('ul');

    if($list) {
      var content = {
        'url': $list.prev('a').attr('href'),
        'title': $list.prev('a').text(),
        'links': [],
        'prev': {
          'title': $list.parentsUntil('ul').parent().prev('a').text(),
          'url': $list.parentsUntil('ul').parent().prev('a').attr('href')
        }
      };

      var $lis = $list.children('li');
      for(var i=0; i<$lis.length; i++) {
        $li = $($lis[i]);
        var $link = $li.children('a');
        var link = {
          'title': $link.text(),
          'url': $link.attr('href'),
          'classes': $link.attr('class') || "",
          'hasChildren': ($li.find('ul').length !== 0) ? true : false
        };
        content.links.push(link);
      }

      // Build out the nav, and return it.
      return this.buildNavHtml(content);
    }
  };

  // Build the formatted markup using a content object.
  this.buildNavHtml = function buildNavHtml(content) {
    var html = '';

    // 'Previous' hyperlink.
    if(content.prev.url !== undefined) {
      html += '<a href=\"' + content.prev.url + '\" class=\"nav--' + this.settings.type + '__prev\"><span class=\"icon icon-chevron-left\"></span></a>';
    }

    // Section title.
    var sectionHref = (this.settings.drill) ? '#' : content.url;
    html += '<h1 class="nav--' + this.settings.type + '__section"><a href=\"' + sectionHref + '\">' + content.title + '</a></h1>';

    // Loop through items.
    html += '<ul>';
    for(var i=0; i<content.links.length; i++) {
      html += '<li>';
      html += '<a href=\"' + content.links[i].url + '\" class="' + content.links[i].classes;
      if(content.links[i].hasChildren) {
          html += ' nav--' + this.settings.type + '__parent';
      }
      html += '">' + content.links[i].title + '</a>';

      // If link has children, then display a 'Next' hyperlink.
      if(content.links[i].hasChildren) {
        html += '<a href=\"' + content.links[i].url + '\" class=\"nav--' + this.settings.type + '__next\"><span class=\"icon icon-chevron-right\"></span></a>';
      }

      html += '</li>';
    }
    html += '</ul>';

    return html;
  };

  // Update the nav menu, passing in the URL of page menu to load
  // and a direction to animate the menu (forward|back).
  this.updateNav = function updateNav(pathname, direction) {
    var content = this.buildNav(pathname);
    var $navContent = this.$navContainer.find('.nav--' + this.settings.type + '__content');
    var $clone = $navContent.clone();

    // Update the clone with the new content.
    $clone.html(content);

    // Pull clone up level with current nav.
    $clone.css('top', -($navContent.outerHeight(true)) + 'px');

    // Position to left or right of current nav.
    if(direction === 'forward') {
      $clone.css('left', '100%');
    } else if(direction === 'back') {
      $clone.css('left', '-100%');
    }

    // Insert the new nav into the dom.
    $clone.insertAfter($navContent);

    // Animate the transition between the two menus.
    $clone.animate({
      left: 0
    }, {
      duration: 150,
      step: function(now, fx) {
        $navContent.css('left', now - fx.start + 'px');
      },
      done: function(){
        $navContent.remove();
        $clone.css('top', 0);
      }
    });
  };

  // Kick off
  // this.init(); Disabling this here, so it can be enabled on a page per page basis.
};

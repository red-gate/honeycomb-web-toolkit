var Honeycomb = Honeycomb || {};

Honeycomb.Confluence = (function($) {

    var sidebar = function sidebar() {
		$(".confluence-sidebar ul").scrollTree({
        	'contextPath': window.contextPath,
          	'css': {
              'ancestor': 'ancestor',
              'current': 'active',
              'collapsed': 'collapsed',
              'expanded': 'expanded',
              'toggle': 'toggle'
            },
          	'renderChildLi': function (child, opts) {
              	var html = '<li class="' + opts.css[child.type] + '">';
              	html += '<a href="' + child.link + '" class="' + opts.css[child.type] + '">';

              	if(typeof child.children !== 'undefined') {
	              	html += '<span class="' + opts.css.toggle + ' ' + opts.css.toggle + '--has-children"></span>';
                } else {
                  	html += '<span class="' + opts.css.toggle + '"></span>';
                }

              	html += child.title + '</a>';
              	html += '</li>';

              	return html;
            }
        });
    };

  	var lightbox = function lightbox() {
      	$(".confluence-embedded-image").each(function(){
          	var $this = $(this);
        	var $parent = $this.parent().get(0);
          	if($parent.nodeName !== "A") {
            	var $a = $("<a/>")
                	.addClass("lightbox link-image js-lightbox")
                	.attr("href", $this.attr("src"))
                	.attr("rel", "lightbox");
	            $this.wrap($a);
            }
        });
    };

    var notifications = function notifications() {

        // List of classes to add to.
        var classes = {
            "confluence-information-macro": "notification notification--block",
            "confluence-information-macro-tip": "notification--success",
            "confluence-information-macro-note": "notification--info",
            "confluence-information-macro-information": "notification--info",
            "confluence-information-macro-warning": "notification--fail",
            "confluence-information-macro-body": "notification__body",
            "confluence-information-macro-icon": "notification__icon"
        };

        var icons = {
            "info": "icon--info",
            "success": "icon--success",
            "fail": "icon--fail"
        };

        // Loop through and add the classes.
        for(var c in classes) {
            $("." + c).addClass(classes[c]);
        }

        // Add the inner container.
        $(".confluence-information-macro").wrapInner("<div class=\"notification--block__inner-container\"></div>");

        // Loop through adding in notification icons.
        $(".confluence-information-macro").each(function(){
            var $this = $(this);
            for(var i in icons) {
                if($this.hasClass("notification--" + i)) {
                    var c = "icon " + icons[i];
                    $span = $("<span/>").addClass(c);
                    $span.prependTo($this.find(".confluence-information-macro-icon"));
                }
            }
        });
    };

    var toc = function toc() {
        $(".toc-macro").each(function(){
            var $this = $(this);
            var defaults = ["h1", "h2", "h3", "h4", "h5", "h6"];
            var headings = $this.data("headerelements").toLowerCase().split(",");
            var excludedHeadings = [];

            for(var i=0; i<defaults.length; i++) {
                if(headings.indexOf(defaults[i]) === -1) {
                    excludedHeadings.push(defaults[i]);
                }
            }

            // Exclude H1 headings by default.
            excludedHeadings.push("h1");

            // Convert array to string.
            excludedHeadings = excludedHeadings.join(', ');

            $this.toc({
                exclude: excludedHeadings,
                numerate: false
            });
        });
    };

  	var init = function init() {
    	sidebar();
      	lightbox();
        notifications();
        toc();
    };

    return {
        init: init
    };
})(jQuery);

/* jQuery(function() {
  Honeycomb.Confluence.init();
}); */

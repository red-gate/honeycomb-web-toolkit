let sidebar = () => {

    if ( typeof scrollTree === 'undefined' ) {
        window.console.log( 'The scrollTree plugin hasn\'t been installed correctly. - Plugin undefined' );
        return;
    }

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
          	let html = '<li class="' + opts.css[child.type] + '">';
          	html += '<a href="' + child.link + '" class="' + opts.css[child.type] + '">';

          	if ( typeof child.children !== 'undefined' ) {
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

let lightbox = () => {
  	$(".confluence-embedded-image").each(function(){
      	let $this = $(this);
    	let $parent = $this.parent().get(0);
      	if ( $parent.nodeName !== "A" ) {
        	let $a = $("<a/>")
            	.addClass("lightbox link-image js-lightbox")
            	.attr("href", $this.attr("src"))
            	.attr("rel", "lightbox");
            $this.wrap($a);
        }
    });
};

let notifications = () => {

    // List of classes to add to.
    let classes = {
        "confluence-information-macro": "notification notification--block",
        "confluence-information-macro-tip": "notification--success",
        "confluence-information-macro-note": "notification--warning",
        "confluence-information-macro-information": "notification--info",
        "confluence-information-macro-warning": "notification--fail",
        "confluence-information-macro-body": "notification__body",
        "confluence-information-macro-icon": "notification__icon"
    };

    let icons = {
        "info": "icon--info",
        "success": "icon--success",
        "fail": "icon--fail",
        "warning": "icon--warning"
    };

    // Loop through and add the classes.
    for ( let c in classes ) {
        $("." + c).addClass(classes[c]);
    }

    // Add the inner container.
    $(".confluence-information-macro").wrapInner("<div class=\"notification--block__inner-container\"></div>");

    // Loop through adding in notification icons.
    $(".confluence-information-macro").each(function(){
        let $this = $(this);
        for ( let i in icons ) {
            if ( $this.hasClass("notification--" + i ) ) {
                let c = "icon " + icons[i];
                $span = $("<span/>").addClass(c);
                $span.prependTo($this.find(".confluence-information-macro-icon"));
            }
        }
    });
};

let toc = () => {
    $(".toc-macro").each(function(){
        let $this = $(this);
        let defaults = ["h1", "h2", "h3", "h4", "h5", "h6"];
        let headings = $this.data("headerelements").toLowerCase().split(",");
        let excludedHeadings = [];

        for ( let i = 0; i < defaults.length; i++ ) {
            if ( headings.indexOf( defaults[ i ] ) === -1 ) {
                excludedHeadings.push( defaults[ i ] );
            }
        }

        // Exclude H1 headings by default.
        excludedHeadings.push( "h1") ;

        // Convert array to string.
        excludedHeadings = excludedHeadings.join( ', ' );

        $this.toc({
            exclude: excludedHeadings,
            numerate: false
        });
    });
};

let init = () => {
    sidebar();
    lightbox();
    notifications();
    toc();
};

export default {
    init: init
};

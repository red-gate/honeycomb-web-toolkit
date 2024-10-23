(function ($) {

    'use strict';

    // http://learn.jquery.com/plugins/basic-plugin-creation/
    // http://learn.jquery.com/plugins/advanced-plugin-concepts/
    $.fn.scrollTree = function (options) {

        var DEFAULT_OPTIONS = {
            'contextPath': '/',
            'css': {
                'ancestor': 'active',
                'current': 'active',
                "leaf": 'leaf',
                'loading': 'sp-loading',
                'collapsed': 'sp-collapsed',
                'expanded': 'sp-expanded',
                'error': 'sp-error',
              	'toggle': 'sp-toggle'
            },
            'renderChildrenUl': function () {
                return '<ul class="nav"></ul>';
            },
            'renderChildLi': function (child, opts) {
                return '<li class="' + opts.css[child.type] + '"><span class="' + opts.css.toggle + '"></span><a href="' + child.link + '">' + child.title + '</a></li>';
            }
        };

        var viewportId = $(this).data('viewportId');
        var rootLink = $(this).data('root');
        var currentLink = $(this).data('current');

        var opts = $.extend(true, DEFAULT_OPTIONS, options);

        return this.each(function () {
            var $rootUl = $(this);

            loadChildren($rootUl, rootLink, currentLink);
            setupEventHandling($rootUl);

            return this;
        });


        function loadChildren($ul, parentLink, currentLink) {
            var $parentLi = $ul.closest('li');
            if ($parentLi) {
                $parentLi.removeClass(opts.css.collapsed)
                    .addClass(opts.css.loading);
            }

            $.get(opts.contextPath + '/rest/scroll-viewport/1.0/tree/children', {
                'viewportId': viewportId,
                'root': rootLink,
                'parent': parentLink || $parentLi.find('> a').attr('href'),
                'current': currentLink || ''
            }, function success(children) {
                insertChildren($ul, children);

                $parentLi.removeClass(opts.css.loading)
                    .addClass(opts.css.expanded);
            }).fail(function error(jqXHR, textStatus, errorThrown) {
                $parentLi.removeClass(opts.css.loading)
                    .addClass(opts.css.error);
            });
        }


        function insertChildren($ul, children) {
            $ul.html('');
            $.each(children, function (idx, child) {
                var $childLi = $(opts.renderChildLi(child, opts)).appendTo($ul);

                if (child.children) {
                    if (child.children.length) {
                        $childLi.addClass(opts.css.expanded);
                        var $childrenEl = $(opts.renderChildrenUl()).appendTo($childLi);
                        insertChildren($childrenEl, child.children);

                    } else {
                        $childLi.addClass(opts.css.collapsed);
                    }
                } else {
                    $childLi.addClass(opts.css.leaf);
                }
            });
        }


        function setupEventHandling($rootUl) {
	        $rootUl.on('click', '.' + opts.css.toggle, function (e) {

              	var $this = $(this);
                var $li = $this.parent().parent('li');

              	if($this.hasClass(opts.css.toggle + '--has-children')) {
                  e.preventDefault();
                }

                if ($li.is('.' + opts.css.collapsed)) {
                    openNode($li);

                } else if ($li.is('.' + opts.css.expanded)) {
                    closeNode($li);

                } else {
                    // we don't have children -> no-op
                }
            });
        }


        function openNode($li) {
            if ($li.has('ul').length) {
                // children have been loaded, just toggle classes
                $li.removeClass(opts.css.collapsed)
                    .addClass(opts.css.expanded);
            } else {
                // children have to be loaded
                var $childrenEl = $(opts.renderChildrenUl()).appendTo($li);
                loadChildren($childrenEl);
            }
        }


        function closeNode($li) {
            $li
                .removeClass(opts.css.expanded)
                .addClass(opts.css.collapsed);
        }
    };

})(jQuery);

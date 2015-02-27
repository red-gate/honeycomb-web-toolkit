var Base = Base || {};

// Tabbable content functionality. (https://github.com/edwardcasbon/jquery.tabs)
Base.Tabs = function() {
  $('.js-tabbed').each(function() {
    var $this = $(this);
    var options = {
      pagination: false,
      template: {
        container: {
          atts: {},
          classes: [
            'tabbed__container'
          ]
        },
        tab: {
          container: {
            classes: [
              'js-tab'
            ]
          }
        },
        pagination: {
          container: {
            atts: {
              'data-ui-component': 'nav--tabs-pagination'
            },
            classes: [
            'pagination'
            ]
          },
          links: {
            prev: {
              atts: {},
              classes: [
              'pagination__prev'
              ],
              preHtml: '',
              postHtml: ''
            },
            next: {
              atts: {},
              classes: [
              'pagination__next'
              ],
              preHtml: '',
              postHtml: ''
            }
          }
        }
      }
    };

    // Scroll animation
    if($this.attr('data-tabs-scroll-to')) {
      options.scrollTo = ($this.attr('data-tabs-scroll-to') === 'true');
    }

    // Scroll animation offset
    if($this.attr('data-tabs-scroll-to-offset')) {
      options.scrollToOffset = $this.attr('data-tabs-scroll-to-offset');
    }

    // Pagination
    if($this.attr('data-tabs-pagination')) {
      options.pagination = ($this.attr('data-tabs-pagination') === 'true');
    }

    // Reload ajax requests
    if($this.attr('data-tabs-reload-ajax')) {
      options.reloadAjax = ($this.attr('data-tabs-reload-ajax') === 'true');
    }

    // Apply tabs plugin.
    $this.tabs(options);
  });
};

$(function(){
  Base.Tabs();
});

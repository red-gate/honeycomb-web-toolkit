var Base = Base || {};

// Filter (Hide/Show) content on a page.
Base.Filter = (function() {

  var init = function init() {

    // Get the filter.
    var $filter = $(".js-filter");

    // If there's no filter on the page then stop.
    if($filter.length === 0) {
      return false;
    }

    // When the update button is clicked, update the filter.
    $filter.on("click", ".js-filter__update", function() {
      updateFilter.call(this);
    });

    // When any of the filter items are changed (selected/deselected), update
    // the filter.
    $filter.on("change", ".js-filter__item", function() {
      updateFilter.call(this);
    });

    // When the reset button is clicked, reset the filter.
    $filter.on("click", ".js-filter__reset", function() {
      resetFilter.call(this);
    });

    // Update the filter on init.
    updateFilter.call($filter.get(0).childNodes[0]);
  };

  // Update the filter.
  var updateFilter = function updateFilter() {
    var $this           = $(this);
    var $filter         = $this.parents(".js-filter");
    var $items          = $filter.find(".js-filter__item");
    var $content        = $("[data-filter-content]");
    var enabledItems    = [];
    var enabledContent  = [];

    // Get the enabled items.
    $items.each(function() {
      var $this = $(this);
      if($this.prop("checked")) {
        enabledItems.push($this.attr("data-filter-term"));
      }
    });

    // Show/Hide the relevant content.
    $content.each(function() {
      var $this   = $(this);
      var terms   = $this.attr("data-filter-content").trim().split(" ");
      var show    = false;

      for(var i=0; i<terms.length; i++) {
        if(enabledItems.indexOf(terms[i]) !== -1) {
          show = true;
        }
      }

      if(show) {
        enabledContent.push($this.get(0));
      }
    });

    $content.stop().animate({
      opacity: 0
    },{
      duration: 250,
      complete: function() {
        $content.each(function() {
          var $this = $(this);
          var enabled = (enabledContent.indexOf($this.get(0)) !== -1) ? true : false;

          if(enabled) {
            $this.show();
            $this.stop().animate({
              opacity: 1
            }, {
              duration: 250
            });
          } else {
            $this.hide();
          }
        });
      }
    });
  };

  var resetFilter = function resetFilter() {
    var $this = $(this);
    var $filter = $this.parents(".js-filter");
    var $items = $filter.find(".js-filter__item");

    $items.prop("checked", true);

    updateFilter.call(this);
  };

  return {
    init: init
  };
})();

$(function(){
  Base.Filter.init();
});

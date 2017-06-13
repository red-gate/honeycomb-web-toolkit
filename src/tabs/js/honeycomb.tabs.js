import browser from '../../browser/js/honeycomb.browser';
import loadScript from '../../document/js/honeycomb.document.load-script';

let init = ( config = {} ) => {

    // If IE7, bail!
    if (browser.isIE7()) {
        return false;
    }

    let tabbed = document.querySelectorAll('.js-tabbed');
    if (tabbed.length) {

        if (typeof window.jQuery.fn.tabs === 'undefined') {
            if (typeof config.url === 'undefined') {
                config.url = 'tabs/vendor/jquery.tabs.min.js';
            }

            loadScript.load(config.url, () => {
                init(config);
            });
        } else {

            for (let tab of tabbed) {
                let options = {
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
                let scrollTo = tab.getAttribute('data-tabs-scroll-to');
                if (scrollTo) {
                    options.scrollTo = scrollTo === 'true';
                }

                // Scroll animation offset
                let scrollToOffset = tab.getAttribute('data-tabs-scroll-to-offset');
                if (scrollToOffset) {
                    options.scrollToOffset = scrollToOffset;
                }

                // Pagination
                let pagination = tab.getAttribute('data-tabs-pagination');
                if (pagination) {
                    options.pagination = pagination === 'true';
                }

                // Reload ajax requests
                let reloadAjax = tab.getAttribute('data-tabs-reload-ajax');
                if (reloadAjax) {
                    options.reloadAjax = reloadAjax === 'true';
                }

                // Equal heights
                let equalHeights = tab.getAttribute('data-tabs-equal-heights');
                if (equalHeights) {
                    options.onTabChange = config.equalise;
                }

                // Apply tabs plugin.
                window.jQuery(tab).tabs(options);

                // Callback.
                if (typeof config.callback === 'function') {
                    config.callback.call();
                }
            }
        }
    }
};

export default {
    init
};

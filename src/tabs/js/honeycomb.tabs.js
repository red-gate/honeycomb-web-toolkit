import browser from '../../browser/js/honeycomb.browser';

let init = () => {

    // If IE7, bail!
    if ( browser.isIE7() ) {
        return false;
    }

    let tabbed = document.querySelectorAll( '.js-tabbed' );
    if ( tabbed.length > 0 ) {
        for ( let tab of tabbed ) {
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
            let scrollTo = tab.getAttribute( 'data-tabs-scroll-to' );
            if ( scrollTo ) {
                options.scrollTo = scrollTo === 'true';
            }

            // Scroll animation offset
            let scrollToOffset = tab.getAttribute( 'data-tabs-scroll-to-offset' );
            if ( scrollToOffset ) {
                options.scrollToOffset = scrollToOffset;
            }

            // Pagination
            let pagination = tab.getAttribute( 'data-tabs-pagination' );
            if ( pagination ) {
                options.pagination = pagination === 'true';
            }

            // Reload ajax requests
            let reloadAjax = tab.getAttribute( 'data-tabs-reload-ajax' );
            if ( reloadAjax ) {
                options.reloadAjax = reloadAjax === 'true';
            }

            // Apply tabs plugin.
            let $tabs = $( tab ).tabs( options );
        }
    }
};

export default {
    init
};

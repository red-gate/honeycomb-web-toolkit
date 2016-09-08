// Google analytics.
import googleAnalytics from './analytics/js/honeycomb.analytics.google';
googleAnalytics.setAccountId('XX-AAA');
googleAnalytics.init();

// Pingdom.
import pingdom from './analytics/js/honeycomb.analytics.pingdom';
pingdom.init();

// Animation.
import animationFade from './animation/js/honeycomb.animation.fade';
animationFade.init();

// Base.
import { version, date } from './base/js/honeycomb.base';

// Browser.
import browser from './browser/js/honeycomb.browser';
browser.init();

// Carousel.
import carousel from './carousel/js/honeycomb.carousel';
carousel.init();

// Code
import code from './code/js/honeycomb.code';
code.init();
window.addEventListener( 'load', () => {
    code.highlight();
} );

// Confluence.
import confluence from './confluence/js/honeycomb.confluence';
confluence.init();

// Cookie
import cookie from './cookie/js/honeycomb.cookie';

// Document.
import documentLocation from './document/js/honeycomb.document.location';
import documentViewport from './document/js/honeycomb.document.viewport';
documentViewport.init();

// Equalise.
import equalise from './equalise/js/honeycomb.equalise';
window.addEventListener( 'resize', () => {
    equalise();
} );
window.addEventListener( 'load', () => {
    equalise();
} );

// Filter.
import filter from './filter/js/honeycomb.filter';
filter.init();

// Lightbox.
import lightbox from './lightbox/js/honeycomb.lightbox';
lightbox.init();

// Google map.
import googleMap from './maps/js/honeycomb.maps.google';
window.initMap = googleMap.initialiseMap;
googleMap.init({
    callback: 'window.initMap'
});

// Navigation
import dropdown from './navigation/js/honeycomb.navigation.dropdown';
dropdown.init();

import mobileMenu from './navigation/js/honeycomb.navigation.header';
mobileMenu.init();

// Notification
import notifications from './notification/js/honeycomb.notification.block';
notifications.init();
new notifications.block({
    'content': 'This is some content'
});

// Polyfills.
import boxSizing from './polyfill/js/honeycomb.polyfill.box-sizing';
import indexOf from './polyfill/js/honeycomb.polyfill.index-of';
import tableCell from './polyfill/js/honeycomb.polyfill.table-cell';
boxSizing();
indexOf();
tableCell();

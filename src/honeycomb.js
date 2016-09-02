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

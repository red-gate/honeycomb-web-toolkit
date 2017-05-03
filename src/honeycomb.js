// Google analytics.
import googleAnalytics from './analytics/js/honeycomb.analytics.google';
googleAnalytics.setAccountId('UA-XXX');
googleAnalytics.init();

// Pingdom.
import pingdom from './analytics/js/honeycomb.analytics.pingdom';
pingdom.init();

// Animation.
import animationFade from './animation/js/honeycomb.animation.fade';
animationFade.init();

// Base.
import { version, date, breakpoints } from './base/js/honeycomb.base';
window.breakpoints = breakpoints;

// Browser.
import browser from './browser/js/honeycomb.browser';
browser.init();

// Carousel.
import carousel from './carousel/js/honeycomb.carousel';
window.addEventListener( "load", () => {
    carousel.init();
});

// Code
import code from './code/js/honeycomb.code';
code.init();

// Confluence.
import confluence from './confluence/js/honeycomb.confluence';
confluence.init();

// Content.
import content from './content/js/honeycomb.content';
window.addEventListener( "load", () => {
    content.init();
});

// Cookie
import cookie from './cookie/js/honeycomb.cookie';

// Document.
import documentLocation from './document/js/honeycomb.document.location';
import documentViewport from './document/js/honeycomb.document.viewport';
documentViewport.init();

// Equalise.
import equalise from './equalise/js/honeycomb.equalise';
equalise.init();

// Filter.
import filter from './filter/js/honeycomb.filter';
filter.init();

// Forms.
import forms from './forms/js/honeycomb.forms';
forms.init();

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

import verticalNav from './navigation/js/honeycomb.navigation.vertical';
verticalNav.init();

// Notification
import notifications from './notification/js/honeycomb.notification.block';
notifications.init();

// Polyfills.
import indexOf from './polyfill/js/honeycomb.polyfill.index-of';
import customEvent from './polyfill/js/honeycomb.polyfill.custom-event';
indexOf();
customEvent();

// Reveal.
import reveal from './reveal/js/honeycomb.reveal';
reveal.init();

// Scroll.
import scroll from './scroll/js/honeycomb.scroll';
scroll.init();

// Sticky.
import sticky from './sticky/js/honeycomb.sticky';
sticky.init();

// SVG.
import svg from './svg/js/honeycomb.svg';
svg.init();

// Tabs.
import tabs from './tabs/js/honeycomb.tabs';
tabs.init({
	equalise: equalise.init
});

// Toggle.
import toggle from './toggle/js/honeycomb.toggle';
toggle.init();

// Video.
import video from './video/js/honeycomb.video';
video.init({
    analytics: googleAnalytics
});

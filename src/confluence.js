// Confluence. (Only import Confluence styling for Confluence themes.)
import confluence from './confluence/js/honeycomb.confluence';
import cookieConsent from './cookie-consent/js/honeycomb.cookie-consent';

confluence.init();

// Init the cookie consent functionality, using red-gate.com as the default.
window.Honeycomb = window.Honeycomb || {};
window.Honeycomb.CookieConsent = cookieConsent;
cookieConsent.init({
    banner: {
        heading: 'Cookies on red-gate.com',
        links: [
            {
                title: 'Privacy notice',
                href: 'https://www.red-gate.com/website/legal',
            },
        ],
    },
    consentGroups: [
        // 'functional', // Removing functional for now, as we don't have any yet.
        'performance',
        'targeting',
    ],
    cookie: {
        name: 'rgcookieconsent',
        domain: '.red-gate.com',
    },
});

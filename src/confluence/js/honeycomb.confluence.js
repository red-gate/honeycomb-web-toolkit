import CookieConsent from '../../cookie-consent/js/honeycomb.cookie-consent';
import Code from './honeycomb.confluence.code';
import ConvertIds from './honeycomb.confluence.convertIds';
import DisplayVersions from './honeycomb.confluence.displayVersions';
import Expand from './honeycomb.confluence.expand';
import LatestVersionNotification from './honeycomb.confluence.latestVersionNotification';
import Lightbox from './honeycomb.confluence.lightbox';
import Nav from './honeycomb.confluence.nav';
import Notifications from './honeycomb.confluence.notifications';
import PageTree from './honeycomb.confluence.pageTree';
import Sidebar from './honeycomb.confluence.sidebar';
import Tables from './honeycomb.confluence.tables';
import TaskList from './honeycomb.confluence.tasklist';
import Toc from './honeycomb.confluence.toc';

const init = () => {
    Sidebar.init();
    Lightbox.init();
    Notifications.init();
    Toc.init();
    Tables.init();
    ConvertIds.init();
    DisplayVersions.init();
    Code.init();

    Nav.init();
    window.addEventListener('resize', Nav.init);

    LatestVersionNotification.init();
    Expand.init();
    TaskList.init();
    PageTree.init();

    window.Honeycomb = window.Honeycomb || {};
    window.Honeycomb.CookieConsent = CookieConsent;
    CookieConsent.init({
        banner: {
            heading: 'Cookies on red-gate.com',
            links: [{
                title: 'Privacy notice',
                href: 'https://www.red-gate.com/website/legal',
            }],
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
};

export default {
    init
};

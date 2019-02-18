import Sidebar from './honeycomb.confluence.sidebar';
import Lightbox from './honeycomb.confluence.lightbox';
import Notifications from './honeycomb.confluence.notifications';
import Toc from './honeycomb.confluence.toc';
import Tables from './honeycomb.confluence.tables';
import ConvertIds from './honeycomb.confluence.convertIds';
import DisplayVersions from './honeycomb.confluence.displayVersions';
import Code from './honeycomb.confluence.code';
import Nav from './honeycomb.confluence.nav';
import LatestVersionNotification from './honeycomb.confluence.latestVersionNotification';
import Expand from './honeycomb.confluence.expand';
import TaskList from './honeycomb.confluence.tasklist';
import PageTree from './honeycomb.confluence.pageTree';

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
};

export default {
    init
};

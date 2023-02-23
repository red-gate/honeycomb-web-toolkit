import Code from './honeycomb.confluence.code';
import ConvertIds from './honeycomb.confluence.convertIds';
import DisplayVersions from './honeycomb.confluence.displayVersions';
import Expand from './honeycomb.confluence.expand';
import LatestVersionNotification from './honeycomb.confluence.latestVersionNotification';
import Lightbox from './honeycomb.confluence.lightbox';
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
    LatestVersionNotification.init();
    Expand.init();
    TaskList.init();
    PageTree.init();
};

export default {
    init,
};

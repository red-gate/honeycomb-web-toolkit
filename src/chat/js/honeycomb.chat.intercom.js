import loadScript from '../../document/js/honeycomb.document.load-script';

const init = () => {
    if (typeof window.intercomSettings !== 'undefined') {
        if (typeof window.Intercom !== 'undefined') {
            window.Intercom('reattach_activator');
            window.Intercom('update', window.intercomSettings);
        } else {
            let i = function() {
                i.c(arguments);
            };
            i.q = [];
            i.c = function(args) {
                i.q.push(args);
            };
            window.Intercom = i;
            loadScript.load(`https://widget.intercom.io/widget/${window.intercomSettings.app_id}`, init);
        }
    }
};

export default {
    init
};
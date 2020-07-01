const load = ( url = false, callback = false, attrs = {} ) => {
    if (url !== false) {
        let link = document.createElement('link');
        const honeycombPath = (window.Honeycomb && window.Honeycomb.path) ? window.Honeycomb.path : '';
        link.setAttribute('rel', 'stylesheet');
        link.href = honeycombPath + url;

        let done = false;

        // When the stylesheet has loaded, apply the callback.
        link.onload = link.onreadystatechange = function () {
            if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                done = true;

                if (typeof callback === 'function') {
                    callback.apply(this);
                }
            }
        };

        // Custom attributes.
        for ( let prop in attrs ) {
            link[prop] = attrs[prop];
        }

        let head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    }
};

export default {
    load
};

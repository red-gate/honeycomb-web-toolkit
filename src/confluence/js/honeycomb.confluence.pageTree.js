/**
 * Build the page tree.
 */
const buildPageTreeMacro = pageTreeMacro => {
    const domain = document.location.protocol + '//' + document.location.hostname;
    const requestIdUrl = pageTreeMacro.querySelector('[name="treeRequestId"]').getAttribute('value');
    const hasRoot = !!pageTreeMacro.querySelector('[name="noRoot"]').getAttribute('value')
    const pageId = pageTreeMacro.querySelector('[name="rootPageId"]').getAttribute('value');
    const treeId = pageTreeMacro.querySelector('[name="treeId"]').getAttribute('value');
    const startDepth = pageTreeMacro.querySelector('[name="startDepth"]').getAttribute('value');
    const mobile = pageTreeMacro.querySelector('[name="mobile"]').getAttribute('value');
    const treePageId = pageTreeMacro.querySelector('[name="treePageId"]').getAttribute('value');

    const requestUrl = buildRequestUrl(domain + requestIdUrl, {
        hasRoot,
        pageId,
        treeId,
        startDepth,
        mobile,
        treePageId
    });

    // Do ajax call and inject returned HTML.
    if (typeof window.jQuery !== 'undefined') {
        window.jQuery.ajax({
            url: requestUrl,
            error: function(request, status, error) {
                window.console.error('Error with Page Tree ajax call', error);
            },
            success: function(data) {
                if (typeof data !== 'undefined') {
                    pageTreeMacro.innerHTML = data;
                }
            }
        });
    }
};

/**
 * Build the request URL
 *
 * @param string url The URL of the request
 * @param object params The request params object (key/value pairs)
 * @return string The built URL
 */
const buildRequestUrl = ( url, params ) => {
    let requestUrl = url;

    if (requestUrl.match('/?') !== null) {
        requestUrl += '&';
    } else {
        requestUrl += '?';
    }

    let requestParams = [];
    for (let key in params ) {
        requestParams.push(key + '=' + params[key]);
    }
    requestUrl += requestParams.join('&');

    return requestUrl;
};

/**
 * Check to see if any page trees exist, and if
 * they do, then build them.
 */
const init = () => {
    const pageTreeMacros = document.querySelectorAll('[data-macro-name="pagetree"]');
    if (pageTreeMacros) {
        for (let i=0; i<pageTreeMacros.length; i++) {
            buildPageTreeMacro(pageTreeMacros[i]);
        }
    }
};

export default {
    init
};

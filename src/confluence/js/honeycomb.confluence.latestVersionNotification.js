const checkForLatestVersion = href => {
    if (href) {
        window.jQuery.ajax({
            url: href,
            success: data => {
                const page = new DOMParser().parseFromString(data, 'text/html');
                if (page) {
                    const docLinks = page.querySelectorAll('[data-macro-name="sp-pagelayout"] a');
                    let docLink = false;
                    for (let i=0; i<docLinks.length; i++) {
                        if (docLinks[i].innerHTML == 'Documentation') {
                            docLink = docLinks[i];
                            break;
                        }
                    }

                    // Latest docs link is docLink.
                    const latestSpace = getSpaceFromUrl(docLink.href);
                    const thisSpace = getSpaceFromUrl(window.location.href);
                    if (latestSpace !== thisSpace) {
                        displayNotification(latestSpace, href);
                    }
                }
            }
        });
    }
};

const getSpaceFromUrl = url => {
    const a = document.createElement('a');
    a.href = url;
    const splits = a.pathname.split('/');
    const space = (splits[0] === '') ? splits[1] : splits[0];
    return space;
};

const displayNotification = ( latestSpace, docLink ) => {
    const notification = document.createElement('div');
    let innerHTML = '';

    notification.className = 'notification notification--block notification--info spaced-top--tight spaced-bottom--none';
    innerHTML += '<div class="notification--block__inner-container"><figure class="notification__icon"><span class="icon icon--info"></span></figure><div class="notification__body">';
    innerHTML += `<p>These pages cover ${window.Confluence.Space.name}, which is not the latest version. Help for <a href="${docLink}">other versions</a> is also available.</p>`;
    innerHTML += '</div></div>';
    notification.innerHTML = innerHTML;

    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
        pageContent.insertBefore(notification, pageContent.firstChild);
    }
};

const init = () => {

    // Only check for latest version if there's a version number in the space key.
    if (window.Confluence && window.Confluence.Space && window.Confluence.Space.key) {
        if (window.Confluence.Space.key.match(/[0-9]/ig) !== null) {
            const link = document.querySelector('.js-older-versions a');
            if (link) {
                checkForLatestVersion(link.href);
            }
        }
    }
};

export default {
    init
};
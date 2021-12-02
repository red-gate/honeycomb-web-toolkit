import cookie from '../../cookie/js/honeycomb.cookie';
import crawlerUserAgents from '../json/crawler-user-agents.json';
import { close as closeDialog, open as openDialog } from './honeycomb.cookie-consent.dialog';

/**
 * The name of the consent cookie.
 * 
 * @var {String} The name of the consent cookie.
 */
let consentCookieName = 'hccookieconsent';

/**
 * The groups that can be consented to.
 * 
 * @var {Array} consentGroups The groups
 */
let consentGroups = [
    'functional',
    'performance',
    'targeting',
];

/**
 * The links to display in the banner.
 * 
 * @var {Array} links An array of link objects
 */
let links = [];

/**
 * Set the consent cookie name.
 * 
 * @param {String} name The name of the consent cookie
 * @returns {Void}
 */
const setConsentCookieName = name => {
    consentCookieName = name;
};

/**
 * Set the consent groups.
 * 
 * @param {Array|Null} groups The groups to consent to
 */
const setConsentGroups = ( groups = null ) => {
    if (Array.isArray(groups)) {
        consentGroups = groups;
    }
};

/**
 * Set links to display on the banner.
 * 
 * @param {Array|Null} links The links to display on the banner
 */
const setLinks = ( l = null ) => {
    if (Array.isArray(l)) {
        links = l;
    }
};

/**
 * Get the name of the Redgate consent cookie
 * 
 * @returns {String} The name of the consent cookie
 */
const getConsentCookieName = () => {
    return consentCookieName;
};

/**
 * Get the consent groups.
 * 
 * @returns {Array} An array of consent groups
 */
const getConsentGroups = () => {
    return consentGroups;
};

/**
 * Get the custom links to display on the banner.
 * 
 * @returns {Array} An array of custom links
 */
const getLinks = () => {
    return links;
};

/**
 * Get the groups from the cookie if they exist. If they don't exist, then
 * return null.
 * 
 * @returns {Object|Null} The consent groups with their consent value, or null if not found
 */
const getConsentGroupsFromCookie = () => {
    const consentCookieGroups = JSON.parse(cookie.get(getConsentCookieName()));
    return ( typeof consentCookieGroups !== 'object' || consentCookieGroups === null ) ? null : consentCookieGroups;
};

/**
 * Check if there is consent to use cookies by checking for the value of the
 * consent cookie.
 * 
 * @param {String|Null} group The group to check consent for
 * @returns {Boolean} Whether consent is given to use cookies
 */
const hasConsent = ( group = null ) => {
    if ( group !== null ) {
        group = group.toLowerCase();
    }

    const consentCookie = JSON.parse(cookie.get(getConsentCookieName()));

    // Legacy.
    if ( typeof consentCookie !== 'object' || consentCookie === null ) {
        return ( consentCookie === null || consentCookie == 0 ) ? false : true;
    }

    // By default, consent is NOT given.
    let consent = false;

    // If no group specified, then check if any of the groups have consent, and
    // return true if so.
    if ( group === null ) {
        for ( const g in consentCookie ) {
            if ( consentCookie[g] == 1 ) {
                consent = true;
            }
        }

        return consent;
    }

    // Check cookie for group status
    if ( Object.prototype.hasOwnProperty.call(consentCookie, group) ) {
        if ( consentCookie[group] == 1 ) {
            consent = true;
        }
    }

    return consent;
};

/**
 * Set the consent cookie with the groups consent statuses, and for it to
 * expire in 31 days.
 *
 * @param {Object|Null} groups The groups object with the group as the property,
 *                             and the consent status as the value (0|1)
 */
const setHasConsent = ( groups = null ) => {

    // If no groups info is passed in, then set all groups to have consent.
    if ( groups === null ) {
        groups = {};
        getConsentGroups().forEach(group => {
            groups[group] = 1;
        });
    }

    cookie.set(getConsentCookieName(), JSON.stringify(groups), {
        'max-age': 2678400,
        domain: '.red-gate.com',
    });
};

/**
 * Set the consent cookie with a value of 0, valid for the session only, so the
 * notification doesn't get shown on every page load.
 * 
 */
const setNoConsent = () => {
    cookie.set(getConsentCookieName(), 0, {
        domain: '.red-gate.com',
    });
};

/**
 * Check if the notification should be displayed.
 * 
 * If the cookie is set, then we know that the user has made a decision, and
 * we no longer need to display the notification.
 * 
 * We also check if it's a crawler crawling the page, if so, we don't want to
 * display the cookie notification.
 * 
 * @returns {Boolean} True to display the notifcation, False if not
 */
const isDisplayNotification = () => {
    const consentCookie = cookie.get(getConsentCookieName());
    return ( consentCookie === null && ( ! isCrawler() ) ) ? true : false;
};

/**
 * Display the cookie notification, and ask the user to either accept or
 * reject the setting of additional cookies.
 * 
 */
const displayNotification = () => {

    // Container.
    const container = document.createElement('div');
    container.className = 'band cookie-consent';

    // Inner container.
    const innerContainer = document.createElement('div');
    innerContainer.className = 'band__inner-container grid padded-v--tight';

    // Grid column.
    const column = document.createElement('div');
    column.className = 'grid__col grid__col--span-9-of-12';

    // Heading.
    const heading = document.createElement('h1');
    heading.className = 'beta spaced-bottom--none';
    heading.innerHTML = 'Cookies on red-gate.com';

    // Description.
    const description = document.createElement('p');
    description.className = 'gamma text--normal spaced-bottom--none';
    description.innerHTML = 'We use some essential cookies to make this website work.';

    const description2 = document.createElement('p');
    description2.className = 'gamma text--normal spaced-bottom--tight';
    description2.innerHTML = 'We\'d like to set additional ones to see how you use our site and for advertising.';

    // List.
    const list = document.createElement('ul');
    list.className = 'list--bare list--horizontal';

    // Accept button.
    const acceptButtonListItem = document.createElement('li');
    acceptButtonListItem.className = 'spaced-right--tight';
    const acceptButton = document.createElement('button');
    acceptButton.className = 'button button--primary button--small';
    acceptButton.innerHTML = 'Accept additional cookies';
    acceptButton.addEventListener('click', () => {
        setHasConsent();
        hideNotification();
        trackButtonClick(1);
    });
    acceptButtonListItem.appendChild(acceptButton);
    list.appendChild(acceptButtonListItem);

    // Customise link.
    const customiseLinkItem = document.createElement('li');
    customiseLinkItem.className = 'spaced-right--tight';
    const customiseLink = document.createElement('a');
    customiseLink.setAttribute('href', '#');
    customiseLink.innerHTML = 'Customize additional cookies';
    customiseLink.addEventListener('click', e => {
        e.preventDefault();
        openDialog(
            getConsentGroupsFromCookie() || getConsentGroups(), 
            groups => {
                setHasConsent(groups);
                hideNotification();
                closeDialog();
            }
        );
    });
    customiseLinkItem.appendChild(customiseLink);
    list.appendChild(customiseLinkItem);

    // Links.
    getLinks().forEach(link => {
        const linkListItem = document.createElement('li');
        linkListItem.className = 'spaced-right--tight';
        const a = document.createElement('a');
        a.setAttribute('href', link.href);
        a.innerHTML = link.title;
        linkListItem.appendChild(a);
        list.appendChild(linkListItem);
    });

    // Add all the nodes to each other.
    column.appendChild(heading);
    column.appendChild(description);
    column.appendChild(description2);
    column.appendChild(list);
    innerContainer.appendChild(column);
    container.appendChild(innerContainer);

    // Add the container to the body of the page.
    document.body.appendChild(container);
};

/**
 * Hide the notification if it exists.
 * 
 */
const hideNotification = () => {
    const notification = document.querySelector('.cookie-consent');
    if (notification) {
        notification.parentElement.removeChild(notification);
    }
};

/**
 * Track the button click.
 *
 * @param {Integer} consent Whether consent has been given (1 for yes, 0 for no)
 * @return {Void}
 */
const trackButtonClick = consent => {
    const request = new XMLHttpRequest();
    request.open('GET', `/wp-admin/admin-ajax.php?action=cookie_consent_track&consent=${consent}`);
    request.send();
};

/**
 * Check if the current request's user agent belongs to a list of crawler user
 * agents.
 * 
 * @see https://github.com/monperrus/crawler-user-agents/blob/master/crawler-user-agents.json
 * @returns {Boolean}
 */
const isCrawler = () => {
    const ua = window.navigator.userAgent;
    const patterns = crawlerUserAgents.map(ua => ua.pattern);
    
    // Loop over the patterns checking for a match.
    patterns.forEach(pattern => {
        if ( ua.match(pattern) !== null ) {
            return true;
        }
    });

    return false;
};

/**
 * Initialise the module and its functionality.
 * 
 * @param {Object} settings An object containing settings to override the defaults. * 
 */
const init = ( settings = {} ) => {

    // Update the cookie consent name if set in settings.
    if ( settings.consentCookieName ) {
        setConsentCookieName(settings.consentCookieName);
    }

    // Set the consent groups if set in settings.
    if ( settings.consentGroups ) {
        setConsentGroups(settings.consentGroups);
    }

    // Set the links to display in the banner if set in settings.
    if ( settings.banner?.links ) {
        setLinks(settings.banner.links);
    }
    
    // Check if notification should be displayed.
    if ( isDisplayNotification() ) {
        displayNotification();
    }

    // If user has given consent previously, then reset cookie so it's a
    // rolling expiration date.
    // If the user doesn't visit for a period after 31 days then they'll see
    // the notification, however if they keep revisiting then they'll never
    // see it again.
    if ( hasConsent() ) {
        setHasConsent(getConsentGroupsFromCookie());
    }
};

export default {
    init,
    hasConsent,
};

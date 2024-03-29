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
 * The domain used when setting the cookie.
 *
 * @var {String} consentCookieDomain The domain
 */
let consentCookieDomain = window.location.hostname;

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
 * The heading used on the banner.
 *
 * @var {String} bannerHeading The heading
 */
let bannerHeading = 'Cookies';

/**
 * The intro content used on the banner.
 *
 * @var {String} bannerIntro The intro content
 */
let bannerIntro = `
    <p class="spaced-bottom--none">This website stores cookies on your computer.</p>
    <p class="spaced-bottom--none">These cookies are used to improve your website 
    experience and provide more personalized services 
    to you, both on this website and through other media.</p>
    <p>To find out more about the cookies we use, see our 
    <a href="https://www.red-gate.com/trust/privacy-notice">Privacy Policy</a></p>
`;

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
 * Set the domain used for the cookie.
 *
 * @param {String} domain The domain to use for the cookie
 * @returns {Void}
 */
const setConsentCookieDomain = domain => {
    consentCookieDomain = domain;
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
 * Set the heading to use on the banner.
 *
 * @param {String} heading The heading to use on the banner
 * @returns {Void}
 */
const setBannerHeading = heading => {
    bannerHeading = heading;
};

/**
 * Set the intro content to use on the banner.
 *
 * @param {String} intro The intro content
 * @returns {Void}
 */
const setBannerIntro = intro => {
    bannerIntro = intro;
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
 * Get the domain to use when setting the consent cookie.
 *
 * @returns {String} The domain to use for the consent cookie
 */
const getConsentCookieDomain = () => {
    return consentCookieDomain;
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
 * Get the heading to use on the banner.
 *
 * @returns {String} The heading to use on the banner
 */
const getBannerHeading = () => {
    return bannerHeading;
};

/**
 * Get the intro content to use on the banner.
 *
 * @returns {String} The intro to use on the banner
 */
const getBannerIntro = () => {
    return bannerIntro;
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
 * expire in 31 days if cookies accepted, and 6 months if rejected.
 *
 * Also dispatch a `CookieConsent` event which includes the consent group data.
 *
 * @param {Object|Null} groups The groups object with the group as the property,
 *                             and the consent status as the value (0|1)
 * @param {Boolean} status The status to set consent to if groups is null.
 *                         Defaults to true (accepted)
 */
const setHasConsent = ( groups = null, status = true ) => {

    // If no groups info is passed in, then set all groups to have consent.
    if ( groups === null ) {
        groups = {};
        getConsentGroups().forEach(group => {
            groups[group] = status === true ? 1 : 0;
        });
    }

    cookie.set(getConsentCookieName(), JSON.stringify(groups), {
        'max-age': (status === 1) ? 2678400 : 16070400,
        domain: getConsentCookieDomain(),
    });

    window.dispatchEvent(
        new CustomEvent('CookieConsent', {
            bubbles: true,
            detail: {
                groups,
            },
        })
    );
};

/**
 * Set the consent cookie with a value of 0, valid for the session only, so the
 * notification doesn't get shown on every page load.
 * 
 */
const setNoConsent = () => {
    cookie.set(getConsentCookieName(), 0, {
        domain: getConsentCookieDomain(),
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
    heading.innerHTML = getBannerHeading();

    // Intro.
    let introContainer = null;
    const introContent = getBannerIntro();
    if (introContent && introContent !== '') {
        introContainer = document.createElement('div');
        introContainer.className = 'gamma text--normal spaced-bottom--tight';
        introContainer.innerHTML = introContent;
    }

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
    });
    acceptButtonListItem.appendChild(acceptButton);
    list.appendChild(acceptButtonListItem);

    // Reject button.
    const rejectButtonListItem = document.createElement('li');
    rejectButtonListItem.className = 'spaced-right--tight';
    const rejectButton = document.createElement('button');
    rejectButton.className = 'button button--small';
    rejectButton.innerHTML = 'Reject additional cookies';
    rejectButton.addEventListener('click', () => {
        setHasConsent(null, false);
        hideNotification();
    });
    rejectButtonListItem.appendChild(rejectButton);
    list.appendChild(rejectButtonListItem);

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
    introContainer && column.appendChild(introContainer);
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
 * Update the consent value for a group.
 * 
 * If the group doesn't exist, it will create it.
 * 
 * @param {String} group The consent group to update the value of
 * @param {Number} value The value to set the consent group to
 * @returns {Boolean} True if the consent was updated, false it not
 */
const updateConsent = ( group = '', value = 0 ) => {
    
    // Get groups from cookie with their values (defaulting to 0 if no cookie found).
    const groups = 
        getConsentGroupsFromCookie() || 
        Object.fromEntries(
            getConsentGroups().map(
                group => [group, 0]
            )
        );

    // If the group exists, and the value is the same, then exit early.
    if ((group in groups) && (groups[group] === value)) return false;

    // Update the group's value and update the consent cookie.
    groups[group] = value;
    setHasConsent(groups);

    return true;
};

/**
 * Initialise the module and its functionality.
 * 
 * @param {Object} settings An object containing settings to override the defaults. * 
 */
const init = ( settings = {} ) => {

    // Update the cookie consent name if set in settings.
    if ( settings.cookie?.name ) {
        setConsentCookieName(settings.cookie.name);
    }

    // Update the cookie consent domain if set in settings.
    if ( settings.cookie?.domain ) {
        setConsentCookieDomain(settings.cookie.domain);
    }

    // Set the consent groups if set in settings.
    if ( settings.consentGroups ) {
        setConsentGroups(settings.consentGroups);
    }

    // Set the banner heading if set in settings.
    if ( settings.banner?.heading) {
        setBannerHeading(settings.banner.heading);
    }

    // Set the banner intro content if set in settings.
    if ( settings.banner?.intro) {
        setBannerIntro(settings.banner.intro);
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
    updateConsent,
};

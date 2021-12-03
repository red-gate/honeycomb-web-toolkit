let dialog = null;

/**
 * Open the dialog, and display the cookie groups, with the consent values (as
 * toggles).
 * 
 * @param {Object|Array} consentGroups An object containing the groups and
 *                                     their consent values, or an array of
 *                                     group names.
 * @param {Function} setHasConsent A function to use to set consent, passing in
 *                                 object of groups and their consent values
 * @return {Void}
 */
const open = ( consentGroups = null, setHasConsent = null ) => {
    if ( dialog ) return;

    // Convert groups array into object.
    if ( Array.isArray(consentGroups) ) {
        let groupsObject = {};
        for ( let i = 0; i < consentGroups.length; i++ ) {
            groupsObject[consentGroups[i]] = 0;
        }
        consentGroups = groupsObject;
    }

    // Container.
    dialog = document.createElement('div');
    dialog.setAttribute('class', 'cookie-dialog');
    dialog.addEventListener('click', e => {

        // If the user clicks outside of the inner container, then close the dialog.
        if (e.target?.getAttribute('class') === 'cookie-dialog') {
            close();
        }
    });

    // Inner container.
    const inner = document.createElement('div');
    inner.setAttribute('class', 'cookie-dialog__inner');

    // Heading.
    const heading = document.createElement('h1');
    heading.setAttribute('class', 'beta text--redgate');
    heading.innerHTML = 'Cookie settings';
    inner.appendChild(heading);

    // Intro para.
    const intro = document.createElement('p');
    intro.innerHTML = 'When you visit a website, it may store or retrieve information on your browser, mostly in the form of cookies. This information could be about you, your preferences, or your device. Typically, it does not identify you personally.<br/>If you prefer, you can choose not to allow some types of cookies. To disallow all cookies, except essential cookies that our site needs to function, click Save settings. Otherwise, you can enable certain types of cookies by checking the appropriate box under Manage cookie groups.<br/>Blocking some types of cookies may affect your experience of our site and what we can offer you.';
    inner.appendChild(intro);

    // Allow all button.
    const acceptAll = document.createElement('button');
    acceptAll.setAttribute('class', 'button button--primary button--small spaced-bottom--tight');
    acceptAll.innerHTML = 'Accept all';
    acceptAll.addEventListener('click', e => {
        e.preventDefault();
        setHasConsent(null);
    });
    inner.appendChild(acceptAll);

    // Group heading.
    const groupHeading = document.createElement('h2');
    groupHeading.setAttribute('class', 'gamma text--redgate');
    groupHeading.innerHTML = 'Manage cookie groups';
    inner.appendChild(groupHeading);

    // Group intro.
    const groupIntro = document.createElement('p');
    groupIntro.innerHTML = 'Performance cookies include Google Analytics and similar platforms that help us see how people are using our site. Targeting cookies let us deliver content and ads relevant to your interests on our sites and third-party ones.';
    inner.appendChild(groupIntro);

    // Groups.
    const groups = document.createElement('ul');
    groups.setAttribute('class', 'cookie-dialog__groups');
    for (let consentGroup in consentGroups) {
        const group = document.createElement('li');

        // Checkbox.
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'groups[]');
        checkbox.setAttribute('id', `group-${consentGroup}`);
        checkbox.setAttribute('value', consentGroup);
        if ( consentGroups[consentGroup] == 1 ) {
            checkbox.setAttribute('checked', 'checked');
        }

        // Label.
        const label = document.createElement('label');
        label.setAttribute('for', `group-${consentGroup}`);
        label.innerHTML = consentGroup;
        
        group.appendChild(checkbox);
        group.appendChild(label);
        groups.appendChild(group);
    }
    inner.appendChild(groups);

    // Controls.
    const controls = document.createElement('div');
    controls.setAttribute('class', 'cookie-dialog__controls');

    // Save button.
    const saveButton = document.createElement('button');
    saveButton.setAttribute('class', 'button button--primary button--small');
    saveButton.innerHTML = 'Save settings';
    saveButton.addEventListener('click', e => {

        // Build the selections object from the checkboxes and pass into the
        // setHasConsent function to pass back to the calling function.
        e.preventDefault();
        const groups = dialog.querySelectorAll('input[type="checkbox"]');
        const selections = {};
        for ( let i = 0; i < groups.length; i++ ) {
            const name = groups[i].getAttribute('value');
            selections[name] = (groups[i].checked === true) ? 1 : 0;
        }
        setHasConsent(selections);
    });
    controls.appendChild(saveButton);

    // Close button?
    const closeButton = document.createElement('button');
    closeButton.setAttribute('class', 'button button--transparent button--small');
    closeButton.innerHTML = 'Close settings';
    closeButton.addEventListener('click', e => {
        e.preventDefault();
        close();
    });
    controls.appendChild(closeButton);

    inner.appendChild(controls);

    // Close button in the corner of the dialog.
    const closeButton2 = document.createElement('button');
    closeButton2.setAttribute('class', 'button button--transparent button--small cookie-dialog__close--corner');
    closeButton2.innerHTML = 'Close';
    closeButton2.addEventListener('click', e => {
        e.preventDefault();
        close();
    });
    inner.appendChild(closeButton2);

    // Append the dialog to the DOM.
    dialog.appendChild(inner);
    document.body.appendChild(dialog);

    // Set focus to the dialog box.
    dialog.focus();
};

/**
 * Close the dialog.
 */
const close = () => {
    if ( dialog ) {
        dialog.parentElement.removeChild(dialog);
        dialog = null;
    }
};

export {
    close,
    open,
};

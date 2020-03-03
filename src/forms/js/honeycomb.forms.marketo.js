import loadScript from '../../document/js/honeycomb.document.load-script';

/**
 * The default form settings.
 * 
 * Exported so they can be imported by the React implementation.
 */
export const defaults = {
    callback: () => {},
    formId: '',
    formsJavaScriptUrl: 'https://content.red-gate.com/js/forms2/js/forms2.min.js',
    munchkinId: '808-ITG-788',
    rootUrl: '//content.red-gate.com',
    success: {
        callback: null,
        message: null,
    },
};

/**
 * Create a custom config object by merging the default 
 * with the user supplied config.
 * 
 * @param {object} c The user supplied config.
 * @return {object} The defaults merged with the user supplied config.
 */
const createConfig = c => {
    return { ...defaults, ...c };
};

const removeDefaultStyles = () => {

    // Remove all the Marketo form stylesheets and embedded style tags.
    const formStyles = document.querySelectorAll(`
        .mktoForm style,
        link#mktoForms2BaseStyle,
        link#mktoForms2ThemeStyle,
        link#mktoFontUrl
    `);
    for (let i=0; i<formStyles.length; i++) {
        let style = formStyles[i];
        if (Object.prototype.hasOwnProperty.call(style, 'remove')) {
            style.remove();
        } else {
            style.parentElement.removeChild(style);
        }
    }

    // Remove all the Marketo form embedded style attributes.
    const formElements = document.querySelectorAll(`
        .mktoForm,
        .mktoForm *
    `);
    for (let i=0; i<formElements.length; i++) {
        let formElement = formElements[i];
        formElement.removeAttribute('style');
    }
};

/**
 * Check the config to find out if the form has custom 
 * success functionality or not.
 * 
 * @param {object} config The config object, to check for custom success values against.
 * @return {bool} Whether the form has custom success functionality or not.
 */
const hasCustomSuccess = config => {
    let customSuccess = false;

    // Is there a custom success callback?
    if (config.success.callback !== null && typeof config.success.callback !== 'undefined') {
        customSuccess = true;
    }

    // Is there a custom success message?
    if (config.success.message !== null && typeof config.success.message !== 'undefined') {
        customSuccess = true;
    }

    return customSuccess;
};

/*
 * Format checkboxes so that the label is alongside the input.
 * 
 * @param {HTMLElement} form The Marketo form being formatted.
 */
const formatCheckboxes = form => {
    const checkboxes = form.querySelectorAll('.mktoCheckboxList');
    if (checkboxes) {
        for (let i=0; i<checkboxes.length; i++) {
            const checkbox = checkboxes[i];
            checkbox.parentElement.insertBefore(checkbox, checkbox.parentElement.firstChild);
        }
    }
};

const create = c => {
    
    // Get the config for the form.
    const config = createConfig(c);

    // Load the Marketo form script, and once loaded, load the 
    // form, and apply any callbacks.
    // See API documentation at https://developers.marketo.com/javascript-api/forms/api-reference/ .
    loadScript.load(config.formsJavaScriptUrl, () => {
        if (typeof window.MktoForms2 === 'undefined') return;

        // If there's no form ID, then don't go any further.
        if (config.formId === '') return;

        window.MktoForms2.loadForm(
            config.rootUrl,
            config.munchkinId,
            config.formId,
            (marketoForm) => {
                const marketoFormElement = marketoForm.getFormElem().get(0);

                removeDefaultStyles();
                formatCheckboxes(marketoFormElement);

                if (typeof config.callback === 'function') {
                    config.callback.call(this, marketoForm);
                }

                if (hasCustomSuccess(config)) {
                    marketoForm.onSuccess((formValues, followUpUrl) => {
                        const $form = marketoForm.getFormElem(); // $form is a jQuery object.

                        // If there's a callback, and it's a function, then call it, passing 
                        // in the form values so that they can be used client side if needed.
                        if (typeof config.success.callback === 'function') {
                            config.success.callback.call(this, marketoForm, formValues, followUpUrl);
                        }

                        // If there's a custom message, then replace the form wit this message.
                        if (config.success.message !== null) {
                            $form.html(config.success.message);
                        }

                        // Add a class to describe the form has been successfully submitted.
                        $form.addClass('mktoFormSubmitted mktoFormSubmitted--successful');

                        // Return false to stop the form from reloading the page.
                        return false;
                    });
                }

                marketoForm.onValidate((successful) => {
                    if (!successful) {
                        marketoForm.submittable(false);
                    } else {

                        // Do some custom validation.

                        // Get the fields and their values from the form.
                        const fields = marketoForm.vals();

                        // Custom object for storing info about the fail.
                        let fail = {
                            isFail: false,
                            message: '',
                            element: null,
                        };

                        // Email validation.
                        if (typeof fields.Email !== 'undefined') {

                            // Email regex provided by https://regex101.com/r/L9Z2N0/1.
                            // Check that the format is {something}@{something}.{something}.
                            const emailRegex = /\S+@\S+\.\S+/;

                            if (emailRegex.test(fields.Email) === false) {
                                fail.isFail = true;
                                fail.message = 'Please enter a valid email address.';
                                fail.element = marketoForm.getFormElem().find('input[name="Email"]');
                            }
                        }

                        // If form validation fails.
                        if (fail.isFail) {

                            // Stop the form from being submittable.
                            marketoForm.submittable(false);

                            // Show an error message against the invalid field.
                            marketoForm.showErrorMessage(fail.message, fail.element);

                            // Display the field as invalid using the Marketo class.
                            fail.element.get(0).classList.add('mktoInvalid');
                        } else {

                            // All is good, continue as normal.
                            marketoForm.submittable(true);
                        }
                    }
                });
            }
        );
    });
};

const init = callback => {
    if (typeof callback === 'function') {
        callback.call(this);
    }
};

export default {
    create,
    init
};
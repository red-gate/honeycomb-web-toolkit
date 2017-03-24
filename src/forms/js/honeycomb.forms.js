const init = () => {
    addRequiredDot();
    addHelpIcon();
};

const addElement = ( selector, type, atts ) => {
    const fields = document.querySelectorAll(selector);
    for(let i=0; i<fields.length; i++) {
        const el = document.createElement(type);
        for(let a=0; a<atts.length; a++) {
            const attr = atts[a];
            const value = ( typeof attr.value === "string" ) ? attr.value : fields[i].getAttribute(attr.value.dataAttribute);

            if(attr.attribute && value) {
                el.setAttribute(attr.attribute, value);
            }
        }
        fields[i].parentElement.insertBefore(el, fields[i].nextSibling);
    }
};

const addRequiredDot = () => {
    addElement("form .js-required, form [required]", "span", [
        {
            attribute: "class",
            value: "form__required-dot"
        }, {
            attribute: "title",
            value: "This field is required"
        }
    ]);
};

const addHelpIcon = () => {
    addElement("form .js-help", "span", [
        {
            attribute: "class",
            value: "icon--help-circle form__help"
        }, {
            attribute: "title",
            value: {
                dataAttribute: "data-help-text"
            }
        }
    ]);
};

export default {
    init
};

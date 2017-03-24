const init = () => {
    addRequiredDot();
};

const addRequiredDot = () => {
    const fields = document.querySelectorAll("form .required, form [required]");
    for(let i=0; i<fields.length; i++) {
        const dot = document.createElement("span");
        dot.setAttribute("class", "form__required-dot");
        fields[i].parentElement.insertBefore(dot, fields[i].nextSibling);
    }
};

export default {
    init
};

// Convert classes to IDs (as ID's get stripped out when added
// via the editor)
// Usage: set class="class-a class-b id--this-is-my-id class-c"
const init = () => {
    const els = document.querySelectorAll('[class*=id--]');
    for (var i=0; i<els.length; i++) {
        let id = false;
        const el = els[i];
        const cls = el.getAttribute('class').match(/id--[a-z0-9\-]*/ig);
        if (cls) {
            const c = cls[0];
            id = c.replace('id--', '');
        }

        if (id) {
            el.setAttribute('id', id);
        }
    }
};

export default {
    init
};
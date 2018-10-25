const classNames = {
    hidden: 'expand-hidden',
    revealed: 'expand-revealed'
};

let containers = null;

const init = () => {
    containers = document.querySelectorAll('.expand-container, [data-macro-name="expand"]');
    if (!containers) return;

    setupContainers();
};

const setupContainers = () => {
    for (let i=0; i<containers.length; i++) { 
        const container = containers[i];
        const control = container.querySelector('.expand-control');
        const content = container.querySelector('.expand-content');
        if (!control && !content) return;

        if (content.classList.contains(classNames.hidden)) {
            container.classList.add(classNames.hidden);
            content.classList.remove(classNames.hidden);
        } else {
            container.classList.add(classNames.revealed);
            content.classList.remove(classNames.revealed);
        }

        addHandler(control, container);
    }
};

const addHandler = ( control, container ) => {
    control.addEventListener('click', e => {
        e.preventDefault();
        toggle(container);
    });
};

const toggle = container => {
    if (container.classList.contains(classNames.hidden)) {
        reveal(container);
    } else if (container.classList.contains(classNames.revealed)) {
        hide(container);
    }
};

const reveal = container => {
    container.classList.remove(classNames.hidden);
    container.classList.add(classNames.revealed);
};

const hide = container => {
    container.classList.remove(classNames.revealed);
    container.classList.add(classNames.hidden);
};

export default {
    init
};
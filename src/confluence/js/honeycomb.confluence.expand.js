const classNames = {
    hidden: 'expand-hidden',
    revealed: 'expand-revealed',
    contentHidden: 'expand-content-hidden',
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
        
        updateControl(control, content);
        addHandler(control, content);
    }
};

const addHandler = ( control, content ) => {
    control.addEventListener('click', () => {
        window.setTimeout(() => {
            updateControl(control, content);        
        }, 100);
    });
};

const updateControl = ( control, content ) => {
    if (content.classList.contains(classNames.hidden)) {
        control.classList.add(classNames.contentHidden);
    } else {
        control.classList.remove(classNames.contentHidden);
    }
};

export default {
    init
};
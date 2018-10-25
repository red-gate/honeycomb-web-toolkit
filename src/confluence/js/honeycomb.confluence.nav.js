const nav = document.querySelector('.nav--vertical--minimal');
const container = document.querySelector('.content-container');

const init = () => {
    if (!nav || !container) return false;
    nav.style.minHeight = '0';     
    if (window.innerWidth < 600) return false;
    nav.style.minHeight = `${container.clientHeight}px`;
};

export default {
    init
};
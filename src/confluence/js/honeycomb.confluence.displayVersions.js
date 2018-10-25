const init = () => {
    if (typeof window.Confluence === 'undefined') return;
    if (typeof window.Confluence.Space === 'undefined') return;
    if (typeof window.Confluence.Space.key === 'undefined') return;

    const version = window.Confluence.Space.key.replace(/[^0-9]/g, '');
    if ((version !== '') && (parseInt(version) > 1)) {
        const oldVersions = document.querySelector('.js-older-versions');
        if (oldVersions) {
            oldVersions.style.display = 'block';
        }
    }
};

export default {
    init
};
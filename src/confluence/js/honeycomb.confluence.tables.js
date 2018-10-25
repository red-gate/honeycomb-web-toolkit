// If the table isn't a code example (highlight) and is wider
// than it's parent (i.e. it's wider than the page) then
// change it to a fixed layout table.
const init = () => {
    const tables = document.querySelectorAll('table');
    for (var i=0; i<tables.length; i++) {
        const table = tables[i];
        const wrapper = table.parentElement;
        const onPhotoBoard = document.querySelector('body').className.match('id-11863182');

        if (wrapper.className === 'table-wrap' && wrapper.parentElement.className.match('highlight') === null && !onPhotoBoard) {
            if (table.clientWidth > wrapper.clientWidth) {
                table.className += ' table--fixed';
            }
        }
    }
};

export default {
    init
};
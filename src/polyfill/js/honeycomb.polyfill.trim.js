// Polyfill for the string trim command.
let trim = () => {
    if ( ! String.prototype.trim ) {
        String.prototype.trim = function () {
            return this.replace( /^\s+|\s+$/g, '' );
        };
    }
};

export default trim;

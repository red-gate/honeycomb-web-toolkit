// Polyfill for the array indexOf command.
let indexOf = () => {
    if ( ! ( 'indexOf' in Array.prototype ) ) {
        Array.prototype.indexOf = function( find, i /*opt*/ ) {
            if ( i === undefined ) i = 0;
            if ( i < 0 ) i += this.length;
            if ( i < 0 ) i = 0;
            for ( let n = this.length; i < n; i++ ) {
                if ( i in this && this[ i ] === find ) {
                    return i;
                }
            }
            return -1;
        };
    }
};

export default indexOf;

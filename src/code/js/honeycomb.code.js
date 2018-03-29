import loadScript from '../../document/js/honeycomb.document.load-script';
import loadStyle from '../../document/js/honeycomb.document.load-style';

const isCodeSample = ( sample ) => {
    let search = 'brush:';
    if ( sample.className.match( search ) ) {
        return true;
    }

    return false;
};

const getCodeSamples = () => {
    const pres = document.getElementsByTagName( 'pre' );
    const scripts = document.getElementsByTagName( 'script' );
    let samples = [];

    for ( let a = 0; a < pres.length; a++ ) {
        if ( isCodeSample( pres[ a ] ) ) {
            samples.push( pres[ a ] );
        }
    }

    for ( let b = 0; b < scripts.length; b++ ) {
        if ( isCodeSample( scripts[ b ] ) ) {
            samples.push( scripts[ b ] );
        }
    }

    return samples;
};

const loadVendorScript = config => {
    if (typeof config.url === 'undefined') {
        config.url = 'code/vendor/syntaxhighlighter.js';
    }

    loadScript.load(config.url, () => {
        const myConsole = console;
        myConsole.log('Syntax Highlighter script loaded');
    });
};

const loadVendorStyle = config => {
    if (typeof config.style === 'undefined') {
        config.style = 'code/vendor/theme.css';
    }

    loadStyle.load(config.style, () => {
        const myConsole = console;
        myConsole.log('Syntax Highlighter style loaded');
    });
};

const init = ( config = {} ) => {
    const samples = getCodeSamples();

    if (samples.length > 0) {
        loadVendorScript(config);
        loadVendorStyle(config);
    }
};

export default {
    init
};
let vendorUrl   = 'https://alexgorbatchev.com/pub/sh/current/';
let scriptsDir  = 'scripts/';
let cssDir      = 'styles/';

let scripts = [
    vendorUrl + scriptsDir + 'shCore.js'
];

let styles = [
    cssDir + 'shThemeDefault.css'
];

let samples = [];

let brushes = [
    ['applescript', 'shBrushAppleScript.js'],
    ['actionscript3', 'as3', 'shBrushAS3.js'],
    ['bash', 'shell',	'shBrushBash.js'],
    ['coldfusion', 'cf', 'shBrushColdFusion.js'],
    ['cpp', 'c', 'shBrushCpp.js'],
    ['c#', 'c-sharp', 'csharp', 'shBrushCSharp.js'],
    ['css', 'shBrushCss.js'],
    ['delphi', 'pascal', 'shBrushDelphi.js'],
    ['diff', 'patch', 'pas', 'shBrushDiff.js'],
    ['erl', 'erlang', 'shBrushErlang.js'],
    ['groovy', 'shBrushGroovy.js'],
    ['java', 'shBrushJava.js'],
    ['jfx', 'javafx', 'shBrushJavaFX.js'],
    ['js', 'jscript', 'javascript', 'shBrushJScript.js'],
    ['perl', 'pl', 'shBrushPerl.js'],
    ['php', 'shBrushPhp.js'],
    ['text', 'plain', 'shBrushPlain.js'],
    ['py', 'python', 'shBrushPython.js'],
    ['powershell', 'ps', 'posh', 'shBrushPowerShell.js'],
    ['ruby', 'rails', 'ror', 'rb', 'shBrushRuby.js'],
    ['sass', 'scss', 'shBrushSass.js'],
    ['scala', 'shBrushScala.js'],
    ['sql', 'shBrushSql.js'],
    ['vb', 'vbnet', 'shBrushVb.js'],
    ['xml', 'xhtml', 'xslt', 'html', 'shBrushXml.js']
];

let isCodeSample = ( sample ) => {
    let search = 'brush:';
    if ( sample.className.match( search ) ) {
        return true;
    }

    return false;
};

let loadStylesheet = ( sheet ) => {
    let head = document.getElementsByTagName( 'head' )[ 0 ];
    let link = document.createElement( 'link' );
    link.rel = 'stylesheet';
    link.href = vendorUrl + sheet;
    head.appendChild(link);
};

let loadScript = ( src ) => {
    let scriptNodes = document.getElementsByTagName( 'script' )[ 0 ];
    let script = document.createElement( 'script' );
    script.async = true;
    script.src = src;
    scriptNodes.parentNode.insertBefore( script, scriptNodes );
};

let loadBrush = ( brush ) => {
    for ( let i = 0; i < brushes.length; i++ ) {
        if ( brushes[ i ].indexOf( brush ) !== -1 ) {
            let ref = brushes[ i ][ brushes[ i ].length-1 ];
            loadScript( vendorUrl + scriptsDir + ref );
        }
    }
};

let getCodeSamples = () => {
    let pres = document.getElementsByTagName( 'pre' );
    let scripts = document.getElementsByTagName( 'script' );
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

let loadStylesheets = () => {
    for ( let i = 0; i < styles.length; i++ ) {
        loadStylesheet( styles[ i ] );
    }
};

let loadScripts = () => {
    for ( let i = 0; i < scripts.length; i++ ) {
        loadScript( scripts[ i ] );
    }
};

let autoloadBrushes = () => {
    let brushesLoaded = [];

    for ( let i = 0; i < samples.length; i++ ) {
        let brush = samples[ i ].className.match( /brush:[\s]*([a-z#]*)/i )[ 1 ];

        if ( brushesLoaded.indexOf( brush ) === -1 ) {
            brushesLoaded.push( brush );
            loadBrush( brush );
        }
    }
};

let highlight = () => {
    if ( typeof window.SyntaxHighlighter !== 'undefined' ) {
        window.SyntaxHighlighter.defaults.toolbar = false;
        window.SyntaxHighlighter.defaults.gutter = false;
        window.SyntaxHighlighter.defaults[ 'quick-code' ] = false;
        window.SyntaxHighlighter.highlight();
    }
};

let init = () => {
    samples = getCodeSamples();

    if ( samples.length > 0 ) {
        loadStylesheets();
        loadScripts();
        autoloadBrushes();
    }

    window.addEventListener( 'load', () => {
        highlight();
    } );
};

export default {
    init: init,
    highlight: highlight
};

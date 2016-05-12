var Honeycomb = Honeycomb || {};

Honeycomb.Code = (function($){

    var vendorUrl   = "//alexgorbatchev.com/pub/sh/current/";
    var scriptsDir  = "scripts/";
    var cssDir      = "styles/";

    var scripts = [
        vendorUrl + scriptsDir + "shCore.js"
    ];

    var styles = [
        cssDir + "shThemeDefault.css"
    ];

    var samples = [];

    var brushes = [
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

    var _isCodeSample = function _isCodeSample(sample) {
        var search = "brush:";
        if(sample.className.match(search)) {
            return true;
        }

        return false;
    };

    var _loadStylesheet = function _loadStylesheet(sheet) {
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = vendorUrl + sheet;
        head.appendChild(link);
    };

    var _loadScript = function _loadScript(src) {
        var scriptNodes = document.getElementsByTagName("script")[0];
        var script = document.createElement("script");
        script.async = true;
        script.src = src;
        scriptNodes.parentNode.insertBefore(script, scriptNodes);
    };

    var _loadBrush = function _loadBrush(brush) {
        for(var i=0; i<brushes.length; i++) {
            if(brushes[i].indexOf(brush) !== -1) {
                var ref = brushes[i][brushes[i].length-1];
                _loadScript(vendorUrl + scriptsDir + ref);
            }
        }
    };

    var init = function init() {
        samples = getCodeSamples();

        if(samples.length > 0) {
            loadStylesheets();
            loadScripts();
            autoloadBrushes();
        }
    };

    var getCodeSamples = function getCodeSamples() {
        var pres = document.getElementsByTagName("pre");
        var scripts = document.getElementsByTagName("script");
        var _samples = [];

        for(var a=0; a<pres.length; a++) {
            if(_isCodeSample(pres[a])) {
                _samples.push(pres[a]);
            }
        }

        for(var b=0; b<scripts.length; b++) {
            if(_isCodeSample(scripts[b])) {
                _samples.push(scripts[b]);
            }
        }

        return _samples;
    };

    var loadStylesheets = function loadStylesheets() {
        for(var i=0; i<styles.length; i++) {
            _loadStylesheet(styles[i]);
        }
    };

    var loadScripts = function loadScripts() {
        for(var i=0; i<scripts.length; i++) {
            _loadScript(scripts[i]);
        }
    };

    var autoloadBrushes = function autoloadBrushes() {
        var brushesLoaded = [];

        for(var i=0; i<samples.length; i++) {
            var brush = samples[i].className.match(/brush:[\s]*([a-z#]*)/i)[1];

            if(brushesLoaded.indexOf(brush) === -1) {
                brushesLoaded.push(brush);
                _loadBrush(brush);
            }
        }
    };

    var highlight = function highlight() {
        if(typeof SyntaxHighlighter !== "undefined") {
            SyntaxHighlighter.defaults.toolbar = false;
            SyntaxHighlighter.defaults.gutter = false;
            SyntaxHighlighter.defaults['quick-code'] = false;
            SyntaxHighlighter.highlight();
        }
    };

    return {
        init: init,
        highlight: highlight
    };

})(jQuery);

jQuery(function(){
    Honeycomb.Code.init();
});

jQuery(window).on("load", function(){
    Honeycomb.Code.highlight();
});

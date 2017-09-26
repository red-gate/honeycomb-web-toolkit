// polyfill for window.CustomEvent
// from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

// this gets used by honeycomb.tabs and honeycomb.reveal
// honeycomb.reveal fires a CustomEvent which honeycomb.tabs listens for, so that honeycomb.tabs can unset/reset its fixed heights

let CustomEvent = () => {
    if ( typeof window.CustomEvent !== 'function' ) {
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = ( event, params ) => {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        };
    }
};

export default CustomEvent;

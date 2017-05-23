let $maps;

let init = ( options ) => {
    $maps = window.jQuery( '.js-google-map' );

    if ( $maps.length > 0 ) {
        let s = document.getElementsByTagName( 'script' )[ 0 ];
        let se = document.createElement( 'script' );

        se.type = 'text/javascript';
        se.src = `//maps.googleapis.com/maps/api/js?libraries=places&callback=${options.callback}`;
        s.parentNode.insertBefore( se, s );
    }
};

let initialiseMap = () => {
    $maps.each( function () {
        let $this = window.jQuery( this );
        let config = getConfig( $this );
        let map;

        if ( !config.streetView ) {

            // Normal map type.
            map = new window.google.maps.Map( this, {
                center:             new window.google.maps.LatLng( config.lat, config.long ),
                zoom:               config.zoom,
                mapTypeId:          config.mapTypeId,
                disableDefaultUI:   config.disableDefaultUI,
                scrollwheel:        config.scrollwheel,
                draggable:          config.draggable
            });

            if ( config.place ) {
                let request = {
                    location:   map.getCenter(),
                    radius:     '1000',
                    query:      config.place
                };

                let placesService = new window.google.maps.places.PlacesService( map );
                placesService.textSearch( request, function( results, status ) {
                    if ( status === window.google.maps.places.PlacesServiceStatus.OK ) {
                        let result = results[ 0 ];

                        let marker = new window.google.maps.Marker({
                            map:        map,
                            position:   result.geometry.location
                        });

                        let content = '<h1 class="delta spaced-bottom--tight">' + result.name + '</h1>' +
                            '<p>' + result.formatted_address.replace(/,/gi, ',<br/>') + '</p>';

                        let infoWindow = new window.google.maps.InfoWindow({
                            content: content
                        });

                        window.google.maps.event.addListener( marker, 'click', () => {
                            infoWindow.open( map, marker );
                        });

                        infoWindow.open( map, marker );
                    }
                });
            }
        } else {

            // Street view
            map = new window.google.maps.StreetViewPanorama( this, {
                position: new window.google.maps.LatLng( config.lat, config.long ),
                pov: {
                    heading: 0,
                    pitch: 0
                },
                zoom: 1,
                disableDefaultUI:   config.disableDefaultUI,
                scrollwheel:        config.scrollwheel
            });
            map.setVisible( true );
        }
    });
};

let getConfig = ( $map ) => {

    // Look at the elements data attributes to get configs and return in object.
    let config = {};
    config.lat                = $map.attr( 'data-google-map-lat' ) || 0;
    config.long               = $map.attr( 'data-google-map-long' ) || 0;
    config.zoom               = parseInt( $map.attr( 'data-google-map-zoom' ), 10) || 10;
    config.mapTypeId          = window.google.maps.MapTypeId.ROADMAP;
    config.disableDefaultUI   = ( $map.attr( 'data-google-map-disable-ui' ) === 'true' ) ? true : false;
    config.scrollwheel        = ($map.attr( 'data-google-map-scrollwheel' ) === 'false' ) ? false : true;
    config.draggable          = ($map.attr( 'data-google-map-draggable' ) === 'false' ) ? false : true;
    config.place              = $map.attr( 'data-google-map-place' ) || false;
    config.streetView         = $map.attr( 'data-google-map-street-view' ) || false;

    return config;
};

export default {
    init: init,
    initialiseMap: initialiseMap
};

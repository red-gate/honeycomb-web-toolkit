// Equalise heights amongst selected items (https://github.com/edwardcasbon/jquery.equalise)
let equalise = () => {
	if ( $.fn.equalise ) {
		$( '.js-equal-heights' ).equalise({
			itemClass: 'js-equal-heights__item',
			groupAttr: 'js-equal-heights-group'
		});
	}
};

export default equalise;

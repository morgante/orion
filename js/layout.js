(function($, orion) {
	var height;
	var $pages;

	function resize() {
		height = $(window).height();

		$pages.height(height);
	}

	function init() {
		$pages = $('.page');

		resize();
	}

	function getHeight() {
		return height;
	}

	orion.layout = orion.layout || {
		height: getHeight,
		init: init
	};
}(jQuery, orion));
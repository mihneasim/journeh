'use strict';

// Configuring the stories module
angular.module('stories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Cancel this ..
		//Menus.addMenuItem('topbar', 'Stories', 'stories', 'dropdown', '/stories(/create)?');
		//Menus.addSubMenuItem('topbar', 'stories', 'List stories', 'stories');
		//Menus.addSubMenuItem('topbar', 'stories', 'New Story', 'stories/create');
		// And try this:
		Menus.addMenuItem('topbar', 'Explore Stories', 'stories');
		Menus.addMenuItem('topbar', 'New Story', 'stories/create', 'item', '/stories/create', false);

	}
]);

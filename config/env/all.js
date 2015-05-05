'use strict';

module.exports = {
	app: {
		title: 'Mapping Salt Lake City',
		description: 'Mapping Salt Lake City is a community-created archive of Salt Lake City’s neighborhoods and people that documents the city’s changes through art, critical and creative literature, personal maps and multimedia projects. We invite people to engage with and evolve this site by submitting their own contributions.',
		keywords: 'mapping, map, geojson, salt lake city, utah, art, humanities, digital humanities, isomer'
	},
	port: process.env.PORT || 3000,
    httpsPort: process.env.PORT || 3001,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/ng-ckeditor/ng-ckeditor.css',
                '//api.tiles.mapbox.com/mapbox.js/v2.1.8/mapbox.css',
				'public/lib/sidebar-v2/css/leaflet-sidebar.min.css'
				//'public/lib/angular-material/modules/css/angular-material-layout.css',
				//'public/lib/angular-material/angular-material.min.css'

			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery/dist/jquery.js',
				'public/lib/rangy/rangy-core.js',
				'public/lib/ng-ckeditor/libs/ckeditor/ckeditor.js',
				'public/lib/ng-ckeditor/ng-ckeditor.js',
				'public/lib/modernizr/modernizr.js',
                '//api.tiles.mapbox.com/mapbox.js/v2.1.8/mapbox.js',
				'public/lib/sidebar-v2/js/leaflet-sidebar.min.js',
				'//maps.stamen.com/js/tile.stamen.js?v1.3.0',
				'public/modules/core/controllers/menu-uiMorphingButton.js',
				'public/lib/classie/classie.js'
				//'public/lib/bootstrap-material-design/dist/js/material.min.js',
				//'public/lib/angular-material/angular-material.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
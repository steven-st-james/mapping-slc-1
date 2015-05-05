'use strict';

angular.module('map').controller('MapController', ['$scope', 'Authentication', 'ApiKeys', '$http', '$rootScope', '$timeout',
    function ($scope, Authentication, ApiKeys, $http, $rootScope, $timeout) {

        $scope.markers = true;
        $scope.filters = true;
        $scope.censusDataTractLayer = true;
        $scope.googlePlacesLayer = false;
        $scope.toggleDetails = false;
        $scope.triggerMenu = true;
        $rootScope.triggerMenuCount = 0;
        var sidebarToggle = false;

        var dataBoxStaticPopup = null,
            dataBoxStaticPopupFn = null,
            tractData = {},
            censusTractData = null;

        $scope.toggleMainMenu = function(){};
        ////function that hides the core overlay main view and shows a logo in the upper left corner of the window
        $scope.triggerMenu = function(){
            console.log('$rootScope.triggerMenuCount (on map ctrl): ', $rootScope.triggerMenuCount);
            if($rootScope.triggerMenuCount === 0) {
                $rootScope.animateSmallLogo();
                $timeout(function () {
                    $scope.toggleMainMenu();
                }, 3000);
                $rootScope.triggerMenuCount++;
            }else{

            }
        };

        //service that returns api keys
        ApiKeys.getApiKeys()
            .success(function (data) {
                mapFunction(data.mapboxKey, data.mapboxSecret);
            })
            .error(function (data, status) {
                alert('Failed to load Mapbox API key. Status: ' + status);
            });

//
//call the map and add functionality
//
        var mapFunction = function (key, accessToken) {
            //creates a Mapbox Map
            L.mapbox.accessToken = accessToken;

            //'info' id is part of creating tooltip with absolute position
            var info = document.getElementById('info');

            var map = L.mapbox.map('map', null, {})
                .setView([40.773, -111.902], 12)
                //allow users to share maps on social media
                // source: https://www.mapbox.com/mapbox.js/api/v2.1.5/l-mapbox-sharecontrol/
                .addControl(L.mapbox.shareControl())
                .addControl(L.mapbox.geocoderControl('mapbox.places'));

            var grayMap = L.mapbox.tileLayer('poetsrock.b06189bb'),
                mainMap = L.mapbox.tileLayer('poetsrock.la999il2'),
                topoMap = L.mapbox.tileLayer('poetsrock.la97f747'),
                greenMap = L.mapbox.tileLayer('poetsrock.jdgpalp2'),
                landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'),
                watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png');

            var layers = {
                'Main Map': mainMap,
                'Topo Map': topoMap,
                'Green Map': greenMap,
                'Landscape': landscape,
                'Watercolor': watercolor
            };

            grayMap.addTo(map);
            L.control.layers(layers).addTo(map);

            var sidebar = L.control.sidebar('sidebar', {
                closeButton: true,
                position: 'left'
            }).addTo(map);
            //map.addControl(sidebar);


            //add marker where sidebar will toggle from
            //var sidePop = L.mapbox.featureLayer({
            //L.mapbox.layerGroup({
            L.mapbox.featureLayer({
                // this feature is in the GeoJSON format: see geojson.org
                // for the full specification
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    // coordinates here are in longitude, latitude order because
                    // x, y is the standard for GeoJSON and many formats
                    coordinates: [
                        -111.702,
                        40.773
                    ]
                },
                properties: {
                    title: 'Peregrine The Espresso',
                    description: '1718 14th St NW, Washington, DC',
                    // one can customize markers by adding simplestyle properties
                    // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                    'marker-size': 'large',
                    'marker-color': '#BE9A6B',
                    'marker-symbol': 'cafe'
                }
            })

                .on('click', function (e) {


                    ////the below line of code centers the map when the marker is clicked
                    ////source: https://www.mapbox.com/mapbox.js/example/v1.0.0/centering-markers/
                    map.panTo(e.layer.getLatLng());

                    //$scope.$apply(
                    //    function(){
                    //        $scope.toggleDetails = !$scope.toggleDetails;
                    //    }
                    //);
                    sidebar.getContainer();
                    //sidebar.setContent('test <b>test</b> test');
                    if (sidebarToggle === false) {
                        $rootScope.animateLogoCheck = true;
                        setTimeout(function () {
                            sidebar.open('settings');
                        }, 500);
                        sidebarToggle = true;
                    } else {
                        setTimeout(function () {
                            sidebar.close();
                        }, 500);
                        sidebarToggle = false;
                    }
                })

                .addTo(map);

            //style the polygon tracts
            var style = {
                'stroke': true,
                'clickable': true,
                'color': "#00D",
                'fillColor': "#00D",
                'weight': 1.0,
                'opacity': 0.2,
                'fillOpacity': 0.0,
                'className': ''  //String that sets custom class name on an element
            };
            var hoverStyle = {
                'color': "#00D",
                "fillOpacity": 0.5,
                'weight': 1.0,
                'opacity': 0.2,
                'className': ''  //String that sets custom class name on an element
            };
            var hoverOffset = new L.Point(30, -16);

            ApiKeys.getTractData()
                .success(function (tractData) {
                    tractDataLayer(tractData);
                })
                .error(function (tractData) {
                    alert('Failed to load tractData. Status: ' + status);
                });
            var tractDataLayer = function (tractData) {
                censusTractData = L.geoJson(tractData, {
                        style: style,
                        onEachFeature: function (feature, layer) {
                            if (feature.properties) {
                                var popupString = '<div class="popup">';
                                for (var k in feature.properties) {
                                    var v = feature.properties[k];
                                    popupString += k + ': ' + v + '<br />';
                                }
                                popupString += '</div>';
                                layer.bindPopup(popupString);
                            }
                            if (!(layer instanceof L.Point)) {
                                layer.on('mouseover', function () {
                                    layer.setStyle(hoverStyle);
                                    //layer.setStyle(hoverOffset);
                                });
                                layer.on('mouseout', function () {
                                    layer.setStyle(style);
                                    //layer.setStyle(hoverOffset);
                                });
                            }

                        }
                    }
                );
            };

            dataBoxStaticPopupFn = function (dataBoxStaticPopup) {

                // Listen for individual marker clicks.
                dataBoxStaticPopup.on('mouseover', function (e) {
                    // Force the popup closed.
                    e.layer.closePopup();

                    var feature = e.layer.feature;
                    var content = '<div><strong>' + feature.properties.title + '</strong>' +
                        '<p>' + feature.properties.description + '</p></div>';

                    info.innerHTML = content;
                });

                function empty() {
                    info.innerHTML = '<div><strong>Click a marker</strong></div>';
                }

                // Clear the tooltip when map is clicked.
                map.on('move', empty);

                // Trigger empty contents when the script
                // has loaded on the page.
                empty();

            };

            //Google Places API
            var googlePlacesMarker = null;
            var googlePlacesMarkerLayer = null;
            var googlePlacesMarkerArray = [];

            var googlePlacesData = function () {
                $http.get('/places').success(function (poiData) {

                    var placeLength = poiData.results.length;
                    for (var place = 0; place < placeLength; place++) {

                        var mapLat = poiData.results[place].geometry.location.lat;
                        var mapLng = poiData.results[place].geometry.location.lng;
                        var mapTitle = poiData.results[place].name;

                        googlePlacesMarker = L.marker([mapLat, mapLng]).toGeoJSON();

                        googlePlacesMarkerArray.push(googlePlacesMarker);
                    } //end of FOR loop

                    googlePlacesMarkerLayer = L.geoJson(googlePlacesMarkerArray, {
                        style: function (feature) {
                            return {
                                'title': mapTitle,
                                'marker-size': 'large',
                                //'marker-symbol': mapSymbol(),
                                'marker-symbol': 'marker',
                                'marker-color': '#00295A',
                                'riseOnHover': true,
                                'riseOffset': 250,
                                'opacity': 0.5,
                                'clickable': true
                            }
                        }
                    })
                });
            };

            //create toggle/filter functionality for Census Tract Data
            $scope.toggleCensusData = function () {
                if (!$scope.censusDataTractLayer) {
                    map.removeLayer(censusTractData);
                    map.removeLayer(dataBoxStaticPopup);
                } else {
                    map.addLayer(censusTractData);
                    map.addLayer(dataBoxStaticPopup);

                }
            };

            //create toggle/filter functionality for Census Tract Data
            $scope.toggleGooglePlacesData = function () {
                if ($scope.googlePlacesLayer) {
                    map.removeLayer(googlePlacesMarkerLayer);
                } else {
                    map.addLayer(googlePlacesMarkerLayer);
                }
            };

            //connects to the sidebar client controller to open the modal when 'home' is clicked on the sidebar
            $rootScope.$on('SHOW_MAP', function () {
                //mainMap.addTo(map);
                map.addLayer(mainMap);
                map.removeLayer(grayMap);
            });

            //connects to the sidebar client controller to close the modal when the sidebar is opened
            $rootScope.$on('HIDE_MAP', function () {
                grayMap.addTo(map);
                mainMap.removeLayer(map);
            });
        };

    }
]);
$(function() { 

    $("form#add_review_form").submit(function(){
                var formData = new FormData($(this)[0]);
                console.log(formData);
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request, Please wait...",
                 textonly: true,
                 textVisible: true
                    });
                $.ajax({
                    url: 'http://location.falcontechng.com/add_review.php',
                    type: 'POST',
                    data: formData,
                   // async: false,
                    success: function (data) {
                        console.log(data);
                        var response = data.response;
                        var message = data.message;
                        var imgpath =data.imgpath;
                        $.mobile.loading('hide');
                        if(response==='error')
                        {
                           alert(message);
                        }
                        else
                           goto_sucess('#usersuccesspage',message);
                           redirect_to('#cafeteria_details');

                        
                    },
                    error: function(data){
                         console.log(data);
                         $.mobile.loading('hide');
                         redirect_to('#adminerrorpage');
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                    });
                return false;
            });



	  });

var watchID;
        var geo;    // for the geolocation object
        var map;    // for the google map object
        var mapMarker;  // the google map marker object

        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;
        var my_location_lat;
        var my_location_lnt;
        var current_dest_lat;
        var current_dest_lnt;
        // position options
        var MAXIMUM_AGE = 200; // miliseconds
        var TIMEOUT = 300000;
        var HIGHACCURACY = true;
function getGeoLocation() {
            try {
                if( !! navigator.geolocation ) return navigator.geolocation;
                else return undefined;
            } catch(e) {
                return undefined;
            }
        }

function set_my_details(position){
    my_location_lat = position.coords.latitude;
    my_location_lnt = position.coords.longitude;
}
        function show_map(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlng = new google.maps.LatLng(lat, lon);
            my_location_lat = position.coords.latitude;
            my_location_lnt = position.coords.longitude;
            console.log("in settings function");
            console.log(my_location_lnt);
            if(map) {
                map.panTo(latlng);
                if(mapMarker)
                  mapMarker.setPosition(latlng);
                else{
                  mapMarker = new google.maps.Marker({
                    position: latlng,
                    title:"You are here."
                });
                }
            } else {
                var myOptions = {
                    zoom: 18,
                    center: latlng,

                    // mapTypeID --
                    // ROADMAP displays the default road map view
                    // SATELLITE displays Google Earth satellite images
                    // HYBRID displays a mixture of normal and satellite views
                    // TERRAIN displays a physical map based on terrain information.
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("map_where_am_i"), myOptions);
                map.setTilt(0); // turns off the annoying default 45-deg view

                mapMarker = new google.maps.Marker({
                    position: latlng,
                    title:"You are here."
                });
                mapMarker.setMap(map);
            }
        }

        function geo_error(error) {
            stopWatching();
            switch(error.code) {
                case error.TIMEOUT:
                    alert('Geolocation Timeout');
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('Geolocation Position unavailable');
                    break;
                case error.PERMISSION_DENIED:
                    alert('Geolocation Permission denied');
                    break;
                default:
                    alert('Geolocation returned an unknown error code: ' + error.code);
            }
        }

        function stopWatching() {
            if(watchID) geo.clearWatch(watchID);
            watchID = null;
        }

        function show_cordinates(position){
          my_location_lat = position.coords.latitude;
          my_location_lnt= position.coords.longitude;
        }
        function startWatching() {
            watchID = geo.watchPosition(show_map, geo_error, {
                enableHighAccuracy: HIGHACCURACY,
                maximumAge: MAXIMUM_AGE,
                timeout: TIMEOUT
            });
        }

        function handle_processsing(){
              watchID = geo.watchPosition(set_my_details, geo_error, {
                enableHighAccuracy: HIGHACCURACY,
                maximumAge: MAXIMUM_AGE,
                timeout: TIMEOUT
            });
        }

function where_im_i(){
	 if((geo = getGeoLocation())) {
                startWatching();
            } else {
                alert('Geolocation not supported.')
            }
}

function handle_current_location_settings(){
     if((geo = getGeoLocation())) {
        startWatching();
               //handle_processsing();
            } else {
                alert('Geolocation not supported.')
            }
}

function load_search_building(){
  if($('#building_name_search').val()=='')
        alert('Please enter the name of Building to search');
    else{
        var building_name = $('#building_name_search').val();
        var dataurl = 'http://location.falcontechng.com/list_search_building.php?name='+building_name;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    }); 
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    console.log(jsondata);
                    if(jsondata.length>0){
                    $('#building_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#building_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_building_details('+jsondata[i].building_list.id+')">'+jsondata[i].building_list.name+'</a></li>');
                       }
                       $('#building_content_listing_area').append('</ul>');
                         $('#building_content_listing_area').listview().listview('refresh');
                    redirect_to('#building_list');
                    }
                    else
                        alert('No Record Found!');
                }


            });
    }
}

function load_search_computer_lab(){
   if($('#computer_name_search').val()=='')
        alert('Please enter the Lab name to search');
    else{
        var lab_name = $('#computer_name_search').val();
        var dataurl = 'http://location.falcontechng.com/list_search_computer_lab.php?name='+lab_name;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    }); 
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    if(jsondata.length>0){
                      $('#computer_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#computer_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_computer_details('+jsondata[i].computer_lab.id+')">'+jsondata[i].computer_lab.name.toUpperCase()+'</a></li>');
                       }
                       $('#computer_content_listing_area').append('</ul>');
                         $('#computer_content_listing_area').listview().listview('refresh');
                    redirect_to('#computer_list');                   
                  }
                    else
                        alert('No Record Found!');
                }


            });
    }
}

function load_search_office() {
  // body...
   if($('#office_no_search').val()=='')
        alert('Please enter the Office number to search');
    else{
        var office_name = $('#office_no_search').val();
        var dataurl = 'http://location.falcontechng.com/list_search_office.php?office_no='+office_name;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    }); 
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    if(jsondata.length>0){
                      $('#office_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#office_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_office_details('+jsondata[i].staff_office.id+')">'+jsondata[i].staff_office.office_no.toUpperCase()+'</a></li>');
                       }
                       $('#office_content_listing_area').append('</ul>');
                         $('#office_content_listing_area').listview().listview('refresh');
                    redirect_to('#office_list');                    }
                    else
                        alert('No Record Found!');
                }


            });
    }
}

function load_search_lec_hall(){
   if($('#lechall_name_search').val()=='')
        alert('Please enter the name of Lecture Hall to search');
    else{
        var lec_name = $('#lechall_name_search').val();
        var dataurl = 'http://location.falcontechng.com/list_search_lecturehall.php?name='+lec_name;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    }); 
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    if(jsondata.length>0){
                    $('#lecture_hall_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#lecture_hall_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_lecture_hall_details('+jsondata[i].lecture_hall.id+')">'+jsondata[i].lecture_hall.name+'</a></li>');
                       }
                       $('#lecture_hall_content_listing_area').append('</ul>');
                         $('#lecture_hall_content_listing_area').listview().listview('refresh');
                    redirect_to('#lecture_hall_list');
                    }
                    else
                        alert('No Record Found!');
                }
            });
    }
}


function load_search_cafeteria() {
    if($('#cafe_name_search').val()=='')
        alert('Please enter the name of cafeteria to search');
    else{
        var cafe_name = $('#cafe_name_search').val();
        var dataurl = 'http://location.falcontechng.com/list_search_cafeteria.php?name='+cafe_name;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    }); 
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    if(jsondata.length>0){
                    $('#cafeteria_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafeteria_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_cafeteria_details('+jsondata[i].cafeteria_list.id+')">'+jsondata[i].cafeteria_list.name+'</a></li>');
                       }
                       $('#cafeteria_content_listing_area').append('</ul>');
                         $('#cafeteria_content_listing_area').listview().listview('refresh');
                    redirect_to('#cafeteria_list');
                    }
                    else
                        alert('No Record Found!');
                }


            });
    }
}

function load_all_building() {
  var dataurl = 'http://location.falcontechng.com/list_all_building.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#building_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#building_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_building_details('+jsondata[i].building_list.id+')">'+jsondata[i].building_list.name+'</a></li>');
                      
                       }
                       $('#building_content_listing_area').append('</ul>');
                         $('#building_content_listing_area').listview().listview('refresh');
                    redirect_to('#building_list');
                }


            });
}

function load_all_lec_hall(){
   var dataurl = 'http://location.falcontechng.com/list_all_lecture_hall.php';
    $.ajax({
      
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#lecture_hall_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#lecture_hall_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_lecture_hall_details('+jsondata[i].lecture_hall.id+')">'+jsondata[i].lecture_hall.name+'</a></li>');
                       }
                       $('#lecture_hall_content_listing_area').append('</ul>');
                         $('#lecture_hall_content_listing_area').listview().listview('refresh');
                    redirect_to('#lecture_hall_list');
                }


            });
}

function load_all_cafeteria(){
    var dataurl = 'http://location.falcontechng.com/list_all_cafeteria.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#cafeteria_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafeteria_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_cafeteria_details('+jsondata[i].cafeteria_list.id+')">'+jsondata[i].cafeteria_list.name+'</a></li>');
                      
                       }
                       $('#cafeteria_content_listing_area').append('</ul>');
                         $('#cafeteria_content_listing_area').listview().listview('refresh');
                    redirect_to('#cafeteria_list');
                }


            });
}

function load_all_computer_lab(){
  var dataurl = 'http://location.falcontechng.com/list_all_computer_lab.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                      console.log(jsondata);
                    $('#computer_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#computer_content_listing_area').append('<li data-theme="a"><a href="#" onclick="load_computer_details('+jsondata[i].computer_lab.id+')">'+jsondata[i].computer_lab.name.toUpperCase()+'</a></li>');
                       }
                       $('#computer_content_listing_area').append('</ul>');
                         $('#computer_content_listing_area').listview().listview('refresh');
                    redirect_to('#computer_list');
                }


            });
}

function load_all_office(){
    var dataurl = 'http://location.falcontechng.com/list_all_office.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                      console.log(jsondata);
                    $('#office_content_listing_area').html('<ul data-theme="b" data-role="listview">');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#office_content_listing_area').append('<li data-theme="b"><a href="#" onclick="load_office_details('+jsondata[i].staff_office.id+')">'+jsondata[i].staff_office.office_no.toUpperCase()+'</a></li>');
                       }
                       $('#office_content_listing_area').append('</ul>');
                         $('#office_content_listing_area').listview().listview('refresh');
                    redirect_to('#office_list');
                }


            });
}


function load_lecture_hall_details(id){
  var dataurl = 'http://location.falcontechng.com/get_lecture_hall_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Lecture Hall Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#lecture_hall_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#lecture_hall_details_area').append('<p>'+jsondata[i].lecture_hall.name.toUpperCase()+' Lecture Hall</p><p>'+jsondata[i].lecture_hall.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].lecture_hall.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].lecture_hall.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].lecture_hall.lat+','+jsondata[i].lecture_hall.lng+')" >Get Direction</button>');
                       }
                      
                    redirect_to('#lecture_hall_details');
                }


            });
}
function load_office_details(id){
   var dataurl = 'http://location.falcontechng.com/get_office_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Office Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#office_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#office_details_area').append('<p>'+jsondata[i].staff_office.staff_name.toUpperCase()+'\'S Office</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].staff_office.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].staff_office.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].staff_office.lat+','+jsondata[i].staff_office.lng+')" >Get Direction</button>');
                       }
                      
                    redirect_to('#office_details');
                }


            });
}


function getlibrary_info(){
    var dataurl = 'http://location.falcontechng.com/getlibrary_info.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Library information.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    console.log(jsondata);
                    console.log(jsondata.library.cover_pics);
                    $('#library_details_area').html('');
                    $('#library_details_area').append('<img src="'+jsondata.library.cover_pics+'" alt="Library Cover Picture" class="banner"><p>'+jsondata.library.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata.library.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata.library.closing_hour+'</p></div><div class="ui-block-a"><p>Email: '+jsondata.library.email+'</p></div><div class="ui-block-b"></div><div class="ui-block-a"><p>Website: '+jsondata.library.website+'</p></div><div class="ui-block-b"><p></p></div></div><button class="ui-btn" onclick="getmylocation('+jsondata.library.lat+','+jsondata.library.lng+')" >Get Direction</button>');
                      
                    redirect_to('#library');
                }


            });
}

function load_building_details(id){
  var dataurl = 'http://location.falcontechng.com/get_building_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Building Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#building_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#building_details_area').append('<img src="'+jsondata[i].building_list.cover_pics+'" alt="Building Cover Picture" class="banner"><p>'+jsondata[i].building_list.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].building_list.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].building_list.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].building_list.lat+','+jsondata[i].building_list.lng+')" >Get Direction</button>');
                       }
                      
                    redirect_to('#building_details');
                }


            });
}


function load_gym_details(){
  var dataurl = 'http://location.falcontechng.com/get_gym_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Sport Center Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#gym_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#gym_details_area').append('<img src="'+jsondata[i].gym_list.cover_pics+'" alt="GYM Cover Picture" class="banner"><p>'+jsondata[i].gym_list.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].gym_list.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].gym_list.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].gym_list.lat+','+jsondata[i].gym_list.lng+')" >Get Direction</button>');
                       }
                      
                    redirect_to('#gym');
                }


            });
}


function load_church_details(){
  var dataurl = 'http://location.falcontechng.com/get_church_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Church Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#church_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#church_details_area').append('<img src="'+jsondata[i].church_list.cover_pics+'" alt="Church Cover Picture" class="banner"><p>'+jsondata[i].church_list.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].church_list.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].church_list.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].church_list.lat+','+jsondata[i].church_list.lng+')" >Get Direction</button>');
                       }
                      
                    redirect_to('#church');
                }


            });
}


function load_mosque_details(){
  var dataurl = 'http://location.falcontechng.com/get_mosque_details.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Mosque Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#mosque_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#mosque_details_area').append('<img src="'+jsondata[i].mosque_list.cover_pics+'" alt="Mosque Cover Picture" class="banner"><p>'+jsondata[i].mosque_list.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].mosque_list.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].mosque_list.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].mosque_list.lat+','+jsondata[i].mosque_list.lng+')" >Get Direction</button>');
                       }
                      
                    redirect_to('#mosque');
                }


            });
}


function load_busstop_details(){
  var dataurl = 'http://location.falcontechng.com/list_all_busstop.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Bus Stop Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                   $('#busstoplist').html('');
                    $('#busstop_count').html(jsondata.length);
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#busstoplist').append('<div data-role="collapsible"><h1>'+jsondata[i].busstop.name+'</h1><p><div class="content" class="ui-content"><div class="ui-grid-a">'+jsondata[i].busstop.name+'</div><button onclick="getmylocation('+jsondata[i].busstop.lat+','+jsondata[i].busstop.lng+')" class="ui-btn">Get Direction</button></p></div></div>');
                      
                       }
                      $('#busstoplist').find('div[data-role=collapsible]').collapsible({refresh:true});
                      $('#busstoploading').hide();
                      
                    redirect_to('#busstop');
                }


            });
}


function load_computer_details(id){
   var dataurl = 'http://location.falcontechng.com/get_computer_details.php?id='+id;
    $.ajax({
        url: dataurl,
        //timeout: 5000,
        beforeSend: function() {
        $.mobile.loading('show', {
         theme: "a",
         text: "Loading Computer Lab Details.. please wait",
         textonly: true,
         textVisible: true
            });
        },
        error: function(jqXHR, textStatus) {
            console.log(textStatus);
            $.mobile.loading('hide');
            redirect_to('#errorpage');
        },

       fail: function(jqXHR, textStatus, errorThrown){
           $.mobile.loading('hide');
           console.log(textStatus);
            redirect_to('#errorpage');
              },
      success: function (jsondata) {
          $.mobile.loading('hide');
          $('#computer_details_area').html('');
             for (var i = 0; i < jsondata.length; i++) {
             $('#computer_details_area').append('<p>'+jsondata[i].computer_lab.name.toUpperCase()+'</p><p>'+jsondata[i].computer_lab.brief_info+'</p><div class="ui-grid-a"><div class="ui-block-a"><p>Opening Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].computer_lab.opening_hour+'</p></div><div class="ui-block-a"><p>Closing Hour</p></div><div class="ui-block-b"><p>'+jsondata[i].computer_lab.closing_hour+'</p></div><button class="ui-btn" onclick="getmylocation('+jsondata[i].computer_lab.lat+','+jsondata[i].computer_lab.lng+')" >Get Direction</button>');
             }
          redirect_to('#computer_details');
      }


    });
}
function load_cafeteria_details(id){
   // var cafe_rating = getcafeterial_rating(id);
     var dataurl = 'http://location.falcontechng.com/get_cafeteria_details.php?id='+id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Loading Cafeteria Details.. please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    //console.log(jsondata.avg_rating);
                    $.mobile.loading('hide');
                    $('#cafeteria_details_area').html('');
                       for (var i = 0; i < jsondata.length; i++) {
                       $('#cafeteria_details_area').append('<img src="'+jsondata[i].cafeteria_list.cover_pics+'" alt="Cafeteria Cover Picture" class="banner">Ratings: '+getcafeterial_rating(jsondata[i].avg_rating)+' <p>'+jsondata[i].cafeteria_list.brief_info+'</p><button class="ui-btn" onclick="getmylocation('+jsondata[i].cafeteria_list.lat+','+jsondata[i].cafeteria_list.lng+')" >Get Direction</button>');
                       $('#review_cafeteria_id').val(jsondata[i].cafeteria_list.id);
                       }
                      // $('#cgdb').button();
                    redirect_to('#cafeteria_details');
                }


            });
}

function getcafeterial_rating(message){
    ratings ='No ratings yet!';
    message = Math.round(message);
    console.log(message);
    if(message=='1')
     ratings = '✭';
    else if(message=='2')
     ratings = '✭✭';
    else if(message=='3')
     ratings = '✭✭✭';
    else if(message=='4')
     ratings =  '✭✭✭✭';
    else if(message=='5')
     ratings = '✭✭✭✭✭';
    return ratings;
}

function load_atm_list(){
   var dataurl = 'http://location.falcontechng.com/list_all_atm.php';
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                    $.mobile.loading('hide');
                    $('#atmlist').html('');
                    $('#atm_count').html(jsondata.length);
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#atmlist').append('<div data-role="collapsible"><h1>'+jsondata[i].atm_list.name+'</h1><p><div class="content" class="ui-content"><div class="ui-grid-a"><div class="ui-block-a"><p>Currency available</p></div><div class="ui-block-b"><p>'+jsondata[i].atm_list.currency+'</p></div><div class="ui-block-a"><p>Brief Info</p></div><div class="ui-block-b"><p>'+jsondata[i].atm_list.info+'</p></div></div><button onclick="getmylocation('+jsondata[i].atm_list.lat+','+jsondata[i].atm_list.lng+')" class="ui-btn">Get Direction</button></p></div></div>');
                      
                       }
                      $('#atmlist').find('div[data-role=collapsible]').collapsible({refresh:true});
                      $('#atmloading').hide();
                      return true;
                }


            });
}



function load_review_list(){
   var id = $('#review_cafeteria_id').val();
   var dataurl = 'http://location.falcontechng.com/list_all_review.php?id=' + id;
    $.ajax({
                url: dataurl,
                //timeout: 5000,
                beforeSend: function() {
                $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
                },
                error: function(jqXHR, textStatus) {
                    console.log(textStatus);
                    $.mobile.loading('hide');
                    redirect_to('#errorpage');
                },

                fail: function(jqXHR, textStatus, errorThrown){
                    $.mobile.loading('hide');
                    console.log(textStatus);
                    redirect_to('#errorpage');
                },

                success: function (jsondata) {
                  console.log(jsondata);
                  console.log(jsondata.length);
                  if(jsondata.length>0){
                    console.log("im running this!");
                    $.mobile.loading('hide');
                    $('#reviewlist').html('');
                    $('#review_count').html(jsondata.length);
                       for (var i = 0; i < jsondata.length; i++) {
                        $('#reviewlist').append('<div data-role="collapsible"><h1>'+jsondata[i].review_list.review_title+'</h1><p>'+jsondata[i].review_list.reviewer_name+' gave this cafeteria '+getcafeterial_rating(jsondata[i].review_list.rating_scale)+' stars and said <br> <i> &quot;'+jsondata[i].review_list.review+'&quot; </i> <br> Review date: '+jsondata[i].review_list.date_added+'</p></div></div>');
                       }
                      $('#reviewlist').find('div[data-role=collapsible]').collapsible({refresh:true});
                      $('#reviewloading').hide();
                    redirect_to('#review_details');
                  }
                  else
                  { 
                    $('#no_review_yet').html("No Reviews yet for the Cafeteria. Be the first to comment!");
                    $.mobile.loading('hide');
                    $('#reviews_Avail').html('');
                    redirect_to('#review_details');
                  }

                }


            });
}


function load_direction(lat,lng){
    console.log(lat);
    console.log(lng);
    $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
    handle_current_location_settings();
    stopWatching();
  var dest = new google.maps.LatLng(lat, lng);
  console.log(my_location_lat);
  console.log(my_location_lnt);
  var fromloc = new google.maps.LatLng(my_location_lat, my_location_lnt);
  console.log(fromloc);
   directionsDisplay = new google.maps.DirectionsRenderer();
  var cyprus = new google.maps.LatLng(35.1439106, 33.909568);
  var mapOptions = {
    zoom:9,
    center: dest
  };
  map = new google.maps.Map(document.getElementById('direction_map_loc'), mapOptions);
  directionsDisplay.setMap(map);
  var request = {
      origin:fromloc,
      destination:dest,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    console.log(response);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });

  show_your_location();
  $.mobile.loading('hide');
  redirect_to('#directions_map');
  
}

function show_your_location() {
            var latlng = new google.maps.LatLng(my_location_lat, my_location_lnt);

            if(map) {
                map.panTo(latlng);
                map.setTilt(0); // turns off the annoying default 45-deg view
                console.log('running');
                mapMarker = new google.maps.Marker({
                    position: latlng,
                    title:"You are here."
                });
                mapMarker.setMap(map);
                mapMarker.setPosition(latlng);

            }
        }
function getmp() {
    if((geo = getGeoLocation())) {
               watchID = geo.watchPosition(show_cordinates, geo_error, {
                enableHighAccuracy: HIGHACCURACY,
                maximumAge: MAXIMUM_AGE,
                timeout: TIMEOUT
            });
            } else {
                alert('Geolocation not supported.')
            }

            
        }
function getmylocation (lat,lng) {
    // body...
     $.mobile.loading('show', {
                 theme: "a",
                 text: "Processing Request... please wait",
                 textonly: true,
                 textVisible: true
                    });
/*if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {*/
     

if((geo = getGeoLocation())) {
                getmp();
            } else {
                alert('Geolocation not supported.')
            }

 var pos = new google.maps.LatLng(my_location_lat,
                                       my_location_lnt);
 console.log(pos);
current_dest_lat = lat;
current_dest_lnt = lng;
var dest = new google.maps.LatLng(lat, lng);
makedirectionrequest(pos,dest,1,"direction_map_loc");
 // show_your_location();
  $.mobile.loading('hide');
  redirect_to('#directions_map');

   /* }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }*/
}
// Try HTML5 geolocation
  
function makedirectionrequest(pos,dest,mode,mapdiv_id){
  directionsDisplay = new google.maps.DirectionsRenderer();
  //var cyprus = new google.maps.LatLng(35.1439106, 33.909568);
  var mapOptions = {
    zoom:6,
    center: dest
  };
  map = new google.maps.Map(document.getElementById(mapdiv_id), mapOptions);
  directionsDisplay.setMap(map);
  if(mode == 1){
    var request = {
      origin:pos,
      destination:dest,
      travelMode: google.maps.TravelMode.WALKING
  };  
  }
  else if(mode == 2){
    var request = {
      origin:pos,
      destination:dest,
      travelMode: google.maps.TravelMode.DRIVING
  };
  }
  else if(mode == 3){
     var request = {
      origin:pos,
      destination:dest,
      travelMode: google.maps.TravelMode.BICYCLING
  };  
  }
  
  directionsService.route(request, function(response, status) {
    console.log(response);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    else if(status == google.maps.DirectionsStatus.ZERO_RESULTS)
    {
      alert("Direction service could not find a route. please check that you have location service enabled on your device!");
    }
  });
}
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your Device doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };
    var mapOptions = {
    zoom:6,
    center: new google.maps.LatLng(60, 105)
  };
map = new google.maps.Map(document.getElementById('direction_map_loc'), mapOptions);
  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function change_direction_mode(){
var sopton = $('#cmchange option:selected').val();
alert("Processing your request. please wait");
var pos = new google.maps.LatLng(my_location_lat,my_location_lnt);
var dest = new google.maps.LatLng(current_dest_lat, current_dest_lnt);
makedirectionrequest(pos,dest,sopton,"direction_map_loc");
}

function download_manual(){
	window.open("http://location.falcontechng.com/user_manual.php","_system");
}

function errordialog(newPage) {
      $("body").pagecontainer("change", newPage, {transition: "pop"});
  	}

  	function redirect_to(newPage) {
      $("body").pagecontainer("change", newPage, {transition: "pop"});
  	}
    function goto_sucess(newPage,message) {
      $('#usersucessmsg').html(message);
      $("body").pagecontainer("change", newPage, {transition: "pop"});
    }
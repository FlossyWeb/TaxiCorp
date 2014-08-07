var taxi = $.localStorage.getItem('taxi');
var tel = $.localStorage.getItem('tel');
var email = $.localStorage.getItem('email');
var civil = $.localStorage.getItem('civil');
var nom = $.localStorage.getItem('nom');
var prenom = $.localStorage.getItem('prenom');
var siret = $.localStorage.getItem('siret');
var station = $.localStorage.getItem('station');
var group = $.localStorage.getItem('group');
var mngid = $.localStorage.getItem('mngid');
var pass = $.localStorage.getItem('pass');
var idcourse = $.sessionStorage.setItem('idcourse', '');
var idcourseUrg = $.sessionStorage.setItem('idcourseUrg', '');
var rdv = $.sessionStorage.setItem('rdv', '');
var com = $.sessionStorage.setItem('com', '');
var cell = $.sessionStorage.setItem('cell', '');
var cmd = $.sessionStorage.setItem('cmd', 0);
var query_string = $.sessionStorage.setItem('query_string', '');
var delay = 10;

// Lecteur audio
var my_media = null;
var mediaTimer = null;

// Scanner
var scanner;

// Detect wether it is an App or WebApp
var app;

// getLocation & secureCall
var lat = 0;
var lng = 0;

var mobileDemo = { 'center': '43.615945,3.876743', 'zoom': 10 };
		
////////////////////////////////////////////////////////////
//$(document).on( 'pagebeforecreate', '#directions_map', function() {
$( '#directions_map' ).live( 'pagebeforeshow',function(event){
	$("#infos_map").empty();
	var idcourse = $.sessionStorage.getItem('idcourse');
	var rdv = $.sessionStorage.getItem('rdv');
	var com = $.sessionStorage.getItem('com');
	var cell = $.sessionStorage.getItem('cell');
	var cmd = $.sessionStorage.getItem('cmd');
	//document.getElementById('to').value = rdv;
	$('#to').val(rdv);

	var infos = '<p>';
	if (cell != '')
	{
		infos += '<a data-ajax="false" href="tel:' + cell + '" class="ui-btn ui-corner-all ui-shadow ui-icon-phone ui-btn-icon-left">Joindre le client</a>';
	}
	if (com != '')
	{
		infos += '<b>Infos RDV : ' + com + '</b></br>';
	}
	if (idcourse != '')
	{
		infos += '<br>N&deg; de course : <b>' + idcourse + '</b>';
	}
	infos += '</p>';
	$("#infos_map").append(infos);			
	if (rdv != '')
	{
		$.post("https://ssl14.ovh.net/~taxibleu/client/in_app_calls.php", { map: 'true', cmd: cmd, rdv: rdv, com: com, idcourse: idcourse, cell: cell, pass: pass, dep: '34' }, function(data){
			$("#infos_map").append(data);
			$("#infos_map").trigger('create');
			//alert(data);
		});
	}
});

$('#directions_map').live('pagecreate', function() {
	demo.add('directions_map', function() {
		$('#map_canvas_1').gmap({'center': mobileDemo.center, 'zoom': mobileDemo.zoom, 'disableDefaultUI':true, 'callback': function() {
			var self = this;
			self.set('getCurrentPosition', function() {
				self.refresh();
				self.getCurrentPosition( function(position, status) {
					if ( status === 'OK' ) {
						var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
						self.get('map').panTo(latlng);
						self.search({ 'location': latlng }, function(results, status) {
							if ( status === 'OK' ) {
								$('#from').val(results[0].formatted_address);
								var rdv = $.sessionStorage.getItem('rdv');
								//document.getElementById('to').value = rdv;
								if (rdv != '')
								{
									$('#submit').trigger('click');
								}
							}
						});
					} else {
						alert('Unable to get current position');
					}
				},{enableHighAccuracy:true, maximumAge:Infinity});
			});
			$('#submit').click(function() {
				self.displayDirections({ 'origin': $('#from').val(), 'destination': $('#to').val(), 'travelMode': google.maps.DirectionsTravelMode.DRIVING }, { 'panel': document.getElementById('directions')}, function(response, status) {
					( status === 'OK' ) ? $('#results_gps').show() : $('#results_gps').hide();
				});
				return false;
			});
		}});
	}).load('directions_map');
				
});

$('#directions_map').live('pageshow', function() {
	demo.add('directions_map', $('#map_canvas_1').gmap('get', 'getCurrentPosition')).load('directions_map');
});

$('#toolate').live('pagecreate', function() {
	var idcourse = $.sessionStorage.getItem('idcourse');
	var late = '<p style="color:#F00; font-size: large;"><b>D&eacute;sol&eacute; mais la course ' + idcourse + ' &agrave; &eacute;t&eacute; prise par un autre taxi.</b></p>';
	$("#late_cont").empty().append(late);			
});

$('#delayPop').live( 'pagebeforeshow',function(event) {
	//$("#hideCall").hide("fast");
	$("#delayConf").hide("fast");
	//$('select#delay').val('d&eacute;lai');
	//$('select#delay').selectmenu('refresh', true);
});

$( '#planning' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/client/in_app_calls.php", { planning: 'true', tel: tel, pass: pass, dep: '34' }, function(data){
		$.mobile.loading( "show" );
		$("#plan_cont").empty().append(data);
		$("#plan_cont").trigger('create');
		//alert(data);
	}).done(function() { $.mobile.loading( "hide" ); });
});

$( '#history' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/client/in_app_calls.php", { history: 'true', tel: tel, pass: pass, dep: '34' }, function(data){
		$.mobile.loading( "show" );
		$("#hist_cont").empty().append(data);
		$("#hist_cont").trigger('create');
		//alert(data);
	}).done(function() { $.mobile.loading( "hide" ); });
});

$( '#infos' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/client/in_app_calls.php", { infos: 'true', pass: pass, dep: '34' }, function(data){
		$.mobile.loading( "show" );
		$("#infos_cont").empty().append(data);
		$("#infos_cont").trigger('create');
		//alert(data);
	}).done(function() { $.mobile.loading( "hide" ); });
});

$('#manage').live('pagecreate', function() {
	var dec_nom = $('#nom').html(nom).text();
	var dec_prenom = $('#prenom').html(prenom).text();
	var dec_station = $('#station').html(station).text();
	$('#login').val(tel);
	$('#nom').val(dec_nom);
	$('#prenom').val(dec_prenom);
	$('#taxi').val(taxi);
	$('#tel').val(tel);
	$('#email').val(email);
	$('#siret').val(siret);
	$('#station').val(dec_station);
	$('#log').val(tel);
	$.post("https://ssl14.ovh.net/~taxibleu/client/billing.php", { taxi: taxi, pass: pass, dep: '34', mngid: mngid }, function(data){
		$("#billing").empty().append(data);
		//alert(data);
	});
});

function getLocation()
{
	if (navigator.geolocation)
	{
		if (navigator.userAgent.toLowerCase().match(/android/)) {
			navigator.geolocation.getCurrentPosition(get_coords, showError,{enableHighAccuracy:false, maximumAge:0});
		}
		else {
			navigator.geolocation.getCurrentPosition(get_coords, showError,{enableHighAccuracy:true, maximumAge:0});
		}
	}
	else {
		alert("Localisation impossible.");
	}
	setTimeout('getLocation()', 30000); // Every thirty seconds you check geolocation...
}

function stopWatch()
{
	navigator.geolocation.clearWatch(watchId);
}

function showPosition(position)
{
	var latlon=position.coords.latitude+","+position.coords.longitude;
	
	var img_url="http://maps.googleapis.com/maps/api/staticmap?center="
	+latlon+"&zoom=14&size=600x400&sensor=false&key=AIzaSyCvL4a4-LKLUXJrTwpJ4_UnkmtZSGgrVWg";
	document.getElementById("mapholder").innerHTML="<img src='"+img_url+"' />";
}			  
function showError(error)
{
	var x=document.getElementById("ePopResults");
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
		  x.innerHTML="<strong>Vous avez refus&eacute; l&rsquo;acc&egrave;s &agrave; la G&eacute;olocalisation.</strong>"
		  break;
		case error.POSITION_UNAVAILABLE:
		  x.innerHTML="<strong>G&eacute;olocalisation indisponible, veuillez regarder dans l&rsquo;aide ou activer le service dans les reglages de votre appareil.</strong>"
		  break;
		case error.TIMEOUT:
		  x.innerHTML="<strong>La demande de G&eacute;olocalisation a expir&eacute;(user location request timed out).</strong>"
		  break;
		case error.UNKNOWN_ERROR:
		  x.innerHTML="<strong>Erreur inconnue de G&eacute;olocalisation (unknown error occurred).</strong>"
		  break;
		default:
		  x.innerHTML="<strong>Veuillez activer la G&eacute;olocalisation, si ce message revient, un red&eacute;marrage du smartphone peut-&ecirc;tre n&eacute;c&eacute;ssaire.</strong>"
	}
	// Fall back to no options and try again for Android to work.
	navigator.geolocation.getCurrentPosition(get_coords, function(){
		$( "#errorPop" ).popup( "open", { positionTo: "window" } );
	});
}			  
function get_coords(position) 
{
	lat = position.coords.latitude;
	lng = position.coords.longitude;
	//var x=document.getElementById("results");
	//x.innerHTML="lat = " + lat + " - lng = " +lng;
	//alert('taxi: ' + taxi + ' tel: ' + tel + ' pass=' + pass);
	$.post("https://ssl14.ovh.net/~taxibleu/client/insert_app_cab_geoloc.php?lat="+lat+"&lng="+lng, { taxi: taxi, tel: tel, email: email, pass: pass, dep: '34' }); 
}

function update()
{
	var dispo = $.sessionStorage.getItem('dispo');
	$.post("https://ssl14.ovh.net/~taxibleu/server/get_app_drive.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: '34', mngid: mngid, group: group }, function(data){ 
		$("#screen_job").empty().append(data);
		if (data != 0)
		{
			$("#warn").empty().append('<a href="#jobs_taker"><img src="visuels/Alerte_course_flat.png" width="100%"/></a>');
			//$("#warn_home").empty().append('<a href="#jobs_taker"><img src="visuels/Alerte_course_flat.png" width="100%"/></a>');
			document.getElementById("play").play();
			//document.getElementById("play_home").play();
			//navigator.notification.beep(2);
			navigator.notification.vibrate(3600);
		}
		else
		{
			$("#warn").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			//$("#warn_home").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			document.getElementById("play").pause();
			//document.getElementById("play_home").pause();
		}
	});

	$.post("https://ssl14.ovh.net/~taxibleu/server/get_app_drive.php?cmd=1", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: '34', mngid: mngid, group: group }, function(data){ 
		$("#screen_job_cmd").empty().append(data);
		if (data != 0)
		{
			$("#warn_cmd").empty().append('<img src="visuels/Alerte_course_flat.png" width="100%"/>');
			document.getElementById("play_cmd").play();
			//navigator.notification.beep(2);
			navigator.notification.vibrate(3600);
		}
		else
		{
			$("#warn_cmd").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			document.getElementById("play_cmd").pause();
		}
	});

setTimeout('update()', 2000);
}

function dispo()
{
	$.post("https://ssl14.ovh.net/~taxibleu/client/dispo_app.php?check=1", { taxi: taxi, tel: tel, pass: pass, dep: '34' }, function(data){ 
		var display = '';
		if (data.dispo == 1)
		{
			display = '<a href="#home" onClick="Dispo_Off()" style=""><img src="visuels/DispoOn_flat.png" width="100%"/></a>';
		}
		else {
			display = '<a href="#jobs_taker" onClick="Dispo_On()" style=""><img src="visuels/DispoOff_flat.png" width="100%"/></a>';
		}
		$("#dispo").empty().append(display);
		$("#dispo_jobs").empty().append(display);
		$("#dispo_cmd").empty().append(display);
		$.sessionStorage.setItem('dispo', data.dispo);
		//alert(data.dispo);
	}, "json"); 
	/*
	$.post("dispo.php?check=1&p=home", {}, function(data){ $("#dispo").each(function () {
				$(this).empty().append(data);
			});
	}); 
	*/
	setTimeout('dispo()', 10000); // Every ten seconds you check dispo for real or oldies...
}
function Dispo_On()
{
	$.post("https://ssl14.ovh.net/~taxibleu/client/dispo_app.php?dispo=1", { taxi: taxi, tel: tel, pass: pass, dep: '34' });
	$("#dispo").empty().append('<a href="#home" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$("#dispo_jobs").empty().append('<a href="#jobs_taker" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$("#dispo_cmd").empty().append('<a href="#jobs_taker" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$.sessionStorage.setItem('dispo', '1');
}
function Dispo_Off()
{
	$.post("https://ssl14.ovh.net/~taxibleu/client/dispo_app.php?dispo=0", { taxi: taxi, tel: tel, pass: pass, dep: '34' }); 
	$("#dispo").empty().append('<a href="#home" onClick="Dispo_On()"><img src="visuels/DispoOff_flat.png" width="100%"/></a>');
	$("#dispo_jobs").empty().append('<a href="#jobs_taker" onClick="Dispo_On()"><img src="visuels/DispoOff_flat.png" width="100%"/></a>');
	$("#dispo_cmd").empty().append('<a href="#jobs_taker" onClick="Dispo_On()"><img src="visuels/DispoOff_flat.png" width="100%"/></a>');
	$.sessionStorage.setItem('dispo', '0');
}

function playAudio(src) {
	// Créer l'objet Media à partir de src
	my_media = new Media(src, onSuccess, onError);

	// Lire le clip audio
	my_media.play();
	/*
	// Récupérer la positon courante une fois par seconde
	if (mediaTimer == null) {
		mediaTimer = setInterval(function() {
			// Récupérer la positon de my_media
			my_media.getCurrentPosition(
				// Callback en cas de succès
				function(position) {
					if (position > -1) {
						setAudioPosition((position) + " sec");
					}
				},
				// Callback en cas d'erreur
				function(e) {
					console.log("Erreur lors de la récupération de la position = " + e);
					setAudioPosition("Erreur : " + e);
				}
			);
		}, 1000);
	}
	*/
}

// Mettre en pause la lecture audio
function pauseAudio() {
	if (my_media) {
		my_media.pause();
	}
}

// Arrêter la lecture audio
function stopAudio() {
	if (my_media) {
		my_media.stop();
	}
	//clearInterval(mediaTimer);
	//mediaTimer = null;
}

function Sound_On()
{
	$("#sound").empty().append('<a href="#jobs_taker" onClick="Sound_Off()"><img src="visuels/sound_on.png" width="20"/></a>');
	$("#sound_cmd").empty().append('<a href="#cmd" onClick="Sound_Off()"><img src="visuels/sound_on.png" width="20"/></a>');
	$("#player").empty().append('<audio id="play" loop="loop" preload="auto" style="display:none" ><source src="http://www.taxibleuservices.com/client/sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	$("#player_cmd").empty().append('<audio id="play_cmd" loop="loop" preload="auto" style="display:none" ><source src="http://www.taxibleuservices.com/client/sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	$("#player_home").empty().append('<audio id="play_home" loop="loop" preload="auto" style="display:none" ><source src="http://www.taxibleuservices.com/client/sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	//$.sessionStorage.setItem('sound', '1');
}
function Sound_Off()
{
	$("#sound").empty().append('<a href="#jobs_taker" onClick="Sound_On()"><img src="visuels/sound_off.png" width="20"/></a>');
	$("#sound_cmd").empty().append('<a href="#cmd" onClick="Sound_On()"><img src="visuels/sound_off.png" width="20"/></a>');
	$("#player").empty();
	$("#player_cmd").empty();
	$("#player_home").empty();
	//$.sessionStorage.setItem('sound', '0');
}
function footer()
{
	$.post("https://ssl14.ovh.net/~taxibleu/client/footer_app.php", { dep: '34' }, function(data) {
		for (i=1; i<9; i++) {
			$('#footer_cont' + i).empty().append(data);
		}
	});
}
function addCalendar(date, rdv, com, idcourse, cell)
{
	var startDate = new Date(date.replace(/-/g, '/'));
	var diff = 60; // difference in minutes
	var endDate = new Date(startDate.getTime() + diff*60000);
	var title = "Course en commande";
	var location = rdv;
	var notes = 'Infos RDV : ' + com + ' - Identifiant de la course : ' + idcourse + ' - Tel client : ' + cell;
	var success = function(message) { alert("AJOUT EVENEMENT AU CALENDRIER: " + JSON.stringify(message)); };
	var error = function(message) { alert("Erreur: " + message); };
	// create
	window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
}
function histoMap(rdv, idcourse, com, cell)
{
	$.sessionStorage.setItem('rdv', rdv);
	$.sessionStorage.setItem('idcourse', idcourse);
	$.sessionStorage.setItem('com', com);
	$.sessionStorage.setItem('cell', cell);
	$.sessionStorage.setItem('cmd', 0);
	$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
}
function planMap(rdv, idcourse, com, cell)
{
	$.sessionStorage.setItem('rdv', rdv);
	$.sessionStorage.setItem('idcourse', idcourse);
	$.sessionStorage.setItem('com', com);
	$.sessionStorage.setItem('cell', cell);
	$.sessionStorage.setItem('cmd', 1);
	$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
}
function justify(when, rdv, comments, destadd, cell)//justify(\''.$when.'\', \''.$rdv.'\', \''.$comments.'\', \''.$destadd.'\', \''.$cell.'\
{
	$.post("https://ssl14.ovh.net/~taxibleu/client/justify.php", { when: when, rdv: rdv, comments: comments, destadd: destadd, cell: cell, dep: '34', pass: pass, email: email }, function(data){
		$.mobile.loading( "show" );
		alert(data);
		//window.plugins.childBrowser.showWebPage('http://www.taximedia.fr', { showLocationBar: true });
	}).done(function() { $.mobile.loading( "hide" ); });
}
// diaryCall for direct job that open #delay
function delayCall(query_string)
{
	$.sessionStorage.setItem('query_string', query_string);
	$.mobile.pageContainer.pagecontainer("change", "#delayPop", { transition: "slide"} );
}
/*
$(document).on( "click", "#directCall", function() {
	$.mobile.loading( "show" );
});
$(document).on( "click", "#diaryLink", function() {
	$.mobile.loading( "show" );
});
$(document).on( "click", ".hide-page-loading-msg", function() {
	$.mobile.loading( "hide" );
});
*/
function directCall()
{
	$.mobile.loading( "show" );
	// Getting query_string using sessionStorage
	var dataDiary = $.sessionStorage.getItem('query_string');
	// Modifying the link 2 diary
	//var link2diary = document.getElementById('link2diary');
	query_string = dataDiary + '&delay=' + delay;
	$.sessionStorage.setItem('query_string', query_string);
	$.post("https://ssl14.ovh.net/~taxibleu/server/diary_app_dcvp.php?dep=34", query_string, function(data){ 
		switch (data.location) {
			 case '#directions_map':
				//alert('in direction case');
				$.sessionStorage.setItem('rdv', data.rdv);
				$.sessionStorage.setItem('idcourse', data.idcourse);
				$.sessionStorage.setItem('com', data.com);
				$.sessionStorage.setItem('cell', data.cell);
				$.sessionStorage.setItem('cmd', 0);
				$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
				 
				 break;
			 case '#toolate':
				$.mobile.pageContainer.pagecontainer("change", "#toolate", { transition: "slide"} );
				$.sessionStorage.setItem('idcourse', data.idcourse);
				 
				 break;
			 default: 
				$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
				 
				 break;
		}					
	}, "json");
}
// Diary call when accepting cmd jobs or refusing jobs
function diaryCall(query_string)
{
	$.mobile.loading( "show" );
	$.post("https://ssl14.ovh.net/~taxibleu/server/diary_app_dcvp.php?dep=34", query_string, function(data){ 
		switch (data.location) {
			 case '#directions_map':
				//alert('in direction case');
				$.sessionStorage.setItem('rdv', data.rdv);
				$.sessionStorage.setItem('idcourse', data.idcourse);
				$.sessionStorage.setItem('com', data.com);
				$.sessionStorage.setItem('cell', data.cell);
				$.sessionStorage.setItem('cmd', 1);
				$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
				 
				 break;
			 case '#toolate':
				$.mobile.pageContainer.pagecontainer("change", "#toolate", { transition: "slide"} );
				$.sessionStorage.setItem('idcourse', data.idcourse);
				 
				 break;
			 default: 
				$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
				 
				 break;
		}					
	}, "json");
}

// Urgence call => Danger zone
function getLocationOnce()
{
	if (navigator.geolocation)
	{
		$.mobile.loading( "show" );
		if (navigator.userAgent.toLowerCase().match(/android/)) {
			navigator.geolocation.getCurrentPosition(secureCall, showError,{enableHighAccuracy:false, maximumAge:0});
		}
		else {
			navigator.geolocation.getCurrentPosition(secureCall, showError,{enableHighAccuracy:true, maximumAge:0});
		}
		//var watchId = navigator.geolocation.watchPosition(get_coords, showError);
		//navigator.geolocation.getAccurateCurrentPosition(get_coords, showError, {maxWait:30000});
	}
	else {
		alert("Localisation impossible.");
	}
}
function secureCall(position)
{			
	lat = position.coords.latitude;
	lng = position.coords.longitude;
	var rdvpoint = lat + ', ' + lng;
	var helpname = civil + ' ' + nom + ' ' + prenom;
	var myDate = new Date();
	var idcourseUrg = myDate.getTime();
	$.sessionStorage.setItem('idcourseUrg', idcourseUrg);
	
	$.post("https://ssl14.ovh.net/~taxibleu/client/secure_xml.php", { lat: lat, lng: lng, dep: '34', pass: pass}, function(xml){
																							 
		var i = 0; // We need to make any numreq unique on that one !!
		$(xml).find('marker').each(function(){
			var name = $(this).attr('name');
			var address = $(this).attr('address');
			var lat2 = $(this).attr('lat');
			var lng2 = $(this).attr('lng');
			var timestamp = $(this).attr('timestamp');
			var distance = $(this).attr('distance');
			var num_reqUrg = idcourseUrg + i;
			//var title = $(this).find('title').text(); To get nodes inside
			//$('<div id='+name+'></div>').html('<p><b>'+name+' - '+address+' - '+lat+' - '+lng+' - '+timestamp+' - '+distance+'</b></p>').appendTo('#secureResults');
			//$('#secureResults').append('<p><b>'+name+' - '+address+' - '+lat+' - '+lng+' - '+timestamp+' - '+distance+'</b></p>');
			
			$.post("https://ssl14.ovh.net/~taxibleu/client/secure.php", { taxi: name, tel: address, rdvpoint: rdvpoint, helptaxi: taxi, helpname: helpname, helptel: tel, idcourse: idcourseUrg, num_req: num_reqUrg, dep: '34', pass: pass}, function(data){
				//$('#secureResults').append(data);
			});
			i++;
		});
		check_answer();
		//alert('Geoloc results :' + lat + ' - ' + lng);
		//$('#results').append('<p><b>'+name+' - '+address+' - '+lat+' - '+lng+' - '+timestamp+' - '+distance+'</b></p>');
		
	}, "xml");
}
function check_answer()
{
	$.mobile.pageContainer.pagecontainer("change", "#urgency", { transition: "slide"} );
	var idcourseUrg = $.sessionStorage.getItem('idcourseUrg');
	sec = setInterval( function () {
		$.post("https://ssl14.ovh.net/~taxibleu/client/status.php?idcourse=" + idcourseUrg + "&check=1" , { dep: '34'}, function(data){ 
			if (data != 0)
			{
				//cancel(idcourse);
				//$('#dblinks').append($('<input id="stop" type="hidden" value="1" />'));
				//var box = alert(data);
				$('#urgencyResults').empty().append(data);
			}
		}); 
	}, 6000);
	return false;
}
function stopSecureCall()
{
	var idcourseUrg = $.sessionStorage.getItem('idcourseUrg');
	$.post("https://ssl14.ovh.net/~taxibleu/client/secure.php", { taxi: '', tel: '', rdvpoint: '', helptaxi: taxi, helpname: '', helptel: tel, idcourse: idcourseUrg, dep: '34', pass: pass, stopcall: 'true'}, function(data){

		$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
	});
	//$.sessionStorage.setItem('idcourseUrg', false);
	clearInterval(sec);
}

function taximedia()
{
	//window.plugins.childBrowser.showWebPage('http://www.taximedia.fr/redir.php', { showLocationBar: true });
	window.open('http://www.taximedia.fr/redir.php','_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function help()
{
	//window.plugins.childBrowser.showWebPage('http://taxibleuservices.com/client/help.html', { showLocationBar: true });
	window.open('http://taxibleuservices.com/client/help.html','_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function cgv()
{
	//window.plugins.childBrowser.showWebPage('http://taxibleuservices.com/client/docs/CGV.pdf', { showLocationBar: true });
	window.open('http://taxibleuservices.com/client/docs/CGV.pdf','_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function unEasy()
{
	$.localStorage.setItem('easy', 0)
	$.mobile.loading( "show" );
	var wait2go = setTimeout( function () {
		$.mobile.loading( "hide" );
		window.location.href="home.html";
		//$.mobile.pageContainer.pagecontainer("change", "home.html", { reload: true} );
	}, 1000);
}

// Checks App or Browser
app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && document.URL.indexOf("localhost") != 7;
if ( app ) {
	// PhoneGap application
	// Attendre que PhoneGap soit prêt	    //
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap est prêt
	function onDeviceReady() {
		//navigator.geolocation.getCurrentPosition(onSuccess, onError);
		navigator.splashscreen.hide();
		if(navigator.network.connection.type == Connection.NONE){
			$("body").empty().append('<img src="no_network.png" onClick="window.location.reload()" />');
		}
		StatusBar.overlaysWebView(false);
		//Functions to call only at app first load
		getLocation();
		dispo();
		update();
		scanner = cordova.require("cordova/plugin/BarcodeScanner");
	}
}

var scanSuccess = function (result) {
	var textFormats = "QR_CODE DATA_MATRIX";
	var productFormats = "UPC_E UPC_A EAN_8 EAN_13";
	if (result.cancelled) { return; }
	if (textFormats.match(result.format)) {                
		var scanVal = result.text;
		if (scanVal.indexOf("http") === 0) {
			setTimeout(function() { 
				//window.plugins.childBrowser.showWebPage(result.text, { showLocationBar: true }); 
				window.open(result.text,'_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer');
			}, 500);
		} else {
			navigator.notification.alert(
					result.text,
					function (){},
					'Scan Value:',
					'Done'
				);
		}
	} else if (productFormats.match(result.format)) {
		var searchUrl = "https://www.google.fr/#q=" + result.text;
		setTimeout(function() { window.plugins.childBrowser.showWebPage(searchUrl, { showLocationBar: true }); }, 500);
	} else { alert("Format du scan: " + result.format + 
			  " NON SUPPORTE. Valeur du scan: " + result.text);
	}
}
function goScan ()
{
	scanner.scan(
		scanSuccess, 
		function (error) {
			alert("Scan Erreur: " + error);
		}
	);
}
function contactPick()
{
	var successCallbackPick = function(result){
		setTimeout(function(){
			//alert(result.name + " " + result.phoneNumber);
			var number = result.phoneNumber;
			$('#telShare').val(number);
		},500);
	};
	var failedCallbackPick = function(result){
		setTimeout(function(){
			//alert(result);
		},500);
	}
	window.plugins.contactNumberPicker.pick(successCallbackPick,failedCallbackPick);
}
function Share()
{
	var number = $('#telShare').val();
	var message = "Téléchargez l'app myTaxi 34 en suivant ce lien : http://www.taximedia.fr/stores.php?app=mytaxi&dep=34";
	var intent = ""; //leave empty for sending sms using default intent
	var success = function () {
		//alert('Message sent successfully');
		$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	var error = function (e) {
		//alert('Message Failed:' + e); 
		$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	sms.send(number, message, intent, success, error);
}
function ShareArt()
{
	var number = $('#telShare').val();
	var message = "Téléchargez l'app artisan taxi DCVP 34 en suivant ce lien : http://www.taximedia.fr/stores.php?app=dcvp&dep=34";
	var intent = ""; //leave empty for sending sms using default intent
	var success = function () {
		//alert('Message sent successfully');
		$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	var error = function (e) {
		//alert('Message Failed:' + e); 
		$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	sms.send(number, message, intent, success, error);
}
function contactShare()
{
	var successCallbackPick = function(result){
		setTimeout(function(){
			//alert(result.name + " " + result.phoneNumber);
			var number = result.phoneNumber;
			var message = "Téléchargez l'app myTaxi 34 en suivant ce lien : http://www.taximedia.fr/stores.php?app=mytaxi&dep=34";
			var intent = ""; //leave empty for sending sms using default intent
			var success = function () {
				//alert('Message sent successfully');
				$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
				$( "#popSms" ).popup( "open", { positionTo: "window" } );
			};
			var error = function (e) {
				//alert('Message Failed:' + e); 
				$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
				$( "#popSms" ).popup( "open", { positionTo: "window" } );
			};
			sms.send(number, message, intent, success, error);
		},500);
	};
	var failedCallbackPick = function(result){
		setTimeout(function(){
			//alert(result);
		},500);
	}
	window.plugins.contactNumberPicker.pick(successCallbackPick,failedCallbackPick);
}
/*
// Swiping between pages function
$('div.ui-page').live("swipeleft", function(){
	var nextpage = $(this).next('div[data-role="page"]');
	// swipe using id of next page if exists
	if (nextpage.length > 0) {
		$.mobile.changePage(nextpage, 'slide');
	}
});
$('div.ui-page').live("swiperight", function(){
	var prevpage = $(this).prev('div[data-role="page"]');
	// swipe using id of next page if exists
	if (prevpage.length > 0) {
		$.mobile.changePage(prevpage, 'slide', true);
	}
});
*/		
$('#home').live("swiperight", function() {
	//$.mobile.pageContainer.pagecontainer("change", "#home"), { transition: "slide", reverse: true} );
	$("#homepanel_poper").trigger('click');
});
$('#home .ui-content').live("swipeleft", function() {
	$.mobile.pageContainer.pagecontainer("change", "#jobs_taker", { transition: "slide"} );
	Dispo_On(); 
});
$('#jobs_taker').live("swiperight", function() {
	$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide", reverse: true} );
});
$('#jobs_taker .ui-content').live("swipeleft", function() {
	$.mobile.pageContainer.pagecontainer("change", "#history", { transition: "slide"} );
});
$('#history').live("swiperight", function() {
	$.mobile.pageContainer.pagecontainer("change", "#jobs_taker", { transition: "slide", reverse: true} );
});
$('#history .ui-content').live("swipeleft", function() {
	$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
});
$('#cmd').live("swiperight", function() {
	$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide", reverse: true} );
});
$('#cmd .ui-content').live("swipeleft", function() {
	$.mobile.pageContainer.pagecontainer("change", "#planning", { transition: "slide"} );
});
$('#planning').live("swiperight", function() {
	$.mobile.pageContainer.pagecontainer("change", "#cmd", { transition: "slide", reverse: true} );
});
$('#planning .ui-content').live("swipeleft", function() {
	$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
});
$('#directions_map').live("swiperight", function() {
	$("#mapPanel_poper").trigger('click');
});
			
$(document).bind( 'pagecreate', function() {

	if(!$.localStorage.getItem('pass'))
	{
		document.location.href='index.html';
		//$.mobile.changePage( "test.html", { transition: "slide"} );
	}
	if(($.localStorage.getItem('taxi') == '') || ($.localStorage.getItem('tel') == ''))
	{
		document.location.href='index.html';
		//$.mobile.changePage( "test.html", { transition: "slide"} );
	}
	//setTimeout('dispo()', 10000);
	if(!app) {
		getLocation();
		update();
		dispo();
	}
	footer();
	//update_cmd();
	//setTimeout('JobWatcher()', 2000); // Starts after 2 seconds...
	/*
	$('a.poper').click(function() {
		$("#delayPop").popup("open");
	});
	$('body').click(function() {
		$( "#delayPop" ).popup( "close" );
	});
	*/
	$("select#delay").change(function () {
		var str = "Temps d'approche : ";
		$("select#delay option:selected").each(function () {
			str += $(this).text();
		});
		
		// Getting delay list value
		var delay = document.getElementById('delay').value;
		//$("#hideCall").show("fast");
		$("#delayConf").html(str);
		$("#delayConf").show("fast");
		//$("#link2diary").trigger('click');

	});
				
});

$(document).ready(function(){

	$.validator.addMethod(
		"regex",
		function(value, element, regexp) {
			var check = false;
			var re = new RegExp(regexp);
			return this.optional(element) || re.test(value);
		},""	  
	);
	
	$.validator.addMethod('phone', function (value) {
		return /^(01|02|03|04|05|06|07|08|09)[0-9]{8}$/.test(value);
	}, 'le N&deg; de t&eacute;l&eacute;phone et une s&eacute;rie de 10 chiffres sans espace commen&ccedil;ant par 0');
	
	$.validator.addMethod('siret', function (value) {
		return /^[0-9]{14}$/.test(value);
	}, 'Le N&deg; SIRET doit corresondre &agrave; 14 chiffres sans espace.');

	$("#modmy").validate({
		rules: {
		 login: {
		   required: true,
		   phone: true
		 },
		 nom: "required",
		 prenom: "required",
		 taxi: "required",
		 tel: {
		   required: true,
		   phone: true
		 },
		 siret: {
		   required: true,
		   siret: true
		 },
		 station: "required",
		 email: {
		   required: true,
		   email: true
		 },
		 confirmail: {
		   required: true,
		   email: true,
		   equalTo: '#email'
		 }
		},
		messages: {
		 nom: "Ce champs est obligatoire",
		 prenom: "Ce champs est obligatoire",
		 taxi: "Ce champs est obligatoire",
		 station: "Ce champs est obligatoire",
		 email: {
		   required: "Nous avons besoin de votre email afin de vous contacter",
		   email: "Votre email doit &ecirc;tre au format nom@domaine.com"
		 },
		 confirmail: {
		   required: "L&rsquo;email ci dessus n&rsquo;a pas &eacute;t&eacute; confirm&eacute;",
		   email: "Votre email doit &ecirc;tre au format nom@domaine.com",
		   equalTo: "Cette adresse n&rsquo;est pas identique &agrave; la pr&eacute;c&eacute;dante."
		 }
		}
		/* Put errors below fields
		,
		errorPlacement: function(error, element) {
			error.appendTo( element.parent().next('em') );
		}
		*/
	});
	$("#modmy").submit(function(event) {
		if ($("#modmy").valid())
		{	
			// stop form from submitting normally
			event.preventDefault();
			// Subs some data
			$.post("https://ssl14.ovh.net/~taxibleu/client/login_app.php", $("#modmy").serialize(), function(data) {
				// GET SHIT BACK !!
				$.localStorage.setItem('civil', data.civil);
				$.localStorage.setItem('nom', data.nom);
				$.localStorage.setItem('prenom', data.prenom);
				$.localStorage.setItem('taxi', data.taxi);
				$.localStorage.setItem('tel', data.tel);
				$.localStorage.setItem('siret', data.siret);
				$.localStorage.setItem('email', data.email);
				$.localStorage.setItem('station', data.station);
				$.sessionStorage.setItem('pwd', data.pwd);
				$.sessionStorage.setItem('modmy', data.modmy);
				//alert(data.taxi + ' - ' + data.siret + ' - ' + data.email + ' - ' + data.tel + ' - ' + data.subscribed + ' - ' + data.telexist + ' - ' + data.cabexist + ' - ' + data.sirexist);
				
				var display = '';
				if (data.modmy)
				{
					display = '<p><b>la modification de vos informations personnelles &agrave; bien &eacute;t&eacute; prise en compte, merci.</b></p>';
				}
				else {
					display = '<p style="color:red;"><b>la modification de vos informations personnelles n&rsquo;&agrave; pas &eacute;t&eacute; prise en compte, l&rsquo;identifiant fourni ne figurant pas dans notre base de donn&eacute;e.</b></p>';
				}
				$('#mod_collaps').collapsible( "collapse" );
				$("#returns").empty().append(display);
			}, "json");
		}
	});
	$("#change").submit(function(event) {
		// stop form from submitting normally
		event.preventDefault();
		// Subs some data
		$.post("https://ssl14.ovh.net/~taxibleu/client/login_app.php", $("#change").serialize(), function(data) {
			//alert($("#change").serialize());
			// GET SHIT BACK !!
			var display = '';
			if (data.changed)
			{
				display = '<p><b>Voici les informations d&rsquo;identification qui vous permettront d&rsquo;acc&egrave;der &agrave; votre compte :<br><span style="color:#09F;">Identifiant = ' + data.tel + '<br>Mot de passe = ' + data.pwd + '</span><br>Vous les recevrez dans quelques instants &agrave; cet email : <span style="color:#09F;">' + data.email + '</span>, merci.<br></b></p>';
			}
			else {
				display = '<p style="color:red;"><b>la modification de vos informations personnelles n&rsquo;&agrave; pas &eacute;t&eacute; prise en compte, l&rsquo;identifiant fourni ne figurant pas dans notre base de donn&eacute;e.</b></p>';
			}
			$("#returns").empty().append(display);
		}, "json");
	});
});

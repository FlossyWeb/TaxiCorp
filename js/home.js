
var taxi = $.localStorage.getItem('taxi');
var tel = $.localStorage.getItem('tel');
var email = $.localStorage.getItem('email');
var civil = $.localStorage.getItem('civil');
var nom = $.localStorage.getItem('nom');
var prenom = $.localStorage.getItem('prenom');
var siret = $.localStorage.getItem('siret');
var station = $.localStorage.getItem('station');
var dep = $.localStorage.getItem('dep');
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
var sound = $.sessionStorage.setItem('sound', 'ON');

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
		$.post("https://ssl14.ovh.net/~taxibleu/appclient/in_app_calls.php", { map: 'true', cmd: cmd, rdv: rdv, com: com, idcourse: idcourse, cell: cell, pass: pass, dep: dep }, function(data){
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

$( '#home' ).live( 'pagebeforeshow',function(event){
	//checkCmd();
});

$('#delayPop').live( 'pagebeforeshow',function(event) {
	//$("#hideCall").hide("fast");
	$("#delayConf").hide("fast");
	//$('select#delay').val('d&eacute;lai');
	//$('select#delay').selectmenu('refresh', true);
});
$('#delayPop').live( 'pagecreate',function(event) {
	var ok = setInterval( function () {
		var str = "Temps d'approche : ";
		$("select#delay option:selected").each(function () {
			str += $(this).text();
		});
		// Getting delay list value
		delay = document.getElementById('delay').value;
		//$("#hideCall").show("fast");
		$("#delayConf").html(str);
		$("#delayConf").show("fast");
	}, 1000);
});
$( '#planning' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/in_app_calls.php", { planning: 'true', tel: tel, pass: pass, dep: dep }, function(data){
		$.mobile.loading( "show" );
		$("#plan_cont").empty().append(data);
		$("#plan_cont").trigger('create');
	}).done(function() { $.mobile.loading( "hide" ); });
});

$( '#cmd' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/appserver/get_app_bookings.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group }, function(data){
		$.mobile.loading( "show" );
		$("#screen_bookings").empty().append(data);
		$("#screen_bookings").trigger('create');
		//alert(data);
	}).done(function() { $.mobile.loading( "hide" ); });
});

$( '#history' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/in_app_calls.php", { history: 'true', tel: tel, pass: pass, dep: dep }, function(data){
		$.mobile.loading( "show" );
		$("#hist_cont").empty().append(data);
		$("#hist_cont").trigger('create');
		//alert(data);
	}).done(function() { $.mobile.loading( "hide" ); });
});

$( '#infos' ).live( 'pagebeforeshow',function(event){
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/in_app_calls.php", { infos: 'true', pass: pass, dep: dep }, function(data){
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
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/billing.php", { taxi: taxi, pass: pass, dep: dep, mngid: mngid }, function(data){
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
		//var watchId = navigator.geolocation.watchPosition(get_coords, showError);
		//navigator.geolocation.getAccurateCurrentPosition(get_coords, showError, {maxWait:30000});
	}
	else {
		alert("Localisation impossible.");
	}
	setTimeout('getLocation()', 30000); // Every thirty seconds you check geolocation...
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
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/insert_app_cab_geoloc.php?lat="+lat+"&lng="+lng, { taxi: taxi, tel: tel, email: email, pass: pass, dep: dep }); 
}

function update()
{
	var dispo = $.sessionStorage.getItem('dispo');
	$.post("https://ssl14.ovh.net/~taxibleu/appserver/get_app_drive.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group }, function(data){ 
		$("#screen_job").empty().append(data);
		if (data != 0)
		{
			$("#warn").empty().append('<a href="#jobs_taker"><img src="visuels/Alerte_course_flat.png" width="100%"/></a>');
			$("#warn_home").empty().append('<a href="#jobs_taker"><img src="visuels/Alerte_course_flat.png" width="100%"/></a>');
			//document.getElementById("play").play();
			//navigator.notification.beep(2);
			if ($.sessionStorage.getItem('sound') != 'OFF') {
				playAudio('sounds/ring.mp3');
				navigator.notification.vibrate(2000);
			}
		}
		else
		{
			$("#warn").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			$("#warn_home").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			//document.getElementById("play").pause();
			//stopAudio();
		}
	});

setTimeout('update()', 2000);
}
function checkCmd() {
	$.post("https://ssl14.ovh.net/~taxibleu/appserver/get_app_bookings.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group, ring: pass }, function(data){
		if (data != 0)
		{
			$('.orders').addClass('badge');
			$('.ordersjob').addClass('badge');
			$('.orders').empty().append(data);
			$('.ordersjob').empty().append(data);
			navigator.notification.beep(2);
			navigator.notification.vibrate(1000);
		}
	});
setTimeout('checkCmd()', 300000);
}
function refreshCmd() {
	$.post("https://ssl14.ovh.net/~taxibleu/appserver/get_app_bookings.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group }, function(data){
		$.mobile.loading( "show" );
		$("#screen_bookings").empty().append(data);
		$("#screen_bookings").trigger('create');
	}).done(function() { $.mobile.loading( "hide" ); });
}
function dispo()
{
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/dispo_app.php?check=1", { taxi: taxi, tel: tel, pass: pass, dep: dep }, function(data){ 
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
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/dispo_app.php?dispo=1", { taxi: taxi, tel: tel, pass: pass, dep: dep });
	$("#dispo").empty().append('<a href="#home" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$("#dispo_jobs").empty().append('<a href="#jobs_taker" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$("#dispo_cmd").empty().append('<a href="#jobs_taker" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$.sessionStorage.setItem('dispo', '1');
}
function Dispo_Off()
{
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/dispo_app.php?dispo=0", { taxi: taxi, tel: tel, pass: pass, dep: dep }); 
	$("#dispo").empty().append('<a href="#home" onClick="Dispo_On()"><img src="visuels/DispoOff_flat.png" width="100%"/></a>');
	$("#dispo_jobs").empty().append('<a href="#jobs_taker" onClick="Dispo_On()"><img src="visuels/DispoOff_flat.png" width="100%"/></a>');
	$("#dispo_cmd").empty().append('<a href="#jobs_taker" onClick="Dispo_On()"><img src="visuels/DispoOff_flat.png" width="100%"/></a>');
	$.sessionStorage.setItem('dispo', '0');
}

function Sound_On()
{
	$("#sound").empty().append('<button class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-btn-inline" onClick="Sound_Off()"><img src="visuels/sound_on.png" width="24px"></button>');
	//$("#player").empty().append('<audio id="play" loop="loop" preload="auto" style="display:none" ><source src="sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	$.sessionStorage.setItem('sound', 'ON');
}
function Sound_Off()
{
	$("#sound").empty().append('<button class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-btn-inline" onClick="Sound_On()"><img src="visuels/sound_off.png" width="24px"></button>');
	//$("#player").empty();
	$.sessionStorage.setItem('sound', 'OFF');
}
function footer()
{
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/footer_app.php", { dep: dep }, function(data) {
		for (i=0; i<9; i++) {
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
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/justify.php", { when: when, rdv: rdv, comments: comments, destadd: destadd, cell: cell, dep: dep, pass: pass, email: email }, function(data){
		$.mobile.loading( "show" );
		alert(data);
		//window.plugins.childBrowser.showWebPage('http://www.taximedia.fr', { showLocationBar: true });
	}).done(function() { $.mobile.loading( "hide" ); });
}
// diaryCall for direct job that open #delay
function delayCall(query_string)
{
	Sound_Off();
	$.sessionStorage.setItem('query_string', query_string);
	$.mobile.pageContainer.pagecontainer("change", "#delayPop", { transition: "slide"} );
}
function directCall()
{
	$.mobile.loading( "show" );
	// Getting query_string using sessionStorage
	var dataDiary = $.sessionStorage.getItem('query_string');
	// Modifying the link 2 diary
	//var link2diary = document.getElementById('link2diary');
	query_string = dataDiary + '&delay=' + delay;
	$.sessionStorage.setItem('query_string', query_string);
	var dep = $.localStorage.getItem('dep');
	$.post("https://ssl14.ovh.net/~taxibleu/appserver/diary_app_dcvp.php?dep="+dep, query_string, function(data){ 
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
	}, "json").done(function() { Sound_On();});
}
// Diary call when accepting cmd jobs or refusing jobs
function diaryCall(query_string)
{
	$.mobile.loading( "show" );
	var dep = $.localStorage.getItem('dep');
	$.post("https://ssl14.ovh.net/~taxibleu/appserver/bookings_app_dcvp.php?dep="+dep, query_string, function(data){ 
		switch (data.location) {
			 case '#directions_map':
				//alert('in direction case');
				$.sessionStorage.setItem('rdv', data.rdv);
				$.sessionStorage.setItem('idcourse', data.idcourse);
				$.sessionStorage.setItem('com', data.com);
				$.sessionStorage.setItem('cell', data.cell);
				$.sessionStorage.setItem('cmd', 1);
				$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
				var number = data.cell;
				var message = "Le taxi "+taxi+" viendra vous chercher à l'heure prévue.";
				var intent = ""; //leave empty for sending sms using default intent
				var success = function () {
				};
				var error = function (e) {
				};
				sms.send(number, message, intent, success, error);
				 
				 break;
			 case '#toolate':
				$.mobile.pageContainer.pagecontainer("change", "#toolate", { transition: "slide"} );
				$.sessionStorage.setItem('idcourse', data.idcourse);
				 
				 break;
			 default: 
				$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
				 
				 break;
		}					
	}, "json").done(function() { Sound_On();});
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
	
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/secure_xml.php", { lat: lat, lng: lng, dep: dep, pass: pass}, function(xml){
																							 
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
			
			$.post("https://ssl14.ovh.net/~taxibleu/appclient/secure.php", { taxi: name, tel: address, rdvpoint: rdvpoint, helptaxi: taxi, helpname: helpname, helptel: tel, idcourse: idcourseUrg, num_req: num_reqUrg, dep: dep, pass: pass}, function(data){
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
		$.post("https://ssl14.ovh.net/~taxibleu/appclient/status.php?idcourse=" + idcourseUrg + "&check=1" , { dep: dep}, function(data){ 
			if (data != 0)
			{
				$('#urgencyResults').empty().append(data);
			}
		}); 
	}, 6000);
	return false;
}
function stopSecureCall()
{
	var idcourseUrg = $.sessionStorage.getItem('idcourseUrg');
	$.post("https://ssl14.ovh.net/~taxibleu/appclient/secure.php", { taxi: '', tel: '', rdvpoint: '', helptaxi: taxi, helpname: '', helptel: tel, idcourse: idcourseUrg, dep: dep, pass: pass, stopcall: 'true'}, function(data){
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

// Checks App or Browser
app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && document.URL.indexOf("localhost") != 7;
if ( app ) {
	// PhoneGap application
	// Attendre que PhoneGap soit prêt	    //
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap est prêt
	function onDeviceReady() {
		document.addEventListener("resume", onResume, false);
		navigator.splashscreen.hide();
		if(navigator.network.connection.type == Connection.NONE){
			$("body").empty().append('<img src="no_network.png" onClick="window.location.reload()" />');
		}
		StatusBar.overlaysWebView(false);
		// prevent device from sleeping
		window.plugins.powerManagement.acquire();
		//Functions to call only at app first load
		getLocation();
		scanner = cordova.require("cordova/plugin/BarcodeScanner");
		setTimeout('update()', 2000);
		checkCmd();
	}
}
function onResume() {
	$.post("https://ssl14.ovh.net/~taxibleu/client/active_app.php", { tel: tel, mngid: mngid, dep: dep}, function(data) {});
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
		setTimeout(function() { window.open(searchUrl,'_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer'); }, 500);
		//setTimeout(function() { window.plugins.childBrowser.showWebPage(searchUrl, { showLocationBar: true }); }, 500);
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
function SharePad()
{
	var number = $('#telShare').val();
	var message = "Rendez-vous sur le WebService myTaxi 34 Hôtels & Restaurants en suivant ce lien : http://ecra.se/AA";
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
function SharePro()
{
	var number = $('#telShare').val();
	var message = "Téléchargez l'app myTaxi 34 Pro sur les sores en suivant ce lien : http://www.taximedia.fr/stores.php?app=pro&dep=34  ou rendez-vous sur le WebService en suivant ce lien : http://ecra.se/3jt";
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
function getPhoneGapPath() {
    return 'file://' + path;
};
function playAudio(src) {
	if (my_media == null) {
		// Create Media object from src
		var path = window.location.pathname;
		path = path.substring(0, path.lastIndexOf('/') + 1);
		var source = path + src;
		my_media = new Media(source, playOnSuccess, playOnError);
	}
	// Play audio
	my_media.play();
} 
// Stop audio
function stopAudio() {
	if (my_media) {
		my_media.stop();
	}
}

// onSuccess Callback
function playOnSuccess() {
	//console.log("playAudio():Audio Success");
}

// onError Callback 
function playOnError(error) {
	//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}
$('#home').live("swiperight", function() {
	//$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide", reverse: true} );
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
	$( "body>[data-role='panel']" ).panel().enhanceWithin();
	if(!app) {
		getLocation();
		setTimeout('update()', 2000);
	}
	if (navigator.userAgent.toLowerCase().match(/android/)) {
		$("#player").empty().append('<audio id="play" loop="loop" preload="auto" style="display:none" ><source src="/android_asset/www/sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	}
	else {
		$("#player").empty().append('<audio id="play" loop="loop" preload="auto" style="display:none" ><source src="sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	}
	dispo();
	footer();
	var dep = $.localStorage.getItem('dep');
	$('#depMod').val(dep);
	$('#depPwd').val(dep);
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

	$.validator.addMethod('cp', function (value) {
		return /^[0-9]{5}$/.test(value);
	}, 'Le CP fait 5 chiffres sans espace.');

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
		 station: {
		   required: true,
		   cp: true
		 },
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
		 station: {
		   required: "Ce champs est obligatoire"
		 },
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
			$.post("https://ssl14.ovh.net/~taxibleu/appclient/login_app.php", $("#modmy").serialize(), function(data) {
				// GET SHIT BACK !!
				$.localStorage.setItem('civil', data.civil);
				$.localStorage.setItem('nom', data.nom);
				$.localStorage.setItem('prenom', data.prenom);
				$.localStorage.setItem('taxi', data.taxi);
				$.localStorage.setItem('tel', data.tel);
				$.localStorage.setItem('siret', data.siret);
				$.localStorage.setItem('email', data.email);
				$.localStorage.setItem('station', data.station);
				$.localStorage.setItem('dep', data.dep);
				$.sessionStorage.setItem('pwd', data.pwd);
				$.sessionStorage.setItem('modmy', data.modmy);
				
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
		$.post("https://ssl14.ovh.net/~taxibleu/appclient/login_app.php", $("#change").serialize(), function(data) {
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

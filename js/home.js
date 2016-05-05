var taxi = $.localStorage.getItem('taxi');
var tel = $.localStorage.getItem('tel');
var pwd = $.localStorage.getItem('pwd');
var email = $.localStorage.getItem('email');
var civil = $.localStorage.getItem('civil');
var nom = $.localStorage.getItem('nom');
var prenom = $.localStorage.getItem('prenom');
var siret = $.localStorage.getItem('siret');
var cpro = $.localStorage.getItem('cpro');
var station = $.localStorage.getItem('station');
var dep = $.localStorage.getItem('dep');
var group = $.localStorage.getItem('group');
var mngid = $.localStorage.getItem('mngid');
var pass = $.localStorage.getItem('pass');
var accessHash = $.localStorage.getItem('accessHash');
var type = $.localStorage.getItem('type');
var cb = $.localStorage.getItem('cb');
var medic = $.localStorage.getItem('medic');
var animal = $.localStorage.getItem('animal');
var passengers = $.localStorage.getItem('passengers');
var color = $.localStorage.getItem('color');
var lang = $.localStorage.getItem('lang');
var idcourse = $.localStorage.setItem('idcourse', '');
var idcourseUrg = $.sessionStorage.setItem('idcourseUrg', '');
var dispo = $.sessionStorage.getItem('dispo');
var rdv = $.sessionStorage.setItem('rdv', '');
var com = $.sessionStorage.setItem('com', '');
var cell = $.sessionStorage.setItem('cell', '');
var cmd = $.sessionStorage.setItem('cmd', 0);
var query_string = $.sessionStorage.setItem('query_string', '');
var delay = 10;
var pollingTime = 2000;

// Lecteur audio
var my_media = null;
var sound = $.sessionStorage.setItem('sound', 'ON');

// Scanner
var scanner;

// localNotifications
var notificationId = 1;
var badgeNumber = 0;
var badgeNumber1 = 0;
var badgeNumber2 = 0;

// Detect wether it is an App or WebApp
var app;
var appVersion = "1.6.2";
		
// getLocation & secureCall
var lat = 0;
var lng = 0;
var previousLat = 0;
var previousLng = 0;

//opendata vars
var api_key = "307464f4-81ba-4d22-9b6c-23376ce4cf9e";
var insee = $.localStorage.getItem('insee');
var ads = $.localStorage.getItem('taxi');
var cpro = $.localStorage.getItem('cpro');
var imat = $.localStorage.getItem('imat');
var taxi_id = $.localStorage.getItem('taxi_id');
var constructor = $.localStorage.getItem('constructor');
var model = $.localStorage.getItem('model');
var type_ = $.localStorage.getItem('type_');
var birthdate = $.localStorage.getItem('birthdate');
var tpmr = $.localStorage.getItem('tpmr');
var openStatus;
var openDataInit=false;
var openDataGo=false;
var geoserver='188.165.50.190';

var mobileDemo = { 'center': '43.615945,3.876743', 'zoom': 10 };

if($.localStorage.getItem('pass')!='true')
{
	document.location.href='index.html';
}
$.post("https://www.mytaxiserver.com/appclient/open_login_app.php", { tel: tel, mngid: mngid, log: tel, pass: pwd, dep: dep, version: appVersion}, function(data) {
	if(data.done) {
		//"insee"=>$insee, "ads"=>$ads, "cpro"=>$cpro, "imat"=>$imat, "constructor"=>$constructor, "model"=>$model, "type_"=>$type_, "birthdate"=>$birthdate
		insee = data.insee;
		ads = data.ads;
		cpro = data.cpro;
		imat = data.imat;
		constructor = data.constructor;
		model = data.model;
		type_ = data.type_;
		birthdate = data.birthdate;
		accessHash = data.accessHash;
		$.localStorage.setItem('insee', data.insee);
		$.localStorage.setItem('ads', data.ads);
		$.localStorage.setItem('cpro', data.cpro);
		$.localStorage.setItem('imat', data.imat);
		$.localStorage.setItem('constructor', data.constructor);
		$.localStorage.setItem('model', data.model);
		$.localStorage.setItem('type_', data.type_);
		$.localStorage.setItem('birthdate', data.birthdate);
		$.localStorage.setItem('accessHash', data.accessHash);
	}
	//else alert('Pas de correspondance dans la table opendata_interface !!', alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
	else { // Not in le.taxi so we pop...
		setTimeout(function(){
			$( "#leTaxiPopFirst" ).popup( "open", { positionTo: "window" } );
		}, 2000);
	}
	if (data.badid)
	{
		$.localStorage.setItem('pass', 0);
		document.location.href='index.html';
	}
}, "json").done(function(data) { 
	if(data.done) {
		$.post("https://www.mytaxiserver.com/appclient/open_enroll_app.php", { tel: tel, insee: insee, dep: dep, mngid: mngid, ads: ads, cpro: cpro, imat: imat}, function(data) {
			taxi_id = data.taxi_id;
			$.localStorage.setItem('taxi_id', data.taxi_id);
			openStatus = data.status;
			openDataInit=true;
			openDataGo=true;
			$("#openSwitch").val(1).flipswitch( "refresh" );
			//dispoCheck();
			//Dispo_On();
		}, "json");
	}
	reloadVars();
});
function reloadVars() {
	taxi = $.localStorage.getItem('taxi');
	tel = $.localStorage.getItem('tel');
	pwd = $.localStorage.getItem('pwd');
	email = $.localStorage.getItem('email');
	civil = $.localStorage.getItem('civil');
	nom = $.localStorage.getItem('nom');
	prenom = $.localStorage.getItem('prenom');
	siret = $.localStorage.getItem('siret');
	cpro = $.localStorage.getItem('cpro');
	station = $.localStorage.getItem('station');
	dep = $.localStorage.getItem('dep');
	group = $.localStorage.getItem('group');
	mngid = $.localStorage.getItem('mngid');
	pass = $.localStorage.getItem('pass');
	accessHash = $.localStorage.getItem('accessHash');
	type = $.localStorage.getItem('type');
	cb = $.localStorage.getItem('cb');
	medic = $.localStorage.getItem('medic');
	animal = $.localStorage.getItem('animal');
	passengers = $.localStorage.getItem('passengers');
	color = $.localStorage.getItem('color');
	lang = $.localStorage.getItem('lang');
	insee = $.localStorage.getItem('insee');
	ads = $.localStorage.getItem('ads');
	cpro = $.localStorage.getItem('cpro');
	imat = $.localStorage.getItem('imat');
	taxi_id = $.localStorage.getItem('taxi_id');
	constructor = $.localStorage.getItem('constructor');
	model = $.localStorage.getItem('model');
	type_ = $.localStorage.getItem('type_');
	birthdate = $.localStorage.getItem('birthdate');
	tpmr = $.localStorage.getItem('tpmr');
}
		
////////////////////////////////////////////////////////////
//$(document).on( 'pagebeforecreate', '#directions_map', function() {
$( '#directions_map' ).live( 'pagebeforeshow',function(event){
	$("#infos_map").empty();
	idcourse = $.sessionStorage.getItem('idcourse');
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
		$.post("https://www.mytaxiserver.com/appclient/in_app_calls.php", { map: 'true', cmd: cmd, rdv: rdv, com: com, idcourse: idcourse, cell: cell, pass: pass, dep: dep }, function(data){
			$("#infos_map").append(data);
			$("#infos_map").trigger('create');
			//navigator.notification.alert(data);
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
								var gmapLink = '<a href="#" onClick="openSomeUrl(\'http://maps.google.com/maps?daddr='+rdv+'&saddr='+results[0].formatted_address+'&directionsmode=driving\')" class="ui-btn  ui-btn-c ui-corner-all ui-shadow ui-icon-navigation ui-btn-icon-left">Ouvrir dans Maps</a>';
								setTimeout(function() { 
									$("#infos_map").append(gmapLink);
								}, 1000);
								if (rdv != '')
								{
									$('#submit').trigger('click');
								}
							}
						});
					} else {
						navigator.notification.alert('Unable to get current position', alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
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
	idcourse = $.sessionStorage.getItem('idcourse');
	var late = '<p style="color:#F00; font-size: large;"><b>D&eacute;sol&eacute; mais la course ' + idcourse + ' &agrave; &eacute;t&eacute; prise par un autre taxi.</b></p>';
	$("#late_cont").empty().append(late);			
});
$('#delayPop').live( 'pagebeforeshow',function(event) {
	$("#delayConf").hide("fast");
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
		$("#delayConf").html(str);
		$("#delayConf").show("fast");
	}, 1000);
});
$( '#planning' ).live( 'pagebeforeshow',function(event){
	$.mobile.loading( "show" );
	$.post("https://www.mytaxiserver.com/appclient/in_app_calls.php", { planning: 'true', tel: tel, pass: pass, dep: dep, mngid: mngid }, function(data){
		$("#plan_cont").empty().append(data);
		$("#plan_cont").trigger('create');
	}).always(function() { $.mobile.loading( "hide" ); });
});
$( '#cmd' ).live( 'pagebeforeshow',function(event){
	$.mobile.loading( "show" );
	$.post("https://www.mytaxiserver.com/appserver/get_app_bookings.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group }, function(data){
		if (data != 0)
		{
			$("#screen_bookings").empty().append(data);
			$("#screen_bookings").trigger('create');
		}
		//navigator.notification.alert(data);
	}).always(function() { $.mobile.loading( "hide" ); });
});
$( '#history' ).live( 'pagebeforeshow',function(event){
	$.mobile.loading( "show" );
	$.post("https://www.mytaxiserver.com/appclient/in_app_calls.php", { history: 'true', tel: tel, pass: pass, dep: dep, mngid: mngid }, function(data){
		$("#hist_cont").empty().append(data);
		$("#hist_cont").trigger('create');
		//navigator.notification.alert(data);
	}).always(function() { $.mobile.loading( "hide" ); });
});
$( '#infos' ).live( 'pagebeforeshow',function(event){
	$.mobile.loading( "show" );
	$.post("https://www.mytaxiserver.com/appclient/in_app_calls.php", { infos: 'true', pass: pass, dep: dep }, function(data){
		$("#infos_cont").empty().append(data);
		$("#infos_cont").trigger('create');
		//navigator.notification.alert(data);
	}).always(function() { $.mobile.loading( "hide" ); });
});
$('#manage').live('pagecreate', function() {
	//Mod Form...
	var dec_nom = $('#nom').html(nom).text();
	var dec_prenom = $('#prenom').html(prenom).text();
	var dec_station = $('#station').html(station).text();
	$('#login').val(tel);
	$('#civil').val(civil).selectmenu( "refresh" );
	$('#nom').val(dec_nom);
	$('#prenom').val(dec_prenom);
	$('#taxi').val(taxi);
	$('#tel').val(tel);
	$('#email').val(email);
	$('#confirmail').val(email);
	$('#cpro').val(cpro);
	$('#station').val(dec_station);
	$('#log').val(tel);
	if(type!=null) $('#type').val(type).selectmenu( "refresh" );
	if(cb!=null) $('#cb').val(cb).flipswitch( "refresh" );
	if(medic!=null) $('#medic').val(medic).flipswitch( "refresh" );
	if(animal!=null) $('#animal').val(animal).flipswitch( "refresh" );
	if(passengers!=null) $('#passengers').val(passengers).slider("refresh");;
	if(color!=null) $('#color').val(color).selectmenu( "refresh" );
	if(lang!=null) { //array("en", "ge", "sp", "it", "ru", "cn", "ab");
		var langTab= lang.split(", ");
		for (i = 0; i < langTab.length; i++) {
			switch(langTab[i]) {
				case "en": 
					$('#checkbox1').prop("checked", true).checkboxradio( "refresh" );
					break;
				case "sp": 
					$('#checkbox2').prop("checked", true).checkboxradio( "refresh" );
					break;
				case "it": 
					$('#checkbox3').prop("checked", true).checkboxradio( "refresh" );
					break;
				case "ru": 
					$('#checkbox4').prop("checked", true).checkboxradio( "refresh" );
					break;
				case "ge": 
					$('#checkbox5').prop("checked", true).checkboxradio( "refresh" );
					break;
				case "cn": 
					$('#checkbox6').prop("checked", true).checkboxradio( "refresh" );
					break;
				case "ab": 
					$('#checkbox7').prop("checked", true).checkboxradio( "refresh" );
					break;
			}
		}
	}
	//Le.Taxi Form...
	$.post("https://www.mytaxiserver.com/appserver/open_get_insee.php", { zip: station, pass: pass, accessHash: accessHash }, function(data){
		$("#inseeBox").empty().append('<label for="insee">Commune de stationnement: </label>'+data).trigger('create');
		//$("#inseeBox").trigger('create');
		$('#insee').val(insee).selectmenu( "refresh" );
	});
	$('#imat').val(imat);
	$('#constructor').val(constructor);
	$('#model').val(model);
	$('#birthdate').val(birthdate);
	$('#tpmr').val(tpmr).selectmenu( "refresh" );
	$('#whoLeTaxi').val(tel);
	// Billing infos
	$.post("https://www.mytaxiserver.com/appclient/billing.php", { taxi: taxi, pass: pass, dep: dep, mngid: mngid }, function(data){
		$("#billing").empty().append(data);
	});
	// Rating infos
	$.post("https://www.mytaxiserver.com/appclient/myrates.php", { tel: tel, pass: pass, dep: dep, mngid: mngid }, function(data){
		$("#myRates").empty().append(data);
	});
});
function dc() {
	$.mobile.loading( "show" );
	$.localStorage.clear();
	$.sessionStorage.clear();
	$.localStorage.setItem('pass', 0);
	setTimeout(function(){
		document.location.href="index.html";
	}, 1000);
}
function getLocation()
{
	//alert('IN getLocation: '+openDataInit);
	if (navigator.geolocation)
	{
		//var watchId = navigator.geolocation.watchPosition(get_coords, showError, { maximumAge: 30000, timeout: 5000, enableHighAccuracy: true });
		if (navigator.userAgent.toLowerCase().match(/android/)) {
			navigator.geolocation.getCurrentPosition(get_coords, showError,{enableHighAccuracy:false, maximumAge:5000, timeout: 5000});
		}
		else {
			navigator.geolocation.getCurrentPosition(get_coords, showError,{enableHighAccuracy:true, maximumAge:0, maximumAge:5000, timeout: 5000});
		}
	}
	else {
		navigator.notification.alert("Localisation impossible.", alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
	}
}
function showError(error)
{
	var x=document.getElementById("ePopResults");
	var geoAlert="";
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
		  x.innerHTML="<strong>Vous avez refus&eacute; l&rsquo;acc&egrave;s &agrave; la G&eacute;olocalisation.</strong>"
		  geoAlert="Vous avez refusé l'accès à la Géolocalisation, vous pouvez modifier cela dans les réglages.";
		  break;
		case error.POSITION_UNAVAILABLE:
		  x.innerHTML="<strong>G&eacute;olocalisation indisponible, veuillez regarder dans l&rsquo;aide ou activer le service dans les reglages de votre appareil.</strong>"
		  geoAlert="Géolocalisation indisponible, veuillez regarder dans l'aide ou activer le service dans les reglages de votre appareil.";
		  break;
		case error.TIMEOUT:
		  x.innerHTML="<strong>La demande de G&eacute;olocalisation a expir&eacute;(user location request timed out).</strong>"
		  geoAlert="La demande de Géolocalisation a expiré (user location request timed out).";
		  break;
		case error.UNKNOWN_ERROR:
		  x.innerHTML="<strong>Erreur inconnue de G&eacute;olocalisation (unknown error occurred).</strong>"
		  geoAlert="Erreur inconnue de Géolocalisation (unknown error occurred).";
		  break;
		default:
		  x.innerHTML="<strong>Erreur de G&eacute;olocalisation, red&eacute;marrage du smartphone n&eacute;c&eacute;ssaire.</strong>"
		  geoAlert="Erreur de Géolocalisation, libre à vous d'activer le service de géolocalisation pour cette app dans les réglages.";
	}
	// Fall back to no options and try again for Android to work.
	navigator.geolocation.getCurrentPosition(get_coords, function(){
		//$( "#errorPop" ).popup( "open", { positionTo: "window" } );
		if(app) navigator.notification.alert(geoAlert, alertDismissed, 'Mon Appli Taxi', 'OK');
		else alert(geoAlert);
	});
}			  
function get_coords(position) 
{
	lat = position.coords.latitude;
	lng = position.coords.longitude;
	//alert('Located: '+lat+' , '+lng);
	var stampDot = new Date().getTime() / 1000; // float timestamp in seconds
	var stamp = parseInt(stampDot); // timestamp in seconds
	var geoHash = sha1(stamp+"montaxi"+taxi_id+lat+lng+"phone"+"0"+"2"+api_key); //sha1(concat(timestamp, operator, taxi, lat, lon, device, status, version, api_key))
	var payload = '{"timestamp":"'+stamp+'","operator":"montaxi","taxi":"'+taxi_id+'","lat":"'+lat+'","lon":"'+lng+'","device":"phone","status":"0","version":"2","hash":"'+geoHash+'"}';
	//var payload = 'JSON.stringify({"timestamp":"'+stamp+'","operator":"montaxi","taxi":"'+taxi_id+'","lat":"'+lat+'","lon":"'+lng+'","device":"phone","status":"0","version":"2","hash":"'+geoHash+'"})';
	//alert(JSON.stringify(payload));
	if (openDataInit && openDataGo && app) {
		udptransmit.sendMessage(payload);
	}
	if((lat!=previousLat) && (lng!=previousLng)) {
		$.post("http://www.mytaxiserver.com/appclient/insert_app_cab_geoloc.php?lat="+lat+"&lng="+lng, { tel: tel, pass: pass, dep: dep }, function(data) {
			//alert('Sent:'+lat+' , '+lng);
		});
	}
	previousLat = lat;
	previousLng = lng;
	setTimeout('getLocation()', 5000); // Every thirty seconds you check geolocation...
	/*
	//var x=document.getElementById("results");
	//x.innerHTML="lat = " + lat + " - lng = " +lng;
	//navigator.notification.alert('taxi: ' + taxi + ' tel: ' + tel + ' pass=' + pass);
	$.post("https://www.mytaxiserver.com/appclient/open_app_cab_geoloc.php?lat="+lat+"&lng="+lng, { taxi: taxi, tel: tel, email: email, pass: pass, dep: dep }).always(function(data) {
		//setTimeout('getLocation()', 30000); // Every thirty seconds you check geolocation...
	});
	*/	
}
//
function UDPTransmissionSuccess(success) {
	alert('UDPTransmissionSuccess: '+success);
	//setTimeout('getLocation()', 5000); // Every five seconds you refresh geolocation...
}

function UDPTransmissionError(error) {
	alert('UDPTransmissionError: '+error);
	//setTimeout('getLocation()', 5000); // Every five seconds you refresh geolocation...
}
function update()
{
	dispo = $.sessionStorage.getItem('dispo');
	$.post("https://www.mytaxiserver.com/appserver/open_get_app_drive.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group, lat: lat, lng: lng, nodelay: true }, function(data){ 
		if (data != 0)
		{
			$("#screen_job").empty().append(data);
			$("#warn").empty().append('<a href="#jobs_taker"><img src="visuels/Alerte_course_flat.png" width="100%"/></a>');
			$("#warn_home").empty().append('<a href="#jobs_taker"><img src="visuels/Alerte_course_flat.png" width="100%"/></a>');
			//document.getElementById("play").play();
			//navigator.notification.beep(2);
			setTimeout( function () {
				if ($.sessionStorage.getItem('sound') != 'OFF') {
					playAudio('sounds/ring.mp3');
					navigator.notification.vibrate(1000);
				}
			}, 100);
			badgeNumber1=1;
			badgeNumber = badgeNumber1+badgeNumber2;
			cordova.plugins.notification.local.schedule({
				id: 1,
				title: "Notification de course Mon Appli Taxi",
				text: "Une course immediate est disponible !",
				led: "E7B242",
				badge: badgeNumber,
				data: { data:data }
			});
		}
		else
		{
			$("#screen_job").empty().append('<br><p><b>En attente de courses...</b></p><br>');
			$("#warn").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			$("#warn_home").empty().append('<a href="#jobs_taker"><img src="visuels/Aucune_course_flat.png" width="100%"/></a>');
			//document.getElementById("play").pause();
			//stopAudio();
			cordova.plugins.notification.local.clear(1, function() {
				//alert("done");
			});
		}
	}).always(function(data) {
		setTimeout('update()', pollingTime);
	});
}
function checkCmd() {
	$.post("https://www.mytaxiserver.com/appserver/get_app_bookings.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group, zip: station, ring: pass }, function(data){
		if (data != 0)
		{
			$('.orders').addClass('badge');
			$('.ordersjob').addClass('badge');
			$('.orders').empty().append(data);
			$('.ordersjob').empty().append(data);
			navigator.notification.beep(2);
			navigator.notification.vibrate(1000);
			//badgeNumber2=data;
			badgeNumber2=1;
			badgeNumber = badgeNumber1+badgeNumber2;
			if(parseInt(data)>1) { var showing=data+" courses en commande sont disponibles !";}
			else { var showing="Une course en commande est disponible !";}
			cordova.plugins.notification.local.schedule({
				id: 2,
				title: "Notification de course Mon Appli Taxi",
				text: showing,
				led: "E7B242",
				badge: badgeNumber,
				data: { number:data }
			});
		}
		else {
			cordova.plugins.notification.local.clear(2, function() {
				//alert("done");
			});
			$('.orders').removeClass('badge');
			$('.ordersjob').removeClass('badge');
			$('.orders').empty();
			$('.ordersjob').empty();
		}
	}).always(function(data) {
		setTimeout('checkCmd()', 300000);
	});
}
function refreshCmd() {
	$.mobile.loading( "show" );
	$("#screen_bookings").empty();
	$.post("https://www.mytaxiserver.com/appserver/get_app_bookings.php", { taxi: taxi, tel: tel, email: email, dispo: dispo, pass: pass, dep: dep, mngid: mngid, group: group, zip: station }, function(data){
		if (data != 0)
		{
			$("#screen_bookings").append(data);
			$("#screen_bookings").trigger('create');
		}
	}).always(function() { $.mobile.loading( "hide" ); });
}
function dispoCheck()
{
	$.post("https://www.mytaxiserver.com/appclient/open_dispo_app.php?check=1", { taxi: taxi, tel: tel, pass: pass, dep: dep, taxi_id: taxi_id, opendata: openDataGo}, function(data){ 
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
		//navigator.notification.alert(data.dispo);
	}, "json").always(function(data) {
		setTimeout('dispoCheck()', 60000); // Every minutes you check dispo for real or oldies...
	});
}
function Dispo_On()
{
	$.post("https://www.mytaxiserver.com/appclient/open_dispo_app.php?dispo=1", { taxi: taxi, tel: tel, pass: pass, dep: dep, taxi_id: taxi_id, opendata: openDataGo });
	$("#dispo").empty().append('<a href="#home" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$("#dispo_jobs").empty().append('<a href="#jobs_taker" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$("#dispo_cmd").empty().append('<a href="#jobs_taker" onClick="Dispo_Off()"><img src="visuels/DispoOn_flat.png" width="100%"/></a>');
	$.sessionStorage.setItem('dispo', '1');
}
function Dispo_Off()
{
	$.post("https://www.mytaxiserver.com/appclient/open_dispo_app.php?dispo=0", { taxi: taxi, tel: tel, pass: pass, dep: dep, taxi_id: taxi_id, opendata: openDataGo }); 
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
	$.post("https://www.mytaxiserver.com/appclient/footer_app.php", { dep: dep }, function(data) {
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
	//var success = function(message) { navigator.notification.alert("AJOUT EVENEMENT AU CALENDRIER: " + JSON.stringify(message)); };
	var success = function(message) { navigator.notification.alert("EVENEMENT AJOUTE AU CALENDRIER", alertDismissed, 'Mon Appli Taxi', 'OK'); };
	var error = function(message) { navigator.notification.alert("Erreur: " + message, alertDismissed, 'Mon Appli Taxi Erreur', 'OK'); };
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
	$.post("https://www.mytaxiserver.com/appclient/justify.php", { when: when, rdv: rdv, comments: comments, destadd: destadd, cell: cell, dep: dep, pass: pass, email: email }, function(data){
		$.mobile.loading( "show" );
		navigator.notification.alert(data, alertDismissed, 'Mon Appli Taxi', 'OK');
		//window.plugins.childBrowser.showWebPage('http://www.taximedia.fr', { showLocationBar: true });
	}).always(function() { $.mobile.loading( "hide" ); });
}
function reporting_customer(rdv_rc, idcourse_rc, hail_id_rc, operator_rc, cell_rc)
{
	var comRate = $("#leComRate").val();
	$.post("https://www.mytaxiserver.com/appclient/open_reporting.php", { rdv: rdv_rc, idcourse: idcourse_rc, hail_id: hail_id_rc, operator: operator_rc, cell: cell_rc, dep: dep, tel: tel, mngid: mngid, comments: comRate}, function(data){ 
		if(app) navigator.notification.alert('Votre remarque &eacute;t&eacute; prise en compte, Merci.', alertDismissed, 'Mon Appli Taxi', 'OK');
		else alert('Votre remarque &eacute;t&eacute; prise en compte, Merci.');
	});
}
function showRepCusto() {
	$('#reporting_customer_cont').slideToggle('slow');
}
// diaryCall for direct job that open #delay
function delayCall(query_string)
{
	Sound_Off();
	$.sessionStorage.setItem('query_string', query_string);
	var delayAddr = $.urlParam('rdv', 'www.my.url?'+query_string); // PageToGo
	$("#delayAddr").empty().append("<p><b>Lieu de prise en charge: "+delayAddr+"</b></p>");
	$.mobile.pageContainer.pagecontainer("change", "#delayPop", { transition: "slide"} );
	cordova.plugins.notification.local.clear(1, function() {
		//alert("done");
	});
}
// Cancels direct jobs...
function cancelCall(query_string)
{
	$.mobile.loading( "show" );
	dep = $.localStorage.getItem('dep');
	$.post("https://www.mytaxiserver.com/appserver/open_diary_app_dcvp.php?dep="+dep, query_string, function(data){ 
		$.mobile.pageContainer.pagecontainer("change", "#jobs_taker", { transition: "slide"} );
	}, "json").always(function() { $.mobile.loading( "hide" ); });
	cordova.plugins.notification.local.clear(1, function() {
		// Cleaning direct job notification
	});
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
	dep = $.localStorage.getItem('dep');
	$.post("https://www.mytaxiserver.com/appserver/open_diary_app_dcvp.php?dep="+dep, query_string, function(data){ 
		switch (data.location) {
			 case '#directions_map':
				//navigator.notification.alert('in direction case');
				$.sessionStorage.setItem('rdv', data.rdv);
				$.sessionStorage.setItem('idcourse', data.idcourse);
				$.sessionStorage.setItem('com', data.com);
				$.sessionStorage.setItem('cell', data.cell);
				$.sessionStorage.setItem('cmd', 0);
				$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
				/*
				setTimeout( function () {
					checkCustomerConfirm(dep, query_string);
				}, 30000);
				*/
				//Dispo_Off();
				 
				 break;
			 case '#toolate':
				$.mobile.pageContainer.pagecontainer("change", "#toolate", { transition: "slide"} );
				$.sessionStorage.setItem('idcourse', data.idcourse);
				 
				 break;
			 default: 
				$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
				 
				 break;
		}					
	}, "json").always(function() { Sound_On();});
	cordova.plugins.notification.local.clear(1, function() {
		// Cleaning direct job notification
	});
}
function openCall(query_string)
{
	$.mobile.loading( "show" );
	$.sessionStorage.setItem('query_string', query_string);
	dep = $.localStorage.getItem('dep');
	$.post("https://www.mytaxiserver.com/appserver/open_diary_app_dcvp.php?dep="+dep, query_string, function(data){ 
		switch (data.location) {
			 case '#directions_map':
				//navigator.notification.alert('in direction case');
				$.sessionStorage.setItem('rdv', data.rdv);
				$.sessionStorage.setItem('idcourse', data.idcourse);
				$.sessionStorage.setItem('com', data.com);
				$.sessionStorage.setItem('cell', data.cell);
				$.sessionStorage.setItem('cmd', 0);
				$.mobile.pageContainer.pagecontainer("change", "#directions_map", { transition: "slide"} );
				setTimeout( function () {
					checkCustomerConfirm(dep, query_string);
				}, 30000);
				//Dispo_Off();
				 
				 break;
			 case '#toolate':
				$.mobile.pageContainer.pagecontainer("change", "#toolate", { transition: "slide"} );
				$.sessionStorage.setItem('idcourse', data.idcourse);
				 
				 break;
			 default: 
				$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
				 
				 break;
		}					
	}, "json").always(function() { Sound_On();});
	cordova.plugins.notification.local.clear(1, function() {
		// Cleaning direct job notification
	});
}
// Diary call when accepting cmd jobs or refusing jobs
function diaryCall(query_string)
{
	$.mobile.loading( "show" );
	dep = $.localStorage.getItem('dep');
	$.post("https://www.mytaxiserver.com/appserver/bookings_app_dcvp.php?dep="+dep, query_string, function(data){ 
		switch (data.location) {
			 case '#directions_map':
				//navigator.notification.alert('in direction case');
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
	}, "json").always(function() { Sound_On();});
	cordova.plugins.notification.local.clear(2, function() {
		// Cleaning cmd notification
	});
}
function checkCustomerConfirm(d, q)
{
	$.post("https://www.mytaxiserver.com/appserver/open_status.php?dep=" + d + "&check=0" , q, function(data){ 
		if (data != 0)
		{
			if(app) navigator.notification.alert(data, alertDismissed, 'Mon Appli Taxi', 'OK');
			else alert(data);
			$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
			//return false;
		}
		else {
			Dispo_Off();
		}
	});
}
function callIncident(irdv, ihail, iop, icell, istatus)
{ // callIncident(\''.$rdv.'\', \''.$hail_id.'\', \''.$operator.'\', \''.$cell.'\', \''.$status.'\')
	$.post("https://www.mytaxiserver.com/appserver/open_incident.php" , { rdvpoint: irdv, hail_id: ihail, operator: iop, cell: icell, status: istatus, db: 'true', dep: dep}, function(data){ 
		if (data.ok)
		{
			var number = icell;
			var message = "Le taxi "+taxi+" ne pourra venir vous chercher à cause d'un incident.";
			var intent = ""; //leave empty for sending sms using default intent
			var success = function () {
			};
			var error = function (e) {
			};
			sms.send(number, message, intent, success, error);
			//$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
			//return false;
		}
		else {
			if(app) navigator.notification.alert("Erreur: L'incident n'a pas été déclaré.", alertDismissed, 'Mon Appli Taxi', 'OK');
			else alert("Erreur: L'incident n'a pas été déclaré.");
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
	}
	else {
		navigator.notification.alert("Localisation impossible.", alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
	}
}
function secureCall(position)
{			
	lat = position.coords.latitude;
	lng = position.coords.longitude;
	var rdvpoint = lat + ', ' + lng;
	var helpname = civil + ' ' + nom + ' ' + prenom;
	var myDate = new Date();
	idcourseUrg = myDate.getTime();
	$.sessionStorage.setItem('idcourseUrg', idcourseUrg);
	
	$.post("https://www.mytaxiserver.com/appclient/secure_xml.php", { lat: lat, lng: lng, dep: dep, pass: pass}, function(xml){
																							 
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
			
			$.post("https://www.mytaxiserver.com/appclient/secure.php", { taxi: name, tel: address, rdvpoint: rdvpoint, helptaxi: taxi, helpname: helpname, helptel: tel, idcourse: idcourseUrg, num_req: num_reqUrg, dep: dep, pass: pass}, function(data){
				//$('#secureResults').append(data);
			});
			i++;
		});
		check_answer();
		//navigator.notification.alert('Geoloc results :' + lat + ' - ' + lng);
		//$('#results').append('<p><b>'+name+' - '+address+' - '+lat+' - '+lng+' - '+timestamp+' - '+distance+'</b></p>');
		
	}, "xml");
}
function check_answer()
{
	$.mobile.pageContainer.pagecontainer("change", "#urgency", { transition: "slide"} );
	idcourseUrg = $.sessionStorage.getItem('idcourseUrg');
	sec = setInterval( function () {
		$.post("https://www.mytaxiserver.com/appclient/status.php?idcourse=" + idcourseUrg + "&check=1" , { dep: dep}, function(data){ 
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
	idcourseUrg = $.sessionStorage.getItem('idcourseUrg');
	$.post("https://www.mytaxiserver.com/appclient/secure.php", { taxi: '', tel: '', rdvpoint: '', helptaxi: taxi, helpname: '', helptel: tel, idcourse: idcourseUrg, dep: dep, pass: pass, stopcall: 'true'}, function(data){
		$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide"} );
	});
	//$.sessionStorage.setItem('idcourseUrg', false);
	clearInterval(sec);
}
function openSomeUrl(url)
{
	//window.plugins.childBrowser.showWebPage('http://www.taximedia.fr/redir.php', { showLocationBar: true });
	window.open(url,'_blank','location=false,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function taximedia()
{
	//window.plugins.childBrowser.showWebPage('http://www.taximedia.fr/redir.php', { showLocationBar: true });
	window.open('http://www.taximedia.fr/redir.php','_blank','location=false,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function help()
{
	//window.plugins.childBrowser.showWebPage('http://taximedia.fr/client/help.html', { showLocationBar: true });
	window.open('http://taximedia.fr/client/help.html','_blank','location=false,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function cgv()
{
	//window.plugins.childBrowser.showWebPage('http://taximedia.fr/client/docs/CGV.pdf', { showLocationBar: true });
	window.open('http://taximedia.fr/docs/CGV.pdf','_blank','location=false,enableViewportScale=yes,closebuttoncaption=Fermer');
}
function alertDismissed()
{
	// Do Nothing...
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
		document.addEventListener("pause", onPause, false);
		navigator.splashscreen.hide();
		StatusBar.overlaysWebView(false);
		StatusBar.backgroundColorByHexString("#E7B242");
		// prevent device from sleeping
		window.plugins.powerManagement.acquire();
		//Functions to call only at app first load
		scanner = cordova.require("cordova/plugin/BarcodeScanner");
		$.post("https://www.mytaxiserver.com/appclient/polling.php", {}, function(data) {
			pollingTime = data.polling;
			// Initialising UDP Connexion once...
			udptransmit.initialize(data.udpserver, 80);
			//udptransmit.initialize("51.254.243.15", 80);
			//udptransmit.initialize("geoloc.dev.api.taxi", 80);
			//udptransmit.initialize("geoloc.test.api.taxi", 80);
			//udptransmit.initialize("geoloc.api.taxi", 80);
			//udptransmit.initialize("46.105.34.86", 80);
			//udptransmit.initialize("geoloc.opendatataxi.fr", 80);
		}, "json").always(function(data) {
			setTimeout('update()', 2000);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			udptransmit.initialize(geoserver, 80);
		});
		// For iOS => backgroundtask
		//backgroundtask.start(bgFunctionToRun);
		// For Android => Enable background mode
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.setDefaults({
			title:  'App toujours en fonction, nous vous informons des courses en cours...',
			ticker: 'App toujours en fonction, nous vous informons des courses en cours...',
			text:   'Nous vous informons des courses en cours...'
		});
		// Called when background mode has been activated or deactivated
		cordova.plugins.backgroundMode.onactivate = function () {
			//Sound_Off();
			//cordova.plugins.notification.local.clear(3, function() {});
		}
		cordova.plugins.backgroundMode.ondeactivate = function() {
			// Sadly this event is fired anytime the backgroundMode is deactivated including when the app is just pushed back from back to foreground !! Sad but true ;-)
			//navigator.notification.alert("Bon retour sur l'application.", backFromBackGround, 'Mon Appli Taxi', 'Relancer');
		}
		/*
		cordova.plugins.notification.local.on("click", function (notification, state) {
			//alert(notification.id + " was clicked");
			if(notification.id=='3') backFromBackGround();
		}, this);
		*/
		if (typeof window.udptransmit == 'undefined') {
			alert("udpTransmit is undefined !!");
		}
		getLocation(); // Launching getLocation anyway !!
		//setTimeout('update()', 2000);
		checkCmd();
		cordova.plugins.notification.local.clearAll(function() {
			//alert("All notifications cleared");
		}, this);
	}
}
function onResume() {
	$.post("https://www.mytaxiserver.com/client/active_app.php", { tel: tel, mngid: mngid, dep: dep}, function(data) {});
	if((navigator.network.connection.type == Connection.NONE) || !window.jQuery){
		$("body").empty().append('<img src="no_network.png" width="'+screen.width+'" height="'+screen.height+'" onClick="window.location.reload()" />');
	}
	cordova.plugins.notification.local.clearAll(function() {
		//alert("All notifications cleared");
	}, this);
	Sound_On();
}
function onPause() {
	Sound_Off();
}
function bgFunctionToRun() {
	update();
	getLocation();
	checkCmd();
}
function backFromBackGround() {
	document.location.href='home.html';
}
$.urlParam = function(name, url){
	// Get parameters from an URL
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
	//For current URL
	//var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null){
	   return null;
	}
	else{
	   return results[1] || 0;
	}
}
// Get params from url when called from url the scheme...
function handleOpenURL(url) {
	setTimeout(function() {
		//alert("received url: " + url);
		toApp = $.urlParam('to', url); // PageToGo
		if(toApp=='history') {
			//alert(toApp);
			$.mobile.pageContainer.pagecontainer("change", "#"+toApp, { transition: "slide"} );
		}
	}, 600);
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
					'Valeur du scan:',
					'OK'
				);
		}
	} else if (productFormats.match(result.format)) {
		var searchUrl = "https://www.google.fr/#q=" + result.text;
		setTimeout(function() { window.open(searchUrl,'_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer'); }, 500);
		//setTimeout(function() { window.plugins.childBrowser.showWebPage(searchUrl, { showLocationBar: true }); }, 500);
	} else { navigator.notification.alert("Format du scan: " + result.format + 
			  " NON SUPPORTE. Valeur du scan: " + result.text, alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
	}
}
function goScan ()
{
	scanner.scan(
		scanSuccess, 
		function (error) {
			navigator.notification.alert("Scan Erreur: " + error, alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
		}
	);
}
function contactPick()
{
	var successCallbackPick = function(result){
		setTimeout(function(){
			//navigator.notification.alert(result.name + " " + result.phoneNumber);
			var number = result.phoneNumber;
			$('#telShare').val(number);
		},500);
	};
	var failedCallbackPick = function(result){
		setTimeout(function(){
			//navigator.notification.alert(result);
		},500);
	}
	window.plugins.contactNumberPicker.pick(successCallbackPick,failedCallbackPick);
}
// UDP init Success/Error Handlers...
function UDPTransmitterInitializationSuccess(success) {
	navigator.notification.alert('UDP INIT SUCCESS: '+success, alertDismissed, 'Mon Appli Taxi', 'OK');
	//getLocation();
}

function UDPTransmitterInitializationError(error) {
	navigator.notification.alert('UDP INIT ERROR: '+error, alertDismissed, 'Mon Appli Taxi Erreur', 'OK');
}
function myTaxiDown()
{
	//var url = "http://www.taximedia.fr/stores.php?app=pro";
	//window.open(url,'_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer');
	window.open('montaxipro://?from=driver', '_system');
}
function Share()
{
	var number = $('#telShare').val();
	var message = "Téléchargez l'app Mon Appli Taxi en suivant ce lien : http://www.taximedia.fr/stores.php?app=mytaxi";
	var intent = ""; //leave empty for sending sms using default intent
	var success = function () {
		//navigator.notification.alert('Message sent successfully');
		$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	var error = function (e) {
		//navigator.notification.alert('Message Failed:' + e); 
		$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	sms.send(number, message, intent, success, error);
}
function ShareArt()
{
	var number = $('#telShare').val();
	var message = "Téléchargez l'app Mon Appli Taxi Chauffeur en suivant ce lien : http://www.taximedia.fr/stores.php?app=dcvp";
	var intent = ""; //leave empty for sending sms using default intent
	var success = function () {
		//navigator.notification.alert('Message sent successfully');
		$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	var error = function (e) {
		//navigator.notification.alert('Message Failed:' + e); 
		$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	sms.send(number, message, intent, success, error);
}
function SharePro()
{
	var number = $('#telShare').val();
	var message = "Téléchargez l'app Mon Appli Taxi Business sur les sores en suivant ce lien : http://www.taximedia.fr/stores.php?app=pro  ou rendez-vous sur le WebService en suivant ce lien :  http://www.taximedia.fr/pro/";
	var intent = ""; //leave empty for sending sms using default intent
	var success = function () {
		//navigator.notification.alert('Message sent successfully');
		$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	var error = function (e) {
		//navigator.notification.alert('Message Failed:' + e); 
		$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
		$( "#popSms" ).popup( "open", { positionTo: "window" } );
	};
	sms.send(number, message, intent, success, error);
}
function goToSection(jumpPage, jumpSection)
{
	//goToSection('#manage', '#shareCollaps')
	$.mobile.pageContainer.pagecontainer("change", jumpPage, { transition: "slide"} );
	$(jumpSection).collapsible( "expand" );
}
function contactShare()
{
	var successCallbackPick = function(result){
		setTimeout(function(){
			//navigator.notification.alert(result.name + " " + result.phoneNumber);
			var number = result.phoneNumber;
			var message = "Téléchargez l'app Mon Appli Taxi en suivant ce lien : http://www.taximedia.fr/stores.php?app=mytaxi";
			var intent = ""; //leave empty for sending sms using default intent
			var success = function () {
				//navigator.notification.alert('Message sent successfully');
				$('#smsReturn').empty().append('Message envoy&eacute; avec succ&egrave;s, Merci');
				$( "#popSms" ).popup( "open", { positionTo: "window" } );
			};
			var error = function (e) {
				//navigator.notification.alert('Message Failed:' + e); 
				$('#smsReturn').empty().append('Probl&egrave;me lors de l&rsquo;envoi du message: ' + e);
				$( "#popSms" ).popup( "open", { positionTo: "window" } );
			};
			sms.send(number, message, intent, success, error);
		},500);
	};
	var failedCallbackPick = function(result){
		setTimeout(function(){
			//navigator.notification.alert(result);
		},500);
	}
	window.plugins.contactNumberPicker.pick(successCallbackPick,failedCallbackPick);
}
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
	//navigator.notification.alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}
function modPay() {
	var cardNumber = $('#cbnum').val();
	var exp = $('#cbexpa').val()+'-'+$('#cbexpm').val();
	var cardNetwork = $('#brand').val();
	var cvv = $('#cbval').val();
	$('#modPay').prop('disabled', true).addClass('ui-disabled');
	$.mobile.loading( "show" );
	$.post('https://www.mytaxiserver.com/payzen/updateIndent.php', {cardNumber: cardNumber, exp: exp, cardNetwork: cardNetwork, cvv: cvv, civil: civil, nom: nom, prenom: prenom, tel: tel, email: email, cardIdent: siret, station: station}, function(data){
	}, "json").done(function(data) { 
		var display = '';
		if (data.sniffed == 'OK')
		{
			display = '<p><b>la modification de votre carte bancaire &agrave; bien &eacute;t&eacute; prise en compte, merci.</b></p>';
		}
		/*
		else if (!data.signed)
		{
			display += '<p style="color:red;"><b>Il y a un probl&egrave;me technique avec l&rsquo;enregistrement de la carte bancaire.</b></p>';
		}*/
		else {
			display += '<p style="color:red;"><b>Il y a un probl&egrave;me avec l&rsquo;enregistrement de la carte bancaire, il faut une carte VALIDE de type CB, VISA ou MASTERCARD.<br>'+data.showError+'</b></p>';
		}
		$("#returnsVisa").empty().append(display);
		$("#returnsBox").popup( "open", { positionTo: "window" } );
	}).always(function () {
		//$('#mod_collaps').collapsible( "collapse" );
		$.mobile.loading( "hide" );
		$('#modPay').prop('disabled', false).removeClass('ui-disabled');
	});
}
$('#home').live("swiperight", function() {
	//$.mobile.pageContainer.pagecontainer("change", "#home", { transition: "slide", reverse: true} );
	$("#homepanel_poper").trigger('click');
});
$('#home .ui-content').live("swipeleft", function() {
	$.mobile.pageContainer.pagecontainer("change", "#jobs_taker", { transition: "slide"} );
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
$(document).on( 'pagecreate', function() {
	$( "body>[data-role='panel']" ).panel().enhanceWithin();
	$('.expends').click(function () {
		$(this).next('div').slideToggle('slow');
		//$.mobile.silentScroll($(this).next('div').offset().top);
	});
	if(!app) {
		getLocation();
		//setTimeout('update()', 2000);
		$.post("https://www.mytaxiserver.com/appclient/polling.php", {}, function(data) {
			pollingTime = data.polling;
		}, "json").always(function(data) {
			setTimeout('update()', 2000);
		});
	}
	if (navigator.userAgent.toLowerCase().match(/android/)) {
		$("#player").empty().append('<audio id="play" loop="loop" preload="auto" style="display:none" ><source src="/android_asset/www/sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	}
	else {
		$("#player").empty().append('<audio id="play" loop="loop" preload="auto" style="display:none" ><source src="sounds/ring.mp3" type="audio/mpeg" />Your browser does not support the audio element.</audio>');
	}
	//Dispo_On();
	dispoCheck();
	footer();
	dep = $.localStorage.getItem('dep');
	//alert('taxi: '+taxi+', tel: '+tel+', email: '+email+', dispo: '+dispo+', nom: '+nom+', prenom: '+prenom+', pass: '+pass+', dep: '+dep+', mngid: '+mngid+', group: '+group);
	$('#depMod').val(dep);
	$('#depLeTaxi').val(dep);
	$('#depPwd').val(dep);
	$('#openSwitch').change(function(){
		if ($(this).val()==1) {
			openDataGo=true;
			if(!openDataInit) { // Probably cab is not registered @le.taxi => open register form
				openDataGo=false;
				$(this).val(0).flipswitch( "refresh" );
				goToSection('#manage', '#leTaxiCollaps');
			}
			else Dispo_On();
		}
		else {
			openDataGo=false;
			$.post("https://www.mytaxiserver.com/appclient/open_dispo_app.php?dispo=0", { taxi: taxi, tel: tel, pass: pass, dep: dep, taxi_id: taxi_id, opendata: true, getout: true }); 
		}
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
		 cpro: "required",
		 tel: {
		   required: true,
		   phone: true
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
		 login: {
		   required: "Ce champs est obligatoire"
		 },
		 nom: "Ce champs est obligatoire",
		 prenom: "Ce champs est obligatoire",
		 taxi: "Ce champs est obligatoire",
		 cpro: "Le N&deg; de Carte Professionelle est obligatoire",
		 tel: {
		   required: "Le T&eacute;l&eacute;phone est obligatoire"
		 },
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
		// Form submission if every thing is ok
		,
		submitHandler: function (form) {
			$('#mod_collaps input[type=submit]').button('disable');
			$.mobile.loading( "show" );
			// Subs some data
			$.post("https://www.mytaxiserver.com/appclient/login_app.php", $("#modmy").serialize(), function(data) {
				// GET SHIT BACK !!
				$.localStorage.setItem('civil', data.civil);
				$.localStorage.setItem('nom', data.nom);
				$.localStorage.setItem('prenom', data.prenom);
				$.localStorage.setItem('taxi', data.taxi);
				$.localStorage.setItem('tel', data.tel);
				$.localStorage.setItem('cpro', data.cpro);
				$.localStorage.setItem('email', data.email);
				$.localStorage.setItem('station', data.station);
				$.localStorage.setItem('dep', data.dep);
				$.sessionStorage.setItem('pwd', data.pwd);
				$.sessionStorage.setItem('modmy', data.modmy);
				$.localStorage.setItem('type', data.type);
				$.localStorage.setItem('cb', data.cb);
				$.localStorage.setItem('medic', data.medic);
				$.localStorage.setItem('animal', data.animal);
				$.localStorage.setItem('passengers', data.passengers);
				$.localStorage.setItem('color', data.color);
				$.localStorage.setItem('lang', data.lang);
			}, "json").done(function(data) { 
				reloadVars();
				$('#login').val(data.tel);
				$('#civil').val(data.civil).selectmenu( "refresh" );
				$('#nom').val(data.nom);
				$('#prenom').val(data.prenom);
				$('#taxi').val(data.taxi);
				$('#tel').val(data.tel);
				$('#cpro').val(data.cpro);
				$('#email').val(data.email);
				$('#confirmail').val(data.email);
				$('#station').val(data.station);
				$('#type').val(data.type).selectmenu( "refresh" );
				$('#cb').val(data.cb).flipswitch( "refresh" );
				$('#medic').val(data.medic).flipswitch( "refresh" );
				$('#animal').val(data.animal).flipswitch( "refresh" );
				$('#passengers').val(data.passengers).slider("refresh");;
				$('#color').val(data.color);
				var langTab= data.lang.split(", ");
				for (i = 0; i < langTab.length; i++) {
					switch(langTab[i]) {
						case "en": 
							$('#checkbox1').prop("checked", true).checkboxradio( "refresh" );
							break;
						case "sp": 
							$('#checkbox2').prop("checked", true).checkboxradio( "refresh" );
							break;
						case "it": 
							$('#checkbox3').prop("checked", true).checkboxradio( "refresh" );
							break;
						case "ru": 
							$('#checkbox4').prop("checked", true).checkboxradio( "refresh" );
							break;
						case "ge": 
							$('#checkbox5').prop("checked", true).checkboxradio( "refresh" );
							break;
						case "cn": 
							$('#checkbox6').prop("checked", true).checkboxradio( "refresh" );
							break;
						case "ab": 
							$('#checkbox7').prop("checked", true).checkboxradio( "refresh" );
							break;
					}
				}
				var display = '';
				var alertMe = '';
				if (data.modmy)
				{
					display = '<p><b>la modification de vos informations personnelles &agrave; bien &eacute;t&eacute; prise en compte, merci.</b></p>';
					alertMe = 'la modification de vos informations personnelles à bien été prise en compte, merci.';
				}
				else {
					display = '<p style="color:red;"><b>la modification de vos informations personnelles n&rsquo;&agrave; pas &eacute;t&eacute; prise en compte, aucune modification faite en base de donn&eacute;e.</b></p>';
					alertMe = "la modification de vos informations personnelles n'a pas été prise en compte, aucune modification faite en base de donnée.";
				}
				$.mobile.loading( "hide" );
				$('#mod_collaps').collapsible( "collapse" );
				$('#mod_collaps input[type=submit]').button('enable');
				$("#returns").empty().append(display);
				navigator.notification.alert(alertMe, alertDismissed, 'Mon Appli Taxi', 'OK');
			});
		}
	});
	$("#letaxiForm").validate({
		rules: {
		 insee: {
		   required: true,
		   cp: true
		 },
		 imat: "required",
		 constructor: "required",
		 model: "required",
		 birthdate: "required",
		},
		messages: {
		 insee: {
		   required: "Ce champs est obligatoire"
		 },
		 imat: "Ce champs est obligatoire",
		 constructor: "Ce champs est obligatoire",
		 model: "Ce champs est obligatoire",
		 birthdate: "Le N&deg; de Carte Professionelle est obligatoire",
		}
		/* Put errors below fields
		,
		errorPlacement: function(error, element) {
			error.appendTo( element.parent().next('em') );
		}
		*/
		// Form submission if every thing is ok
		,
		submitHandler: function (form) {
			$('#leTaxiCollaps input[type=submit]').button('disable');
			$.mobile.loading( "show" );
			// Adding the accessHash var to posting data (so that it does not show in code using an hidden input)
			var dataLeTaxi = $('#letaxiForm').serializeArray();
			dataLeTaxi.push({name: 'accessHash', value: accessHash});
			// Subs some data
			$.post("https://www.mytaxiserver.com/appserver/open_register.php", dataLeTaxi, function(data) {
				// GET SHIT BACK !!
				$.localStorage.setItem('insee', data.insee);
				$.localStorage.setItem('imat', data.imat);
				$.localStorage.setItem('constructor', data.constructor);
				$.localStorage.setItem('model', data.model);
				$.localStorage.setItem('birthdate', data.birthdate);
				$.localStorage.setItem('ads', taxi);
				$.localStorage.setItem('tpmr', tpmr);
			}, "json").done(function(data) { 
				reloadVars();
				$('#insee').val(data.insee);
				$('#imat').val(data.imat);
				$('#constructor').val(data.constructor);
				$('#model').val(data.model);
				$('#birthdate').val(data.birthdate);
				$('#tpmr').val(data.tpmr);
				var display = '';
				var alertMe = '';
				if (data.ok)
				{
					display = '<p><b>la modification de vos informations personnelles &agrave; bien &eacute;t&eacute; prise en compte, merci.</b></p>';
					alertMe = 'la modification de vos informations personnelles à bien été prise en compte, merci.';
					// In case Licence plate or any key has changed we have to re-enroll because taxi_id may have changed then !
					$.post("https://www.mytaxiserver.com/appclient/open_enroll_app.php", { tel: tel, insee: insee, dep: dep, mngid: mngid, ads: taxi, cpro: cpro, imat: imat}, function(data) {
						taxi_id = data.taxi_id;
						$.localStorage.setItem('taxi_id', data.taxi_id);
						openStatus = data.status;
						openDataInit=true;
						$("#openSwitch").val(1).flipswitch( "refresh" );
						//dispoCheck();
						//Dispo_On();
					}, "json");
				}
				else {
					display = '<p style="color:red;"><b>la modification de vos informations personnelles n&rsquo;&agrave; pas &eacute;t&eacute; prise en compte, aucune modification faite en base de donn&eacute;e.</b></p>';
					alertMe = "la modification de vos informations personnelles n'a pas été prise en compte, aucune modification faite en base de donnée.";
				}
				$.mobile.loading( "hide" );
				$('#leTaxiCollaps').collapsible( "collapse" );
				$('#leTaxiCollaps input[type=submit]').button('enable');
				$("#returns").empty().append(display);
				navigator.notification.alert(alertMe, alertDismissed, 'Mon Appli Taxi', 'OK');
			});
		}
	});
	$("#change").submit(function(event) {
		// stop form from submitting normally
		event.preventDefault();
		// Subs some data
		$.post("https://www.mytaxiserver.com/appclient/login_app.php", $("#change").serialize(), function(data) {
			// GET SHIT BACK !!
			var display = '';
			var alertMe = '';
			if (data.changed)
			{
				display = '<p><b>Voici les informations d&rsquo;identification qui vous permettront d&rsquo;acc&egrave;der &agrave; votre compte :<br><span style="color:#09F;">Identifiant = ' + data.tel + '<br>Mot de passe = ' + data.pwd + '</span><br>Vous les recevrez dans quelques instants &agrave; cet email : <span style="color:#09F;">' + data.email + '</span>, merci.<br></b></p>';
				alertMe = "Vous recevrez vos nouveaux identifiants dans quelques instants à cet email : " + data.email + ", merci.";
			}
			else {
				display = '<p style="color:red;"><b>la modification de vos informations personnelles n&rsquo;&agrave; pas &eacute;t&eacute; prise en compte, l&rsquo;identifiant fourni ne figurant pas dans notre base de donn&eacute;e.</b></p>';
				alertMe = "la modification de vos identifiants n'à pas été faite, l'identifiant fourni ne figurant pas dans notre base de donnée.";
			}
			$("#returns").empty().append(display);
			navigator.notification.alert(alertMe, alertDismissed, 'Mon Appli Taxi', 'OK');
		}, "json");
	});
});

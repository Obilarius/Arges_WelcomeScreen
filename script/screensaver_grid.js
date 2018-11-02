// VARIABLEN
var AnzahlBilderQuer = 16;
var AnzahlBilderHoch = 4;
var ZeitUeberblendung = 1200; //in Millisekunden (600)
var Intervall = 4000; //in Millisekunden (4000)
var idletime = 60; //sekunden
var imgPath = "img/screensaver_grid/";



var imgOnScreen = [];

$( document ).ready(function() {
	init();

	var lastIndex;
	window.setInterval(function(){
		var rndNr;
		while (true) {
			rndNr = rndNumber(1, 10);
			// Verhindert das zwei mal hintereinander die selbe Zelle dran kommt
			if (rndNr != lastIndex) { break; }
		}
		lastIndex = rndNr;

		newIMG(rndNr);
	}, Intervall);

});


function rndNumber (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newIMG (divNr) {
	var srcdiv;

	// Prüfung ob Quer oder Hochformat Kachel
	if (divNr == 9 || divNr == 10) {
		if(divNr == 9) { srcdiv = ".grid-item1h"; }
		else if(divNr == 10) { srcdiv = ".grid-item2h"; }

		while(1) {
			var rndIMG = rndNumber(1, AnzahlBilderHoch);
			var src = 'url("'+ imgPath +'h' + rndIMG + '.jpg")';
			if (checkOnScreen(src) == -1) {break;}
		}
	} else {
		srcdiv = ".grid-item" + divNr.toString();

		while(1) {
			var rndIMG = rndNumber(1, AnzahlBilderQuer);
			var src = 'url("'+ imgPath + rndIMG + '.jpg")';
			if (checkOnScreen(src) == -1) {break;}
		}
	}

	// URL des alten Bildes zusammenbauen
	var oldUrl = $(srcdiv).css("background-image");
	oldUrl = oldUrl.split("/img/")
	oldUrl = 'url("img/' + oldUrl[1];

	var index = $.inArray(oldUrl, imgOnScreen);
	// console.log(imgOnScreen +"  --  "+ oldUrl + "  --  "+ src+ "  --  "+ index	);
	if (index > -1) {
		imgOnScreen.splice(index, 1);
	}
	imgOnScreen.push(src);


	// Überblendung zu neuem Bild
    $(srcdiv).fadeTo(ZeitUeberblendung, 0, function()
	{
		$(this).css('background-image', src);
	}).fadeTo(ZeitUeberblendung, 1);
}

function checkOnScreen (url) {
	return $.inArray(url, imgOnScreen);
}

function init () {
	$('div.screensaver-grid-container>div').each(function(attr, value){
		var number = attr;
		// var srcdiv = ".grid-item" + number.toString() + " > div";

		if (value.attributes[0].nodeValue == "grid-item1h" || value.attributes[0].nodeValue == "grid-item2h") {
			number = number - 8;
			var src = 'url("' + imgPath + 'h' + number.toString() + '.jpg")';
		} else {
			var src = 'url("' + imgPath + number.toString() + '.jpg")';
		}
		// console.log(number + " -- " + value.attributes[0].nodeValue);
		$(value).css('background-image', src);
		imgOnScreen.push(src);
	});
}


// SCREENSAVER FUNKTIONEN
var mousetimeout;
var screensaver_active = false;


function show_screensaver(){
    $('.screensaver_wrapper').fadeIn(4000);
    $('.grid_container').css("display", "none");
    screensaver_active = true;
}

function stop_screensaver(){
    $('.grid_container').css("display", "grid");
    $('.screensaver_wrapper').fadeOut();
    screensaver_active = false;
}

$(document).mousemove(function(){
    clearTimeout(mousetimeout);

    if (screensaver_active) {
        stop_screensaver();
    }

    mousetimeout = setTimeout(function(){
        show_screensaver();
    }, 1000 * idletime); // 5 secs
});

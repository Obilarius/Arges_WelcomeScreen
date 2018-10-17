// Bsp. Mi 17.10.2018
function getDatumLang(formattedDate) {
  let tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  let day = formattedDate.getDay();
  let date = formattedDate.getDate();
  let m =  formattedDate.getMonth();
  m += 1;  // JavaScript months are 0-11
  let y = formattedDate.getFullYear();
  let dayOfWeek = tage[day];

  if(date < 10){ date = '0' + date; }
  if(m   < 10){ m   = '0' + m; }

  let retString = dayOfWeek + " " + date + "." + m + "." + y

  return retString;
}

// Bsp. 17.10.2018
function getDatum() {
  let formattedDate = new Date();
  let d = formattedDate.getDate();
  let m =  formattedDate.getMonth();
  m += 1;  // JavaScript months are 0-11
  let y = formattedDate.getFullYear();

  if(d < 10){ d = '0' + d; }
  if(m   < 10){ m   = '0' + m; }

  let retString = d + "." + m + "." + y
  return retString;
}

// Sortierfunktion um Terminzeiten zu sortieren
function compareByStarttime(a,b) {
  if (a._Start_Time < b._Start_Time)
    return -1;
  if (a._Start_Time > b._Start_Time)
    return 1;
  return 0;
}

// liest die URL Parameter (?preview=true&date=all usw.) aus und gibt den abgefragten Wert zurück
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? "test" : sParameterName[1];
        }
    }
};

function getDatum() {
  let tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  let formattedDate = new Date();
  let day = formattedDate.getDay();
  let date = formattedDate.getDate();
  let m =  formattedDate.getMonth();
  m += 1;  // JavaScript months are 0-11
  let y = formattedDate.getFullYear();
  let dayOfWeek = tage[day];

  if(day < 10){ day = '0' + day; }
  if(m   < 10){ m   = '0' + m; }

  let retString = dayOfWeek + " " + date + "." + m + "." + y

  return retString;
}

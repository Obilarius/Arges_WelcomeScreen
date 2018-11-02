// VARIABLES
var borderTop = 20; // vh
var borderBottom = 95; // vh
var borderLeft = 2; // vw
var borderRight = 80;  // vw
var speed = 1;
var moveStep = 1; // px
var textdiv = ".moving-info-text";


var windowWidthPx = $(window).width();
var windowHeightPx = $(window).height();
var borderTopPx = parseFloat(windowHeightPx * borderTop / 100);
var borderBottomPx = parseFloat(windowHeightPx * borderBottom / 100);
var borderLeftPx = parseFloat(windowWidthPx * borderLeft / 100);
var borderRightPx = parseFloat(windowWidthPx * borderRight / 100);
var moveX = moveStep;
var moveY = moveStep;

setInterval(function(){
  var posX = parseFloat($(textdiv).css('left').replace(/[^-\d\.]/g, ''));
  var posY = parseFloat($(textdiv).css('top').replace(/[^-\d\.]/g, ''));

  var newPosX = posX + moveX;
  var newPosY = posY + moveY;

  if (newPosX <= borderLeftPx || newPosX >= borderRightPx) {
    moveX = moveX * (-1);
  }
  if (newPosY <= borderTopPx || newPosY >= borderBottomPx) {
    moveY = moveY * (-1);
  }

  $(textdiv).css("left",newPosX);
  $(textdiv).css("top", newPosY);
}, 10 * speed);

/* VARIABLES */

/* DOM VARIABLES */
var h1;
var prevBtn;
var slider;
var nextBtn;
var div;

var slide;
var slideWidth;
var style;
var slideMargin;
var selectSlide;
var currentCap;
var slides;

/* FUNCTION VARIABLES */

var isSliding=false;



/* END VARIABLES */


window.onload = function() {

	refreshRequest();
	
	/* -----------------------INITIALIZE DOM----------------------- */
	
	/* Selector div */
	slide = document.getElementById('s0');
	div = document.createElement('div');

	syncSelector();
	
	document.body.appendChild(div);
	/* Fin Selector div */
	

	/* -----------------------END INITIALIZE DOM----------------------- */
	
	
	// SET VARIABLES FOR FUNCTIONS
	h1 = document.getElementById('ip');
	slideWidth = slide.offsetWidth;
	style = getComputedStyle(slide);
	slideMargin = parseFloat(style.marginLeft);

	slider = document.getElementById('slider');
	nextBtn = document.getElementById('previous');
	prevBtn = document.getElementById('next');

	selectSlide = slide;
	currentCap = slide;
	currentCap.classList.add("current");
	
	slides = document.querySelectorAll('.slide');
	console.log(slides);
	
	
	fetch("http://192.168.44.27:80/cgi-bin/ip.cgi")
	.then(function(response) {
	  return response.text();
	}).then(function(data) {
	  h1.innerHTML = "Dashboard " + data;
	});


	/* -----------------------INITIALIZE DOM EVENT LISTENER----------------------- */
	for (var i = 0; i < slides.length; i++) {
		slides[i].addEventListener('click', clickOnSlide);
	}
	
	nextBtn.addEventListener('click', sliderNext);
	prevBtn.addEventListener('click', sliderPrev);

};

window.onresize = function() {
	syncSelector();
}

/* FONCTIONS */


function refreshRequest() {
	fetch("http://192.168.44.27:80/html/script.txt")
	.then(function(response) {
	  return response.text();
	}).then(function(data) {
	  data = data.split(/(?={)/);
	  for(i=0; i<data.length; i++){
		data[i] = JSON.parse(data[i]);
	  }
	  recordslist(data);
	});
	setTimeout(refreshRequest, 5000);
}

function recordslist(tab)
{
	for(i=0; i<slides.length; i++){
		j = slides[i].children[2];

		tab.forEach(function(cap) {
			if(cap.id == j.id){
				j.innerHTML = cap[j.className]; 
				return;
			}
		});
	
	}

}

function sliderNext() {
  return move(-1);
}
function sliderPrev() {
  return move(1);
}

function move(step){
	console.log(step);
	if (isSliding) return;
	isSliding=true;
	goalSlideId = parseInt(selectSlide.id.replace("s","")) + step;
	  
	  if (goalSlideId < 0 || goalSlideId >= slides.length) {
		  console.log('Exit out of array');
		  isSliding=false;
	    return;
	  }
	  
		console.log(goalSlideId);
		
	  selectSlide = document.getElementById("s" + goalSlideId);
	  console.log(selectSlide);
  
  beg = parseFloat(getComputedStyle(slider).left);
  end = beg + (slideWidth + slideMargin)*step;
  function goRight () {
    var cur = parseFloat(getComputedStyle(slider).left);
    
    setTimeout(function () {      
						if (cur < end) {
							slider.style.left = cur + ((slideWidth + slideMargin)*0.1) + 'px';
							goRight();
						} else {
							console.log("move right finished")
							  isSliding=false;
						}
					}, 5);
 }
  function goLeft () {
    var cur = parseFloat(getComputedStyle(slider).left);
    
    setTimeout(function () {      
						if (cur > end) {
							slider.style.left = cur - ((slideWidth + slideMargin)*0.1) + 'px';
							goLeft();
						} else {
							console.log("move left finished")
							  isSliding=false;
						}
					}, 5);
 }
  if(step<0) {
    goLeft();
  }
  else{
    goRight();
  }
  
  setCurrent();
  }



function setCurrent(slide) {
	if (slide === undefined) {
		slide = selectSlide;
	}
	currentCap.classList.remove("current");
	currentCap = slide;
	currentCap.classList.add("current");
}
function clickOnSlide(){
	//console.log(event.srcElement); clicked element : svg, span ...
	//console.log(this); event listener linked element
	move(this.id.replace("s","") - selectSlide.id.replace("s",""));
}

function syncSelector() {
	div.style.width =(slide.offsetWidth +10 )+ "px";
	div.style.height =(slide.offsetHeight + 10 )+ "px";
	div.style.border = "5px dashed black";
	div.style.position = "absolute";
	div.style.top = (slide.getBoundingClientRect().top - 10 ) + "px";
	div.style.left = (slide.getBoundingClientRect().left - 11 ) + "px";
	div.style.pointerEvents = "none";
	//div.style.zIndex = "5";
}


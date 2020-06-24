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


/* DATA */
const format = [
	{
		"type": "Digital Input",
		"key": "Digital_Input",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Digital Output",
		"key": "Digital_Output",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Analog Input",
		"key": "Analog_Input",
		"unit": "Volt",
		"icon": ""
	},
	{
		"type": "Analog Output",
		"key": "Analog_Output",
		"unit": "Volt",
		"icon": ""
	},
	{
		"type": "Generic Sensor",
		"key": "Generic_Sensor",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Illuminance",
		"key": "Illuminance",
		"unit": "Lux",
		"icon": "/img/lux.svg"
	},
	{
		"type": "Presence",
		"key": "Presence",
		"unit": "Personnes",
		"icon": ""
	},
	{
		"type": "Temperature",
		"key": "Temperature",
		"unit": "degré",
		"icon": "/img/temp.svg"
	},
	{
		"type": "Humidity",
		"key": "Humidity",
		"unit": "%",
		"icon": "/img/hum.svg"
	},
	{
		"type": "Power Measurement",
		"key": "Powermeas",
		"unit": "Watt",
		"icon": ""
	},
	{
		"type": "Actuation",
		"key": "Actuation",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Set Point",
		"key": "Set_Point",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Load Control",
		"key": "Load_Control",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Light Control",
		"key": "Light_Control",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Power Control",
		"key": "Power_Control",
		"unit": "",
		"icon": ""
	},
	{
		"type": "Accelerometer",
		"key": "Accelerometer",
		"unit": "g",
		"icon": "/img/acc.svg"
	},
	{
		"type": "Magnetometer",
		"key": "Magnetometer",
		"unit": "Tesla",
		"icon": ""
	},
	{
		"type": "Barometer",
		"key": "Barometer",
		"unit": "Bar",
		"icon": "/img/bar.svg"
	},{
		"type": "Voltage",
		"key": "Voltage",
		"unit": "Volt",
		"icon": ""
	},
	{
		"type": "Current",
		"key": "Current",
		"unit": "Ampère",
		"icon": ""
	},
	{
		"type": "Frequency",
		"key": "Frequency",
		"unit": "Hz",
		"icon": ""
	},
	{
		"type": "Depth",
		"key": "Depth",
		"unit": "Métre",
		"icon": ""
	},{
		"type": "Percentage",
		"key": "Percentage",
		"unit": "%",
		"icon": ""
	},
	{
		"type": "Altitude",
		"key": "Altitude",
		"unit": "Métre",
		"icon": ""
	},
	{
		"type": "Load",
		"key": "Load",
		"unit": "%",
		"icon": ""
	},
	{
		"type": "Pressure",
		"key": "Pressure",
		"unit": "Bar",
		"icon": ""
	},{
		"type": "Distance",
		"key": "Distance",
		"unit": "Métre",
		"icon": ""
	},
	{
		"type": "Energy",
		"key": "Energy",
		"unit": "Watt",
		"icon": ""
	},
	{
		"type": "Direction",
		"key": "Direction",
		"unit": "degré",
		"icon": ""
	},
	{
		"type": "Time",
		"key": "Time",
		"unit": "Second",
		"icon": ""
	},
	{
		"type": "Gyrometer",
		"key": "Gyrometer",
		"unit": "Degré / seconde",
		"icon": ""
	},
	{
		"type": "Colour",
		"key": "Colour",
		"unit": "RGBA",
		"icon": ""
	},
	{
		"type": "Location",
		"key": "Location",
		"unit": "Latitude, Longitude, Altitude",
		"icon": ""
	}
];
var capteurs = [];

/* END DATA */

/* GRAPHE */
var ctx;
var myChart;

/* FUNCTION VARIABLES */

var isSliding=false;



/* END VARIABLES */


window.onload = function() {

	//refreshRequest();
	initCapteurLoad();
	

	
	
	// SET VARIABLES FOR FUNCTIONS
	h1 = document.getElementById('ip');


	slider = document.getElementById('slider');
	nextBtn = document.getElementById('previous');
	prevBtn = document.getElementById('next');


	/* Requete lancé à l'initialisation

	/* Requete permettant de récuperer l'adresse IP du noeud courant */
	fetch("/ip.txt") // http://192.168.44.27:80/cgi-bin/ip.cgi
	.then(function(response) {
	  return response.text();
	}).then(function(data) {
	  h1.innerHTML = "Dashboard " + data;
	});




	/* -----------------------INITIALIZE DOM EVENT LISTENER----------------------- */

	
	nextBtn.addEventListener('click', sliderNext);
	//nextBtn.addEventListener('dblclick', jumpNext);

	prevBtn.addEventListener('click', sliderPrev);
	//prevBtn.addEventListener('dblclick', jumpPrev);


	ctx = document.getElementById('myChart').getContext('2d');

};

window.onresize = function() {
	syncSelector();
}

/* FONCTIONS */


function sliderNext() {
	move(-1);
}
function sliderPrev() {
	move(1);
}

function jumpNext() {
	return move(-10);
}
function jumpPrev() {
	return move(10);
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
	createChart(capteurs[this.id.replace("s","")]);
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













function initCapteurLoad() {
	fetch("script.txt") // http://192.168.44.17:80/api/allCap
		.then(function(response) {
			return response.text();
		}).then(function(data) {
		data = JSON.parse(data);
		//console.log(data);
		loadCapteurs(data);
		initSlides();
	});

	setTimeout(autoReload, 10000);
}



function autoReload() {
	fetch("script.txt")
		.then(function(response) {
			return response.text();
		}).then(function(data) {
			data = JSON.parse(data);
			//console.log(data);
			updateCapteurs(data);
			updateSlides();
			//console.log(capteurs);
	});

	setTimeout(autoReload, 10000);
}

function initSlides() {
	capteurs.forEach((capteur, index) => createSlide(index, capteur.capteurId, capteur.type, capteur.value, capteur.unit, capteur.icon));
	slides = document.querySelectorAll('.slide');

	/* -----------------------INITIALIZE DOM----------------------- */

	/* Selector div */
	slide = document.getElementById('s0');
	div = document.createElement('div');
	createChart(capteurs[0]);

	syncSelector();

	document.body.appendChild(div);
	/* Fin Selector div */

	slideWidth = slide.offsetWidth;
	style = getComputedStyle(slide);
	slideMargin = parseFloat(style.marginLeft);


	selectSlide = slide;
	currentCap = slide;
	currentCap.classList.add("current");


	/* -----------------------END INITIALIZE DOM----------------------- */

	for (var i = 0; i < slides.length; i++) {
		slides[i].addEventListener('click', clickOnSlide);
	}
}

function updateSlides() {
	capteurs.forEach((capteur, index) => updateSlide(capteur.value, capteur.unit, index));
}

function createSlide(index, id, type, value, unit, icon) {
	var a = document.createElement("a");
	a.className += "slide";
	a.id = "s" + index;

	var img = document.createElement("img");
	if(!icon || icon == null || icon == "") icon = "/img/default.svg"
	img.src = icon;

	var span1 = document.createElement("span");
	span1.innerText = "Capteur " + id + " / " + type;
	var span2 = document.createElement("span");
	span2.innerText = value + " " + unit;

	a.appendChild(img);
	a.appendChild(span1);
	a.appendChild(span2);

	document.getElementById('slider').appendChild(a);
}

function updateSlide(value, unit, index) {
	document.getElementById("s" + index).children[2].innerText = value + " " + unit;;
}

function stringToObject(el) {
	el = JSON.parse(el);
}


function loadCapteurs(el) {

	for (let i=0; i < el.length; i++) {
		for (const [key, value] of Object.entries(el[i])) {
			if(key != "id"){
				var newObject = {
					capteurId: el[i].id,
					key: key,
					value: value,
					values: [value],
					times: [moment().format('DD/MM HH:mm')],
					type: getType(key),
					unit: getUnit(key),
					icon: getIcon(key)
				}
				//console.log(newObject);
				capteurs.push(newObject);
			}
		}
	}
}

function updateCapteurs(el) {

	for (let i=0; i < el.length; i++) {
		for (const [key, value] of Object.entries(el[i])) {
			if(key != "id"){

				var oldCap = capteurs.find(function (oldCap) {
					return oldCap.capteurId == el[i].id && oldCap.key == key;
				});

				oldCap.value = value;
				oldCap.values.push(value);
				oldCap.times.push(moment().format('DD/MM HH:mm'));

			}
		}
	}
	myChart.update();
}

function createChart(capteur) {
	myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: capteur.times,
			datasets: [{
				label: capteur.type + " (" + capteur.unit + ") ",
				data: capteur.values,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {}
	});
}

function getType(key) {
	return format.find(function(el){
		return el.key === key;
	}).type;
}

function getUnit(key) {
	return format.find(function(el){
		return el.key === key;
	}).unit;
}

function getIcon(key) {
	return format.find(function(el){
		return el.key === key;
	}).icon;
}



var css = require("styles.scss");

document.head.innerHTML += '<style type="text/css">' + css + '</style>';

setTimeout(function(){
	var el = document.getElementById("foo");
	window.__global = document.body.clientWidth + ";" + document.body.clientHeight + ";" + el.clientHeight;
},700);
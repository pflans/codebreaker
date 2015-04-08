
'use strict';
var CODEBREAKER = CODEBREAKER || {};

CODEBREAKER = (function(){

	CODEBREAKER.init = function (){
		console.log('init');
	}

	
	var Peg = function(pegrow, pos, color){
		console.log('peg created');
		this.pegrow = pegrow; // Belongs to pegrow id
		this.pos = pos; // Position in row
		this.color = color; // Default peg color
	}





});

CODEBREAKER.init();
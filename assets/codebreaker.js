//$(function(){
	//'use strict';
	var CODEBREAKER = {};

	CODEBREAKER.debugMode = true; // Member CODEBREAKER


	// 0: Grey 
	// 1: Blue
	// 2: Green
	// 3: Yellow
	// 4: Pink
	// 5: Purple
	// 6: Red
	var pegIds = [0,1,2,3,4,5,6]; 
	var pegColors = {
		0: '#808080',
		1: '#0066FF',
		2: '#009933',
		3: '#FFFF00',
		4: '#FF33CC',
		5: '#FF00FF',
		6: '#FF0000',
	};
	var gameRows = 2; // 1 indexed

	var canvas; // Global element

	function Peg (color, pegrow, pos) {

		this.selectable = true;
		this.color = color;
		this.pegrow = pegrow;
		this.pos = pos;

		this.setColor = function(color){
			this.color = color;
		};
		setPegrow = function(row){
			this.pegrow = row;
		};
		setPos = function(pos){
			this.pos = pos;
		};
	}

	CODEBREAKER.init = function (){
		var _ = this;

		if (CODEBREAKER.debugMode){
			console.log('=== DEBUG TRUE ====')
		}

		CODEBREAKER.setupBoard();
		CODEBREAKER.eventListeners();
	};


	CODEBREAKER.setupBoard = function (){
		var shield = $('#shield');
		var shieldRow = $('#shield .row')
		var board = $('#board');
		var boardRow = $('#board .row');


		// TODO: This sometimes outputs out of order of data-cbrow
		for (i = 1; i < gameRows+1; i++){ // 1 indexed due to shield being row 0. Probably a bad idea?
			var newRow = boardRow.clone();

			newRow.children('ul.pegrow').data('cbrow', i); // might be unneed to add data to parent

			newRow.find('li.peg').each(function(index, value){
				$(this).data('cbpeg', index).data('cbrow', i);
			});
			board.append(newRow);
		}

		var newShield = shield.clone();

		newShield.children('ul.pegrow').data('cbrow', i); // might be unneed to add data to parent
				
		newShield.find('li.peg').each(function(index, value){
			$(this).data('cbpeg', index).data('cbrow', 0);
		});

		shield.append(newShield);

		shieldRow.remove();
		boardRow.remove();
		

	};

	CODEBREAKER.eventListeners = function (){
		var c = 0;
		$('.peg').on('click', function() {
			CODEBREAKER.pickPeg($(this), c);
			c++;
		});
	};

	/* 
		
		1. check if unlocked (unpicked);
		2. if unlocked: click for color change
		3. confirm button in bottom to end picking
	

	*/

	CODEBREAKER.pickPeg = function pickPeg(that, i){
		CODEBREAKER.Utils.debugFunction($(this));
		console.log(that.data());
		that.css('background-color',CODEBREAKER.Utils.getColorFromID(i));
	};



	CODEBREAKER.init();


	CODEBREAKER.Utils = {};

	CODEBREAKER.Utils.debugFunction = function(_){
		if (CODEBREAKER.debugMode) {
			console.log('function: '+CODEBREAKER.Utils.debugFunction.caller.name);
		};
	};

	CODEBREAKER.Utils.getColorFromID = function(id){
		return pegColors[id];
	};

//});
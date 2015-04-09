//$(function(){
	//'use strict';
	var CODEBREAKER = {};

	CODEBREAKER.debugMode = true; // Member CODEBREAKER

	// 0: Grey 
	// 1: Blue
	// 2: Green
	// 3: Yellow
	// 4: Neon Green
	// 5: Purple
	// 6: Red
	var pegIds = [0,1,2,3,4,5,6]; 

	CODEBREAKER.pegColors = {
		colors: {
			0: '#808080',
			1: '#0066FF',
			2: '#009933',
			3: '#FFFF99',
			4: '#99FF00',
			5: '#FF00FF',
			6: '#FF0000',
		},

		defaultColor: 0,

		playableColors: function (){
			var _ = this;
			var playableColors = _.colors;
			delete playableColors[0];
			return playableColors;
		}
	}

	var gameRows = 2; // Gameboard rows
	gameRows++; // Add home row

	var canvas; // Global element

	CODEBREAKER.turnCounter = 0;
	CODEBREAKER.pegs = {};

	CODEBREAKER.addPeg = function(peg) {

		if (CODEBREAKER.pegs[peg.pegrow]) {
	    	CODEBREAKER.pegs[peg.pegrow].push(peg);
	    } else {
	    	CODEBREAKER.pegs[peg.pegrow] = [peg];
	    }
	};

	function Peg (color, pegrow, pos, el) {

		this.color = color;
		this.pegrow = pegrow;
		this.pos = pos;
		this.element = el;

		this.setColor = function(color){
			this.color = color;
		};
		setPegRow = function(row){
			this.pegrow = row;
		};
		setPos = function(pos){
			this.pos = pos;
		};
	};

	CODEBREAKER.init = function (){

		if (CODEBREAKER.debugMode){
			console.log('==== DEBUG TRUE ======');
		}

		CODEBREAKER.setupBoard();
		CODEBREAKER.eventListeners();
		CODEBREAKER.gameTurn();
	};

	CODEBREAKER.gameTurn = function (){

		var turn = CODEBREAKER.turnCounter;
		var rows = $('#codebreaker').find(".row").get().reverse();
		
		CODEBREAKER.Utils.debugFunction('gameturn: '+ turn);

		$(rows[turn]).find('.infocontainer button.confirm').prop('disabled',false);

		// Remove all previous event listeners on pegs
		$('.peg').unbind('click.CB.peg');

		// Add event listeners to current playable pegs
		$(CODEBREAKER.pegs[turn]).each(function(index, value){
			$(CODEBREAKER.pegs[turn][index].element).on('click.CB.peg', function() {
				CODEBREAKER.changeColor(CODEBREAKER.pegs[turn][index].element);
			});
		});


	};


	CODEBREAKER.setupBoard = function (){
		var	shield = $('#shield'),
			board = $('#board'),
			keyRow = $('#board ul.keyrow'),
			pegRow = $('#shield .row');

		for (i = 0; i < gameRows; i++){ 
			var newRow = pegRow.clone();
			var targetContainer = (i === 0 ? shield : board);

			newRow.appendTo(targetContainer);

			newRow.find('li.peg').each(function(index, value){
				var peg = new Peg(CODEBREAKER.pegColors.defaultColor, i, index, $(this));
				CODEBREAKER.addPeg(peg);
			});

			pegRow.remove();
			keyRow.remove();
		}
	};

	CODEBREAKER.eventListeners = function (){
		;
		$('.confirm').on('click', function() {
			CODEBREAKER.confirmRow($(this));
		});
	};

	CODEBREAKER.changeColor = function(peg){
			var color,
				colors = CODEBREAKER.pegColors.playableColors();

			peg.removeClass('invalid');

			if (!peg.attr('data-cbcolor')){
				color = 1;
			} else {
				var prevColor = parseInt(peg.attr('data-cbcolor'), 10); // @todo: this is probably not the best way
				if (prevColor === Object.keys(colors).length){
					color = 1;
				} else {
					color = prevColor + 1;
				}
			}
			peg.attr('data-cbcolor', color).css('background-color', colors[color]);
	};

	CODEBREAKER.confirmRow = function(button){

		var baddata = false, 
			pegs = $(button).siblings('li.peg');
		pegs.each(function(){
			if (!$(this).attr('data-cbcolor')){
				$(this).addClass('invalid');
				baddata = true;
			}
		});
		
		return baddata ? false : true;;
	};

	/* 
		
		1. check if unlocked (unpicked);
		2. if unlocked: click for color change
		3. confirm button in bottom to end picking
	

	*/

	CODEBREAKER.refreshBoard = function (){


	};



	


	CODEBREAKER.Utils = {};

	CODEBREAKER.Utils.debugFunction = function(x){
		if (CODEBREAKER.debugMode) {
			console.log(x);
		};
	};

	CODEBREAKER.Utils.getColorFromID = function(id){
		return pegColors[id];
	};

	CODEBREAKER.init();
//});
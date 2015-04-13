//$(function(){
//	'use strict';

	var CODEBREAKER = {};

	// ========
	// Settings
	// ========

	CODEBREAKER.debugMode = true; 
	CODEBREAKER.maxTurns = 6; 

	CODEBREAKER.gameColors = {
		yes: '#00FF00',
		no: '#FF0000'
	}

	// Scoring key peg colors 
	CODEBREAKER.keyColors = {
		hit: '#000000',
		miss: '#ffffff'
	}
	// Game board peg colors
	CODEBREAKER.pegColors = {
		// 0: Grey 
		// 1: Blue
		// 2: Green
		// 3: Yellow
		// 4: Neon Green
		// 5: Purple
		// 6: Red
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
			var playableColors = this.colors;
			delete playableColors[0];
			return playableColors;
		}
	}

	// ========
	// Initialize Variables 
	// ========
	
	CODEBREAKER.turnCounter = 0;
	CODEBREAKER.pegs = {};
	CODEBREAKER.rowContainer = $('#shield .row').clone();
	CODEBREAKER.gameOver = false;


	CODEBREAKER.init = function (){

		if (CODEBREAKER.debugMode){
			console.log('==== DEBUG TRUE ======');
		}

		CODEBREAKER.setupBoard();
	};

	// ========
	// Classes 
	// ========
	//
	// Peg Class
	//
	var Peg = function (color, pegrow, pos, el) {
		var that = this;

		this.color = color;
		this.pegrow = pegrow;
		this.pos = pos;
		this.element = el;

		this.setColor = function(color){
			this.color = color;
			$(this.element).css('background-color', CODEBREAKER.getColorFromID(color));
		};
		this.setPegRow = function(row){
			this.pegrow = row;
		};
		this.setPos = function(pos){
			this.pos = pos;
		};
	};

	// ========
	// Methods 
	// ========
	//
	// Peg Methods
	//
	CODEBREAKER.addPeg = function(color, row, pos, el) {
		var peg = new Peg(color, row, pos, el);

		if (CODEBREAKER.pegs[peg.pegrow]) {
	    	CODEBREAKER.pegs[peg.pegrow].push(peg);
	    } else {
	    	CODEBREAKER.pegs[peg.pegrow] = [peg];
	    }
	};

	CODEBREAKER.changePegColor = function(peg){
		var color,
			colors = CODEBREAKER.pegColors.playableColors();

		peg.element.removeClass('invalid');

		if (peg.color === 0){
			peg.setColor(1);
		} else {
			if (peg.color === Object.keys(colors).length){
				peg.setColor(1);
			} else {
				peg.setColor(peg.color + 1);
			}
		}

	};
	//
	// Row Methods
	//
	CODEBREAKER.newRow = function(rowNumber){
		var	board = $('#board'),
			pegRow = CODEBREAKER.rowContainer;

		var newRow = pegRow.clone();
	
		newRow.find('li.peg').each(function(index, value){
			CODEBREAKER.addPeg(CODEBREAKER.pegColors.defaultColor, rowNumber, index, $(this));
		});

		newRow.prependTo(board);
	};

	CODEBREAKER.confirmRow = function(){
		var turn = CODEBREAKER.turnCounter,
			pegs = CODEBREAKER.pegs[turn],
		    colors = pegs.map(function(peg){
				if (peg.color == 0){
					if(!$(peg.element).hasClass('invalid')){
						$(peg.element).addClass('invalid');
					}	
				}
				return peg.color;
			});
		if (colors.indexOf(0) > -1){
			return false;;
		} else {
			return true;;
		}
	};

	CODEBREAKER.scoreRow = function() {
		var homeRow = {},
			turnRow = {},
			HITkeys = 0,
			MISSkeys = 0,
			misses = [],
			homeRow_obj = CODEBREAKER.pegs[0],
			turnRow_obj = CODEBREAKER.pegs[Object.keys(CODEBREAKER.pegs).length - 1];

		for (var index in homeRow_obj){
			if (homeRow_obj.hasOwnProperty(index)) {
		    	homeRow[homeRow_obj[index].pos] = homeRow_obj[index].color;
			}
		}
		for (var index in turnRow_obj){
			if (turnRow_obj.hasOwnProperty(index)) {
		    	turnRow[turnRow_obj[index].pos] = turnRow_obj[index].color;
			}
		}

		for (var i = 0; i < Object.keys(turnRow).length; i++){
			if (turnRow[i] === homeRow[i]){
				HITkeys++;
				turnRow[i] = undefined;
				homeRow[i] = undefined;
			} else {

				misses.push(turnRow[i]);
			}
		}

		var homeRowArray = $.map(homeRow, function(value, index) {
			return [value];
		});

		for (var number in misses) {
			var numIndex = homeRowArray.indexOf(misses[number]);
			if (numIndex > -1){
				homeRowArray.splice(numIndex, 1);
				MISSkeys++;
			}
		}

		return {
		    misses: MISSkeys,
		    hits: HITkeys
		}; 
	};

	CODEBREAKER.toggleShield = function(){

			$('#shield').slideToggle();
	};

	//
	// Key Methods
	//
	CODEBREAKER.updateGameKey = function(row, rowScore){
		var misses = rowScore.misses,
			hits = rowScore.hits;

		$(row).find('.keyrow').children('li.key').each(function (index, value){
				if (hits > 0){
					$(this).css('background-color', CODEBREAKER.keyColors.hit);
					hits--;
				} else if (misses > 0){
					$(this).css('background-color', CODEBREAKER.keyColors.miss);
					misses--;
				}
		});
	};

	// ========
	// Board Setup 
	// ========

	CODEBREAKER.setupBoard = function (){
		$('#shield').find('li.peg').each(function(index, value){
				CODEBREAKER.addPeg(CODEBREAKER.pegColors.defaultColor, 0, index, $(this));
		});
		CODEBREAKER.manageEventListerners();
		CODEBREAKER.debugFunction('setupBoard');
	};

	CODEBREAKER.manageEventListerners = function(){
			var turn = CODEBREAKER.turnCounter,
				currentPegs = CODEBREAKER.pegs[turn],
				rows = $('#codebreaker').find(".row").get().reverse(),
				currentRow = $(rows[turn]);

			// Remove all previous event listeners on pegs
			$('.peg').unbind('click.CB.peg');
			
			// Add event listeners to current playable pegs
			$(currentPegs).each(function(index, value){
				currentPegs[index].element.on('click.CB.peg', function() {
					CODEBREAKER.changePegColor(currentPegs[index]);
				});
			});

			// Disable other buttons
			$('button.confirm').prop('disabled', true);
			// Enable confirm button
			currentRow.find('.infocontainer button.confirm').prop('disabled',false);

			// Remove previous event listerners on buttons
			$('button.confirm').unbind('click.CB.confirm');

			// Add event listerners to confirm button
			currentRow.find('button.confirm')
				.on('click.CB.confirm', function() {
					if (CODEBREAKER.confirmRow()){
						// if turn one, start game
						if (turn === 0){
							CODEBREAKER.newRow(1); // Starting first board row
							CODEBREAKER.gameTurn();
						} else {
							CODEBREAKER.updateGameKey(currentRow, CODEBREAKER.scoreRow());
							if (CODEBREAKER.scoreRow().hits === Object.keys(currentPegs).length){
								CODEBREAKER.GameOver(true);
							} else {
								if (CODEBREAKER.turnCounter === CODEBREAKER.maxTurns){
									CODEBREAKER.GameOver(false);
								} else {
									CODEBREAKER.newRow(turn+1);
									CODEBREAKER.gameTurn();
								}
							}
						}
						
					}
				})
				.on('mousedown.CB.confirm', function(){
					var check = $(this).find('i').last();
					check.show();
					if (CODEBREAKER.confirmRow()){
						check.css('color', CODEBREAKER.gameColors['yes']);
					} else {
						check.css('color', CODEBREAKER.gameColors['no']);
					}
				})
				.on('mouseup.CB.confirm', function(){
					var check = $(this).find('i').last();
					check.hide();
				});

	};

	// ========
	// Game Logic 
	// ========

	CODEBREAKER.gameTurn = function(){
		if (!CODEBREAKER.gameOver){
			if (CODEBREAKER.turnCounter == 0){
				CODEBREAKER.toggleShield();
			} 
			CODEBREAKER.turnCounter++;
			CODEBREAKER.manageEventListerners();
			CODEBREAKER.debugFunction('gameturn: '+ CODEBREAKER.turnCounter);
		}
	};

	CODEBREAKER.GameOver = function(victoryBool) {
		if (!CODEBREAKER.gameOver){
			CODEBREAKER.gameOver = true;
			$('.peg').unbind('.CB');
			$('button.confirm').unbind('.CB');
			if (victoryBool) {
				alert('You Win!');
			}else{
				alert('You lose! Good day Sir!');
			}
		}
	};

	// ========
	// Utilities 
	// ========

	CODEBREAKER.getColorFromID = function(id){
		return CODEBREAKER.pegColors.colors[id];
	};

	CODEBREAKER.debugFunction = function(x){
		if (CODEBREAKER.debugMode) {
			console.log('DEBUG:: '+x);
		};
	};
		
	CODEBREAKER.init();

//});
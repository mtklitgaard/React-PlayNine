/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Game = __webpack_require__(2);
	__webpack_require__(8);

	React.render(React.createElement(Game, null), document.getElementById('container'));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var StarsFrame = __webpack_require__(3);

	var ButtonFrame = __webpack_require__(4);

	var AnswerFrame = __webpack_require__(5);

	var NumbersFrame = __webpack_require__(6);

	var DoneFrame = __webpack_require__(7);

	var Game = React.createClass({
		displayName: 'Game',

		getInitialState: function getInitialState() {
			return {
				numberOfStars: this.randomNumber(),
				selectedNumbers: [],
				usedNumbers: [],
				redraws: 5,
				correct: null,
				doneStatus: null };
		},
		resetGame: function resetGame() {
			this.replaceState(this.getInitialState());
		},
		randomNumber: function randomNumber() {
			return Math.floor(Math.random() * 9) + 1;
		},
		possibleSolution: function possibleSolution() {
			var numberOfStars = this.state.numberOfStars;
			var usedNumbers = this.state.usedNumbers;
			var possibleNumbers = [];

			for (var i = 0; i <= 9; i++) {
				if (usedNumbers.indexOf(i) < 0) {
					possibleNumbers.push(i);
				}
			}

			return possibleCombinationSum(possibleNumbers, numberOfStars);
		},
		updateDoneStatus: function updateDoneStatus() {
			if (this.state.usedNumbers.length === 9) {
				this.setState({ doneStatus: 'You win!' });
				return;
			}

			if (this.state.redraws === 0 && !this.possibleSolution()) {
				this.setState({ doneStatus: 'You lose. Game over' });
			}
		},
		selectNumber: function selectNumber(clickedNumber) {
			if (this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
				this.setState({ selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
					correct: null });
			}
		},
		unselectNumber: function unselectNumber(clickedNumber) {
			var selectedNumbers = this.state.selectedNumbers;
			var indexOfNumber = selectedNumbers.indexOf(clickedNumber);

			selectedNumbers.splice(indexOfNumber, 1);

			this.setState({ selectedNumbers: selectedNumbers, correct: null });
		},
		checkAnswer: function checkAnswer() {
			var correct = this.state.numberOfStars === this.sumOfSelectedNumbers();
			this.setState({ correct: correct });
		},
		sumOfSelectedNumbers: function sumOfSelectedNumbers() {
			return this.state.selectedNumbers.reduce(function (p, n) {
				return p + n;
			}, 0);
		},
		redraw: function redraw() {
			if (this.state.redraws > 0) {
				this.setState({
					numberOfStars: this.randomNumber(),
					selectedNumbers: [],
					correct: null,
					redraws: this.state.redraws - 1
				}, function () {
					this.updateDoneStatus();
				});
			}
		},
		acceptAnswer: function acceptAnswer() {
			var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
			this.setState({
				selectedNumbers: [],
				usedNumbers: usedNumbers,
				correct: null,
				numberOfStars: this.randomNumber()
			}, function () {
				this.updateDoneStatus();
			});
		},
		render: function render() {
			var selectedNumbers = this.state.selectedNumbers;
			var usedNumbers = this.state.usedNumbers;
			var numberOfStars = this.state.numberOfStars;
			var correct = this.state.correct;
			var redraws = this.state.redraws;
			var doneStatus = this.state.doneStatus;
			var buttonFrame;

			if (doneStatus) {
				buttonFrame = React.createElement(DoneFrame, { doneStatus: doneStatus, resetGame: this.resetGame });
			} else {
				buttonFrame = React.createElement(NumbersFrame, { selectedNumbers: selectedNumbers, selectNumber: this.selectNumber, usedNumbers: usedNumbers });
			}

			return React.createElement(
				'div',
				{ id: "game" },
				React.createElement(
					'h2',
					null,
					'Play Nine'
				),
				React.createElement('hr', null),
				React.createElement(
					'div',
					{ className: "clearfix" },
					React.createElement(StarsFrame, { numberOfStars: numberOfStars }),
					React.createElement(ButtonFrame, { selectedNumbers: selectedNumbers, correct: correct, checkAnswer: this.checkAnswer,
						acceptAnswer: this.acceptAnswer, redraw: this.redraw, redraws: redraws }),
					React.createElement(AnswerFrame, { selectedNumbers: selectedNumbers, unselectNumber: this.unselectNumber })
				),
				buttonFrame
			);
		}
	});

	var possibleCombinationSum = function possibleCombinationSum(_x, _x2) {
		var _again = true;

		_function: while (_again) {
			var arr = _x,
			    n = _x2;
			listSize = combinationsCount = i = combinationSum = j = undefined;
			_again = false;

			if (arr.indexOf(n) >= 0) {
				return true;
			}
			if (arr[0] > n) {
				return false;
			}
			if (arr[arr.length - 1] > n) {
				arr.pop();
				_x = arr;
				_x2 = n;
				_again = true;
				continue _function;
			}
			var listSize = arr.length,
			    combinationsCount = 1 << listSize;
			for (var i = 1; i < combinationsCount; i++) {
				var combinationSum = 0;
				for (var j = 0; j < listSize; j++) {
					if (i & 1 << j) {
						combinationSum += arr[j];
					}
				}
				if (n === combinationSum) {
					return true;
				}
			}
			return false;
		}
	};

	module.exports = Game;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	var StarsFrame = React.createClass({
		displayName: "StarsFrame",

		render: function render() {
			var stars = [];
			for (var i = 0; i < this.props.numberOfStars; i++) {
				stars.push(React.createElement("span", { className: "glyphicon glyphicon-star" }));
			}
			return React.createElement(
				"div",
				{ id: "stars-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					stars
				)
			);
		}
	});

	module.exports = StarsFrame;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var ButtonFrame = React.createClass({
		displayName: "ButtonFrame",

		render: function render() {
			var disabled;
			var correct = this.props.correct;
			var button;
			switch (correct) {
				case true:
					button = React.createElement(
						"button",
						{ className: "btn btn-success btn-lg", onClick: this.props.acceptAnswer },
						React.createElement("span", { className: "glyphicon glyphicon-ok" })
					);
					break;
				case false:
					button = React.createElement(
						"button",
						{ className: "btn btn-danger btn-lg" },
						React.createElement("span", { className: "glyphicon glyphicon-remove" })
					);
					break;
				default:
					disabled = this.props.selectedNumbers.length === 0;
					button = React.createElement(
						"button",
						{ className: "btn btn-primary btn-lg", disabled: disabled, onClick: this.props.checkAnswer },
						"="
					);
			}

			return React.createElement(
				"div",
				{ id: "button-frame" },
				button,
				React.createElement("br", null),
				React.createElement("br", null),
				React.createElement(
					"button",
					{ className: "btn btn-warning btn-xs", onClick: this.props.redraw, disabled: this.props.redraws === 0 },
					React.createElement("span", { className: "glyphicon glyphicon-refresh" }),
					" ",
					this.props.redraws
				)
			);
		}
	});

	module.exports = ButtonFrame;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var AnswerFrame = React.createClass({
		displayName: "AnswerFrame",

		render: function render() {
			var props = this.props;
			var selectedNumbers = props.selectedNumbers.map(function (i) {
				return React.createElement(
					"span",
					{ onClick: props.unselectNumber.bind(null, i) },
					i
				);
			});

			return React.createElement(
				"div",
				{ id: "answer-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					selectedNumbers
				)
			);
		}
	});

	module.exports = AnswerFrame;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var NumbersFrame = React.createClass({
		displayName: "NumbersFrame",

		render: function render() {
			var numbers = [];
			var className;
			var selectedNumbers = this.props.selectedNumbers;
			var usedNumbers = this.props.usedNumbers;
			var selectNumber = this.props.selectNumber;

			for (var i = 1; i <= 9; i++) {
				className = "number selected-" + (selectedNumbers.indexOf(i) >= 0);
				className += " used-" + (usedNumbers.indexOf(i) >= 0);
				numbers.push(React.createElement(
					"div",
					{ className: className, onClick: selectNumber.bind(null, i) },
					i
				));
			}

			return React.createElement(
				"div",
				{ id: "numbers-frame" },
				React.createElement(
					"div",
					{ className: "well" },
					numbers
				)
			);
		}
	});

	module.exports = NumbersFrame;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var DoneFrame = React.createClass({
		displayName: "DoneFrame",

		render: function render() {
			return React.createElement(
				"div",
				{ className: "well text-center" },
				React.createElement(
					"h2",
					null,
					this.props.doneStatus
				),
				React.createElement(
					"button",
					{ className: "btn btn-default", onClick: this.props.resetGame },
					"Play Again"
				)
			);
		}
	});

	module.exports = DoneFrame;

/***/ },
/* 8 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
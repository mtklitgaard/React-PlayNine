var StarsFrame = require('./stars.jsx');

var ButtonFrame = require('./button.jsx');

var AnswerFrame = require('./answer.jsx');

var NumbersFrame = require('./numbers.jsx');

var DoneFrame = require('./done.jsx');

var Game = React.createClass({
	getInitialState: function() {
		return {
			numberOfStars: this.randomNumber(),
			selectedNumbers: [],
			usedNumbers: [],
			redraws: 5,
			correct: null,
			doneStatus: null};
	},
	resetGame: function() {
		this.replaceState(this.getInitialState())
	},
	randomNumber: function() {
		return Math.floor(Math.random()*9) + 1;
	},
	possibleSolution: function() {
		var numberOfStars = this.state.numberOfStars;
		var usedNumbers = this.state.usedNumbers;
		var possibleNumbers = [];

		for(var i = 0; i <= 9; i++) {
			if(usedNumbers.indexOf(i) < 0) {
				possibleNumbers.push(i);
			}
		}

		return possibleCombinationSum(possibleNumbers, numberOfStars);
	},	
	updateDoneStatus: function() {
		if(this.state.usedNumbers.length === 9) {
			this.setState({	doneStatus: 'You win!'});
			return
		}

		if(this.state.redraws === 0 && !this.possibleSolution()){
			this.setState({doneStatus: 'You lose. Game over'});
		}
	},
	selectNumber: function(clickedNumber) {
		if(this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
		this.setState(
				{selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
				 correct: null});
		}
	},
	unselectNumber: function(clickedNumber) {
		var selectedNumbers = this.state.selectedNumbers;
		var indexOfNumber = selectedNumbers.indexOf(clickedNumber);

		selectedNumbers.splice(indexOfNumber, 1);

		this.setState({selectedNumbers : selectedNumbers, correct:null});
	},
	checkAnswer: function() {
		var correct = this.state.numberOfStars === this.sumOfSelectedNumbers();
		this.setState({correct: correct});
	},
	sumOfSelectedNumbers: function() {
		return this.state.selectedNumbers.reduce(function(p,n) {
			return p+n;
		}, 0)
	},
	redraw: function () {
		if(this.state.redraws > 0) {
			this.setState({
				numberOfStars: this.randomNumber(),
				selectedNumbers: [],
				correct: null,
				redraws: this.state.redraws - 1
			}, function() {
				this.updateDoneStatus();
			});
		}
	},
	acceptAnswer: function() {
		var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
		this.setState({
			selectedNumbers: [],
			usedNumbers: usedNumbers,
			correct: null,
			numberOfStars: this.randomNumber()
		}, function() {
			this.updateDoneStatus();
		});
	},
	render: function () {
		var selectedNumbers = this.state.selectedNumbers;
		var usedNumbers = this.state.usedNumbers;
		var numberOfStars = this.state.numberOfStars;
		var correct = this.state.correct;
		var redraws = this.state.redraws;
		var doneStatus = this.state.doneStatus;
		var buttonFrame;

		if(doneStatus) {
			buttonFrame = <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/>
		} else {
			buttonFrame = <NumbersFrame selectedNumbers={selectedNumbers} selectNumber={this.selectNumber} usedNumbers={usedNumbers}/>
		}

		return (
			<div id="game">
				<h2>Play Nine</h2>
				<hr />
				<div className="clearfix">
					<StarsFrame  numberOfStars= {numberOfStars}/>
					<ButtonFrame selectedNumbers={selectedNumbers} correct={correct} checkAnswer={this.checkAnswer} 
						acceptAnswer={this.acceptAnswer} redraw={this.redraw} redraws={redraws}/>
					<AnswerFrame selectedNumbers={selectedNumbers} unselectNumber={this.unselectNumber} />
				</div>

				{buttonFrame}
			</div>
			);
	}
});

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

module.exports = Game;



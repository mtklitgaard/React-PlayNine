var StarsFrame = require('./stars.jsx');

var ButtonFrame = require('./button.jsx');

var AnswerFrame = require('./answer.jsx');

var NumbersFrame = require('./numbers.jsx');

var DoneFrame = require('./done.jsx');

var ScoreBoard = require('./scoreBoard.jsx');

var TopScores = require('./topScores.jsx');

var PossibleCominationSum = require('./possibleCombinationSum.js');

var Game = React.createClass({
	getInitialState: function() {
		return {
			numberOfStars: this.randomNumber(),
			selectedNumbers: [],
			usedNumbers: [],
			redraws: 5,
			correct: null,
			doneText: null,
			winGame: false,
			score: 0,
			highScore: 0 };
	},
	getResetState: function() {
		var highScore = this.state.highScore;
		var winGame = this.state.winGame;
		var score = this.state.score;

		if(!winGame) {
			score = 0;
		}

		return {
			numberOfStars: this.randomNumber(),
			selectedNumbers: [],
			usedNumbers: [],
			redraws: 5,
			correct: null,
			doneText: null,
			winGame: null,
			score: score,
			highScore: highScore};
	},
	resetGame: function() {
		this.replaceState(this.getResetState())
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

		return PossibleCominationSum(possibleNumbers, numberOfStars);
	},	
	updatewinGame: function() {
		if(this.state.usedNumbers.length === 9) {
			this.setState({	doneText: 'You win!', winGame: true});
			return
		}

		if(this.state.redraws === 0 && !this.possibleSolution()){
			this.setState({doneText: 'You lose. Game over', winGame: false});
		}

		if(this.state.score >= this.state.highScore) {
			this.setState({highScore: this.state.score});
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
				this.updatewinGame();
			});
		}
	},
	acceptAnswer: function() {
		var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
		this.setState({
			selectedNumbers: [],
			usedNumbers: usedNumbers,
			correct: null,
			numberOfStars: this.randomNumber(),
			score: this.state.score + 10
		}, function() {
			this.updatewinGame();
		});
	},
	render: function () {
		var selectedNumbers = this.state.selectedNumbers;
		var usedNumbers = this.state.usedNumbers;
		var numberOfStars = this.state.numberOfStars;
		var correct = this.state.correct;
		var redraws = this.state.redraws;
		var doneText = this.state.doneText;
		var winGame = this.state.winGame;
		var score = this.state.score;
		var highScore = this.state.highScore;
		var buttonFrame;

		if(doneText) {
			buttonFrame = <DoneFrame doneText={doneText} resetGame={this.resetGame}/>
		}
		else {
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
				<br />
				<hr />
				<div className="clearfix">
					<ScoreBoard score= {score} highScore = {highScore} />
					<TopScores />
				</div>
			</div>
			);
	}
});

module.exports = Game;



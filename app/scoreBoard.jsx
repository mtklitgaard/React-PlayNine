var ScoreBoard = React.createClass({
	render: function() {
		return (
				<div id="scoreboard-frame">
					<div className="well">
						<h3>Your Highest Score</h3>
						<h4>{this.props.score}</h4>
					</div>
				</div>
			);
	}
})

module.exports = ScoreBoard;
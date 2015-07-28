var DoneFrame = React.createClass({
	render: function() {
		return (
				<div className="well text-center">
					<h2>{this.props.doneStatus}</h2>
					<button className="btn btn-default" onClick={this.props.resetGame}>Play Again</button>
				</div>
			);
	}
});

module.export = DoneFrame;
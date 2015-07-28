var ButtonFrame = React.createClass({
	render: function  () {
		var disabled;
		var correct = this.props.correct;
		var button;
		switch(correct){
			case true:
				button = (
					<button className="btn btn-success btn-lg" onClick={this.props.acceptAnswer}>
						<span className="glyphicon glyphicon-ok"></span>
					</button>
				);
				break;
			case false:
				button = (
					<button className="btn btn-danger btn-lg" >
						<span className="glyphicon glyphicon-remove"></span>
					</button>
				);
				break;
			default:
				disabled =  this.props.selectedNumbers.length === 0;
				button = (
					<button className="btn btn-primary btn-lg" disabled={disabled} onClick={this.props.checkAnswer}>
						=
					</button>
				);
		}

		return (
			<div id="button-frame">
				{button}
				<br /><br />
				<button className="btn btn-warning btn-xs" onClick={this.props.redraw} disabled={this.props.redraws === 0}>
					<span className="glyphicon glyphicon-refresh"></span>
					&nbsp;
					{this.props.redraws}
				</button>
			</div>
		);
	}
});

module.export = ButtonFrame;
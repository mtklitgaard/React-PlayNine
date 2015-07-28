var NumbersFrame = React.createClass({
	render:function() {
		var numbers = []
		var className
		var selectedNumbers=this.props.selectedNumbers;
		var usedNumbers = this.props.usedNumbers;
		var selectNumber = this.props.selectNumber;

		for(var i = 1; i <= 9; i++) {
			className = "number selected-" + (selectedNumbers.indexOf(i)>=0)
			className += " used-" + (usedNumbers.indexOf(i)>=0);
			numbers.push(
					<div className={className} onClick={selectNumber.bind(null, i)}>{i}</div>
				);
		}

		return (
			<div id="numbers-frame">
				<div className="well">
					{numbers}
				</div>	
			</div>
		);
	}
});

module.exports = NumbersFrame;
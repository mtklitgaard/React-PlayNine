var TopScores = React.createClass({
	render: function() {
		return (
				<div id="topscores-frame">
					<div className="well">
						<h3>Top Scores</h3>
						<ol>
							<li>1. Test - 10000</li>
							<li>2. Test2 - 9999</li>
							<li>3. Test3 - 888</li>
						</ol>
					</div>
				</div>
			);
	}
})

module.exports = TopScores;
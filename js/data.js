window.data = {};
data.rows = false;

data.init = function(){
	
	d3.csv("dataset.csv")
		.row(function(row){
			row.progress = 0;
			row.cx = 0;
			row.cy = 0;
			return row;
		})
		.get(function(error, rows) { 
			console.log(rows); 
			data.rows = rows;
			data.loaded();
		});

}

data.loaded = function(){

	//get maximal value
	data.max = d3.max(data.rows, function(d) { return +d.Conversies; } );

	graph.make();
}
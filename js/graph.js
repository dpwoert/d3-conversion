window.graph = {
	maxRadius: 20,
	nodeColor: '#ffffff',
	pathColor: '#ffffff',
	active: 0,
	test: 0,
	speed: 5
};

graph.pathStart = [0,0];
graph.pathEnd = [0,0];

graph.make = function(){

	graph.radius = d3.scale.linear();
	graph.radius
		.domain([0, data.max])
		.range([0, graph.maxRadius]);

	graph.linearPath = d3.scale.linear();
	graph.linearPath
		.domain([0,20])
		.range([0, 100]);

	graph.getPath = d3.scale.linear();
	graph.getPath
		.domain([0,window.innerWidth])
		.range([0, 100]);

	//circles
	graph.svg = d3.select('svg#balance').append('svg:g');
	d3.select("svg#balance g").selectAll("circle")
		.data(data.rows)
		.enter()
		.append('circle')
			.attr('r', function(d, i){ return graph.radius(d.Conversies); })
			.attr('cx', graph.animate.cx)
			.attr('cy', graph.animate.cy)
			.attr('fill', graph.nodeColor)
			.attr('fill-opacity', 0);

	//balance
	d3.select("svg#balance g")
		.append("svg:path")
		.attr('d', graph.animate.path)
		.attr('stroke', graph.pathColor)
		.attr('stroke-weight', '5');

	graph.animate.tick();

};


//animations
graph.animate = {};

graph.animate.tick = function(){

	//reschedule this
	requestAnimFrame(graph.animate.tick);

	graph.svg.selectAll("circle")
		.attr('cx', graph.animate.cx)
		.attr('cy', graph.animate.cy)

	graph.svg.selectAll("path")
		.attr('d', graph.animate.path);

	$('#week span').text(graph.active);

};

graph.animate.cx = function(d, i){

	//update on active
	if(i == graph.active && d.progress < 100){
		d.progress ++;
		d3.select(this).attr('fill-opacity', 0.5);
	}
	//next on full
	if(i == graph.active && d.progress >= 100){
		graph.active++;
	}

	if (!d.path) d.path = graph.linearPath(d.ConversieRatio);
	var path = d.path * (d.progress/100);

	return graph.path(path).x;
};

graph.animate.cy = function(d, i){
	var path = d3.scale.linear()
		.domain([0, window.innerWidth])
		.range([ graph.pathStart[1],graph.pathEnd[1] ]);

	return path( d3.select(this).attr('cx') );
};

graph.animate.path = function(){
	graph.pathStart = [0, window.innerHeight/2];
	graph.pathEnd = [window.innerWidth, window.innerHeight/2];

	var balance = graph.getWeight();
	var delta = balance.left - balance.right;

	graph.pathStart[1] += (delta*0.00003);
	graph.pathEnd[1] -= (delta*0.00003);

	return 'M ' + graph.pathStart[0] + ' ' + graph.pathStart[1] + ' L ' + graph.pathEnd[0] + ' ' + graph.pathEnd[1];
}

graph.getWeight = function(){

	var left = 0;
	var right = 0;

	graph.svg.selectAll("circle").each(function(d, i){
		var x = d3.select(this).attr('cx');
		var y = d3.select(this).attr('cy');

		var weight = d.Conversies;
		var pos = graph.getPath(x);

		if(d.ConversieRatio != 10 && i <= graph.active){
			//when not on the middle point

			if(x < window.innerWidth/2){
				left += weight*pos;
			} 
			else {
				right += weight*pos;
			}
		}


	});

	//return momentum
	return {
		'left': left,
		'right': right
	}
}

graph.path = function(progress){
	var deltaX = Math.abs(graph.pathStart[0] - graph.pathEnd[0]);
	var deltaY = Math.abs(graph.pathStart[1] - graph.pathEnd[1]);

	return({
		x: (deltaX * progress) / 100,
		y: (deltaY * progress) / 100
	})
}
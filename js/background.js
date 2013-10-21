window.background = {};

background.init = function(){
	background.size();
}

background.size = function(){
	
	//select & add
	background.r = d3.select("svg#background rect");
	background.r
		.attr('x', 0 )
		.attr('y', 0 )
		.attr('width', window.innerWidth/2 )
		.attr('height', window.innerHeight )
		.attr('fill', '#E74C3C')
		.attr('stroke', 'none');

};
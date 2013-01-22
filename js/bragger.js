var manager = {
	doc: {},
	offset: 180,
	init: function() {
		manager.doc.width = 800,
		
		resume.start();
		skills.begin();
		manager.examplers();
		manager.navigation();
	
		// manager.travel();
		
		// google.load('visualization', "1", {
		// 	'packages': ['geomap'],
		// 	'callback': manager.travel
		// });
		
		$('#travel_map_canvas').vectorMap({map: 'world_mill_en'});
		
		
	},
	travel: function() {
		var data = google.visualization.arrayToDataTable([
			['City', 'Visit Length', 'When'],
			['Vermont', 7, 'Grew up there'],
			['New Mexico', 2, 'Grew up there'],
		]);
		
		width = 280;
		
		var options = {
			'region': 'world',
			'colors': [0xFF8747, 0xFFB581, 0xc06000],
			'dataMode': 'markers',
			'width': width,
			'height': (347/546) * width
		};
		
		var container = document.getElementById('travel_map_canvas');
		var geomap = new google.visualization.GeoMap(container);
		geomap.draw(data, options);
	},
	navigation: function() {
		$('a').smoothScroll({
			offset: -1 * manager.offset
		});
				
		$('.bragger.navigation li a').click(function() {
			$('.bragger.navigation li').removeClass('active');
			$(this).parent().addClass('active');
		});
		
		$('.section.bragger section').waypoint(function(direction) {
		 	active = $(this);
			if (direction === "up") active = active.prev();
			
			$('.bragger.navigation li').removeClass('active').filter('#nav-' + active.attr('id') ).addClass('active');
		},{
			offset: manager.offset
		});
	},
	examplers: function() {
		speed = 100
		$('ul.exampler li').hover(function() {
			h = $(this).parent().height();
			$('a', this).data('height', $('a', this).height()).animate({
				height: h
			}, speed);
			$('a span ', this).fadeIn( speed ).css('display', 'block');
		}, function() {
			$('a', this).animate({
				height: $('a', this).data('height')
			}, speed);
			$('a span ', this).fadeOut( speed );
		});
	}
}

var resume = {
	tracks: [
		{
			name: 'education',
			color: 'blue'
		},
		{
			name: 'tech',
			color: 'pink'
		},
		{
			name: 'law',
			color: 'red'
		}
	],
	paths: [],
	start: function() {
		
    // $('#resume .map').subwayMap({ debug: false });
		
		// // // Get a reference to the canvas object
		// this.canvas = document.getElementById('resumeCanvas');
		// 
		// // Create an empty project and a view for the canvas:
		// paper.setup(this.canvas);
		// 
		// var path = new paper.Path();
		// // Give the stroke a color
		// path.strokeColor = 'black';
		// var start = new paper.Point(100, 100);
		// // Move to start and draw a line from there
		// path.moveTo(start);
		// // Note that the plus operator on Point objects does not work
		// // in JavaScript. Instead, we need to call the add() function:
		// path.lineTo(start.add([ 200, -50 ]));
		// 
		// // set up our paths
		// 
		// $.each( resume.tracks, function( i, track) {
		// 	path = new paper.Path();
		// 				
		// 	path.strokeColor = track.color;
		// 	
		// 	path.add(new paper.Point(0, 0));
		// 	path.add(new paper.Point(100, 50));
		// 	
		// 	resume.paths[track.name] = path;
		// } );
		// 
		//         // Draw the view now:
		//         paper.view.draw();
	}
}

var skills = {
	list: {
		'js': {
			name: 'JavaScript',
			size: 20,
			x: -10,
			y: 30,
			rotate: 0
		},
		'html': {
			name: 'HTML5',
			size: -15,
			x: -45,
			y: -5,
			rotate: 20
		},
		'css': {
			name: 'CSS',
			size: 10,
			x: -60,
			y: 37,
			rotate: 25,
			link: 'http://lab.morgante.net/shield'
		},
		'wp': {
			name: 'WordPress',
			size: 10,
			x: -28,
			y: -55,
			rotate: 17,
			link: 'http://google.com'
		},
		'php': {
			name: 'PHP',
			text: 'MVC & OOP',
			size: -15,
			x: 2,
			y: -48,
			rotate: 5,
			link: 'http://lab.morgante.net/habaribox'
		},
		'node': {
			name: 'node.js',
			size: -15,
			x: 30,
			y: 35,
			rotate: 5
		},
		'sql': {
			name: '*SQL',
			size: 10,
			x: 24,
			y: -14,
			rotate: 1
		},
		'debate': {
			name: "Debate",
			size: -15,
			x: 55,
			y: -55,
			rotate: 0
		},
		'writing': {
			name: 'Writing',
			size: 10,
			x: 60,
			y: -5,
			rotate: 3
		},
		'finance': {
			name: 'Finance',
			size: 10,
			x: 60,
			y: 60,
			rotate: 10
		},
	},
	begin: function() {
		skills.graph = d3.select('#skills .graph');
		
		skills.draw();
	},
	draw: function() {
		skills.r = manager.doc.width / 120;
		
		var w = skills.r * 120,
			h = skills.r * 80,
		    x = Math.sin(2 * Math.PI / 3),
		    y = Math.cos(2 * Math.PI / 3),
		    speed = 4,
		    start = Date.now();

		var svg = skills.graph.insert("svg:svg", "form")
		    .attr("width", w)
		    .attr("height", h)
		  .append("svg:g")
		    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(.9)")
		  .append("svg:g")
		    .data([{radius: Infinity}]);
		
		$.each( skills.list, function( i, skill ) {
			var gear = svg.append("svg:g")
			    .attr("class", "skill " + i)
			    .data([{teeth: Math.abs(skill.size / 10) * 16, radius: skill.size * skills.r}])
				.attr("transform", "translate(" + skill.x * skills.r * x + "," + skill.y * skills.r * y + ")rotate(" + skill.rotate + ")")
			gear.append("svg:g")
			    .attr("class", "gear")
				.append("svg:path")
			    .attr("d", skills.gear);
			gear.append("svg:text")
				.attr("class", "title")
			    .attr("x", 0)
			    .attr("dy", ".31em")
				.attr("style", "font-size: " + (Math.abs(skill.size) * skills.r) / 3 + "px")
			    .attr("text-anchor", "middle")
				.attr("transform", "rotate(" + -1 * skill.rotate + ")")
			    .text( skill.name )
			gear.append("svg:text")
				.attr("class", "desc")
			    .attr("x", 0)
			    .attr("dy", (Math.abs(skill.size) * skills.r) / 3 + "px")
			    .attr("text-anchor", "middle")
				.attr("transform", "rotate(" + -1 * skill.rotate + ")")
			    .text( skill.text )
		});
		
		// .attr("transform", "translate(0,-" + r * 3 + ")")

		// d3.selectAll("input[name=reference]")
		//     .data([r * 5, Infinity, -r])
		//     .on("change", function(d) { svg.data([{radius: d}]); });
		// 
		// d3.selectAll("input[name=speed]")
		//     .on("change", function() { speed = +this.value; });

		svg.selectAll(".skill")
		    .on("mouseover", function(d) {
				speed = speed * 2;
				d3.select(this).classed('hover', 1);
			}) 
		    .on("mouseout", function(d) {
				speed = speed / 2;
				d3.select(this).classed('hover', 0);
			});
		    // .on("click", function(d) { console.log("path click"); });

		d3.timer(function() {
			var angle = (Date.now() - start) * speed,
				transform = function(d) { return "rotate(" + angle / d.radius + ")"; };
			svg.selectAll(".gear").attr("transform", transform);
			svg.attr("transform", transform); // fixed ring
		});

	},
	gear: function gear(d) {
	  var n = d.teeth,
	      r2 = Math.abs(d.radius),
	      r0 = r2 - 8,
	      r1 = r2 + 8,
	      r3 = d.ring ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20,
	      da = Math.PI / n,
	      a0 = -Math.PI / 2 + (d.ring ? Math.PI / n : 0),
	      i = -1,
	      path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
	  while (++i < n) path.push(
	      "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
	      "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
	      "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
	      "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
	      "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
	      "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
	  return path.join("");
	}
}

$(document).ready( manager.init );
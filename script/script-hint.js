var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var projection = d3.geo.mercator()
	.translate([width/2, height/2])
    .scale(150);

var path = d3.geo.path()
	.projection(projection);

//color scale
var scaleColor = d3.scale.linear().domain([0,0.15]).range(["#fff","red"]);

//import data
queue()
	.defer(d3.json, "data/world-50m.json")
    .defer(d3.csv, "data/airports-utf.csv", function(d){
        return {
            IATA: d.iata,
            lat: +d.lat,
            lng: +d.lng,
            lngLat: [+d.lng, +d.lat]
        }
    })
	.await(function(err, world, airports){
        if(err) console.error(err);

		draw(world,airports);
	})

function draw(world,airports){
    console.log(world);
    //world data is in the Topojson specification
    //TODO: read topojson specification and usage here
    //https://github.com/mbostock/topojson/wiki/API-Reference
    //especially topojson.feature and topojson.mesh

    svg.append('path')
        .datum(topojson.mesh(world, world.objects.countries))
        .attr('d',path)
        .attr('class','country')

    svg.append('path')
        .datum(topojson.feature(world, world.objects.land))
        .attr('d',path)
        .attr('class','land');

    svg.selectAll('.airport')
        .data(airports)
        .enter()
        .append('circle')
        .attr('class','airport')
        .attr('transform',function(d){
           var xy = projection(d.lngLat);
           return 'translate('+xy[0]+','+xy[1]+')'
        })
        .attr('r',1);



}
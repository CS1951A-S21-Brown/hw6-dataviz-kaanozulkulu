
// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = (MAX_WIDTH / 2), graph_3_height = 575;

let svg = d3.select("#graph1")
          .append("svg")
          .attr("width", graph_1_width)
          .attr("height", graph_1_height)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)

let countRef = svg.append("g");




d3.csv("../data/football.csv").then(function(data) {

    data = cleanData(data, function(a, b) { return parseInt(b.count) - parseInt(a.count) }, data.length);

     games = [2000, 0, 2001, 0, 2002,0, 2003, 0, 2004, 0]
        for (i=0; i< data.length; i++){
          var year_arr = data[i]["date"].split('-')
          dict = {}
          year = year_arr[0]
          //console.log(year)

          if (year == 2000){
            games[1] += 1
         }
         if (year == 2001){
           games[3] += 1
        }
          if (year == 2002){
            games[5] += 1
       }
        if (year == 2003){
          games[7] += 1
      }
        if (year == 2004){
          games[9] += 1

        }
      }
      games_by_year = []
      for (j=0; j<games.length; j+=2) {
        dict = {}
        dict["years"] = games[j]
        dict["count"] = games[j+1]
        games_by_year.push(dict)

      }


    let x = d3.scaleLinear()
                .domain([0, d3.max(games_by_year, function(d) { return parseInt(d.count); })])
                .range([0, graph_1_width - margin.left - margin.right]);
      let y = d3.scaleBand()
                    .domain(games_by_year.map(function(d) { return d["years"] }))
                    .range([0, graph_1_height - margin.top - margin.bottom])
                    .padding(0.1);


                svg.append("g")
                    .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

                let color = d3.scaleOrdinal()
                    .domain(games_by_year.map(function(d) { return d["years"] }))
                    .range(d3.quantize(d3.interpolateHcl("#0099ff", "#008ae6"), 10));

                let bars = svg.selectAll("rect").data(games_by_year);


                bars.enter()       //adding rectangle bars
                    .append("rect")
                    .merge(bars)
                    .attr("fill", function(d) { return color(d['years']) })
                    .attr("x", x(0))
                    .attr("y", function(d) { return y(d["years"]); })
                    .attr("width", function(d) { return x(parseInt(d.count)); })
                    .attr("height",  y.bandwidth());


                let counts = countRef.selectAll("text").data(games_by_year);


                counts.enter()
                .append("text") //numaralar
                .merge(counts)
                .attr("x", function(d) { return x(parseInt(d.count)) + 10; })
                .attr("y", function(d) { return y(d.years) + 20})
                .style("text-anchor", "start")
                .text(function(d) { return parseInt(d.count)});

            // Add x-axis label
            svg.append("text")
                .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                                ${(graph_1_height - margin.top - margin.bottom) + 15})`)
                .style("text-anchor", "middle")
                .text("Number of Games");

            // Add y-axis label
            svg.append("text")
                .attr("transform", `translate(${-120},${(graph_1_height - margin.top - margin.bottom) / 2})`)
                .style("text-anchor", "middle")
                .text("Years");

            // Add chart title
            svg.append("text")
                .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)
                .style("text-anchor", "middle")
                .style("font-size", 20)
                .text("Number of Games in Given Years");

});

let svg2 = d3.select("#graph2")
          .append("svg")
          .attr("width", graph_2_width)
          .attr("height", graph_2_height)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)

let countRef2 = svg2.append("g");



d3.csv("../data/football.csv").then(function(data) {

    data = cleanData(data, function(a, b) { return parseInt(b.count) - parseInt(a.count) }, data.length);

     countries = []
        for (i=0; i< data.length; i++){
          var country = data[i]["home_team"]
          if(!countries.includes(country)){
            countries.push(country)
          }
          country = data[i]["away_team"]
          if(!countries.includes(country)){
            countries.push(country)
          }

      }
      games_played_per_country = new Array(countries.length).fill(0)
      games_won = new Array(countries.length).fill(0)
      for (c=0; c<countries.length; c++) {
        for (j=0; j<data.length; j++){
          if(data[j]["home_team"] == countries[c]){
            games_played_per_country[c] += 1
            if(data[j]["home_score"] > data[j]["away_score"]){
                games_won[c] +=1
            }
          }
          if(data[j]["away_team"] == countries[c]){
            games_played_per_country[c] += 1
            if(data[j]["away_score"] > data[j]["home_score"]){
                games_won[c] +=1
            }
          }
        }
      }

      percentage = []
      for (k = 0; k<games_won.length; k++) {
        percentage.push(games_won[k] * 100/ games_played_per_country[k]);
      }


      dict = {}
      for (t=0; t<percentage.length; t++) {
        dict[countries[t]] = percentage[t]
      }
      console.log(dict)
      var its = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
          });


        its.sort(function(a, b) {
            return b[1] - a[1];
          });
      top_ten_dic = its.slice(0,10)

    top_ten = []
    for (n=0; n<10; n++){
      dic ={}
      dic["teams"] = top_ten_dic[n][0]
      dic["win_rate"] = top_ten_dic[n][1]
      top_ten.push(dic)
    }
      console.log(top_ten)

    let x2 = d3.scaleLinear()
                .domain([0, d3.max(top_ten, function(d) { return parseInt(d.win_rate); })])
                .range([0, graph_2_width - margin.left - margin.right]);
      let y2 = d3.scaleBand()
                    .domain(top_ten.map(function(d) { return d["teams"] }))
                    .range([0, graph_2_height - margin.top - margin.bottom])
                    .padding(0.1);

                svg2.append("g")
                    .call(d3.axisLeft(y2).tickSize(0).tickPadding(10));




                let color2 = d3.scaleOrdinal()
                    .domain(top_ten.map(function(d) { return d["teams"] }))
                    .range(d3.quantize(d3.interpolateHcl("#2eb8b8", "#47d1d1"), 10));

                let bars2 = svg2.selectAll("rect").data(top_ten);




                bars2.enter()       //adding rectangle bars
                    .append("rect")
                    .merge(bars2)
                    .attr("fill", function(d) { return color2(d['teams']) })
                    .attr("x", x2(0))
                    .attr("y", function(d) { return y2(d["teams"]); })
                    .attr("width", function(d) { return x2(parseInt(d.win_rate)); })
                    .attr("height",  y2.bandwidth());


                let counts2 = countRef2.selectAll("text").data(top_ten);


                counts2.enter()
                .append("text") //numbers
                .merge(counts2)
                .attr("x", function(d) { return x2(parseInt(d.win_rate)) + 10; })
                .attr("y", function(d) { return y2(d.teams) + 13})
                .style("text-anchor", "start")
                .text(function(d) { return parseInt(d.win_rate)});

            // Add x-axis label
            svg2.append("text")
                .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                                ${(graph_2_height - margin.top - margin.bottom) + 15})`)
                .style("text-anchor", "middle")
                .text("Win Rates");

            // Add y-axis label
            svg2.append("text")
                .attr("transform", `translate(${-120},${(graph_2_height - margin.top - margin.bottom) / 2})`)
                .style("text-anchor", "middle")
                .text("Teams");

            // Add chart title
            svg2.append("text")
                .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${-10})`)
                .style("text-anchor", "middle")
                .style("font-size", 20)
                .text("Teams with Highest Win Rates: Given In Percentage");

});


var svg3 = d3.select("#graph3")
          .append("svg")
          .attr("width", graph_3_width)
          .attr("height", graph_3_height)
          .append("g")
          .attr("transform", `translate(${margin.left*2},${margin.top*5})`)

        
radius = Math.min(graph_3_width, graph_3_height) / 3,

d3.csv("../data/football.csv").then(function(data) {
    data = cleanData(data, function(a, b) { return parseInt(b.count) - parseInt(a.count) }, data.length);

     countries = []
        for (i=0; i< data.length; i++){
          var country = data[i]["home_team"]
          if(!countries.includes(country)){
            countries.push(country)
          }
          country = data[i]["away_team"]
          if(!countries.includes(country)){
            countries.push(country)
          }
      }
      // only world cup
      games_played_per_country = new Array(countries.length).fill(1)
      games_won = new Array(countries.length).fill(0)
      for (c=0; c<countries.length; c++) {
        for (j=0; j<data.length; j++){
          var year_arr = data[j]["date"].split('-')
          year = year_arr[0]
          if(year == 2014 || year == 2018){
          if(data[j]["tournament"]=="FIFA World Cup"){
            if(data[j]["home_team"] == countries[c]){
              games_played_per_country[c] += 1
              if(data[j]["home_score"] > data[j]["away_score"]){
                games_won[c] +=1
               }
             }
          if(data[j]["away_team"] == countries[c]){
            games_played_per_country[c] += 1
            if(data[j]["away_score"] > data[j]["home_score"]){
                games_won[c] +=1
            }
          }
        }
      }
    }
  }

      percentage = []
      for (k = 0; k<games_won.length; k++) {
        percentage.push(games_won[k] * 100/ games_played_per_country[k]);
      }


      dict = {}
      for (t=0; t<percentage.length; t++) {
        dict[countries[t]] = percentage[t]
      }
      console.log(dict)
      var its = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
          });


        its.sort(function(a, b) {
            return b[1] - a[1];
          });
      top_ten_dic = its.slice(0,10)

    perc = []
    teams = []
    for (n=0; n<10; n++){

      perc.push(top_ten_dic[n][1])
      teams.push(top_ten_dic[n][0])
    }
    console.log(perc)


   var color3 = d3.scaleOrdinal()
   .domain(perc)
   .range(d3.schemeSet3)
		// Generate the pie
		var pie = d3.pie();

		// Generate the arcs
		var arc = d3.arc()
					.innerRadius(0)
					.outerRadius(radius);


		var arcs = svg3.selectAll("arc")
					.data(pie(perc))
					.enter()
					.append("g")
					.attr("class", "arc");

		//Draw arc paths
		arcs.append("path")
			.attr("fill", function(d, i) {
				return color3(i);
			})
			.attr("d", arc);




        arcs.on("mouseover", function() {

          arcs.select("text")
          .style("fill", "black")
          .style("font-size", 0)
          .text(function(d,i) { return perc[i].toFixed(2); })
          .style("text-anchor", "middle")
          .style("font-size", 13.5);

          });

          arcs.on('mouseout', function() {

              arcs.select("text")
              .style("fill", "black")
              .style("font-size", 0)
              .text(function(d,i) { return teams[i]; })
              .style("text-anchor", "middle")
              .style("font-size", 13.5);
          });


          arcs.append("text")
                   .attr("transform", function(d) {
                            return "translate(" + (arc.centroid(d)) + ")";
                    })
                   .text(function(d,i) { return teams[i]; })
                   .style("text-anchor", "middle")
                   .style("font-size", 13.5);


        svg3.append("text")
               .attr("transform", `translate(${(+0)}, ${+250})`)
              .style("text-anchor", "middle")
              .style("font-size", 20)
              .text("Top Performing Teams Over the Last 2 World Cups")
              .attr("class", "title");

          svg3.append("text")
                  .attr("transform", `translate(${(+0)}, ${+300})`)
                  .style("text-anchor", "middle")
                  .style("font-size", 18)
                  .text("Hover over the PieChart to see the 2014 & 2018 World Cup Winning Percentages")
                  .attr("class", "title");
});


 var bool = 0;
 function setData(inc) {
   bool += inc
 if (bool %2==0){
   var color = d3.scaleOrdinal()
    .range(d3.quantize(d3.interpolateHcl("#0099ff", "#008ae6"), 10));

 } else {
     var color = d3.scaleOrdinal()
       .range(d3.quantize(d3.interpolateHcl("#b30000", "#ff0000"), 10));
       console.log(bool)
       }



       d3.csv("../data/football.csv").then(function(data) {

           data = cleanData(data, function(a, b) { return parseInt(b.count) - parseInt(a.count) }, data.length);

            games = [2000, 0, 2001, 0, 2002,0, 2003, 0, 2004, 0]
               for (i=0; i< data.length; i++){
                 var year_arr = data[i]["date"].split('-')
                 dict = {}
                 year = year_arr[0]

                 if (year == 2000){
                   games[1] += 1
                }
                if (year == 2001){
                  games[3] += 1
               }
                 if (year == 2002){
                   games[5] += 1
              }
               if (year == 2003){
                 games[7] += 1
             }
               if (year == 2004){
                 games[9] += 1

               }
             }
             games_by_year = []
             for (j=0; j<games.length; j+=2) {
               dict = {}
               dict["years"] = games[j]
               dict["count"] = games[j+1]
               games_by_year.push(dict)

             }


           let x = d3.scaleLinear()
                       .domain([0, d3.max(games_by_year, function(d) { return parseInt(d.count); })])
                       .range([0, graph_1_width - margin.left - margin.right]);
             let y = d3.scaleBand()
                           .domain(games_by_year.map(function(d) { return d["years"] }))
                           .range([0, graph_1_height - margin.top - margin.bottom])
                           .padding(0.1);

                       color.domain(games_by_year.map(function(d) { return d["years"] }))


                       let bars = svg.selectAll("rect").data(games_by_year);

                       bars.enter()       //adding rectangle bars
                           .append("rect")
                           .merge(bars)
                           .attr("fill", function(d) { return color(d['years']) })
                           .attr("y", function(d) { return y(d["years"]); })
                           .attr("width", function(d) { return x(parseInt(d.count)); })
                           .attr("height",  y.bandwidth());


                       let counts = countRef.selectAll("text").data(games_by_year);


                       counts.enter()
                       .append("text") //numbers
                       .merge(counts)
                       .attr("x", function(d) { return x(parseInt(d.count)) + 10; })
                       .attr("y", function(d) { return y(d.years) + 20})
                       .style("text-anchor", "start")
                       .text(function(d) { return parseInt(d.count)});

                   // Add x-axis label
                   /*
                   svg.append("text")
                       .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                                                       ${(graph_1_height - margin.top - margin.bottom) + 15})`)
                       .style("text-anchor", "middle")
                       .text("Number of Games");

                   // Add y-axis label
                   svg.append("text")
                       .attr("transform", `translate(${-120},${(graph_1_height - margin.top - margin.bottom) / 2})`)
                       .style("text-anchor", "middle")
                       .text("Years");

                   // Add chart title
                //   svg.append("text")
                  //     .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${-10})`)
                  //     .style("font-size", 20)
                    //   .text("Number of Games in Given Years");
                      */
       });
}
function cleanData(data, comparator, numExamples) {
      return data.sort(comparator).slice(0, numExamples);

};

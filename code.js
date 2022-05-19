function draw(threshold,nodefile,edgefile){
var svg = d3.select("#ta"),
    width = +svg.node().getBoundingClientRect().width,
    height = +svg.node().getBoundingClientRect().height;

// svg objects
var link, node;
var colors;
var nodeGroups=[]
// the data - an object with nodes and links
var graph;
var stroke;
var radius=Math.floor(Math.random() * 4 + 4);
var obs=[];
var nodelist=[];
var kys;
var selected_nodes=[];
var data1 = [];
var data2 = [];
var data3 = [];
var data4 = [];
var data5 = [];
var data6 = [];
var data7 = [];
var data8 = [];
var name2Degree={};
var id2name={};
var linklist=[]
// load the data
d3.json(nodefile, function(error, _graph) {
  if (error) throw error;
  kys=Object.keys(_graph)
  //console.log(Object.keys(_graph)[0])
  //console.log(_graph[kys[0]])
  var id=0;
  var gr;
  var count=kys.length; // counting number for original data
  var sort_op = 0;
  for (let i=0;i<kys.length;i++)
  {
      if (_graph[kys[i]]["score_v2"]>threshold)
      {
          obs.push(kys[i]);
          var score_v2=Math.floor(_graph[kys[i]]["score_v2"]*10000)/10000
          selected_nodes.push({"id":id, "Name":kys[i].slice(0,10),"Suspiciousness":score_v2,"Industry":_graph[kys[i]]["industry"]});
        var dt={"id":id, "Name":kys[i].slice(0,10),"Suspiciousness":score_v2,"Industry":_graph[kys[i]]["industry"]};
        
        name2Degree[kys[i]]=0;
        id2name[id]=kys[i]
        if (kys[i]=="Domain_c58c149eec59bb14b0c102a0f303d4c20366926b5c3206555d2937474124beb9" || kys[i]=="Domain_f3554b666038baffa5814c319d3053ee2c2eb30d31d0ef509a1a463386b69845")
        {
            gr=0
            data1.push(dt)
        }
        else if (kys[i].substring(0,1)=="D")
        {
            gr=1
            data1.push(dt)
        }
        else if (kys[i].substring(0,4)=="IP_C")
        {
            gr=7
            data7.push(dt)
        }
        else if (kys[i].substring(0,1)=="I")
        {
            gr=2
            data2.push(dt)
        }
        else if (kys[i].substring(0,1)=="C")
        {
            gr=3
            data3.push(dt)
        }
        else if (kys[i].substring(0,10)=="Whois_Name")
        {
            gr=4
            data4.push(dt)
        }
        else if (kys[i].substring(0,11)=="Whois_Phone")
        {
            gr=5
            data5.push(dt)
        }
        else if (kys[i].substring(0,11)=="Whois_Email")
        {
            gr=6
            data6.push(dt)
        }
        else
        {
            gr=8
            data8.push(dt)
        }
        
        nodelist.push({"id":id,"group":gr,"type":_graph[kys[i]]["type"], "name":kys[i], "Suspiciousness":score_v2,"industry": _graph[kys[i]]["industry"]});
        id=id+1
      }
      
  }
    
  //console.log("IP:"+data2.length)
    var count1 =data1.length;
    var count2 =data2.length;
    var count3 =data3.length;
    var count4 =data4.length;
    var count5 =data5.length;
    var count6 =data6.length;
    var count7 =data7.length;
    var count8 =data8.length;
    var data_all = [count1,count2,count3,count4,count5,count6,count7,count8]
    var catagory = ["Domain", "IP","Cert", "Whois_Name", "Whois_Phone", "Whois_Email", "IP_C", "ASN"];
    var dataF=[data1,data2,data3,data4,data5,data6,data7,data8];
    //console.log("counting data_all= ", data_all)
    
    var data0 = []  // to save all processed data
    for(let k in catagory)
    {
      data0[k] = {cata:catagory[k], dat:data_all[k]};
    }
    if (sort_op ==1)
    {
     // sort data
     data0.sort(function(b, a) {
        return a.dat - b.dat;
      });
    }
    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 90},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svgh = d3.select("#histogramBox")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    // X axis
    var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data0.map(function(d) { return d.cata; }))
    .padding(0.2);
    svgh.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
    // Add Y axis
    var y = d3.scaleLinear()//d3.scaleLog()  //  axis scale
    .domain([1, 1.2*d3.max(data_all)])
    .range([ height, 0]);
    svgh.append("g")
    .call(d3.axisLeft(y));
    function barResponse(dataE)
{
    d3.select("#table").remove();
    var table=d3.select("#tableBox").append("table").attr("id","table")
    //console.log(dataE)
    // var dataw=[]
    // for (let i=0;i<dataE.length;i++)
    // {
    //     if(dataE[i].type)
    // }
    function compFunc(a, b) {
        if (a["Suspiciousness"] > b["Suspiciousness"]) {
          return -1;
        }
        if (a["Suspiciousness"] < b["Suspiciousness"]) {
          return 1;
        }
        return 0
    }
    dataE.sort(compFunc)
    var titles = d3.keys(dataE[0]);
    //console.log(selected_nodes.length)
    var headers = table.append('thead').append('tr').attr("class","header")
                    .selectAll('th')
                    .data(titles).enter()
                    .append('th')
                    .text(function (d) {
                        return d;
                    });
    var rows = table.append('tbody').selectAll('tr')
    .data(dataE).enter()
    .append('tr').attr("id",d=>d.id);
    rows.selectAll('td')
    .data(function (d) {
        return titles.map(function (k) {
            return { 'value': d[k], 'name': k};
        });
    }).enter()
    .append('td')
    .attr('data-th', function (d) {
        return d.name;
    })
    .text(function (d) {
        return d.value;
    });
}
    // Bars
    svgh.selectAll("mybar")
    .data(data0)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.cata); })
    .attr("y", function(d) { return y(d.dat); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.dat); })
    .attr("fill", function(d,i){return colorMap[i+1]})
    .on("click",function(d,i){barResponse(dataF[i]);})


  //console.log(obs.length)
  //console.log(selected_nodes.length)
  
//   d3.json("./static/edge_info.json", function(error, edges) {
//     //console.log(edges[0].length)
//     var pre=""
//     var prein=false;
//     for (let i=0;i<edges.length;i++)
//     {
//         if (obs.indexOf(edges[i][0])!=-1 && obs.indexOf(edges[i][1])!=-1)
//         {
//             prein=true;
//             name2Degree[edges[i][0]]=Number(name2Degree[edges[i][0]])+1;
//             // linklist.push({"source":edges[i][0],"target":edges[i][1],"value":1})
//             linklist.push({"source":obs.indexOf(edges[i][0]),"target":obs.indexOf(edges[i][1])})
//         }
//     }
//     // console.log(linklist)
//     // console.log(name2Degree)
//     //console.log(selected_nodes)
//     for (let u=0;u<selected_nodes.length;u++)
//     {
//         selected_nodes[u]["Degree"]=name2Degree[id2name[selected_nodes[u]["id"]]]
//     }
// graph={"nodes":nodelist,"links":linklist};
// //console.log(graph)
// initializeDisplay();
// initializeSimulation();

// });

// function compFunc(a, b) {
//     if (a["Suspiciousness Score"] > b["Suspiciousness Score"]) {
//       return -1;
//     }
//     if (a["Suspiciousness Score"] < b["Suspiciousness Score"]) {
//       return 1;
//     }
      
//     // When a and b are equal
//     return 0;
//   }
//   selected_nodes.sort(compFunc)
//   console.log(selected_nodes)
//   var table = d3.select("#table");
//     var titles = d3.keys(selected_nodes[0]);
//     console.log(selected_nodes.length)
//     var headers = table.append('thead').append('tr').attr("class","header")
//                     .selectAll('th')
//                     .data(titles).enter()
//                     .append('th')
//                     .text(function (d) {
//                         return d;
//                     });
//     var rows = table.append('tbody').selectAll('tr')
//     .data(selected_nodes).enter()
//     .append('tr').attr("id",d=>d.id);
//     rows.selectAll('td')
//     .data(function (d) {
//         return titles.map(function (k) {
//             return { 'value': d[k], 'name': k};
//         });
//     }).enter()
//     .append('td')
//     .attr('data-th', function (d) {
//         return d.name;
//     })
//     .text(function (d) {
//         return d.value;
//     });

});




d3.json(edgefile, function(error, edges) {
    //console.log(edges[0].length)
    var pre=""
    var prein=false;
    for (let i=0;i<edges.length;i++)
    {
        if (obs.indexOf(edges[i][0])!=-1 && obs.indexOf(edges[i][1])!=-1)
        {
            prein=true;
            name2Degree[edges[i][0]]=Number(name2Degree[edges[i][0]])+1
            name2Degree[edges[i][1]]=Number(name2Degree[edges[i][1]])+1
            // linklist.push({"source":edges[i][0],"target":edges[i][1],"value":1})
            linklist.push({"source":obs.indexOf(edges[i][0]),"target":obs.indexOf(edges[i][1])})
        }
    }
    console.log(linklist)
    for (let u=0;u<selected_nodes.length;u++)
    {
        selected_nodes[u]["Degree"]=name2Degree[id2name[selected_nodes[u]["id"]]]
    }
    console.log(selected_nodes)
graph={"nodes":nodelist,"links":linklist};
//console.log(graph)
initializeDisplay();
initializeSimulation();
function compFunc(a, b) {
    if (a["Suspiciousness"] > b["Suspiciousness"]) {
      return -1;
    }
    if (a["Suspiciousness"] < b["Suspiciousness"]) {
      return 1;
    }
      
    // When a and b are equal
    return 0;
  }
  selected_nodes.sort(compFunc)
  console.log(selected_nodes)
  var table = d3.select("#table");
    var titles = d3.keys(selected_nodes[0]);
    console.log(selected_nodes.length)
    var headers = table.append('thead').append('tr').attr("class","header")
                    .selectAll('th')
                    .data(titles).enter()
                    .append('th')
                    .text(function (d) {
                        return d;
                    });
    var rows = table.append('tbody').selectAll('tr')
    .data(selected_nodes).enter()
    .append('tr').attr("id",d=>"t"+d.id);
    rows.selectAll('td')
    .data(function (d) {
        return titles.map(function (k) {
            return { 'value': d[k], 'name': k};
        });
    }).enter()
    .append('td')
    .attr('data-th', function (d) {
        return d.name;
    })
    .text(function (d) {
        return d.value;
    });

});



//////////// FORCE SIMULATION //////////// 

// force simulator
var simulation = d3.forceSimulation();
console.log(simulation)



// set up the simulation and event to update locations after each tick
function initializeSimulation() {
  simulation.nodes(graph.nodes);
  initializeForces();
  simulation.on("tick", ticked);
}

// values for all forces
forceProperties = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        // strength: -30,
        strength: -20,
        distanceMin: 1,
        distanceMax: 2000
    },
    collide: {
        enabled: true,
        // strength: .7,
        strength: .1,
        iterations: 1,
        radius: 5
    },
    forceX: {
        enabled: false,
        strength: .1,
        x: .5
    },
    forceY: {
        enabled: false,
        strength: .1,
        y: .5
    },
    link: {
        enabled: true,
        distance: 30,
        iterations: 1
    }
}

// add forces to the simulation
function initializeForces() {
    // add forces and associate each with a name
    simulation
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide())
        .force("center", d3.forceCenter())
        .force("forceX", d3.forceX())
        .force("forceY", d3.forceY());
    // apply properties to each of the forces
    updateForces();
}

// apply new force properties
function updateForces() {
    // get each force by name and update the properties
    simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);
    simulation.force("charge")
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax);
    simulation.force("collide")
        .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
        .radius(forceProperties.collide.radius)
        .iterations(forceProperties.collide.iterations);
    simulation.force("forceX")
        .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);
    simulation.force("forceY")
        .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
        .y(height * forceProperties.forceY.y);
    simulation.force("link")
        .id(function(d) {return d.id;})
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? graph.links : []);

    // updates ignored until this is run
    // restarts the simulation (important if simulation has already slowed down)
    simulation.alpha(1).restart();
}



//////////// DISPLAY ////////////

// generate the svg objects and force simulation
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}
var tooltip = d3.select("#graph")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px")
function initializeDisplay() {
  // set the data and properties of link lines
  link = svg.append("g")
        .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

  // set the data and properties of node circles
  colors = d3.schemeCategory20;//d3.schemeTableau10
  const color=d3.scaleOrdinal(nodeGroups, colors);

var mouseover = function(d) {
    if(mouseDown==0){
tooltip
    .style("opacity", 1)
    }
}

var mousemove = function(d) {
    
tooltip
    .html("id: "+d.id+"<br>The type is: " + d.type+"<br>industry: "+d.industry)
    .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", (d3.mouse(this)[1]) + "px")
    
}

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function(d) {
tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
}
var pointClick=function(d)
{
    var ro=document.getElementById("t"+d.id)
    d3.select(this).attr("r",12).attr("stroke","black")
    console.log(ro);
    ro.scrollIntoView({block: "center"})
    ro.style.backgroundColor="pink"
}
  node = svg.append("g")
        .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle").attr("fill", function(d){return(color(d.group))}).attr("gr",function(d){return d.group})
    .attr("id",function(d){return d.id})
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )
    .on("click",pointClick)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))


  // node tooltip
//   node.append("title")
//       .text(function(d) { return d.id; });
  // visualize the graph
  updateDisplay();
}

// var colorMap={0:"red",1:"red",2:"#FF931D",3:"#42B287",4:"#E5CD3C",5:"#FF6224",6:"#A9DB63",7:"#C192EA",8:"green"}
//['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00']
var colorMap={0:"#e31a1c",1:"#e31a1c",2:"#1f78b4",3:"#b2df8a",4:"#33a02c",5:"#fb9a99",6:"#a6cee3",7:"#fdbf6f",8:"#ff7f00"}
// update the display based on the forces (but not positions)
function updateDisplay() {
    colors = d3.schemeCategory20;
  const color=d3.scaleOrdinal(nodeGroups, colors);
    node
        .attr("r", function()
        {   if(Number(d3.select(this).attr("gr"))!=0)
            {
                //return 6
                return 3+Math.log(1+10*name2Degree[id2name[d3.select(this).attr("id")]]);
            }
            else
            {
                return 10
            }
        })//{return (2/Number(d3.select(this).attr("gr"))*radius)})
        .attr("stroke", function()
        {
            if (Number(d3.select(this).attr("gr"))!=0)
            {return "none"}
            else
            {
                return "black"
            }
        })
        .attr("stroke-width", 5)
        // .attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15)
        .attr("fill",function(){return colorMap[(d3.select(this).attr("gr"))]});

}
//     var linkcolor="#"+Math.floor(Math.random()*16777215).toString(16);
//     var strokewidth=0.5+1.5*Math.random();
//     var opa=Math.floor(Math.random()*2);
//     link
//         .attr("stroke-width", strokewidth)
//         // .attr("opacity", opa)
//         .attr("fill",linkcolor);
//         // .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
//         // .attr("opacity", forceProperties.link.enabled ? 1 : 0);
// }
var color1="red"//"#"+Math.floor(Math.random()*16777215).toString(16);
var color2="blue"//"#"+Math.floor(Math.random()*16777215).toString(16);
var color3="#"+Math.floor(Math.random()*16777215).toString(16);
function Tocolor(code)
{

    if (code=="1")
    {
        return color1;
    }
    else if (code=="2")
    {
        return color2;
    }
    else
    {
        return color3;
    }
}

//legend
var svg1 = d3.select("#le");
var legendData=Object.keys(colorMap).slice(1);
var name_list=["Domain", "IP", "Cert","Whois_name","Whois_phone","Whois_email","IP_C","ASN"]
var g=svg1.append("g");
    g.selectAll("rect")
    .data(legendData)
    .enter().append("rect")
    .attr("x",20)
    .attr("y",d=>20+25*(d-1))
    .attr("height",15)
    .attr("width",15)
    .attr("fill", d=>colorMap[d])
    g.selectAll("text")
    .data(name_list)
    .enter().append("text")
    .attr("x", 40)
    .attr("y", function(d,i){return 31+25*i})
    .attr("stroke", "black")
    .text(d=>d);
//


//table
// var table = d3.select("#table");
// var titles = d3.keys(selected_nodes[0]);
// console.log(selected_nodes.length)
// var headers = table.append('thead').append('tr')
//                  .selectAll('th')
//                  .data(titles).enter()
//                  .append('th')
//                  .text(function (d) {
//                       return d;
//                   });
// var rows = table.append('tbody').selectAll('tr')
// .data(selected_nodes).enter()
// .append('tr');
// rows.selectAll('td')
//   .data(function (d) {
//       return titles.map(function (k) {
//           return { 'value': d[k], 'name': k};
//       });
//   }).enter()
//   .append('td')
//   .attr('data-th', function (d) {
//       return d.name;
//   })
//   .text(function (d) {
//       return d.value;
//   });
// var titles=d3.keys([])
// var rows = table.selectAll('tr')
//         .data(selected_nodes).enter()
//         .append('tr');
// console.log(rows)
// console.log()
// rows.selectAll('td')
// .data(function (d) {
// return titles.map(function (k) {
//         return { 'value': d[k], 'name': k};
//     });
// }).enter()
// .append('td')
// .attr('data-th', function (d) {
//     return d.name;
// })
// .text(function (d) {
//     return d.value;
// });
//
  
// update the display positions after each simulation tick
function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    d3.select('#alpha_value').style('flex-basis', (simulation.alpha()*100) + '%');
}



// //////////// UI EVENTS ////////////

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0.0001);
  d.fx = null;
  d.fy = null;
}

// update size-related forces
d3.select(window).on("resize", function(){
    width = +svg.node().getBoundingClientRect().width;
    height = +svg.node().getBoundingClientRect().height;
    updateForces();
});

// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}

}

// draw(0.003)
//draw(0.008,"./static/node_info2.json","./static/edge_info2.json")
draw(0.008,"https://raw.githubusercontent.com/yuanzero/vis_data_LIAO/vis_project/node_info2(1).json","https://raw.githubusercontent.com/yuanzero/vis_data_LIAO/vis_project/edge_info2(1).json")
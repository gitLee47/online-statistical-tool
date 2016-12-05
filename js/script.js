//Setting global variables for manipulating the table and for the sort function
 var tableBody, 
	asc1 = -1,
    asc2 = 1,
    asc3 = 1;
//The function used to upload and create the table from CSV
  function Upload() {
	var fileUpload = document.getElementById("fileUpload");
	var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/; //Regex for validating .csv type
	if (regex.test(fileUpload.value.toLowerCase())) {
		if (typeof (FileReader) != "undefined") {
			var reader = new FileReader();
			
			reader.onload = function (e) {
				var table = '<table>';
				var rows = e.target.result.split("\n");
				var headers = [];
				
				//Creating a table from the csv on the fly
				 for (var singleRow = 0; singleRow <rows.length; singleRow++) {
					if (singleRow === 0) {
					  table += '<thead>';
					  table += '<tr>';
					} else {
					  table += '<tr>';
					}
					var rowCells = rows[singleRow].split(',');
					for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
					  if (singleRow === 0) {
						//Setting the headers to have an onclick event for sorting
						table += '<th onclick="sortTable(tableBody,'+rowCell+', asc1); asc1 *= -1; asc2 = 1; asc3 = 1;">';
						table += rowCells[rowCell];
						table += '</th>';
						headers.push(rowCells[rowCell]);
					  } else {
						table += '<td>';
						table += rowCells[rowCell];
						table += '</td>';
					  }
					}
					if (singleRow === 0) {
					  table += '</tr>';
					  table += '</thead>';
					  table += '<tbody id="tableBody">';
					} else {
					  table += '</tr>';
					}
				  } 
				  table += '</tbody>';
				  table += '</table>';
				
				//Start the creation of the Report
				createReport(headers);
				
				var tableTitle = "<h3 class='textCenter'>Please click on any header to sort by that column (Print at bottom)</h3>"
				
				var printButton = document.createElement("button");
				printButton.innerHTML = "<p>Print Report</p>"
				printButton.setAttribute("onclick","printPage()");
				printButton.setAttribute("class","btnUpload btnPrint textCenter");
				//Settig the table to the view
				var dvCSV = document.getElementById("dvCSV");
				dvCSV.setAttribute("class", "reportDiv")
				dvCSV.innerHTML = "";
				dvCSV.innerHTML = tableTitle;
				dvCSV.innerHTML += table;
				dvCSV.appendChild(printButton);
				//Setting the global object for the table body
				tableBody = document.getElementById("tableBody");
				//removing the extra row
				var rows = tableBody.rows;
				tableBody.deleteRow(rows.length-1);
			}
			reader.readAsText(fileUpload.files[0]);
		} 
		else {
			alert("This browser does not support HTML5.");
		}
	} 
	else {
		alert("Please upload a valid CSV file.");
	}
}
//Function for creating the report
function createReport(headers) {
	//Creating the report title and subtitle
	var title = document.createElement("h2");
	title.innerHTML = "Report from CSV:";
	
	var instr = document.createElement("h2");
	instr.innerHTML = "Please select from the respective dropdowns to see the report";
	//Creating the Max and Min section
	var maxTitle = document.createElement("h3");
	maxTitle.innerHTML = "Max and Min of a Column:";
	var maxSelect = document.createElement("select");
		maxSelect.setAttribute("id", "selectHeadersMax");
		maxSelect.setAttribute("onchange", "MaxMin(this.value)");
		//Adding the headers to the dynamic drop down		
		maxSelect.innerHTML = '<option value="-1">--select--</option>';
		for(i = 0; i< headers.length; i++) {
			maxSelect.innerHTML += '<option value="'+i+'">'+headers[i]+'</option>';
		}
	//Creating the max and min div and hiding it
	var maxDiv = document.createElement("div");
		maxDiv.setAttribute("id", "maxDiv");
		maxDiv.setAttribute("class", "hide");
	
	//Creating the Statistics section
	var sumTitle = document.createElement("h3");
	sumTitle.innerHTML = "Statistics of a Column:";
	
	var sumSelect = document.createElement("select");
		sumSelect.setAttribute("id", "selectHeadersSum");
		sumSelect.setAttribute("onchange", "Statistics(this.value)");
		//Adding the headers to the dynamic drop down		
		sumSelect.innerHTML = '<option value="-1">--select--</option>';
		for(i = 0; i< headers.length; i++) {
			sumSelect.innerHTML += '<option value="'+i+'">'+headers[i]+'</option>';
		}

	//Creating the statistics div and hiding it	
	var statDiv = document.createElement("div");
		statDiv.setAttribute("id", "statDiv");
		statDiv.setAttribute("class", "hide");
		
	//Creating the Graph Selectors
	var graphSelTitle = document.createElement("h3");
	graphSelTitle.innerHTML = "Select X and Y axis for graphs:";
	
	var xSelect = document.createElement("select");
		xSelect.setAttribute("id", "selectX");
		//xSelect.setAttribute("onchange", "Statistics(this.value)");
		//Adding the headers to the dynamic drop down		
		xSelect.innerHTML = '<option value="-1">--Select X--</option>';
		for(i = 0; i< headers.length; i++) {
			xSelect.innerHTML += '<option value="'+i+'">'+headers[i]+'</option>';
		}
		
	var ySelect = document.createElement("select");
		ySelect.setAttribute("id", "selectY");
		//ySelect.setAttribute("onchange", "Statistics(this.value)");
		//Adding the headers to the dynamic drop down		
		ySelect.innerHTML = '<option value="-1">--Select Y--</option>';
		for(i = 0; i< headers.length; i++) {
			ySelect.innerHTML += '<option value="'+i+'">'+headers[i]+'</option>';
		}
		
	var plotBtn = document.createElement("button");
		plotBtn.setAttribute("id", "plotBtn");
		plotBtn.setAttribute("onclick", "plotGraph()");
		plotBtn.innerHTML = "<p>Plot Graphs</p>";
		plotBtn.setAttribute("class","btnUpload btnPrint textCenter");		

	
	//Appending all the above items to the report in sequence
	var reportDiv = document.getElementById("reportDiv");
		reportDiv.innerHTML = "";
		reportDiv.appendChild(title);
		reportDiv.appendChild(instr);
		reportDiv.appendChild(maxTitle);
		reportDiv.appendChild(maxSelect);
		reportDiv.appendChild(maxDiv);
		reportDiv.appendChild(sumTitle);
		reportDiv.appendChild(sumSelect);
		reportDiv.appendChild(statDiv);
		reportDiv.appendChild(graphSelTitle);
		reportDiv.appendChild(xSelect);
		reportDiv.appendChild(ySelect);
		reportDiv.appendChild(plotBtn);
		
		//Showing the report once it is ready
		reportDiv.removeAttribute("class");
		reportDiv.setAttribute("class", "show myDiv");
}
//Function to print the page
function printPage() {
    window.print();
}
//The function to sort the Table
function sortTable(tbody, col, asc) {
    var rows = tbody.rows,
        rlen = rows.length,
        arr = [],
        i, j, cells, clen;
    // fill the array with values from the table
    for (i = 0; i < rlen; i++) {
        cells = rows[i].cells;
        clen = cells.length;
        arr[i] = [];
        for (j = 0; j < clen; j++) {
            arr[i][j] = cells[j].innerHTML;
        }
    }
    // sort the array by the specified column number (col) and order (asc)
	if (!isNaN(parseInt(arr[0][col]))) {
		arr.sort(function (a, b) {
			return (parseInt(a[col]) == parseInt(b[col])) ? 0 : ((parseInt(a[col]) > parseInt(b[col])) ? asc : -1 * asc);
		});
	}
	else {
		arr.sort(function (a, b) {
			return (a[col] == b[col]) ? 0 : ((a[col] > b[col]) ? asc : -1 * asc);
		});
	}
    // replace existing rows with new rows created from the sorted array
    for (i = 0; i < rlen; i++) {
        rows[i].innerHTML = "<td>" + arr[i].join("</td><td>") + "</td>";
    }
}
//Function to find the minimum and masimum values of a selected column
function MaxMin(col) {
	asc = 1;
    var rows = tableBody.rows,
        rlen = rows.length,
        arr = [],
        i, j, cells, clen;
    // fill the array with values from the table
    for (i = 0; i < rlen; i++) {
        cells = rows[i].cells;
        clen = cells.length;
        arr[i] = [];
        for (j = 0; j < clen; j++) {
            arr[i][j] = cells[j].innerHTML;
        }
    }
	//Getting the max and min div created before and setting class to show
	var maxDiv = document.getElementById("maxDiv");
		maxDiv.removeAttribute("class");
		maxDiv.setAttribute("class","show");
		maxDiv.innerHTML = "";
    // sort the array by the specified column number (col) and order (asc) and find the min and max
	if (!isNaN(parseInt(arr[0][col]))) {
		arr.sort(function (a, b) {
			return (parseInt(a[col]) == parseInt(b[col])) ? 0 : ((parseInt(a[col]) > parseInt(b[col])) ? asc : -1 * asc);
		});
		//Creating the max and min data section
		var minRadius = (arr[0][col]/10000)+10;
		var maxRadius = (arr[rlen-1][col]/10000) + 25;
		maxDiv.innerHTML = "<p><b>Min</b>: "+arr[0][col]+" <b>Max</b>: "+arr[rlen-1][col]+"</p>";
		maxDiv.innerHTML += "<p>Let us now have a perspective of the difference in the min and max values!</p>";
		maxDiv.innerHTML += "<svg width='100' height='100'><circle cx='50' cy='50' r="+minRadius+" stroke='green' stroke-width='4' fill='yellow'/></svg>"
		maxDiv.innerHTML += "<svg width='100' height='100'><circle cx='50' cy='50' r="+maxRadius+" stroke='yellow' stroke-width='4' fill='green'/></svg>"
	}
	else {
		arr.sort(function (a, b) {
			return (a[col] == b[col]) ? 0 : ((a[col] > b[col]) ? asc : -1 * asc);
		});
		maxDiv.innerHTML = "<p>This column is not a numerical type!! But here you go!</p><p><b>Min</b>: "+arr[0][col]+" <b>Max</b>: "+arr[rlen-1][col]+"</p>";
	}
}
//Function to find the statistics of a selected column 
function Statistics(col) {
    var rows = tableBody.rows,
        rlen = rows.length,
        arr = [],
        i, j, cells, clen, sum = 0, avg = 0, variance = 0, std = 0;
    //Get statistics for the selected column if valid
	cells = rows[0].cells;
	if (!isNaN(parseInt(cells[col].innerHTML))) {
	//Getting the statistics div created before and setting class to show
	var statDiv = document.getElementById("statDiv");
		statDiv.removeAttribute("class");
		statDiv.setAttribute("class","show");
		statDiv.innerHTML = "";
		//Calculating all the sum, average, variance and standard deviation
		for (i = 0; i < rlen; i++) {
			sum += parseInt(rows[i].cells[col].innerHTML);
		}
		
		avg = sum/rlen;
		
		for (i = 0; i < rlen; i++) {
			variance += Math.pow(parseInt(rows[i].cells[col].innerHTML) - avg , 2);
		}
		variance = variance/rlen;
		
		std = Math.pow(variance, 0.5);
		statDiv.innerHTML = "<p><b>Sum is</b>: "+sum+" <b>Average is</b>: "+avg+" <b>Variance is</b>: "+variance+" <b>Standard Dev is</b>: "+std+"</p>";
	}
	else {
		alert("This column holds NaN values!! Please select another");
	}
}

function createCharts() {
	console.log("Hello");
	d3.csv("./data/quakes.csv", function(error, disasterData) {
		
		// format our data
		var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
		
		 disasterData.forEach(function(d) { 
			d.dtg   = dtgFormat.parse(d.origintime.substr(0,19)); 
			d.lat   = +d.latitude;
			d.long  = +d.longitude;
			d.mag   = d3.round(+d.magnitude,1);
			d.depth = d3.round(+d.depth,0);
		});
		
		var magnitudeChart = dc.barChart("#dc-magnitude-chart");
		var depthChart = dc.barChart("#dc-depth-chart");
		var timeChart = dc.lineChart("#dc-time-chart");
		
		var facts = crossfilter(disasterData);
		
		// for Magnitude
		  var magValue = facts.dimension(function (d) {
			return d.mag;       // group or filter by magnitude
		  });
		  
		  var magValueGroupSum = magValue.group()
			.reduceSum(function(d) { return d.mag; });
			// sums the magnitudes per magnitude
		  var magValueGroupCount = magValue.group()
			.reduceCount(function(d) { return d.mag; }) // counts the number of the facts by magnitude

		  // For datatable
		  var timeDimension = facts.dimension(function (d) {
			return d.dtg;
		  }); // group or filter by time

		  // for Depth
		  var depthValue = facts.dimension(function (d) {
			return d.depth;
		  });
		  var depthValueGroup = depthValue.group();
		  
		  // define a daily volume Dimension
		  var volumeByDay = facts.dimension(function(d) {
			return d3.time.hour(d.dtg);
		  });
		  // map/reduce to group sum
		  var volumeByDayGroup = volumeByDay.group()
			.reduceCount(function(d) { return d.dtg; });

		// Magnitide Bar Graph Summed
		  magnitudeChart.width(480)
			.height(150)
			.margins({top: 10, right: 10, bottom: 20, left: 40})
			.dimension(magValue)								// the values across the x axis
			.group(magValueGroupSum)							// the values on the y axis
			.transitionDuration(500)
			.centerBar(true)	
			.gap(56)                                            // bar width Keep increasing to get right then back off.
			.x(d3.scale.linear().domain([0.5, 7.5]))
			.elasticY(true)
			.xAxis().tickFormat(function(v) {return v;});	

		// Depth bar graph
		  depthChart.width(480)
			.height(150)
			.margins({top: 10, right: 10, bottom: 20, left: 40})
			.dimension(depthValue)
			.group(depthValueGroup)
			.transitionDuration(500)
			.centerBar(true)	
			.gap(1)                    // bar width Keep increasing to get right then back off.
			.x(d3.scale.linear().domain([0, 100]))
			.elasticY(true)
			.xAxis().tickFormat(function(v) {return v;});

		// time graph
		  timeChart.width(960)
			.height(100)
			.margins({top: 10, right: 10, bottom: 20, left: 40})
			.dimension(volumeByDay)
			.group(volumeByDayGroup)
			.transitionDuration(500)
			.elasticY(true)
			.x(d3.time.scale().domain([new Date(2013, 6, 18), new Date(2013, 6, 24)])) // scale and domain of the graph
			.xAxis();

		 // Table of earthquake data
		 /*
		  dataTable.width(960).height(800)
			.dimension(timeDimension)
			.group(function(d) { return "List of all earthquakes corresponding to the filters"
			 })
			.size(10)							// number of rows to return
			.columns([
			  function(d) { return d.dtg; },
			  function(d) { return d.lat; },
			  function(d) { return d.long; },
			  function(d) { return d.depth; },
			  function(d) { return d.mag; },
			  function(d) { return '<a href=\"http://maps.google.com/maps?z=11&t=m&q=loc:' + d.lat + '+' + d.long +"\" target=\"_blank\">Google Map</a>"},
			  function(d) { return '<a href=\"http://www.openstreetmap.org/?mlat=' + d.lat + '&mlon=' + d.long +'&zoom=11'+ "\" target=\"_blank\"> OSM Map</a>"}
			])
			.sortBy(function(d){ return d.dtg; })
			.order(d3.ascending); */
			
		dc.renderAll();
  });
}

function plotGraph(){
	var x = document.getElementById("selectX");
	var y = document.getElementById("selectY");
	
	//console.log(x.value);
	//console.log(y.value);
	createDynamicCharts(x.value, y.value);
}

function createDynamicCharts(xCol,yCol) {
	
	//console.log(xCol);
	
	var rows = tableBody.rows,
        rlen = rows.length,
        x = [], y = [], data = [],
        i;
    //Get statistics for the selected column if valid
	cells = rows[0].cells;

	if (!isNaN(parseInt(cells[xCol].innerHTML)) && !isNaN(parseInt(cells[yCol].innerHTML))) {
	
		for (i = 0; i < rlen; i++) {
			data.push({x:parseInt(rows[i].cells[xCol].innerHTML),
					   y:parseInt(rows[i].cells[yCol].innerHTML)});
		}
	}
	else {
		alert("One of the column holds NaN values!! Please select another");
		return;
	}
	
	function print_filter(filter){
				var f=eval(filter);
				if (typeof(f.length) != "undefined") {}else{}
				if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
				if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
				console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
			};
			
	// format our data
	var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
	
	var timeChartSum = dc.lineChart("#dc-time-chart-sum");
	var timeChartCount = dc.lineChart("#dc-time-chart-count");
	var barChartSum = dc.barChart("#dc-bar-chart-sum");
	
	var facts = crossfilter(data);
	//print_filter(facts);
	
	var xValue = facts.dimension(function (d) {
		return d.x;
	});
	
	var yGroupCount = xValue.group().reduceCount(function(d) { return d.y; });
	var yGroupSum = xValue.group().reduceSum(function(d) { return d.y; });
			
	timeChartSum.width(960)
			.height(400)
			.margins({top: 10, right: 10, bottom: 20, left: 40})
			.dimension(xValue)
			.group(yGroupSum)
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)	 
			.mouseZoomable(true)
			.transitionDuration(0)
			.rangeChart(barChartSum)
			.renderDataPoints({radius: 5})
			.elasticY(true)
			.brushOn(false)
			.x(d3.scale.linear().domain([0, 100]))
			//.y(d3.scale.linear().domain([0, 50]))// scale and domain of the graph
			.xAxis();
			
	timeChartCount.width(960)
			.height(400)
			.margins({top: 10, right: 10, bottom: 20, left: 40})
			.dimension(xValue)
			.group(yGroupCount)
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)	 
			.mouseZoomable(true)
			.transitionDuration(0)
			//.rangeChart(barChartSum)
			.renderDataPoints({radius: 5})
			.brushOn(false)
			.x(d3.scale.linear().domain([0, 100]))
			.y(d3.scale.linear().domain([0, 10]))// scale and domain of the graph
			.xAxis();
			
	 barChartSum.width(480)
			.height(150)
			.margins({top: 10, right: 10, bottom: 20, left: 40})
			.dimension(xValue)								// the values across the x axis
			.group(yGroupSum)							// the values on the y axis
			.transitionDuration(0)
			.centerBar(true)
			.mouseZoomable(true)			
			.gap(56)			// bar width Keep increasing to get right then back off.
			.x(d3.scale.linear().domain([0, 100]))
			.elasticY(true)
			.xAxis().tickFormat(function(v) {return v;});	
			
	dc.renderAll();
}
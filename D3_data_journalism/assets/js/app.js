// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(csvData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.8,
    d3.max(csvData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// // function used for updating y-scale var upon click on axis label
// function yScale(csvData, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.8,
//     d3.max(csvData, d => d[chosenYAxis]) * 1.2
//     ])
//     .range([height, 0]);

//   return yLinearScale;

// }

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// // function used for updating yAxis var upon click on axis label
// function renderAxes(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(leftAxis);

//   return yAxis;
// }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty (%):";
  }
  else if (chosenXAxis === "ageMedian") {
    label = "Age Median:";
  }
  else { label = "Household Income (Median)" };

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${label} ${[d.chosenYAxis]}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (csvData, err) {
  if (err) throw err;

  // parse data
  csvData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(csvData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(csvData, d => d.obesity)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    // .attr("class", "aText active x") 
    .attr("transform", `translate(0, ${height})`) //correct
    .call(bottomAxis);

  // append y axis 
  var yAxis = chartGroup.append("g")
    // .attr("class", "aText active y")  
    .classed("y-axis", true)
    .attr("transform", `translate(${width},0)`) //
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    // .attr("transform", "rotate(-90)")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", -26)
    .attr("data-name", "poverty") // value to grab for event listener
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("data-name", "age") // value to grab for event listener
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 26)
    .attr("data-name", "income")
    .attr("data-axis", "x")
    .attr("class", "aText inactive x")
    .text("Household income (Median)");


  // append y axis
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var obesityLabel = labelsGroup.append("text")
    // .attr("x", 0)
    .attr("y", -15)
    .attr("data-axis", "y")
    .attr("data-name", "obesity")
    // .attr("value", "test1") // value to grab for event listener
    .attr("class", "aText active y")
    // .classed("active", true)
    .text("Obese (%)test1");

  var smokeLabel = labelsGroup.append("text")
    // .attr("x", 0)
    .attr("y", 10)
    // .attr("value", "smokes") // value to grab for event listener
    .attr("data-axis", "y")
    .attr("data-name", "smokes")
    .attr("class", "aText inactive y")
    // .classed("inactive", true)
    .text("Smokes (%)1");

  var lackhealthcareLabel = labelsGroup.append("text")
    // .attr("x", 0)
    .attr("y", 35)
    // .attr("value", "healthcare") // value to grab for event listener
    .attr("data-axis", "y")
    .attr("data-name", "healthcare")
    .attr("class", "aText inactive y")
    // .classed("inactive", true)
    .text("Lacks Healthcare (%)1");

  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .classed("axis-text", true)
  //   .text("Number of Billboard 500 Hits");

  // Create group for  3 y- axis labels

  var labelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
  // .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var obesityLabel = labelsGroup.append("text")
    .attr("y", -25)
    .attr("value", "obesity") // value to grab for event listener
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("Obese (%)");

  var smokeLabel = labelsGroup.append("text")
    // .attr("x", 0)
    .attr("y", 0)
    .attr("value", "smokes") // value to grab for event listener
    .attr("class", "aText inactive y")
    .text("Smokes (%)");

  var lackHealthcareLabel = labelsGroup.append("text")
    // .attr("x", 0)
    .attr("y", 25)
    .attr("value", "healthcare") // value to grab for event listener
    .attr("class", "aText inactive y")
    .text("Lacks of Healthcare (%)");



  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  // var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(csvData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      }
    });
}).catch(function (error) {
  console.log(error);
});

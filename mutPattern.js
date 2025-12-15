// Global variables recording the values of the latest mutation matrix
var InitialMat;
var PrinInitialMat;
var aTropMinInitial;
var yTropMinInitial;
var aTropMaxInitial;
var yTropMaxInitial;

var Cartan;

let DynkinExchangeMatrix;
let affine_Dynkin = false;
let clusterVars = null;
let clusterVarsHistory = [];

//window.MathJax = {
//	loader: {load: ['[tex]/color']},
//	tex: {packages: {'[+]': ['color']}}
//  };

// Dashboard0 to Dashboard1
function dashZeroToOne() {
	const choice = document.querySelector('input[name="inputMethod"]:checked').value;
	// Close all dashboards
	document.getElementById("inDashboardManual1").className = "dashboardOff";
	document.getElementById("inDashboardManual2").className = "dashboardOff";
	document.getElementById("inDashboardBruhat1").className = "dashboardOff";
	document.getElementById("inDashboardBruhat2").className = "dashboardOff";
	document.getElementById("inDashboardGrassmannian1").className = "dashboardOff";
	document.getElementById("inDashboardAcyclic1").className = "dashboardOff";
	document.getElementById("inDashboardAcyclic2").className = "dashboardOff";
	document.getElementById("outDashboard1").className = "dashboardOff";
	document.getElementById("outDashboard2").className = "dashboardOff";
	// Reveal the next dashboard
	if (choice == "manual") {
		document.getElementById("inDashboardManual1").className = "dashboard";
	}
	else if (choice == "Bruhat") {
		document.getElementById("inDashboardBruhat1").className = "dashboard";
	}
	else if (choice == "Grassmannian") {
		document.getElementById("inDashboardGrassmannian1").className = "dashboard";
	}
	else if (choice == "Acyclic") {
		affine_Dynkin = false;
		document.getElementById("inDashboardAcyclic1").className = "dashboard";
	}
	else if (choice == "AffineDynkin") {
		affine_Dynkin = true;
		document.getElementById("inDashboardAcyclic1").className = "dashboard";
	}
}


function closePopup() {
	const popup = document.getElementById("mutation-matrix");
	popup.style.display = "none";
}

function createGrid() {
// Reveal popup grid for matrix size selection
document.getElementById("mutation-matrix").style.display = "block";
// Reveal "Submit initial data" button
	document.getElementById("createMutMatButton").style.display = "inline";

}


function hoverSelect(n) {
	const rownum = Math.floor(n/8);
	const colnum = n%8;
	document.getElementById("tableHead").innerHTML = "Matrix of size " + (rownum+1) + "x" + (colnum+1);
	for (let i=0; i<=rownum; i++) {
		for (let j=0; j <= colnum; j++) {
			const m = i*8+j;
			cell = document.getElementById(m);
			if (j <= i) cell.className = "cell-on";
		}
	}
}

function hoverOff(n) {
	const rownum = Math.floor(n/8);
	const colnum = n%8;
	for (let i=0; i<8; i++) {
		for (let j=0; j <= i; j++) {
			const m = i*8+j;
			cell = document.getElementById(m);
			if (i < rownum && j >= colnum || i >= rownum){
				cell.className = "cell";
			}	
		}
	}
}


function generateTable(n, m, tagId) {
	closePopup();
	const tableContainer = document.getElementById(tagId);
	tableContainer.innerHTML = "";
  // Create the table element
	const table = document.createElement("table");

  // Create rows and cells
  	for (let i = 0; i < n; i++) {
    	const row = table.insertRow();
	    for (let j = 0; j < m; j++) {
	      const cell = row.insertCell();
	      cell.innerHTML = '<input type="text" maxlength="4" size="3"/>';
	    }
  	}

  // Append the table to the table container
  	tableContainer.appendChild(table);
  	return table;
  	//table.setAttribute("id", "mutMatrix");
}

// Function for creating the grid for the initial mutation matrix
function createEmptyMat(n) {
	let rownum = Math.floor(n/8)+1;
	let colnum = n%8+1;
	generateTable(rownum, colnum, "tableContainer").setAttribute("id", "mutMatrix");

	document.getElementById("inDashboardManual2").setAttribute("class", "dashboard");

	// Adjust the display of the grid's tropical points columns
	if (document.getElementById("AtropMinCheckBox").checked == true) {
		generateTable(1,rownum,"AtropMinContainer").setAttribute("id", "AtropMinPoint");
		document.getElementById("AtropMinHeader").style.visibility = "visible";
	}

	else {
		document.getElementById("AtropMinContainer").innerHTML = "";
		document.getElementById("AtropMinHeader").style.visibility = "hidden";
	}

	if (document.getElementById("YtropMinCheckBox").checked == true) {
		generateTable(1,colnum,"YtropMinContainer").setAttribute("id", "YtropMinPoint");
		document.getElementById("YtropMinHeader").style.visibility = "visible";
	}
	else {
		document.getElementById("YtropMinContainer").innerHTML = "";
		document.getElementById("YtropMinHeader").style.visibility = "hidden";
	}

	if (document.getElementById("AtropMaxCheckBox").checked == true) {
		generateTable(1,rownum,"AtropMaxContainer").setAttribute("id", "AtropMaxPoint");
		document.getElementById("AtropMaxHeader").style.visibility = "visible";
	}

	else {
		document.getElementById("AtropMaxContainer").innerHTML = "";
		document.getElementById("AtropMaxHeader").style.visibility = "hidden";
	}
	if (document.getElementById("YtropMaxCheckBox").checked == true) {
		generateTable(1,colnum,"YtropMaxContainer").setAttribute("id", "YtropMaxPoint");
		document.getElementById("YtropMaxHeader").style.visibility = "visible";
	}
	else {
		document.getElementById("YtropMaxContainer").innerHTML = "";
		document.getElementById("YtropMaxHeader").style.visibility = "hidden";
	}

}


function renderArray(array,tagById,renderType) {
	renderMatrix([array],tagById,renderType);
}

function renderMatrix(matrix,tagById,renderType) {
	let rownum = matrix.length;
	let colnum = matrix[0].length;
	let s = "\\( \\begin{pmatrix}";
	for (let i = 0; i < rownum; i++) {
		for (let j = 0; j < colnum; j++) {
			s += matrix[i][j];
			if (j != colnum-1) {
				s += "&";
			}
		}
		if (i != rownum-1) {
			s += '\\\\';
		}
	}
	s += "\\end{pmatrix}\\)";
	const node = document.createTextNode(s);

	// renderType determines whether the tagById div needs to be clear before constructing 
	// the new matrix
	const el = document.getElementById(tagById);
	if (renderType == "clear") {
		// Clear the current div
		el.replaceChildren();
	}
	else if (renderType == "concat") {

	}
	el.appendChild(node);
}

function mutButtons () {
	document.getElementById("mutationButtons").innerHTML = "";
	document.getElementById("mutationHistory").innerHTML = "";
	mutationButtons = document.getElementById("mutationButtons");
	
	// Create a mutation button for each column (if number of
	// columns <= number of rows) or each row (if number of rows <= number of columns)
	const n = Math.min(InitialMat.length, InitialMat[0].length);
	for (let i = 1; i <= n; i++) {
		const button = document.createElement("button");
		const mutationButtonNum = i + "mutButton";
		button.setAttribute("id", mutationButtonNum);
		button.setAttribute("onclick", "mutateData("+i+")");
		button.innerHTML = "\\( \\mu_{" + i + "}\\)";
		mutationButtons.appendChild(button);
	}
	//MathJax.typeset([mutationButtons]);
	MathJax.typeset();
	initTrackingClusterVars();
}


function createMutationMatrix() {
	// Clear any previous mutation matrix / mutation buttons
	document.getElementById("initialMatrix").innerHTML = "";
	document.getElementById("initialATropMin").innerHTML = "";
	document.getElementById("initialYTropMin").innerHTML = "";
	document.getElementById("initialATropMax").innerHTML = "";
	document.getElementById("initialYTropMax").innerHTML = "";

	document.getElementById("outDashboard1").setAttribute("class", "dashboard");
	document.getElementById("outDashboard2").setAttribute("class", "dashboard");

	document.getElementById("mutationHistory").innerHTML = "";

	document.getElementById('iniMutMatHeader').style.visibility = "visible";

	// Function to convert the user input of initial mutation matrix into an array
	function callme(cc) {
	  let result = Array.prototype.map.call(cc, function(e) {
	    return parseFloat(e.value);
	  });
	  return result;
	}

	// Retrieve the content of each <input> in tableContainer, i.e. the 
	// content of each cell of the mutation matrix
	let cells = document.querySelectorAll('#tableContainer input');
	let cellsArray = callme(cells);
	
	
	// Retrieve all the rows in tableContainer.
	let rows = document.querySelectorAll('#tableContainer tr');
	let rownumInitialMat = rows.length;
	let colnumInitialMat = cellsArray.length / rownumInitialMat;
	InitialMat = [];
	PrinInitialMat = [];
	while (cellsArray.length) {
		let row = cellsArray.splice(0, colnumInitialMat);
		InitialMat.push(row.slice());
		PrinInitialMat.push(row);
	}

	// Test whether the mutation matrix is sign-skew-symmetric
	document.getElementById('sssStateCurrent').innerHTML = sssTest(PrinInitialMat);

	// Test whether the mutation matrix is skew-symmetrisable
	document.getElementById('ssStateCurrent').innerHTML = ssTest(PrinInitialMat);

	// Create MathJax rendition of initial mutation matrix in the <div id="initialMatrix">
	renderMatrix(InitialMat,'initialMatrix', "clear");
	// Ask MathJax to render the newly created code in LaTeX
	//MathJax.typeset([initialMatrix]);

	renderMatrix(PrinInitialMat,'initialPrincipalPart', "clear");
	//MathJax.typeset([initialPrincipalPart]);

	// Reveal the "Show mutation history" button
	document.getElementById("mutationHistoryButton").style.display = "block";
	// Create MathJax rendition of initial mutation matrix in the <div id="mutationHistory">
	// Note the code in <div id="mutationHistory"> is not typeset until 
	// the user presses the button "show mutation history"
	renderMatrix(InitialMat,'mutationHistory', "clear");

	// Adjust the display of the grid's tropical points columns
	if (document.getElementById("AtropMinCheckBox").checked == true) {
		document.getElementById("iniAtropMinHeader").style.visibility = "visible";
		let aCells = document.querySelectorAll('#AtropMinContainer input');
		let aCellsArray = callme(aCells);
		aTropMinInitial = aCellsArray;
		renderArray(aTropMinInitial,'initialATropMin',"clear");
		//MathJax.typeset([initialATropMin]);
	}

	else {
	//	document.getElementById("AtropMinContainer").innerHTML = "";
		document.getElementById("iniAtropMinHeader").style.visibility = "hidden";
	}

	if (document.getElementById("YtropMinCheckBox").checked == true) {
		document.getElementById("iniYtropMinHeader").style.visibility = "visible";
		let yCells = document.querySelectorAll('#YtropMinContainer input');
		let yCellsArray = callme(yCells);
		yTropMinInitial = yCellsArray;
		renderArray(yTropMinInitial,'initialYTropMin',"clear");
		//MathJax.typeset([initialYTropMin]);
	}
	else {
	//	document.getElementById("YtropMinContainer").innerHTML = "";
		document.getElementById("iniYtropMinHeader").style.visibility = "hidden";
	}

	// Repeat for the tropical points associated to Zmax
	if (document.getElementById("AtropMaxCheckBox").checked == true) {
		document.getElementById("iniAtropMaxHeader").style.visibility = "visible";
		let aCells = document.querySelectorAll('#AtropMaxContainer input');
		let aCellsArray = callme(aCells);
		aTropMaxInitial = aCellsArray;
		renderArray(aTropMaxInitial,'initialATropMax',"clear");
		//MathJax.typeset([initialATropMax]);
	}

	else {
	//	document.getElementById("AtropMaxContainer").innerHTML = "";
		document.getElementById("iniAtropMaxHeader").style.visibility = "hidden";
	}

	if (document.getElementById("YtropMaxCheckBox").checked == true) {
		document.getElementById("iniYtropMaxHeader").style.visibility = "visible";
		let yCells = document.querySelectorAll('#YtropMaxContainer input');
		let yCellsArray = callme(yCells);
		yTropMaxInitial = yCellsArray;
		renderArray(yTropMaxInitial,'initialYTropMax',"clear");
		//MathJax.typeset([initialYTropMax]);
	}
	else {
	//	document.getElementById("YtropMinContainer").innerHTML = "";
		document.getElementById("iniYtropMaxHeader").style.visibility = "hidden";
	}

	mutButtons();
	quiver(PrinInitialMat);
	MathJax.typeset()
}


function mutateData(direction) { // The mutation direction is an integer from 1 to the number of columns in InitialMat
	// Hide the mutation history div
	document.getElementById("mutationHistory").style.display = "none";
	document.getElementById("mutationHistoryButton").innerHTML = "Show mutation history";

	// Mutate tropical points if any exists
	if (document.getElementById("AtropMinCheckBox").checked == true) {
		aTropMinInitial = mutateATrop(aTropMinInitial,InitialMat,direction,Math.min);
		arrayToMatrix(aTropMinInitial,1,'initialATropMin',"clear");
		//MathJax.typeset([initialATropMin]);
	}
	if (document.getElementById("YtropMinCheckBox").checked == true) {
		yTropMinInitial = mutateYTrop(yTropMinInitial,InitialMat,direction,Math.min);
		arrayToMatrix(yTropMinInitial,1,'initialYTropMin',"clear");
		//MathJax.typeset([initialYTropMin]);
	}
	if (document.getElementById("AtropMaxCheckBox").checked == true) {
		aTropMaxInitial = mutateATrop(aTropMaxInitial,InitialMat,direction,Math.max);
		arrayToMatrix(aTropMaxInitial,1,'initialATropMax',"clear");
		//MathJax.typeset([initialATropMax]);
	}
	if (document.getElementById("YtropMaxCheckBox").checked == true) {
		yTropMaxInitial = mutateYTrop(yTropMaxInitial,InitialMat,direction,Math.max);
		arrayToMatrix(yTropMaxInitial,1,'initialYTropMax',"clear");
		//MathJax.typeset([initialYTropMax]);
	}
	if (clusterVars !== null) {
		const incoming = [];
		const outgoing = [];
		for (let i = 0; i < InitialMat.length; i++) {
			const b = InitialMat[i][direction-1];
			for (let j = 0; j < b; j++) {
				incoming.push(clusterVars[i]);
			}
			for (let j = b; j < 0; j++) {
				outgoing.push(clusterVars[i]);
			}
		}
		clusterVars[direction-1] = clusterVars[direction-1].mutation(incoming, outgoing);
		clusterVarsHistory.push([direction, clusterVars[direction-1]]);
		const out = document.getElementById("clusterVarsOutput");
		const div = divClusterVar(direction, clusterVars[direction-1], specialisedClusterVars());
		out.appendChild(div);
		out.appendChild(document.createElement('br'));
		const did = 'cvout' + out.childElementCount;
		div.setAttribute('id', did);
		MathJax.typeset(['#' + did]);
	}
	// Create new matrix by mutating the latest
	InitialMat = mutation(InitialMat,direction);
	PrinInitialMat = mutation(PrinInitialMat,direction);
	// Test whether the mutation matrix is sign-skew-symmetric
	document.getElementById('sssStateCurrent').innerHTML = sssTest(InitialMat);

	// Test whether the mutation matrix is skew-symmetrisable
	document.getElementById('ssStateCurrent').innerHTML = ssTest(InitialMat);

	// Convert the latest mutation matrix to MathJax
	renderMatrix(InitialMat,'initialMatrix', "clear");
	// Render the MathJax
	//MathJax.typeset([initialMatrix]);

	renderMatrix(PrinInitialMat,'initialPrincipalPart', "clear");
	//MathJax.typeset([initialPrincipalPart]);

	// Add the mutation direction to mutation history div
	document.getElementById("mutationHistory").innerHTML += "\\( \\xrightarrow{ \\mu_" + direction + "} \\) ";
	// Add latest mutation matrix to <div id="mutationHistory">
	renderMatrix(InitialMat,'mutationHistory', "concat");
	quiver(PrinInitialMat);
	// Ask MathJax to render the newly created code in LaTeX
	MathJax.typeset(['#outDashboard1']);

}

function mutation(matrix,direction) {
	const rows = matrix.length;
	const cols = matrix[0].length;
	// Declare a new matrix
	let newMatrix = Array.from(Array(rows), () => new Array(cols));
	// Matrix mutation formulas:
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (i == (direction-1) || j == (direction-1)) {
				newMatrix[i][j] = (-1)*matrix[i][j];
			}
			else {
				newMatrix[i][j] = matrix[i][j] + Math.max(matrix[i][direction-1],0)*Math.max(matrix[direction-1][j],0) - Math.max(-matrix[i][direction-1],0)*Math.max(-matrix[direction-1][j],0);
			}
		}
	}
	return newMatrix;
}

function toggleDiv(button, element, name) {
	if (element.style.display == "none") {
		element.style.display = "block";
		document.getElementById(button).innerHTML = "Hide "+ name;
		//MathJax.typeset([mutationHistory]);
		MathJax.typeset();
	}
	else {
		element.style.display = "none";
		document.getElementById(button).innerHTML = "Show "+ name;
	}

}
	
function mutateATrop (trop,matrix,direction,sgnFunc) {
	const rownum = matrix.length;
	const colnum = matrix[0].length;
	let newTrop = [];
	for (let i =0; i < rownum; i++) {
		if (i == direction-1) {
			let Tpos = 0;
			let Tneg = 0;
			for (let j=0; j < rownum; j++) {
				Tpos += Math.max(matrix[j][direction-1],0) * trop[j];
				Tneg += Math.max(-matrix[j][direction-1],0) * trop[j];
			}
			newTrop[i] = -trop[i] + sgnFunc(Tpos,Tneg);
		}
		else {
			newTrop[i] = trop[i];
		}
	}
	return newTrop;
}	

function mutateYTrop (trop,matrix,direction,sgnFunc) {
	const rownum = matrix.length;
	const colnum = matrix[0].length;
	let newTrop = [];
	for (let i =0; i < colnum; i++) {
		if (i != direction-1) {
			let rhs = 0;
			rhs += trop[i];
			rhs += Math.max(matrix[direction-1][i],0) * trop[direction-1];
			rhs += (-1)*matrix[direction-1][i] * sgnFunc(trop[direction-1],0);
			newTrop[i] = rhs;
		}
		else {
			newTrop[i] = -trop[i];
		}
	}
	return newTrop;
}

// Test whether the principal part of a matrix is sign-skew-symmetric
function sssTest (matrix) {
	let p = Math.min(matrix.length, matrix[0].length);
	for (let i = 0; i < p; i++) {
		// Check whether the diagonal entry is zero
		if (matrix[i][i] != 0) {
			return 'No';
		}
		for (let j = i+1; j < p; j++) {
			// The first two ifs are to check that bij = 0 if and only if bji = 0
			// Note the simple formula for bij and bji
			if (matrix[i][j] == 0 && matrix[j][i] != 0) {
				return 'No';
			}
			else if (matrix[i][j] != 0 && matrix[j][i] == 0) {
				return 'No';
			}
			// This check is for the sign of non-zero entries bij and bji
			else if (matrix[i][j]*matrix[j][i]>0) {
				return 'No';
			}
		}
	}	
	return 'Yes';
}

// Test whether the principal part of a matrix is skew-symmetrisable
function ssTest (matrix) {
	if (document.getElementById('sssStateCurrent').innerHTML == 'No') {
		return 'No';
	}
	let p = Math.min(matrix.length, matrix[0].length);
	let	diag = Array(p*p).fill(0);
	let index = Array.from(Array(p).keys());
	while (index.length > 0) {
		let i = index[0];
		// Remove the first entry of index
		index = index.slice(1);
		if (diag[i*p+i] == 0) {
			diag[i*p+i] = 1;
		}
		let cycle = index.slice();
		for (const j of index) {
			if (matrix[i][j] == 0) {
				
			}
			else {
				const pos = cycle.indexOf(j);
				cycle.splice(pos, 1);
				cycle.unshift(j);
				if (diag[j*p+j] != 0) {
					if (diag[j*p+j]*matrix[j][i] + diag[i*p+i]*matrix[i][j] != 0) {
						return 'No';
					}

				}
				else {
					diag[j*p+j] = (-1)*diag[i*p+i]*matrix[i][j]/matrix[j][i];
				}
			}
		}
		index = cycle;
	}
	return 'Yes';
}

function quiver(matrixData) {
  /**
   * Build the graph data (nodes & links) from the skew-symmetric matrix.
   * Each node is simply labeled by its index (i).
   * Each link has {source, target, weight}.
   */
  function buildGraphFromMatrix(M) {
	const n = M.length;
	// Create node objects
	const nodes = Array.from({ length: n }, (_, i) => ({ id: i }));
	
	// Create link objects
	const links = [];
	for (let i = 0; i < n; i++) {
	  for (let j = 0; j < n; j++) {
		if (i < j) {
		  // We only need to check i<j to avoid duplication
		  if (M[i][j] > 0) {
			// Edge i -> j
			links.push({
			  source: i,
			  target: j,
			  weight: (M[i][j] == 1 && M[j][i] == -1 ? '' : M[i][j] == -M[j][i] ? M[i][j] : '('+M[i][j]+','+(-M[j][i])+')')
			});
		  } else if (M[i][j] < 0) {
			// Edge j -> i
			links.push({
			  source: j,
			  target: i,
			  weight: (M[i][j] == -1 && M[j][i] == 1 ? '' : M[i][j] == -M[j][i] ? M[j][i] : '('+M[j][i]+','+(-M[i][j])+')')
			});
		  }
		}
	  }
	}
  
	return { nodes, links };
  }
  
  /**
   * Draws an oriented graph (directed) with D3's force simulation.
   * Users can drag the nodes to rearrange them.
   */
  function drawOrientedGraph({ nodes, links }, svgSelector) {
	const svg = d3.select(svgSelector);
	const width = +svg.attr("width");
	const height = +svg.attr("height");
  
	// Define a force simulation
	const simulation = d3.forceSimulation(nodes)
	  .force("link", d3.forceLink(links).distance(100).strength(1).id(d => d.id))
	  .force("charge", d3.forceManyBody().strength(-300))
	  .force("center", d3.forceCenter(width / 2, height / 2))
	  .on("tick", ticked);
  
	// Define arrow markers for directed edges
	svg.append("defs").selectAll("marker")
	  .data(["arrow"])
	  .enter()
	  .append("marker")
	  	.attr("id", d => d)
		.attr("refX", 16)    // so the arrow is placed at the end of the link
		.attr("refY", 0)
		.attr("markerWidth", 6)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.attr("class", "arrowhead")
		.attr("viewBox", "0 -5 10 10")
	  .append("path")
		.attr("d", "M0,-5 L10,0 L0,5");
  
	// Create links (lines)
	const link = svg.append("g")
	  .attr("class", "links")
	  .selectAll("path")
	  .data(links)
	  .enter().append("path")
		.attr("class", "link")
		.attr("marker-end", "url(#arrow)")
		.style("stroke", "#666");
  
	// Create link labels for weights
	const linkLabels = svg.append("g")
	  .selectAll(".weight-label")
	  .data(links)
	  .enter().append("text")
		.attr("class", "weight-label")
		.attr("dy", -5)
		.text(d => d.weight);
  
	// Create nodes (circles)
	const node = svg.append("g")
	  .attr("class", "nodes")
	  .selectAll("circle")
	  .data(nodes)
	  .enter().append("circle")
		.attr("class", "node")
		.attr("r", 12)
		.attr("fill", "#69b3a2")
		.call(d3.drag()
		  .on("start", dragStarted)
		  .on("drag", dragged)
		  .on("end", dragEnded));
  
	// Create node labels
	const nodeLabels = svg.append("g")
	  .selectAll(".node-label")
	  .data(nodes)
	  .enter().append("text")
		.attr("class", "node-label")
		.attr("text-anchor", "middle")
		.attr("dy", 4)
		.text(d => d.id+1);
  
	// Update positions each tick
	function ticked() {
	  xclamp = (x => Math.max(30, Math.min(width-30, x)));
	  yclamp = (y => Math.max(30, Math.min(height-30, y)));
	  
	  // Update link positions
	  link.attr("d", d => {
		const sx = xclamp(d.source.x);
		const sy = yclamp(d.source.y);
		const tx = xclamp(d.target.x);
		const ty = yclamp(d.target.y);
		return `M${sx},${sy} L${tx},${ty}`;
	  });
  
	  // Update link labels (weight) positions
	  linkLabels
		.attr("x", d => (xclamp(d.source.x) + xclamp(d.target.x)) / 2)
		.attr("y", d => (yclamp(d.source.y) + yclamp(d.target.y)) / 2);
  
	  // Update node positions
	  node.attr("cx", d => xclamp(d.x))
		  .attr("cy", d => yclamp(d.y));
  
	  // Update node labels positions
	  nodeLabels
		.attr("x", d => xclamp(d.x))
		.attr("y", d => yclamp(d.y));
	}
  
	// Drag behavior
	function dragStarted(event, d) {
	  if (!event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}
  
	function dragged(event, d) {
	  d.fx = event.x;
	  d.fy = event.y;
	}
  
	function dragEnded(event, d) {
	  if (!event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}
  }
  
  // Build the graph data from the matrix
  const graphData = buildGraphFromMatrix(matrixData);
  
  document.getElementById("graph").innerHTML = "";
  // Draw the oriented graph in the SVG with id="graph"
  drawOrientedGraph(graphData, "#graph");
}
  

function displayCartanShortcut(type, rank,tagById) {
	Cartan = createCartan(type, rank);
	renderMatrix(Cartan, tagById, "clear");
	MathJax.typeset();
}

function displayCartanShortcutAcyclic(type, rank,tagById) {
	DynkinExchangeMatrix = createDynkinExchangeMatrix(type, rank);
	renderMatrix(DynkinExchangeMatrix, tagById, "clear");
	MathJax.typeset();
}


function rankToCartan() {
	// Recover the rank inputted by the user
	let rank = parseInt(document.getElementById("userInputRankAcyclic").value);
	if (affine_Dynkin) rank -= 1;

	// Reveal the dashboard 2.
	document.getElementById("inDashboardAcyclic2").setAttribute("class","dashboard");

	// Clear the computations on dashboards 2. 
	document.getElementById("CartanButtons").innerHTML = "";
	document.getElementById("UserCartanDisplayAcyclic").innerHTML = "";

	// Create "shortcut" buttons for Cartan matrices in div with id="CartanButtons"


	CartanButtons = document.getElementById("CartanButtons");
	const ti = (affine_Dynkin ? "\\tilde " : "");
	
	if (rank >= 1) {
		// For an affine Dynkin diagram of type A and rank 1, there are two affine types: twisted and untwisted.
		if (rank ==1 && affine_Dynkin) {
			let button1 = document.createElement("button");
			let buttonId1 = "TwistedA1";
			button1.innerHTML = "\\( "+ti+"{\\text{A}}_{" + 11 +"}\\)";
			button1.setAttribute("id", buttonId1);
			button1.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			CartanButtons.appendChild(button1);

			let button2 = document.createElement("button");	
			let buttonId2 = "UntwistedA1";
			button2.innerHTML = "\\( "+ti+"{\\text{A}}_{" + 12 +"}\\)";
			button2.setAttribute("id", buttonId2);
			button2.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			CartanButtons.appendChild(button2);
		}
		// For an affine Dynkin diagram of type A and rank >= 2, there are non-mutation equivalent orientations.
		// We create the corresponding buttons.
		else if (affine_Dynkin && rank >= 2) {
			for (let i = 1; i <= rank; i++) {
				let button = document.createElement("button");
				let buttonId = "A" + i + "," + (rank+1-i);
				button.innerHTML = "\\( "+ti+"{\\text{A}}_{" + i +","+ (rank+1-i) + "}\\)";
				button.setAttribute("id", buttonId);
				button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
				CartanButtons.appendChild(button);
			}

		} 
		// Create an An button
		else {
			let button = document.createElement("button");
			let buttonId = "A";
			button.setAttribute("id", buttonId);
			button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button.innerHTML = "\\( {\\text{A}}_{" + rank + "}\\)";
			CartanButtons.appendChild(button);
		}
		
	}

	// Create a Bn button if rank >= 2
	if (rank >= 2) {
		let button = document.createElement("button");
		let buttonId = "B";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
		button.innerHTML = "\\( "+ti+"{\\text{B}}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);

		// Create the \tilde{BC}_m affine button if the user has selected affine Dynkin diagrams
		if (affine_Dynkin) {
			let button = document.createElement("button");
			let buttonId = "BC";
			button.setAttribute("id", buttonId);
			button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button.innerHTML = "\\( \\tilde{\\text{BC}}_{" + rank + "}\\)";
			CartanButtons.appendChild(button);
		}
	}
	// Create a Cn button if rank >= 3
	if (rank >= 3 || (affine_Dynkin && rank == 2)) {
		let button = document.createElement("button");
		let buttonId = "C";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
		button.innerHTML = "\\( "+ti+"{\\text{C}}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}

	// Create a Dn button if rank >= 4
	if (rank >= 4 || (affine_Dynkin && rank == 3)) {
		let button = document.createElement("button");
		let buttonId = "D";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
		button.innerHTML = "\\( "+ti+"{\\text{D}}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);

		if (affine_Dynkin) {
			// Add a BD button
			let button = document.createElement("button");
			let buttonId = "BD";
			button.setAttribute("id", buttonId);
			button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button.innerHTML = "\\( \\tilde{\\text{BD}}_{" + rank + "}\\)";
			CartanButtons.appendChild(button);

			// Add a CD button
			let button2 = document.createElement("button");
			let buttonId2 = "CD";
			button2.setAttribute("id", buttonId2);
			button2.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button2.innerHTML = "\\( \\tilde{\\text{CD}}_{" + rank + "}\\)";
			CartanButtons.appendChild(button2);
		}
	}

	// Add exceptional types in suitable ranks
	if (rank == 6 || rank == 7 || rank == 8) {
		let button = document.createElement("button");
		let buttonId = "E";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
		button.innerHTML = "\\( "+ti+"{\\text{E}}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}

	if (rank == 4 ) {
		if (affine_Dynkin) {
			let button1 = document.createElement("button");	
			let buttonId1 = "F41";
			button1.setAttribute("id", buttonId1);
			button1.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button1.innerHTML = "\\( \\tilde{\\text{F}}_{" + 41 + "}\\)";
			CartanButtons.appendChild(button1);
			
			let button2 = document.createElement("button");	
			let buttonId2 = "F42";
			button2.setAttribute("id", buttonId2);
			button2.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button2.innerHTML = "\\( \\tilde{\\text{F}}_{" + 42 + "}\\)";
			CartanButtons.appendChild(button2);
		}
		else {
		let button = document.createElement("button");
		let buttonId = "F";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
		button.innerHTML = "\\( {\\text{F}}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}
	}

	if (rank == 2 ) {
		if (affine_Dynkin) {
			let button1 = document.createElement("button");
			let buttonId1 = "G21";
			button1.setAttribute("id", buttonId1);
			button1.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button1.innerHTML = "\\( \\tilde{\\text{G}}_{" + 21 + "}\\)";
			CartanButtons.appendChild(button1);

			let button2 = document.createElement("button");
			let buttonId2 = "G22";
			button2.setAttribute("id", buttonId2);
			button2.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
			button2.innerHTML = "\\( \\tilde{\\text{G}}_{" + 22 + "}\\)";
			CartanButtons.appendChild(button2);
		}
		else {
		let button = document.createElement("button");
		let buttonId = "G";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcutAcyclic(this.id, parseInt(document.getElementById('userInputRankAcyclic').value), 'UserCartanDisplayAcyclic')");
		button.innerHTML = "\\( {\\text{G}}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
		}
		

	}
	MathJax.typeset([CartanButtons]);
}

// Function to create a mutation matrix of type X (possibly affine) and size n
function createDynkinExchangeMatrix(type, rank) {
	let n = rank;
	let DynkinExchangeMatrix = Array.from(Array(n), () => new Array(n));
	let affine_rank = n-1;
	for (let i = 1; i <= n; i++) {
		if (type == "A"+i+","+(affine_rank+1-i)) {
			for (let j = 0; j < n; j++) {
				for (let k = 0; k < n; k++) {
					let sgn = 1;
					sgn = (j<=i-1 && k<=i-1 ? -1 : 1);
					if (j==k) {
						DynkinExchangeMatrix[j][k] = 0;
					}
					else if (j == k+1){
						DynkinExchangeMatrix[j][k] = sgn*1;
					} 
					else if (j == k-1) {
						DynkinExchangeMatrix[j][k] = -1*sgn;
					}
					else {
						DynkinExchangeMatrix[j][k] = 0;
					}
				}
			}
		DynkinExchangeMatrix[n-1][0] += 1;
		DynkinExchangeMatrix[0][n-1] += -1;
		}
	}
	if (type == "A") {
		for (let i = 0; i < n; i++) {
			for (let j =0; j < n; j++) {
				if (i==j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1){
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if (i == j-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
	}

	
	else if (type == "C") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1){
					DynkinExchangeMatrix[i][j] = 1;
				}
				else if (i == j-1 && j != n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-2 && j == n-1) {
					DynkinExchangeMatrix[i][j] = -2;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		if (affine_Dynkin) {
			DynkinExchangeMatrix[1][0] = 2;
		}
	}

	else if (type == "BC") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1){
					DynkinExchangeMatrix[i][j] = 1;
				}
				else if (i == j-1 && j != n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-2 && j == n-1) {
					DynkinExchangeMatrix[i][j] = -2;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		DynkinExchangeMatrix[0][1] = -2;

		
	}
	else if (type == "B") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1 && i != n-1){
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if (i == j-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-1 && j == n-2) {
					DynkinExchangeMatrix[i][j] = 2;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		if (affine_Dynkin) {
			DynkinExchangeMatrix[0][1] = -2;
		}
	}
	else if (type == "D") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1 && i != n-1) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if  (i == j-1 && j != n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-3 && j == n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-1 && j == n-3) {
					DynkinExchangeMatrix[i][j] = 1;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		if (affine_Dynkin) {
			DynkinExchangeMatrix[0][1] = DynkinExchangeMatrix[1][0] = 0;
			DynkinExchangeMatrix[0][2] = -1;
			DynkinExchangeMatrix[2][0] = 1;
		}
	}

	else if (type == "BD") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1 && i != n-1) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if  (i == j-1 && j != n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-3 && j == n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-1 && j == n-3) {
					DynkinExchangeMatrix[i][j] = 1;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		DynkinExchangeMatrix[0][1] = -2;
	}

	else if (type == "CD") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1 && i != n-1) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if  (i == j-1 && j != n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-3 && j == n-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-1 && j == n-3) {
					DynkinExchangeMatrix[i][j] = 1;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		DynkinExchangeMatrix[1][0] = 2;
	}

	else if (type == "E") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1 && i != 1 && i != 2) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if (i == j-1 && j != 1 && j != 2) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == 2 && j == 0) {
					DynkinExchangeMatrix[i][j] = 1;
				}
				else if (i == 3 && j == 1) {
					DynkinExchangeMatrix[i][j] = 1;
				}
				else if (i == 0 && j == 2) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == 1 && j == 3) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
		if (affine_Dynkin) {
			if (n == 7 || n == 8) {
				DynkinExchangeMatrix[n-1][n-2] = DynkinExchangeMatrix[n-2][n-1] = 0;
			}
			if (n == 7) {
				DynkinExchangeMatrix[n-1][1] = -1;
				DynkinExchangeMatrix[1][n-1] = 1;
			}
			if (n == 8) {
				DynkinExchangeMatrix[n-1][0] = -1;
				DynkinExchangeMatrix[0][n-1] = 1;
			}
		}
	}
	else if (type == "G") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				DynkinExchangeMatrix[i][j] = 0;
			}
		}
		DynkinExchangeMatrix[0][1] = -3;
		DynkinExchangeMatrix[1][0] = 1;
	}
	else if (type == "G21") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				DynkinExchangeMatrix[i][j] = 0;
			}
		}
		DynkinExchangeMatrix[0][1] = -1;
		DynkinExchangeMatrix[1][0] = 1;
		DynkinExchangeMatrix[1][2] = -3;
		DynkinExchangeMatrix[2][1] = 1;
	}
	else if (type == "G22") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				DynkinExchangeMatrix[i][j] = 0;
			}
		}
		DynkinExchangeMatrix[0][1] = -1;
		DynkinExchangeMatrix[1][0] = 1;
		DynkinExchangeMatrix[1][2] = -1;
		DynkinExchangeMatrix[2][1] = 3;
	}
	else if (type == "F") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if (i == j-1 && j != n-2) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-3 && j == n-2) {
					DynkinExchangeMatrix[i][j] = -2;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
	}
	else if (type == "F41") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == j+1) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if (i == j-1 && j != n-2) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				else if (i == n-3 && j == n-2) {
					DynkinExchangeMatrix[i][j] = -2;
				}
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
	}
	else if (type == "F42") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					DynkinExchangeMatrix[i][j] = 0;
				}
				else if (i == n-2 && j == n-3) {
					DynkinExchangeMatrix[i][j] = 2;
				}
				else if (i == j+1) {
					DynkinExchangeMatrix[i][j] = 1;
				} 
				else if (i == j-1) {
					DynkinExchangeMatrix[i][j] = -1;
				}
				
				else {
					DynkinExchangeMatrix[i][j] = 0;
				}
			}
		}
	}
	// Affine cluster algebras of rank 2
	else if (type == "TwistedA1") {
		DynkinExchangeMatrix = [[0, -4], [1, 0]];
	}
	else if (type == "UntwistedA1") {
		DynkinExchangeMatrix = [[0, -2], [2, 0]];
	}
	return DynkinExchangeMatrix;
}

// Function to create a Cartan matrix of type X and size n
function createCartan(type, rank) {
	// affine case not implemented
	let n = rank;
	let Cartan = Array.from(Array(n), () => new Array(n));
	if (type == "A") {
		for (let i = 0; i < n; i++) {
			for (let j =0; j < n; j++) {
				if (i==j) {
					Cartan[i][j] = 2;
				}
				else if (i == j+1 || i == j-1) {
					Cartan[i][j] = -1;
				}
				else {
					Cartan[i][j] = 0;
				}
			}
		}
	}
	else if (type == "C") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i][j] = 2;
				}
				else if ((i == j+1) || (i == j-1 && j != n-1)) {
					Cartan[i][j] = -1;
				}
				else if (i == n-2 && j == n-1) {
					Cartan[i][j] = -2;
				}
				else {
					Cartan[i][j] = 0;
				}
			}
		}
	}
	else if (type == "B") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i][j] = 2;
				}
				else if ((i == j+1 && i != n-1) || (i == j-1)) {
					Cartan[i][j] = -1;
				}
				else if (i == n-1 && j == n-2) {
					Cartan[i][j] = -2;
				}
				else {
					Cartan[i][j] = 0;
				}
			}
		}
	}
	else if (type == "D") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i][j] = 2;
				}
				else if ((i == j+1 && i != n-1) || (i == j-1 && j != n-1)
				|| (i == n-3 && j == n-1) || (i == n-1 && j == n-3)){
					Cartan[i][j] = -1;
				}
				else {
					Cartan[i][j] = 0;
				}
			}
		}
	}
	else if (type == "E") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i][j] = 2;
				}
				else if ((i == j+1 && i != 1 && i != 2) || (i == j-1 && j != 1 && j != 2)
				|| (i == 2 && j == 0) || (i == 3 && j == 1)
				|| (i == 0 && j == 2) || (i == 1 && j == 3)){
					Cartan[i][j] = -1;
				}
				else {
					Cartan[i][j] = 0;
				}
			}
		}
	}
	else if (type == "G") {
		Cartan = [[2, -3], [-1, 2]];
	}
	else if (type == "F") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i][j] = 2;
				}
				else if ((i == j+1) || (i == j-1 && j != n-2)) {
					Cartan[i][j] = -1;
				}
				else if (i == n-3 && j == n-2) {
					Cartan[i][j] = -2;
				}
				else {
					Cartan[i][j] = 0;
				}
			}
		}
	}
	return Cartan;
}

function CartanToInitial() {

	// Recover the rank inputted by the user
	let rank = parseInt(document.getElementById("userInputRankAcyclic").value);

	// Reveal the dashboard 4.
	document.getElementById("outDashboard1").setAttribute("class","dashboard");
	document.getElementById("outDashboard2").setAttribute("class","dashboard");

	InitialMat = DynkinExchangeMatrix;
	PrinInitialMat = DynkinExchangeMatrix;

	// Display Cartan matrix chosen by user
	renderMatrix(InitialMat, "initialMatrix", "clear");
	renderMatrix(InitialMat, "initialPrincipalPart", "clear");
	quiver(InitialMat);
	mutButtons();
	document.getElementById("mutationHistoryButton").style.display = "block";
	// Create MathJax rendition of initial mutation matrix in the <div id="mutationHistory">
	// Note the code in <div id="mutationHistory"> is not typeset until 
	// the user presses the button "show mutation history"
	renderMatrix(InitialMat,'mutationHistory', "clear");

	MathJax.typeset();
}

function trackClusterVars() {
	document.getElementById("stopTrackingClusterVarsButton").style.display = "inline";
	document.getElementById("clusterVarsOutputPanel").style.display = "block";
	const rows = InitialMat.length;
	const cols = InitialMat[0].length;
	clusterVars = [];
	clusterVarsHistory = [];
	const spec = document.getElementById("specialisation");
	spec.replaceChildren();
	LaurentPolynomial.nvars = rows;
	for (let i = 0; i < rows; i++) {
		const x = LaurentPolynomial.x(i);
		clusterVars.push(x);
		const ispec = document.createElement('div');
		const spec_name = 'spec' + i;
		ispec.appendChild(document.createTextNode('Specialise \\(x_{'+(i+1)+'}\\): '));
		const spec_no_label = document.createElement('label');
		const spec_no = document.createElement('input');
		spec_no.setAttribute('type', 'radio');
		spec_no.setAttribute('name', spec_name);
		spec_no.setAttribute('id', spec_name + 'no');
		spec_no.checked = true;
		spec_no_label.appendChild(spec_no);
		spec_no_label.appendChild(document.createTextNode(' no '));
		ispec.appendChild(spec_no_label);
		const spec_one_label = document.createElement('label');
		const spec_one = document.createElement('input');
		spec_one.setAttribute('type', 'radio');
		spec_one.setAttribute('name', spec_name);
		spec_one.setAttribute('id', spec_name + '+1');
		spec_one_label.appendChild(spec_one);
		spec_one_label.appendChild(document.createTextNode(' to 1 '));
		ispec.appendChild(spec_one_label);
		const spec_mone_label = document.createElement('label');
		const spec_mone = document.createElement('input');
		spec_mone.setAttribute('type', 'radio');
		spec_mone.setAttribute('name', spec_name);
		spec_mone.setAttribute('id', spec_name + '-1');
		spec_mone_label.appendChild(spec_mone);
		spec_mone_label.appendChild(document.createTextNode(' to −1 '));
		ispec.appendChild(spec_mone_label);
		spec.appendChild(ispec);
	}
	displayClusterVarsHistory();
}

function initTrackingClusterVars() {
	document.getElementById('stopTrackingClusterVarsButton').style.display = 'none';
	document.getElementById('clusterVarsOutputPanel').style.display = 'none';
	clusterVars = null;
	if (InitialMat.every(row => row.every(x => Number.isInteger(Number(x))))) {
		document.getElementById('trackClusterVarsButton').style.display = 'inline';
	} else {
		document.getElementById('trackClusterVarsButton').style.display = 'none';
	}
}

function displayClusterVarsHistory() {
	const out = document.getElementById('clusterVarsOutput');
	out.replaceChildren();
	const vars = specialisedClusterVars();
	for (let i = 0; i < InitialMat.length; i++) {
		out.appendChild(divClusterVar(i+1, LaurentPolynomial.x(i), vars));
	}
	out.appendChild(document.createElement('br'));
	for (const dcv of clusterVarsHistory) {
		const [direction, cv] = dcv;
		out.appendChild(divClusterVar(direction, cv, vars));
		out.appendChild(document.createElement('br'));
	}
	MathJax.typeset(['#clusterVarsOutputPanel']);
}

function divClusterVar(d, x, vars) {
	const div = document.createElement('div');
	div.appendChild(document.createTextNode('' + d + ': \\(' + x.evaluate_partially(vars).latex() + '\\)'));
	return div;
}

function specialisedClusterVars() {
	const vars = new Map();
	for (let i = 0; i < InitialMat.length; i++) {
		const spec_name = 'spec' + i;
		if (document.getElementById(spec_name + '+1').checked) {
			vars.set(i, 1);
		} else if (document.getElementById(spec_name + '-1').checked) {
			vars.set(i, -1);
		}
	}
	return vars;
}

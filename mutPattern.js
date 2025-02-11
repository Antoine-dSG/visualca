// Global functions recording the values of the latest mutation matrix
var cellsInitialMat;
var rownumInitialMat;
var colnumInitialMat;
var aTropMinInitial;
var yTropMinInitial;
var aTropMaxInitial;
var yTropMaxInitial;


function closePopup() {
	var popup = document.getElementById("mutation-matrix");
		popup.style.display = "none";
}

function createGrid() {
// Reveal popup grid for matrix size selection
document.getElementById("mutation-matrix").style.display = "block";
// Reveal "Submit initial data" button
	document.getElementById("createMutMatButton").style.display = "inline";

}


function hoverSelect(n) {
	var rownum = Math.floor(n/8);
	var colnum = n%8;
	document.getElementById("tableHead").innerHTML = "Matrix of size " + (rownum+1) + "x" + (colnum+1);
	for (let i=0; i<=rownum; i++) {
		for (let j=0; j <= colnum; j++) {
			var m = i*8+j;
			cell = document.getElementById(m);
			cell.className = "cell-on";
			
		}
	}
}

function hoverOff(n) {
	var rownum = Math.floor(n/8);
	var colnum = n%8;
	for (let i=0; i<8; i++) {
		for (let j=0; j <8; j++) {
			var m = i*8+j;
			cell = document.getElementById(m);
			if (i< rownum && j>= colnum) {
				cell.className = "cell";
			}
			else if (i >= rownum){
				cell.className = "cell";
			}	
		}
	}
}


function generateTable(n, m, tagId) {
	closePopup();
	var tableContainer = document.getElementById(tagId);
	tableContainer.innerHTML = "";
  // Create the table element
	var table = document.createElement("table");

  // Create rows and cells
  	for (var i = 0; i < n; i++) {
    	var row = table.insertRow();
	    for (var j = 0; j < m; j++) {
	      var cell = row.insertCell();
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

	document.getElementById("inputField").setAttribute("class", "dashboard");
	document.getElementById("mutMatHeader").style.visibility = "visible";

	rownumInitialMat = rownum;
	colnumInitialMat = colnum;

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


function arrayToMatrix(array,rownum,tagById,renderType) {
// renderType determines whether the tagById div needs to be clear before constructing 
// the new matrix
if (renderType == "clear") {
	// Clear the current div
document.getElementById(tagById).innerHTML = "";
}
else if (renderType == "concat") {

}

let colnum = (array.length) / (rownum);
document.getElementById(tagById).innerHTML += "\\( \\begin{pmatrix}";
for (var i = 0;i < rownum; i++) {
	for (var j = 0; j < colnum; j++) {
		document.getElementById(tagById).innerHTML += array[i*colnum + j];
		if (j != colnum-1) {
			document.getElementById(tagById).innerHTML += "&";
		}
	}
	if (i != rownum-1) {
		document.getElementById(tagById).innerHTML += '\\\\';
	}
}
document.getElementById(tagById).innerHTML += "\\end{pmatrix}\\)";
}




function createMutationMatrix() {
	// Clear any previous mutation matrix / mutation buttons
	document.getElementById("initialMatrix").innerHTML = "";
	document.getElementById("initialATropMin").innerHTML = "";
	document.getElementById("initialYTropMin").innerHTML = "";
	document.getElementById("initialATropMax").innerHTML = "";
	document.getElementById("initialYTropMax").innerHTML = "";
	document.getElementById("mutationButtons").innerHTML = "";

	document.getElementById("initialDataLatex").setAttribute("class", "dashboard");
	document.getElementById("mutationDashboard").setAttribute("class", "dashboard");

	document.getElementById('iniMutMatHeader').style.visibility = "visible";

	// Function to convert the user input of initial mutation matrix into an array
	function callme(cc) {
	  let result = Array.prototype.map.call(cc, function(e) {
	    return e.value;
	  });
	  return result;
	}

	// Retrieve the content of each <input> in tableContainer, i.e. the 
	// content of each cell of the mutation matrix
	let cells = document.querySelectorAll('#tableContainer input');
	let cellsArray = callme(cells);
	cellsInitialMat = cellsArray;

	// Retrieve all the rows in tableContainer.
	let rows = document.querySelectorAll('#tableContainer tr');
	rownumInitialMat = rows.length;
	colnumInitialMat = cellsInitialMat.length / rownumInitialMat;

	// Test whether the mutation matrix is sign-skew-symmetric
	document.getElementById('sssStateCurrent').innerHTML = sssTest(cellsInitialMat);

	// Test whether the mutation matrix is skew-symmetrisable
	document.getElementById('ssStateCurrent').innerHTML = ssTest(cellsInitialMat);

	// Create MathJax rendition of initial mutation matrix in the <div id="initialMatrix">
	arrayToMatrix(cellsArray,rows.length,'initialMatrix', "clear");
	// Ask MathJax to render the newly created code in LaTeX
	MathJax.typeset([initialMatrix]);

	// Reveal the "Show mutation history" button
	document.getElementById("mutationHistoryButton").style.display = "block";
	// Create MathJax rendition of initial mutation matrix in the <div id="mutationHistory">
	// Note the code in <div id="mutationHistory"> is not typeset until 
	// the user presses the button "show mutation history"
	arrayToMatrix(cellsArray,rows.length,'mutationHistory', "clear");

	// Adjust the display of the grid's tropical points columns
	if (document.getElementById("AtropMinCheckBox").checked == true) {
		document.getElementById("iniAtropMinHeader").style.visibility = "visible";
		let aCells = document.querySelectorAll('#AtropMinContainer input');
		let aCellsArray = callme(aCells);
		aTropMinInitial = aCellsArray;
		arrayToMatrix(aTropMinInitial,1,'initialATropMin',"clear");
		MathJax.typeset([initialATropMin]);
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
		arrayToMatrix(yTropMinInitial,1,'initialYTropMin',"clear");
		MathJax.typeset([initialYTropMin]);
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
		arrayToMatrix(aTropMaxInitial,1,'initialATropMax',"clear");
		MathJax.typeset([initialATropMax]);
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
		arrayToMatrix(yTropMaxInitial,1,'initialYTropMax',"clear");
		MathJax.typeset([initialYTropMax]);
	}
	else {
	//	document.getElementById("YtropMinContainer").innerHTML = "";
		document.getElementById("iniYtropMaxHeader").style.visibility = "hidden";
	}


	mutationButtons = document.getElementById("mutationButtons");
	// Create a mutation button for each column (if number of
	// columns <= number of rows) or each row (if number of rows <= number of columns)
	let n = min(rows.length, (cellsArray.length)/(rows.length));
	for (let i = 1; i <= n; i++) {
		let button = document.createElement("button");
		let mutationButtonNum = i + "mutButton";
		button.setAttribute("id", mutationButtonNum);
		button.setAttribute("onclick", "mutateData(this.id)");
		button.innerHTML = "\\( \\mu_" + i + "\\)";
		mutationButtons.appendChild(button);
	}
	MathJax.typeset([mutationButtons]);


}

function mutateData(id) {
	// Hide the mutation history div
	document.getElementById("mutationHistory").style.display = "none";
	document.getElementById("mutationHistoryButton").innerHTML = "Show mutation history";

	// Retrieve the mutation direction from the id of the mutation button
	// Direction is an integer from 1 to colnumInitialMat
	let direction = id.substring(0,1);

	// Mutate tropical points if any exists
	if (document.getElementById("AtropMinCheckBox").checked == true) {
		aTropMinInitial = mutateATrop(aTropMinInitial,cellsInitialMat,rownumInitialMat,colnumInitialMat,direction,'min');
		arrayToMatrix(aTropMinInitial,1,'initialATropMin',"clear");
		MathJax.typeset([initialATropMin]);
	}
	if (document.getElementById("YtropMinCheckBox").checked == true) {
		yTropMinInitial = mutateYTrop(yTropMinInitial,cellsInitialMat,rownumInitialMat,colnumInitialMat,direction,'min');
		arrayToMatrix(yTropMinInitial,1,'initialYTropMin',"clear");
		MathJax.typeset([initialYTropMin]);
	}
	if (document.getElementById("AtropMaxCheckBox").checked == true) {
		aTropMaxInitial = mutateATrop(aTropMaxInitial,cellsInitialMat,rownumInitialMat,colnumInitialMat,direction,'max');
		arrayToMatrix(aTropMaxInitial,1,'initialATropMax',"clear");
		MathJax.typeset([initialATropMax]);
	}
	if (document.getElementById("YtropMaxCheckBox").checked == true) {
		yTropMaxInitial = mutateYTrop(yTropMaxInitial,cellsInitialMat,rownumInitialMat,colnumInitialMat,direction,'max');
		arrayToMatrix(yTropMaxInitial,1,'initialYTropMax',"clear");
		MathJax.typeset([initialYTropMax]);
	}
	// Create new matrix by mutating the latest
	cellsInitialMat = mutation(cellsInitialMat,rownumInitialMat,colnumInitialMat,direction);
	// Test whether the mutation matrix is sign-skew-symmetric
	document.getElementById('sssStateCurrent').innerHTML = sssTest(cellsInitialMat);

	// Test whether the mutation matrix is skew-symmetrisable
	document.getElementById('ssStateCurrent').innerHTML = ssTest(cellsInitialMat);

	// Convert the latest mutation matrix to MathJax
	arrayToMatrix(cellsInitialMat,rownumInitialMat,'initialMatrix', "clear");
	// Render the MathJax
	MathJax.typeset([initialMatrix]);

	// Add the mutation direction to mutation history div
	document.getElementById("mutationHistory").innerHTML += "\\( \\xrightarrow{ \\mu_" + direction + "} \\) ";
	// Add latest mutation matrix to <div id="mutationHistory">
	arrayToMatrix(cellsInitialMat,rownumInitialMat,'mutationHistory', "concat");
	// Ask MathJax to render the newly created code in LaTeX
	// MathJax.typeset([mutationHistory]);
}


function sgnPart(a,sgn) {
	if (sgn == "max") {
		if (a >0) {
		return a;
		}
		else {
			return 0;
		}
	}
	else if (sgn == "min") {
		if (a < 0) {
			return a;
		}
		else {
			return 0;
		}
	}	
}

function min(a,b) {
	if (a <= b) {
		return a;
	}
	else {
		return b;
	}
}

function mutation(matrix,rows,cols,direction) {
	// Declare a new matrix (the RHS guarantees the copy is a deep copy)
	let newMatrix = JSON.parse(JSON.stringify(matrix));
	// Matrix mutation formulas:
	for (i = 0; i < rows; i++) {
		for (j = 0; j < cols; j++) {
			if (i == (direction-1) || j == (direction-1)) {
				newMatrix[i*cols + j] = (-1)*matrix[i*cols + j];
			}
			else {
				newMatrix[i*cols + j] = parseFloat(matrix[i*cols + j]) + parseFloat(sgnPart(matrix[i*cols + (direction -1)],'max'))*parseFloat(sgnPart(matrix[(direction-1)*cols + j],'max')) - parseFloat(sgnPart(-matrix[i*cols + (direction -1)],'max'))*parseFloat(sgnPart(-matrix[(direction-1)*cols + j],'max'));

			}
		}
	}
	return newMatrix;
}

function toggleDiv(button, element, name) {
	if (element.style.display == "none") {
		element.style.display = "block";
		document.getElementById(button).innerHTML = "Hide "+ name;
		MathJax.typeset([mutationHistory]);
	}
	else {
		element.style.display = "none";
		document.getElementById(button).innerHTML = "Show "+ name;
	}

}
	
function mutateATrop (trop,matrix,rownum,colnum,direction,sgn) {
	let newTrop = [];
	for (let i =0; i < rownum; i++) {
		if (i == direction-1) {
			let Tpos = 0;
			let Tneg = 0;
			for (let j=0; j < rownum; j++) {
				Tpos += parseFloat(sgnPart(matrix[j*colnum + (direction-1)],'max'))*trop[j];
				Tneg += parseFloat(sgnPart(-matrix[j*colnum + (direction-1)],'max'))*trop[j];
			}
			if (sgn == 'max') {
				newTrop[i] = -trop[i] + Math.max(Tpos,Tneg);
			}
			else if (sgn == 'min') {
				newTrop[i] = -trop[i] + Math.min(Tpos,Tneg);
			}
			
		}
		else {
			newTrop[i] = trop[i];
		}
	}
	return newTrop;
}	

function mutateYTrop (trop,matrix,rownum, colnum,direction,sgn) {
	let newTrop = [];
	for (let i =0; i < colnum; i++) {
	if (i != direction-1) {
		let rhs = 0;
		rhs += parseFloat(trop[i]);
		rhs += parseFloat(sgnPart(matrix[colnum*(direction-1)+i],'max'))*parseFloat(trop[(direction-1)]);
		rhs += (-1)*parseFloat(matrix[colnum*(direction-1)+i])*parseFloat(sgnPart(trop[(direction-1)],sgn));
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
	var p;
	p = min(colnumInitialMat, rownumInitialMat);
	for (var i = 0; i < p; i++) {
		// Check whether the diagonal entry is zero
		if (matrix[i*p + i] != 0) {
			return 'No';
		}
		for (var j = i+1; j < p; j++) {
			// The first two ifs are to check that bij = 0 if and only if bji = 0
			// Note the simple formula for bij and bji
			if (matrix[i*p+j] == 0 && matrix[j*p + i] != 0) {
				return 'No';
			}
			else if (matrix[i*p+j] != 0 && matrix[j*p + i] == 0) {
				return 'No';
			}
			// This check is for the sign of non-zero entries bij and bji
			else if (matrix[i*p+j]*matrix[j*p + i]>0) {
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
	var p; 
	p = min(colnumInitialMat, rownumInitialMat);
	var	diag = Array(p*p).fill(0);
	var index = Array.from(Array(p).keys());
	while (index.length > 0) {
		var i = index[0];
		// Remove the first entry of index
		index = index.slice(1);
		if (diag[i*p+i] == 0) {
			diag[i*p+i] = 1;
		}
		var cycle = JSON.parse(JSON.stringify(index));
		for (var j of index) {
			if (matrix[i*p+j] == 0) {
				
			}
			else {
				var pos = cycle.indexOf(j);
				cycle.splice(pos, 1);
				cycle.unshift(j);
				if (diag[j*p+j] != 0) {
					if (diag[j*p+j]*matrix[j*p+i] + diag[i*p+i]*matrix[i*p+j] != 0) {
						return 'No';
					}

				}
				else {
					diag[j*p+j] = (-1)*diag[i*p+i]*matrix[i*p+j]/matrix[j*p+i];
				}
			}
		}
		index = cycle;
	}
	return 'Yes';
}




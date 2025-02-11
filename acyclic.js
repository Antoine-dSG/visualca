// Global variables
var Cartan;

// Load a colour package when the user arrives onto the main page
window.MathJax = {
  loader: {load: ['[tex]/color']},
  tex: {packages: {'[+]': ['color']}}
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Functions in the flow of the website //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

function rankToCartan() {
	var rank = 0;
	// Recover the rank inputted by the user
	rank = document.getElementById("userInputRank").value;

	// Reveal the dashboards 2. and 3.
	document.getElementById("CartanDashboard").setAttribute("class","dashboard");

	// Clear the computations on dashboards 4. and 5.
	document.getElementById("initialCartanContainer").innerHTML = "";
	document.getElementById("initialContainer").innerHTML = "";

	document.getElementById("functionTable").innerHTML = "";
	document.getElementById("globalMonomial").innerHTML = "";

	// Hide dashboards 4. and 5. (in case the user has made a calculation previously)
	document.getElementById("InitialDashboard").setAttribute("class","dashboardOff");
	document.getElementById("outcomeDashboard").setAttribute("class","dashboardOff");

	// Create "shortcut" buttons for Cartan matrices in div with id="CartanButtons"
	// First clear the space from any previous buttons
	document.getElementById("CartanButtons").innerHTML = "";

	CartanButtons = document.getElementById("CartanButtons");
	// Create an An button
	let button = document.createElement("button");
	let buttonId = "A";
	button.setAttribute("id", buttonId);
	button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
	button.innerHTML = "\\( \\text{A}_{" + rank + "}\\)";
	CartanButtons.appendChild(button);


	// Create a Bn button if rank >= 2
	if (rank >= 2) {
		let button = document.createElement("button");
		let buttonId = "B";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{B}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}
	// Create a Cn button if rank >= 3
	if (rank >= 3) {
		let button = document.createElement("button");
		let buttonId = "C";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{C}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}

	// Create a Dn button if rank >= 4
	if (rank >= 4) {
		let button = document.createElement("button");
		let buttonId = "D";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{D}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}

	// Add exceptional types in suitable ranks
	if (rank == 6 || rank == 7 || rank == 8) {
		let button = document.createElement("button");
		let buttonId = "E";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{E}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}

	if (rank == 4 ) {
		let button = document.createElement("button");
		let buttonId = "F";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{F}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);
	}

	if (rank == 2 ) {
		let button = document.createElement("button");
		let buttonId = "G";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{G}_{" + rank + "}\\)";
		CartanButtons.appendChild(button);

	}
	MathJax.typeset([CartanButtons]);
}

function customCartan() {
	let rank = document.getElementById("userInputRank").value;
	generateCartanTable(rank, rank, "customCartanContainer").setAttribute("id", "customCartanGrid");
	document.getElementById("customCartanSubmitButt").style.display = "inline-block";
}

function customCartanSubmit() {
	let rank = document.getElementById("userInputRank").value;
	let matrix = document.querySelectorAll('#customCartanContainer input');
	Cartan = callme(matrix);
	arrayToMatrix(Cartan, rank, "UserCartanDisplay", "clear");
	MathJax.typeset();

	document.getElementById("customCartanContainer").innerHTML = "";
	document.getElementById("customCartanSubmitButt").style.display = "none";
}

function CartanToInitial() {

	// Recover the rank inputted by the user
	let rank = document.getElementById("userInputRank").value;

	// Reveal the dashboard 4.
	document.getElementById("InitialDashboard").setAttribute("class","dashboard");

	// Clear the computations on dashboards 4. and 5.
	document.getElementById("initialCartanContainer").innerHTML = "";
	document.getElementById("initialContainer").innerHTML = "";

	document.getElementById("functionTable").innerHTML = "";
	document.getElementById("globalMonomial").innerHTML = "";

	// Display Cartan matrix chosen by user
	arrayToMatrix(Cartan, rank, "initialCartanContainer", "clear");
	MathJax.typeset([initialCartanContainer]);

	// Clear the Cartan preview in dashboard 2.
	document.getElementById("UserCartanDisplay").innerHTML = "";

	// Code to be read if the user has selected to compute frieze patterns
	if (document.getElementById("friezePatCheckBox").checked == true) {
		generateTable(rank,1,"initialContainer").setAttribute("id", "friezeSlice");
		document.getElementById("initialHead").innerHTML = "Slice of frieze pattern";
	}

	// Code to be read if the user has selected to compute Y-frieze patterns
	else if (document.getElementById("YfriezePatCheckBox").checked == true) {
		generateTable(rank,1,"initialContainer").setAttribute("id", "YfriezeSlice");
		document.getElementById("initialHead").innerHTML = "Slice of Y-frieze pattern";
	}
	// Code to be read if the user has selected to compute tropical friezes
	else if (document.getElementById("tropFriezeCheckBox").checked == true) {
		generateTable(rank,1,"initialContainer").setAttribute("id", "tropFriezeSlice");
		document.getElementById("initialHead").innerHTML = "Slice of tropical frieze";
	}
	// Code to be read if the user has selected to compute cluster-additive functions
	else if (document.getElementById("clusterAddFctCheckBox").checked == true) {
		generateTable(rank,1,"initialContainer").setAttribute("id", "clusterAddFctSlice");
		document.getElementById("initialHead").innerHTML = "Slice of cluster-additive function";
	}
	// Code to be read if the user has selected to compute cluster monomials
	else if (document.getElementById("clusterMonoCheckBox").checked == true) {
		generateTable(1,rank,"initialContainer").setAttribute("id", "gvecClMonoSlice");
		document.getElementById("initialHead").innerHTML = "Intitial g-vector";
	}
	// Code to be read if the user has selected to compute global monomials
	else if (document.getElementById("YclusterMonoCheckBox").checked == true) {
		generateTable(1,rank,"initialContainer").setAttribute("id", "gvecGlMonoSlice");
		document.getElementById("initialHead").innerHTML = "Intitial g-vector";
	}
}

function initialDataToOutcome() {
	// Reveal the dashboard 5.
	document.getElementById("outcomeDashboard").setAttribute("class","dashboard");

	// Recover the rank inputted by the user
	let rank = document.getElementById("userInputRank").value;
	let n = parseInt(rank);
	// Recover the chosen Cartan matrix (converted from a list to a matrix)
	// Note that Cartan is a global variable: THIS MIGHT CAUSE PROBLEMS?
	A = listToMathMat(Cartan,rank);

	// Determine the "size" of the fundamental domain for the (tropical) functions
	let h = [];
	[omega, c] = rootSystemSetup(A,rank);
	// Need to check whether matrix is finite type before computing the hiA's.
	if (math.det(A) >0) {
		for (let i = 0; i<n; i++) {
			h[i] = hiA(A,i, omega[i], c,n);
		}
	}
	// Here we put an arbitrary bound on the number of columns computed
	else {
		for (let i = 0; i<n; i++) {
			h[i] = 8;
		}
	}

	// Code to be read if the user has selected to compute frieze patterns
	if (document.getElementById("friezePatCheckBox").checked == true) {
		let sliceInput = document.querySelectorAll('#initialContainer input');
		let slice = callme(sliceInput);

		// Compute cluster-additive function from slice
		let F = [];
		if (math.min(slice) >0 ) {
			F = frieze_pattern(slice,A, h, slice.length);
			mathMatToTableLatex(F,n,h,"functionTable","clear");
			MathJax.typeset([functionTable]);
		}
		else {
			document.getElementById("functionTable").innerHTML = "";
		}
		
	}

	// Code to be read if the user has selected to compute Y-frieze patterns
	if (document.getElementById("YfriezePatCheckBox").checked == true) {
		let sliceInput = document.querySelectorAll('#initialContainer input');
		let slice = callme(sliceInput);

		// Compute cluster-additive function from slice
		let K = [];
		if (math.min(slice) >0 ) {
			K = Yfrieze_pattern(slice,A, h, slice.length);
			mathMatToTableLatex(K,n,h,"functionTable","clear");
			MathJax.typeset([functionTable]);
		}
		else {
			document.getElementById("functionTable").innerHTML = "";
		}
		
	}

	// Code to be read if the user has selected to compute tropical friezes (via slice)
	if (document.getElementById("tropFriezeCheckBox").checked == true) {
		let sliceInput = document.querySelectorAll('#initialContainer input');
		let slice = callme(sliceInput);

		// Compute cluster-additive function from slice
		let F = [];
		F = trop_frieze(slice,A, h, slice.length);
		// Print the array into the website
		mathMatToTableLatex(F,n,h,"functionTable","clear");
		MathJax.typeset([functionTable]);
	}

	// Code to be read if the user has selected to compute cluster-additive functions (via slice)
	if (document.getElementById("clusterAddFctCheckBox").checked == true) {
		let sliceInput = document.querySelectorAll('#initialContainer input');
		let slice = callme(sliceInput);

		// Compute cluster-additive function from slice
		let K = [];
		K = cluster_additive(slice,A, h, slice.length);
		// Print the array into the website
		mathMatToTableLatex(K,n,h,"functionTable","clear");
		MathJax.typeset([functionTable]);
	}

	// Code to be read if the user has selected to compute cluster-additive functions (via g-vector)
	if (document.getElementById("clusterMonoCheckBox").checked == true) {
		// Retrieve the content of each <input> in g-vector
		let gvecInput = document.querySelectorAll('#initialContainer input');
		let gvec = callme(gvecInput);

		// Convert g-vector to slice
		let slice = [];
		for (let i = 0; i < n; i++) {
			slice[i] = gvec[i];
			for (let j = 0; j < i; j++) {
				slice[i] = math.subtract(slice[i], math.multiply(A.subset(math.index(j,i)),sgnPart(slice[j],"max")));
			}
		}

		// Compute cluster-additive function from slice
		let K = [];
		K = cluster_additive(slice,A, h, slice.length);
		// Print the array into the website
		mathMatToTableLatex(K,n,h,"functionTable","clear");
		MathJax.typeset([functionTable]);

		// Only display corresponding global monomial if A is of finite type
		if (math.det(A) >0) {
			functionToClusterMono(K,n,"globalMonomial", "clear");
			MathJax.typeset([globalMonomial]);
		}

	}

	// Code to be read if the user has selected to compute tropical friezes (via g-vector)
	if (document.getElementById("YclusterMonoCheckBox").checked == true) {
		// Retrieve the content of each <input> in g-vector
		let gvecInput = document.querySelectorAll('#initialContainer input');
		let slice = callme(gvecInput);

		let F = [];
		F = trop_frieze(slice,A, h, slice.length);
		// Print the array into the website
		mathMatToTableLatex(F,n,h,"functionTable","clear");
		MathJax.typeset([functionTable]);

	}
}



//////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Useful functions //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////


// Function to convert the user input of initial mutation matrix into an array
function callme(cc) {
  let result = Array.prototype.map.call(cc, function(e) {
    return e.value;
  });
  return result;
}

// Function to create a Cartan matrix of type X and rank n
function createCartan(type, rank) {
	let Cartan = [];
	let n = rank;
	if (type == "A") {
		for (let i = 0; i < n; i++) {
			for (let j =0; j < n; j++) {
				if (i==j) {
					Cartan[i*n+j] = 2;
				}
				else if (i == j+1 || i == j-1) {
					Cartan[i*n+j] = -1;
				}
				else {
					Cartan[i*n+j] = 0;
				}
			}
		}
	}
	else if (type == "B") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i*n+j] = 2;
				}
				else if ((i == j+1) || (i == j-1 && j != n-1)) {
					Cartan[i*n+j] = -1;
				}
				else if (i == n-2 && j == n-1) {
					Cartan[i*n+j] = -2;
				}
				else {
					Cartan[i*n+j] = 0;
				}
			}
		}
	}
	else if (type == "C") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i*n+j] = 2;
				}
				else if ((i == j+1 && i != n-1) || (i == j-1)) {
					Cartan[i*n+j] = -1;
				}
				else if (i == n-1 && j == n-2) {
					Cartan[i*n+j] = -2;
				}
				else {
					Cartan[i*n+j] = 0;
				}
			}
		}
	}
	else if (type == "D") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i*n+j] = 2;
				}
				else if ((i == j+1 && i != n-1) || (i == j-1 && j != n-1)
				|| (i == n-3 && j == n-1) || (i == n-1 && j == n-3)){
					Cartan[i*n+j] = -1;
				}
				else {
					Cartan[i*n+j] = 0;
				}
			}
		}
	}
	else if (type == "E") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i*n+j] = 2;
				}
				else if ((i == j+1 && i != 1 && i != 2) || (i == j-1 && j != 1 && j != 2)
				|| (i == 2 && j == 0) || (i == 3 && j == 1)
				|| (i == 0 && j == 2) || (i == 1 && j == 3)){
					Cartan[i*n+j] = -1;
				}
				else {
					Cartan[i*n+j] = 0;
				}
			}
		}
	}
	else if (type == "G") {
		Cartan[0] = 2;
		Cartan[1] = -1;
		Cartan[2] = -3;
		Cartan[3] = 2;
	}
	else if (type == "F") {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (i == j) {
					Cartan[i*n+j] = 2;
				}
				else if ((i == j+1) || (i == j-1 && j != n-2)) {
					Cartan[i*n+j] = -1;
				}
				else if (i == n-3 && j == n-2) {
					Cartan[i*n+j] = -2;
				}
				else {
					Cartan[i*n+j] = 0;
				}
			}
		}
	}
	return Cartan;
}

// function to convert a JS array to latex.
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

function mathMatToTableLatex(array,rownum, h,tagById,renderType) {
	// Determine the number of columns from the array h of hiA's
	let colnum = math.add(1,math.max(h));
	// renderType determines whether the tagById div needs to be cleared before constructing
	// the new matrix
	if (renderType == "clear") {
		// Clear the current div
	document.getElementById(tagById).innerHTML = "";
	}
	else if (renderType == "concat") {

	}
	document.getElementById(tagById).innerHTML += "\\( \\begin{matrix}";
	for (var i = 0;i < rownum; i++) {
		for (var m = 0; m <= colnum+1; m++) {
			// We add colour to the contours of the fundamental domain
			if (m == h[i]+1 || m == 0) {
				document.getElementById(tagById).innerHTML += "{\\color{red}" + array.subset(math.index(i,m)) + "}";
			}
			else {
				document.getElementById(tagById).innerHTML += array.subset(math.index(i,m));
			}
			
			if (m != colnum+1) {
				document.getElementById(tagById).innerHTML += "&";
			}
		}
		if (i != rownum-1) {
			document.getElementById(tagById).innerHTML += '\\\\';
		}
	}
	document.getElementById(tagById).innerHTML += "\\end{matrix}\\)";
}

// Function to compute the cluster monomial from a cluster-additive function
function functionToClusterMono(K, n, tagById, renderType) {
	if (renderType == "clear") {
		// Clear the current div
	document.getElementById(tagById).innerHTML = "\\(x_{\\rho}^{\\vee} = ";
	}
	// l is the number of points of the cluster-additive function that are displayed
	let l = math.size(K);
	l = math.multiply(l.subset(math.index(1)),l.subset(math.index(0)));
	let M = l/n;
	for (let m=0; m<M;m++) {
		for (let i = 0; i < n; i++) {
			if (K.subset(math.index(i,m)) < -1) {
				let I = i+1;
				document.getElementById(tagById).innerHTML += " x^{\\vee}(" + I + "," + m + ")^{" + math.multiply(-1,K.subset(math.index(i,m))) + "}";
			}
			else if (K.subset(math.index(i,m)) == -1) {
				let I = i+1;
				document.getElementById(tagById).innerHTML += " x^{\\vee}(" + I + "," + m + ")";
			}
		}
	}

	document.getElementById(tagById).innerHTML += "\\) ";

}

// function to create a table
// Each cell in the table is an input (of "text" type, not of "number" type !)
function generateTable(n, m, tagId) {
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

function generateCartanTable(n, m, tagId) {
	var tableContainer = document.getElementById(tagId);
	tableContainer.innerHTML = "";
  // Create the table element
	var table = document.createElement("table");

  // Create rows and cells
  	for (var i = 0; i < n; i++) {
    	var row = table.insertRow();
	    for (var j = 0; j < m; j++) {
	      var cell = row.insertCell();
	      if (i == j) {
	      	cell.innerHTML = '<input style="width:50px" type="number" maxlength="4" value="2" max="2" min="2" />';
	      }
	      else {
	      	cell.innerHTML = '<input style="width:50px" type="number" maxlength="4" value="0" max="0" />';
	      }
	      
	    }
  	}

  // Append the table to the table container
  	tableContainer.appendChild(table);
  	return table;
  	//table.setAttribute("id", "mutMatrix");
}

function displayCartanShortcut(type, rank,tagById) {
	Cartan = createCartan(type, rank);
	arrayToMatrix(Cartan, rank, tagById, "clear");
	MathJax.typeset();
}

// Function to convert a list to a matrix
function listToMathMat(list,rownum) {
	var colnum = list.length/rownum;
	var mathmat = [[]];
	for (let i = 0; i < rownum; i++) {
		mathmat[i] = [];
		for (let j = 0; j < colnum; j++) {
			mathmat[i].push(list[i*colnum + j]);
		}
	}
	return math.matrix(mathmat);
}

// function to construct root systems
function rootSystemSetup(A,rank) {
	// rank is a string; need to convert to a number
	let n = parseInt(rank);
	let omega = [];
	let alpha = [];
	let I = math.identity(n);
	let s = [];
	let c = math.identity(n);
	let h = [];
	A = math.multiply(A,I);
	for (let i = 0; i<n; i++) {
		let J = math.zeros(n,n);
		omega[i] = I.subset(math.index(math.range(0,n),i));
		alpha[i] = A.subset(math.index(math.range(0,n),i));
		J = J.subset(math.index(math.range(0,n),i),alpha[i]);
		s[i] = math.subtract(math.identity(n),J);
		c = math.multiply(c,s[i]);
	}
	return [omega,c];
}

function hiA(A,i, omega, c,n) {
	let m = 0;
	let cm = math.identity(n);
	let cmm = math.identity(n);
	let cm_omega = [];
	let cmm_omega = [];
	let cmbeta = [];
	let cmbetaRoot = math.ones(n,1);
	while (signVec(cmbetaRoot)>0) {
			m = m+1;
			cm = math.pow(c,m);
			cmm = math.pow(c,math.add(m,1));
			cm_omega = math.multiply(cm,omega);
			cmm_omega = math.multiply(cmm,omega);
			cmbeta = math.subtract(cm_omega,cmm_omega);
			cmbetaRoot = math.multiply(math.inv(A),cmbeta);
	}
	return m;
}

// Function to determine the sign of a sign-coherent vector
function signVec(vec) {
	let len = math.count(vec);
	let sum = 0;

	for (let i = 0; i < len; i++) {
		sum = sum + vec.subset(math.index(i,0));
	}
	if (sum >0) {
		return 1;
	}
	if (sum < 0 ) {
		return -1;
	}
}

// Function to return []_- or []_+ of a number
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

// Function to compute frieze patterns from a slice and a Cartan matrix
function frieze_pattern(slice,A, h, n) {
	// Determine the max of the h's
	let N = math.add(1,math.max(h));
	let f = slice;
	let F = math.ones(n,N);
	for (let i = 0; i<n;i++) {
		F.subset(math.index(i,0),slice[i]);
	}
	for (let m = 1; m<=N+1; m++) {
		for (let i = 0; i<n; i++) {
			let lower = 1;
			let upper = 1;
			let tail = 1;
			for (let j = i+1; j<n;j++) {
				lower = math.multiply(lower,math.pow(f[(m-1)*n+j],math.multiply(-1,A.subset(math.index(j,i)))));
			}
			for (let j=0;j <i;j++) {
				upper = math.multiply(upper,math.pow(f[m*n+j], math.multiply(-1,A.subset(math.index(j,i)))));
			}
			tail = math.multiply(upper,lower);
			f[m*n+i] = math.divide(math.add(tail,1),f[(m-1)*n+i]);
			if (m > h[i]+1) {
				F.subset(math.index(i,m),"*");
			}
			else {
				F.subset(math.index(i,m),f[m*n+i]);
			}
		}
	}
	return F;
}

// Function to compute Y-frieze patterns from a slice and a Cartan matrix
function Yfrieze_pattern(slice,A, h, n) {
	// Determine the max of the h's
	let N = math.add(1,math.max(h));
	let k = slice;
	let K = math.ones(n,N);
	for (let i = 0; i<n;i++) {
		K.subset(math.index(i,0),slice[i]);
	}
	for (let m = 1; m<=N+1; m++) {
		for (let i = 0; i<n; i++) {
			let lower = 1;
			let upper = 1;
			let tail = 1;
			for (let j = i+1; j<n;j++) {
				lower = math.multiply(lower,math.pow(math.add(1,k[(m-1)*n+j]),math.multiply(-1,A.subset(math.index(j,i)))));
			}
			for (let j=0;j <i;j++) {
				upper = math.multiply(upper,math.pow(math.add(1,k[m*n+j]), math.multiply(-1,A.subset(math.index(j,i)))));
			}
			tail = math.multiply(upper,lower);
			k[m*n+i] = math.divide(tail,k[(m-1)*n+i]);
			if (m > h[i]+1) {
				K.subset(math.index(i,m),"*");
			}
			else {
				K.subset(math.index(i,m),k[m*n+i]);
			}
		}
	}
	return K;
}

// Function to compute cluster additive functions from a slice and a Cartan matrix
function cluster_additive(slice,A, h, n) {
	// Determine the max of the h's
	let N = math.add(1,math.max(h));
	let k = slice;
	let K = math.zeros(n,N);
	for (let i = 0; i<n;i++) {
		K.subset(math.index(i,0),slice[i]);
	}
	for (let m = 1; m<=N+1; m++) {
		for (let i = 0; i<n; i++) {
			let lower = 0;
			let upper = 0;
			let tail = 0;
			for (let j = i+1; j<n;j++) {
				lower = math.subtract(lower,math.multiply(A.subset(math.index(j,i)), sgnPart(k[(m-1)*n+j], "max" )));
			}
			for (let j=0;j <i;j++) {
				upper = math.subtract(upper,math.multiply(A.subset(math.index(j,i)), sgnPart(k[m*n+j], "max")  ));
			}
			tail = math.add(upper,lower);
			k[m*n+i] = math.subtract(tail,k[(m-1)*n+i]);
			if (m > h[i]+1) {
				K.subset(math.index(i,m),"*");
			}
			else {
				K.subset(math.index(i,m),k[m*n+i]);
			}
		}
	}
	return K;
}

// Function to compute tropical frieze from a slice and a Cartan matrix
function trop_frieze(slice,A, h, n) {
	// Determine the max of the h's
	let N = math.add(1,math.max(h));
	let f = slice;
	let F = math.zeros(n,N);
	for (let i = 0; i<n;i++) {
		F.subset(math.index(i,0),slice[i]);
	}
	for (let m = 1; m<=N+1; m++) {
		for (let i = 0; i<n; i++) {
			let lower = 0;
			let upper = 0;
			let tail = 0;
			for (let j = i+1; j<n;j++) {
				lower = math.subtract(lower,math.multiply(A.subset(math.index(j,i)), f[(m-1)*n+j]));
			}
			for (let j=0;j <i;j++) {
				upper = math.subtract(upper,math.multiply(A.subset(math.index(j,i)), f[m*n+j]));
			}
			tail = math.add(upper,lower);
			f[m*n+i] = math.subtract(sgnPart(tail,"max"),f[(m-1)*n+i]);
			if (m > h[i]+1) {
				F.subset(math.index(i,m),"*");
			}
			else {
				F.subset(math.index(i,m),f[m*n+i]);
			}
		}
	}
	return F;
}

// Global variables
var Cartan;
let Cartan_type = null;
let Cartan_analysis = null;

// Replace the existing window.MathJax assignment with:

// Load a colour package when the user arrives onto the main page
// THIS MIGHT PROVOKE SOME "MathJax.typeset" ERRORS
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
	rank = Number(document.getElementById("userInputRank").value);
	if (!Number.isInteger(rank) || rank < 1) {
		setCartanError("The rank must be a positive integer.");
		return;
	}
	Cartan = undefined;
	Cartan_type = null;
	Cartan_analysis = null;
	setCartanError("");

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
	CartanButtons = document.getElementById("CartanButtons");
	CartanButtons.innerHTML = "";

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
	Cartan_type = null;
	let rank = document.getElementById("userInputRank").value;
	let matrix = document.querySelectorAll('#customCartanContainer input');
	let candidate = callme(matrix).map(Number);
	let analysis = analyseGeneralizedCartan(candidate, rank);
	if (!analysis.valid) {
		Cartan = undefined;
		Cartan_analysis = null;
		setCartanError(analysis.message);
		return;
	}
	Cartan = candidate;
	Cartan_analysis = analysis;
	setCartanError("");
	arrayToMatrix(Cartan, rank, "UserCartanDisplay", "clear");
	MathJax.typeset();

	document.getElementById("customCartanContainer").innerHTML = "";
	document.getElementById("customCartanSubmitButt").style.display = "none";
}

function CartanToInitial() {

	// Recover the rank inputted by the user
	let rank = document.getElementById("userInputRank").value;
	let analysis = analyseGeneralizedCartan(Cartan, rank);
	if (!analysis.valid) {
		setCartanError(analysis.message);
		return;
	}
	Cartan_analysis = analysis;
	setCartanError("");
	let isFiniteType = analysis.isFiniteType;
	let friezeLike = document.getElementById("friezePatCheckBox").checked == true || document.getElementById("YfriezePatCheckBox").checked == true || document.getElementById("tropFriezeCheckBox").checked == true;

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

	let numberColumnsContainer = document.getElementById("numberColumnsContainer");
	if (friezeLike == true && isFiniteType == false) {
		numberColumnsContainer.style.display = "flex";
	} else {
		numberColumnsContainer.style.display = "none";
	}

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
	let analysis = analyseGeneralizedCartan(Cartan, rank);
	if (!analysis.valid) {
		setCartanError(analysis.message);
		return;
	}
	Cartan_analysis = analysis;
	let isFiniteType = analysis.isFiniteType;
	let friezeLike = document.getElementById("friezePatCheckBox").checked == true || document.getElementById("YfriezePatCheckBox").checked == true || document.getElementById("tropFriezeCheckBox").checked == true;
	let finiteTypeBoundaryShift = friezeLike == true && isFiniteType == true;
	let numberOfColumns = parseInt(document.getElementById("numberOfColumns").value);
	let periodText = "";
	let finiteTypeInfo = inferFiniteTypeInfo(A, rank);
	if (isFiniteType == true && finiteTypeInfo.period != null) {
		periodText = "Period = " + finiteTypeInfo.period;
	}
	document.getElementById("outcomeProperties").innerHTML = periodText == "" ? "More properties: &nbsp" : "More properties: &nbsp" + periodText;
	// Need to check whether matrix is finite type before computing the hiA's.
	if (isFiniteType == true) {
		for (let i = 0; i<n; i++) {
			h[i] = hiA(A,i, omega[i], c,n);
			if (friezeLike == true) {
				h[i] = h[i] + 1;
			}
		}
	}
	// Here we put an arbitrary bound on the number of columns computed
	else {
		if (isNaN(numberOfColumns) || numberOfColumns < 1) {
			numberOfColumns = 12;
		}
		for (let i = 0; i<n; i++) {
			h[i] = friezeLike == true ? numberOfColumns - 1 : 8;
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
			mathMatToTableLatex(F,n,h,"functionTable","clear", isFiniteType, 0, finiteTypeBoundaryShift);
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
			mathMatToTableLatex(K,n,h,"functionTable","clear", isFiniteType, 0, finiteTypeBoundaryShift);
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
		mathMatToTableLatex(F,n,h,"functionTable","clear", isFiniteType, 0, finiteTypeBoundaryShift);
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
		mathMatToTableLatex(K,n,h,"functionTable","clear", isFiniteType);
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
		mathMatToTableLatex(K,n,h,"functionTable","clear", isFiniteType);
		MathJax.typeset([functionTable]);

		// Only display corresponding global monomial if A is of finite type
		if (isFiniteType) {
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
		mathMatToTableLatex(F,n,h,"functionTable","clear", isFiniteType);
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

function setCartanError(message) {
	let error = document.getElementById("cartanError");
	if (error) {
		error.textContent = message;
	}
}

function bigintAbs(value) {
	return value < 0n ? -value : value;
}

function bigintGcd(a, b) {
	a = bigintAbs(a);
	b = bigintAbs(b);
	while (b != 0n) {
		let remainder = a % b;
		a = b;
		b = remainder;
	}
	return a == 0n ? 1n : a;
}

function bigintLcm(a, b) {
	return bigintAbs(a / bigintGcd(a, b) * b);
}

function normalizedFraction(numerator, denominator) {
	if (denominator < 0n) {
		numerator = -numerator;
		denominator = -denominator;
	}
	let divisor = bigintGcd(numerator, denominator);
	return {num: numerator / divisor, den: denominator / divisor};
}

function equalFractions(left, right) {
	return left.num * right.den == right.num * left.den;
}

function bareissDeterminant(matrix) {
	let n = matrix.length;
	if (n == 0) {
		return 1n;
	}
	if (n == 1) {
		return matrix[0][0];
	}
	let work = matrix.map(row => row.slice());
	let previousPivot = 1n;
	let sign = 1n;
	for (let pivotIndex = 0; pivotIndex < n - 1; pivotIndex++) {
		if (work[pivotIndex][pivotIndex] == 0n) {
			let swapIndex = pivotIndex + 1;
			while (swapIndex < n && work[swapIndex][pivotIndex] == 0n) {
				swapIndex++;
			}
			if (swapIndex == n) {
				return 0n;
			}
			let temporary = work[pivotIndex];
			work[pivotIndex] = work[swapIndex];
			work[swapIndex] = temporary;
			sign = -sign;
		}
		let pivot = work[pivotIndex][pivotIndex];
		for (let i = pivotIndex + 1; i < n; i++) {
			for (let j = pivotIndex + 1; j < n; j++) {
				work[i][j] = (
					work[i][j] * pivot - work[i][pivotIndex] * work[pivotIndex][j]
				) / previousPivot;
			}
		}
		previousPivot = pivot;
	}
	return sign * work[n - 1][n - 1];
}

function analyseGeneralizedCartan(flatMatrix, rank) {
	let n = Number(rank);
	if (!Number.isInteger(n) || n < 1) {
		return {valid: false, isFiniteType: false, message: "The rank must be a positive integer."};
	}
	if (!Array.isArray(flatMatrix) || flatMatrix.length != n * n) {
		return {valid: false, isFiniteType: false, message: "Choose a Cartan matrix before continuing."};
	}
	let entries = flatMatrix.map(Number);
	if (!entries.every(Number.isInteger)) {
		return {valid: false, isFiniteType: false, message: "Every Cartan-matrix entry must be an integer."};
	}
	for (let i = 0; i < n; i++) {
		if (entries[i * n + i] != 2) {
			return {valid: false, isFiniteType: false, message: "Every diagonal Cartan-matrix entry must equal 2."};
		}
		for (let j = i + 1; j < n; j++) {
			let aij = entries[i * n + j];
			let aji = entries[j * n + i];
			if (aij > 0 || aji > 0) {
				return {valid: false, isFiniteType: false, message: "Off-diagonal Cartan-matrix entries must be non-positive."};
			}
			if ((aij == 0) != (aji == 0)) {
				return {valid: false, isFiniteType: false, message: "The entries a_ij and a_ji must vanish simultaneously."};
			}
		}
	}

	let symmetrizer = new Array(n).fill(null);
	for (let componentStart = 0; componentStart < n; componentStart++) {
		if (symmetrizer[componentStart] != null) {
			continue;
		}
		symmetrizer[componentStart] = {num: 1n, den: 1n};
		let queue = [componentStart];
		while (queue.length > 0) {
			let i = queue.shift();
			for (let j = 0; j < n; j++) {
				let aij = entries[i * n + j];
				if (i == j || aij == 0) {
					continue;
				}
				let aji = entries[j * n + i];
				let candidate = normalizedFraction(
					symmetrizer[i].num * BigInt(-aij),
					symmetrizer[i].den * BigInt(-aji)
				);
				if (symmetrizer[j] == null) {
					symmetrizer[j] = candidate;
					queue.push(j);
				}
				else if (!equalFractions(symmetrizer[j], candidate)) {
					return {valid: false, isFiniteType: false, message: "The Cartan matrix is not symmetrisable."};
				}
			}
		}
	}

	let commonDenominator = 1n;
	for (let i = 0; i < n; i++) {
		commonDenominator = bigintLcm(commonDenominator, symmetrizer[i].den);
	}
	let integerSymmetrizer = symmetrizer.map(value => value.num * (commonDenominator / value.den));
	let symmetricMatrix = [];
	for (let i = 0; i < n; i++) {
		let row = [];
		for (let j = 0; j < n; j++) {
			row.push(integerSymmetrizer[i] * BigInt(entries[i * n + j]));
		}
		symmetricMatrix.push(row);
	}
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			if (symmetricMatrix[i][j] != symmetricMatrix[j][i]) {
				return {valid: false, isFiniteType: false, message: "The Cartan matrix is not symmetrisable."};
			}
		}
	}

	let leadingPrincipalMinors = [];
	let isFiniteType = true;
	for (let size = 1; size <= n; size++) {
		let leadingBlock = symmetricMatrix.slice(0, size).map(row => row.slice(0, size));
		let determinant = bareissDeterminant(leadingBlock);
		leadingPrincipalMinors.push(determinant);
		if (determinant <= 0n) {
			isFiniteType = false;
			break;
		}
	}
	return {
		valid: true,
		isFiniteType: isFiniteType,
		message: "",
		symmetrizer: integerSymmetrizer,
		leadingPrincipalMinors: leadingPrincipalMinors
	};
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
	else if (type == "C") {
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
	else if (type == "B") {
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
		Cartan[1] = -3;
		Cartan[2] = -1;
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

function matricesEqual(A, B) {
	if (math.size(A).toArray().join() !== math.size(B).toArray().join()) {
		return false;
	}
	let size = math.size(A).toArray();
	for (let i = 0; i < size[0]; i++) {
		for (let j = 0; j < size[1]; j++) {
			if (A.subset(math.index(i, j)) != B.subset(math.index(i, j))) {
				return false;
			}
		}
	}
	return true;
}

function inferFiniteTypeInfo(A, rank) {
	let n = parseInt(rank);
	let types = [];
	if (n >= 1) {
		types.push({type: "A", rank: n});
	}
	if (n >= 2) {
		types.push({type: "B", rank: n});
	}
	if (n >= 3) {
		types.push({type: "C", rank: n});
	}
	if (n >= 4) {
		types.push({type: "D", rank: n});
	}
	if (n == 6 || n == 7 || n == 8) {
		types.push({type: "E", rank: n});
	}
	if (n == 4) {
		types.push({type: "F", rank: n});
	}
	if (n == 2) {
		types.push({type: "G", rank: n});
	}
	for (let i = 0; i < types.length; i++) {
		let candidate = listToMathMat(createCartan(types[i].type, types[i].rank), types[i].rank);
		if (matricesEqual(A, candidate)) {
			return {type: types[i].type, period: finiteTypePeriod(types[i].type, types[i].rank)};
		}
	}
	if (Cartan_type != null) {
		return {type: Cartan_type, period: finiteTypePeriod(Cartan_type, n)};
	}
	return {type: null, period: null};
}

function finiteTypePeriod(type, rank) {
	let n = parseInt(rank);
	if (type == "A") {
		return n + 3;
	}
	if (type == "B" || type == "C") {
		return n + 1;
	}
	if (type == "D") {
		if (n % 2 == 0) {
			return n;
		}
		return 2 * n;
	}
	if (type == "E") {
		if (n == 6) {
			return 14;
		}
		if (n == 7) {
			return 10;
		}
		if (n == 8) {
			return 16;
		}
	}
	if (type == "F") {
		return 7;
	}
	if (type == "G") {
		return 4;
	}
	return null;
}

// function to convert a JS array to latex.
function arrayToMatrix(array,rownum,tagById,renderType) {
	// renderType determines whether the tagById div needs to be clear before constructing
	// the new matrix
	let div = document.getElementById(tagById);
	if (renderType == "clear") {
		// Clear the current div
		div.innerHTML = "";
	}
	else if (renderType == "concat") {

	}

	let colnum = (array.length) / (rownum);
	div.innerHTML += "\\( \\begin{pmatrix}";
	for (var i = 0;i < rownum; i++) {
		for (var j = 0; j < colnum; j++) {
			div.innerHTML += array[i*colnum + j];
			if (j != colnum-1) {
				div.innerHTML += "&";
			}
		}
		if (i != rownum-1) {
			div.innerHTML += '\\\\';
		}
	}
	div.innerHTML += "\\end{pmatrix}\\)";
}

function mathMatToTableLatex(array,rownum, h,tagById,renderType, highlightBoundaries, extraDisplayColumns, shiftBoundaryLeft) {
	if (highlightBoundaries === undefined) {
		highlightBoundaries = true;
	}
	if (extraDisplayColumns === undefined) {
		extraDisplayColumns = 0;
	}
	if (shiftBoundaryLeft === undefined) {
		shiftBoundaryLeft = false;
	}
	// Determine the number of columns from the array h of hiA's
	let colnum = math.add(1,math.max(h)) + extraDisplayColumns;
	let div = document.getElementById(tagById);
	let staggeredLayout = document.getElementById("friezePatCheckBox").checked == true || document.getElementById("YfriezePatCheckBox").checked == true || document.getElementById("tropFriezeCheckBox").checked == true;
	// renderType determines whether the tagById div needs to be cleared before constructing
	// the new matrix
	if (renderType == "clear") {
		// Clear the current div
		div.innerHTML = "";
	}
	else if (renderType == "concat") {

	}
	if (staggeredLayout == true) {
		let table = document.createElement("div");
		table.className = "frieze-pattern";
		let measureCanvas = document.createElement("canvas");
		let measureContext = measureCanvas.getContext("2d");
		let bodyStyle = window.getComputedStyle(document.body);
		measureContext.font = bodyStyle.font;
		let widestCell = 0;
		for (var i = 0; i < rownum; i++) {
			var row = document.createElement("div");
			row.className = "frieze-row";
			row.style.paddingLeft = "calc(var(--frieze-cell-width) * " + i + " / 2)";
			for (var m = 0; m <= colnum+1; m++) {
				var cell = document.createElement("div");
				cell.className = "frieze-cell";
				var entry = String(array.subset(math.index(i,m)));
				widestCell = Math.max(widestCell, measureContext.measureText(entry).width);
				let boundaryColumn = shiftBoundaryLeft == true ? h[i] : h[i] + 1;
				if (highlightBoundaries == true && (m == boundaryColumn || m == 0)) {
					cell.innerHTML = "<span class='frieze-boundary'>" + entry + "</span>";
				}
				else {
					cell.textContent = entry;
				}
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		table.style.setProperty("--frieze-cell-width", Math.ceil(widestCell + 24) + "px");
		div.appendChild(table);
		return;
	}
	div.innerHTML += "\\( \\begin{matrix}";
	for (var i = 0;i < rownum; i++) {
		for (var m = 0; m <= colnum+1; m++) {
			// We add colour to the contours of the fundamental domain
			if (m == h[i]+1 || m == 0) {
				div.innerHTML += "{\\color{red}" + array.subset(math.index(i,m)) + "}";
			}
			else {
				div.innerHTML += array.subset(math.index(i,m));
			}
			
			if (m != colnum+1) {
				div.innerHTML += "&";
			}
		}
		if (i != rownum-1) {
			div.innerHTML += '\\\\';
		}
	}
	div.innerHTML += "\\end{matrix}\\)";
}

// Function to compute the cluster monomial from a cluster-additive function
function functionToClusterMono(K, n, tagById, renderType) {
	let div = document.getElementById(tagById);
	if (renderType == "clear") {
		// Clear the current div
		div.innerHTML = "\\(x_{\\rho}^{\\vee} = ";
	}
	// l is the number of points of the cluster-additive function that are displayed
	let l = math.size(K);
	l = math.multiply(l.subset(math.index(1)),l.subset(math.index(0)));
	let M = l/n;
	for (let m=0; m<M;m++) {
		for (let i = 0; i < n; i++) {
			if (K.subset(math.index(i,m)) < -1) {
				let I = i+1;
				div.innerHTML += " x^{\\vee}(" + I + "," + m + ")^{" + math.multiply(-1,K.subset(math.index(i,m))) + "}";
			}
			else if (K.subset(math.index(i,m)) == -1) {
				let I = i+1;
				div.innerHTML += " x^{\\vee}(" + I + "," + m + ")";
			}
		}
	}

	div.innerHTML += "\\) ";

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
		  let input = document.createElement("input");
		  input.setAttribute("type", "text");
		  input.setAttribute("maxlength", "4");
		  input.setAttribute("size", "3");
		  cell.appendChild(input);
		  if (document.getElementById("friezePatCheckBox").checked) {
			  input.value = 1;
		  } else if (document.getElementById("YfriezePatCheckBox").checked) {
			  if (Cartan_type === "A" || Cartan_type === "B" || Cartan_type === "G") {
				  input.value = i+1;
			  } else if (Cartan_type === "C" || Cartan_type === "F") {
				  input.value = n-i;
			  } else if (Cartan_type === "D") {
				  input.value = Math.max(n-1-i, 1);
			  } else if (Cartan_type === "E") {
				  input.value = Math.max(i-1, 1);
			  }
		  }
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
	Cartan_type = type;
	Cartan = createCartan(type, rank);
	Cartan_analysis = analyseGeneralizedCartan(Cartan, rank);
	setCartanError("");
	let container = document.getElementById(tagById);
	let matrixHeadingId = tagById + "-matrix-heading";
	let diagramHeadingId = tagById + "-diagram-heading";
	container.innerHTML =
		"<div class='cartan-preview-grid'>" +
			"<section class='cartan-preview-column' aria-labelledby='" + matrixHeadingId + "'>" +
				"<h4 class='cartan-preview-heading' id='" + matrixHeadingId + "'>Cartan matrix</h4>" +
				"<div class='cartan-preview-content cartan-matrix-preview' id='" + tagById + "-matrix'></div>" +
			"</section>" +
			"<section class='cartan-preview-column' aria-labelledby='" + diagramHeadingId + "'>" +
				"<h4 class='cartan-preview-heading' id='" + diagramHeadingId + "'>Dynkin diagram</h4>" +
				"<div class='cartan-preview-content dynkin-preview' id='" + tagById + "-diagram'></div>" +
			"</section>" +
		"</div>";
	arrayToMatrix(Cartan, rank, tagById + "-matrix", "clear");
	renderDynkinDiagram(type, parseInt(rank), tagById + "-diagram");
	MathJax.typeset([document.getElementById(tagById + "-matrix")]);
}

function renderDynkinDiagram(type, rank, tagById) {
	let container = document.getElementById(tagById);
	if (!container) {
		return;
	}

	let layout = dynkinDiagramLayout(type, rank);
	if (layout == null) {
		container.innerHTML = "";
		return;
	}

	let matrix = createCartan(type, rank);
	let edges = dynkinEdgesFromCartan(matrix, rank);
	let svg =
		"<svg class='dynkin-diagram' width='" + layout.width + "' height='" + layout.height +
		"' viewBox='0 0 " + layout.width + " " + layout.height +
		"' preserveAspectRatio='xMidYMid meet' role='img' aria-labelledby='" + tagById + "-title'>" +
		"<title id='" + tagById + "-title'>Dynkin diagram of type " + type + rank + "</title>";

	for (let i = 0; i < edges.length; i++) {
		let edge = edges[i];
		let firstNode = layout.nodes[edge.i];
		let secondNode = layout.nodes[edge.j];
		let offsets = dynkinParallelOffsets(edge.multiplicity);
		for (let j = 0; j < offsets.length; j++) {
			let segment = dynkinClippedSegment(firstNode, secondNode, offsets[j]);
			svg +=
				"<line class='dynkin-edge' x1='" + dynkinSvgNumber(segment.x1) +
				"' y1='" + dynkinSvgNumber(segment.y1) +
				"' x2='" + dynkinSvgNumber(segment.x2) +
				"' y2='" + dynkinSvgNumber(segment.y2) + "' />";
		}
		if (edge.arrowFrom != null) {
			svg += dynkinArrowSymbol(
				layout.nodes[edge.arrowFrom],
				layout.nodes[edge.arrowTo]
			);
		}
	}

	for (let i = 0; i < layout.nodes.length; i++) {
		let node = layout.nodes[i];
		let labelY = node.labelSide == "above"
			? node.y - node.r - 9
			: node.y + node.r + 12;
		svg +=
			"<g class='dynkin-node'>" +
				"<circle cx='" + node.x + "' cy='" + node.y + "' r='" + node.r + "'></circle>" +
				"<text x='" + node.x + "' y='" + labelY + "'>" + (i + 1) + "</text>" +
			"</g>";
	}

	svg += "</svg>";
	container.innerHTML = svg;
}

function dynkinEdgesFromCartan(matrix, rank) {
	let n = parseInt(rank);
	let edges = [];
	for (let i = 0; i < n; i++) {
		for (let j = i + 1; j < n; j++) {
			let aij = Math.abs(Number(matrix[i * n + j]));
			let aji = Math.abs(Number(matrix[j * n + i]));
			if (aij == 0 && aji == 0) {
				continue;
			}
			let edge = {
				i: i,
				j: j,
				multiplicity: Math.max(aij, aji),
				arrowFrom: null,
				arrowTo: null
			};
			if (aij < aji) {
				edge.arrowFrom = i;
				edge.arrowTo = j;
			}
			else if (aji < aij) {
				edge.arrowFrom = j;
				edge.arrowTo = i;
			}
			edges.push(edge);
		}
	}
	return edges;
}

function dynkinParallelOffsets(multiplicity) {
	if (multiplicity == 2) {
		return [-2.6, 2.6];
	}
	if (multiplicity == 3) {
		return [-4.5, 0, 4.5];
	}
	return [0];
}

function dynkinClippedSegment(firstNode, secondNode, offset) {
	let dx = secondNode.x - firstNode.x;
	let dy = secondNode.y - firstNode.y;
	let length = Math.hypot(dx, dy);
	let ux = dx / length;
	let uy = dy / length;
	let nx = -uy;
	let ny = ux;
	let firstClearance = firstNode.r + 1;
	let secondClearance = secondNode.r + 1;
	return {
		x1: firstNode.x + ux * firstClearance + nx * offset,
		y1: firstNode.y + uy * firstClearance + ny * offset,
		x2: secondNode.x - ux * secondClearance + nx * offset,
		y2: secondNode.y - uy * secondClearance + ny * offset
	};
}

function dynkinArrowSymbol(fromNode, toNode) {
	let dx = toNode.x - fromNode.x;
	let dy = toNode.y - fromNode.y;
	let middleX = (fromNode.x + toNode.x) / 2;
	let middleY = (fromNode.y + toNode.y) / 2;
	let angle = Math.atan2(dy, dx) * 180 / Math.PI;
	return (
		"<g class='dynkin-arrow' aria-hidden='true'>" +
			"<circle class='dynkin-arrow-backplate' cx='" + dynkinSvgNumber(middleX) +
			"' cy='" + dynkinSvgNumber(middleY) + "' r='10' />" +
			"<text class='dynkin-arrow-symbol' " +
			"x='" + dynkinSvgNumber(middleX) + "' y='" + dynkinSvgNumber(middleY) + "' " +
			"transform='rotate(" + dynkinSvgNumber(angle) + " " +
				dynkinSvgNumber(middleX) + " " + dynkinSvgNumber(middleY) + ")'>&gt;</text>" +
		"</g>"
	);
}

function dynkinSvgNumber(value) {
	return Math.round(value * 100) / 100;
}

function dynkinDiagramLayout(type, rank) {
	let n = parseInt(rank);
	let nodeRadius = 7;
	let spacing = 48;
	let horizontalMargin = 24;

	if (type == "A" || type == "B" || type == "C" || type == "F" || type == "G") {
		let width = Math.max(88, horizontalMargin * 2 + spacing * (n - 1));
		let startX = (width - spacing * (n - 1)) / 2;
		let nodes = [];
		for (let i = 0; i < n; i++) {
			nodes.push({
				x: startX + i * spacing,
				y: 32,
				r: nodeRadius,
				labelSide: "below"
			});
		}
		return {width: width, height: 68, nodes: nodes};
	}

	if (type == "D" && n >= 4) {
		let width = horizontalMargin * 2 + spacing * (n - 2);
		let nodes = new Array(n);
		let centralY = 51;
		for (let i = 0; i <= n - 3; i++) {
			nodes[i] = {
				x: horizontalMargin + i * spacing,
				y: centralY,
				r: nodeRadius,
				labelSide: "below"
			};
		}
		let branchX = horizontalMargin + (n - 2) * spacing;
		nodes[n - 2] = {
			x: branchX,
			y: centralY - 24,
			r: nodeRadius,
			labelSide: "above"
		};
		nodes[n - 1] = {
			x: branchX,
			y: centralY + 24,
			r: nodeRadius,
			labelSide: "below"
		};
		return {width: width, height: 104, nodes: nodes};
	}

	if (type == "E" && (n == 6 || n == 7 || n == 8)) {
		let spineOrder = [0, 2, 3];
		for (let i = 4; i < n; i++) {
			spineOrder.push(i);
		}
		let width = horizontalMargin * 2 + spacing * (spineOrder.length - 1);
		let nodes = new Array(n);
		for (let i = 0; i < spineOrder.length; i++) {
			nodes[spineOrder[i]] = {
				x: horizontalMargin + i * spacing,
				y: 57,
				r: nodeRadius,
				labelSide: "below"
			};
		}
		nodes[1] = {
			x: horizontalMargin + 2 * spacing,
			y: 23,
			r: nodeRadius,
			labelSide: "above"
		};
		return {width: width, height: 108, nodes: nodes};
	}

	return null;
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

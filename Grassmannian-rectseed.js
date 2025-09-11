var InitialMat;
var PrinInitialMat;
var rownumInitialMat;
var colnumInitialMat;


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

function Grassrectseed() {
	document.getElementById("mutationHistory").innerHTML = "";
	document.getElementById("initialMatrix").innerHTML = "";
	//This function constructs the mutation matrix associated to the rectangles seed for the Grassmannian.
	//This will include arrows in between frozen variables as indicated by plabic graphs.
	

	let k = Number(document.getElementById("userInputk").value);
    let n = Number(document.getElementById("userInputn").value);
    
	let height = k*(n-k)+1;
	let width = k*(n-k)+1;
	//let width = (k-1)*(n-k-1);
	rownumInitialMat = height;
	

	
	InitialMat = [];
	//Sets zeroth matrix row corresponding to empty rectangle cluster variable
	{const i=0;
	for (j=0; j<width+1; j++) {
		if (j==1) {
			InitialMat[i*width+j] = 1;
		}
		else if (j==(k-1)*(n-k)+1  || j==n-k) {
			InitialMat[i*width+j] = -1;
		}
		else {
			InitialMat[i*width+j] = 0;
		}
	}}

	//Sets matrix rows corresponding to first row of quiver
	{const i=1;
	for (j=0; j<width+1; j++) {
		if (j==0 || j==n-k+2) {
			InitialMat[i*width+j] = -1;
		}
		else if (j==2 || j==n-k+1) {
			InitialMat[i*width+j] = 1;
		}
		else {
			InitialMat[i*width+j] = 0;
		}
	}}

	for (i=2;i<n-k; i++) {
		for (j=0; j<width; j++) {
			if (j==i-1 || j==i+n-k+1) {
				InitialMat[i*width+j] = -1;
			}
			else if (j==i+1 || j==i+n-k) {
				InitialMat[i*width+j] = 1;
			}
			else {
				InitialMat[i*width+j] = 0;
			}
		}
	}

	{const i=n-k;
	for (j=0; j<width; j++) {
		if (j==n-k-1) {
			InitialMat[i*width+j] = -1;
		}
		else if (j==0 || j==2*(n-k)) {
			InitialMat[i*width+j] = 1;
		}
		else {
			InitialMat[i*width+j] = 0;
		}
	}}

	//Sets matrix rows corresponding to intemediary rows of quiver
	for (p=1; p<k-1; p++) {
		{const i=p*(n-k)+1;
		for (j=0; j<width; j++) {
			if (j==i-(n-k) || j==i + n-k +1) {
				InitialMat[i*width+j] = -1;
			}
			else if (j==i+n-k || j==i+1) {
				InitialMat[i*width+j] = 1;
			}
			else {
				InitialMat[i*width+j] = 0;
			}
		}}

		for (i=p*(n-k)+2;i<p*(n-k)+(n-k); i++) {
			for (j=0; j<width; j++) {
				if (j== i-(n-k) || j==i-1 || j==i+n-k+1) {
					InitialMat[i*width+j] = -1;
				}
				else if (j==i-(n-k)-1 || j==i+1 || j==i+n-k) {
					InitialMat[i*width+j] = 1;
				}
				else {
					InitialMat[i*width+j] = 0;
				}
			}
		}

		{const i=p*(n-k)+(n-k);
		for (j=0; j<width; j++) {
			if (j==i-1 || j==i - (n-k)) {
				InitialMat[i*width+j] = -1;
			}
			else if (j==i-(n-k)-1 || j==i+n-k) {
				InitialMat[i*width+j] = 1;
			}
			else {
				InitialMat[i*width+j] = 0;
			}
		}}
	}

	//Sets matrix rows corresponding to last row of quiver
	{const i=(k-1)*(n-k)+1;
	for (j=0; j<width; j++) {
		if (j==(k-2)*(n-k)+1) {
			InitialMat[i*width+j] = -1;
		}
		else if (j==0 || j==i+1) {
			InitialMat[i*width+j] = 1;
		}
		else {
			InitialMat[i*width+j] = 0;
		}
	}}

	for (i=(k-1)*(n-k)+2;i<k*(n-k); i++) {
		for (j=0; j<width; j++) {
			if (j==i-1 || j==i-(n-k)) {
				InitialMat[i*width+j] = -1;
			}
			else if (j==i+1 || j==i-(n-k)-1) {
				InitialMat[i*width+j] = 1;
			}
			else {
				InitialMat[i*width+j] = 0;
			}
		}
	}

	{const i=k*(n-k);
	for (j=0; j<width; j++) {
		if (j==i-1 || j==(k-1)*(n-k)) {
			InitialMat[i*width+j] = -1;
		}
		else if (j==(k-1)*(n-k)-1) {
			InitialMat[i*width+j] = 1;
		}
		else {
			InitialMat[i*width+j] = 0;
		}
	}}
	

	let mutwidth = (k-1)*(n-k-1); 
	
	PrinInitialMat = [];
	for (a = 0; a < mutwidth; a++) {
		for (b = 0; b < mutwidth; b++) {
			PrinInitialMat[a*mutwidth+b] = InitialMat[(a+1 + Math.floor((a) / (n-k-1)))*width+(b+1 + Math.floor((b) / (n-k-1)))];
		}
	}
	mutindices = [];
	for (a = 0; a < mutwidth; a++) {
		mutindices[a] = (a+1 + Math.floor((a) / (n-k-1)))
	}
	colnumInitialMat = mutindices.length;

    // Display mutation matrix
    arrayToMatrix(InitialMat,height,"initialMatrix","clear");

	arrayToMatrix(PrinInitialMat,mutwidth,"initialPrincipalPart","clear");
    //MathJax.typeset();
	
	//arrayToMatrix(mutindices,1,"mutableIndices","clear");
    //MathJax.typeset();
	mutButtons(mutwidth);
	quiver(array2Matrix(PrinInitialMat));
	document.getElementById("mutationHistoryButton").style.display = "block";
	// Create MathJax rendition of initial mutation matrix in the <div id="mutationHistory">
	// Note the code in <div id="mutationHistory"> is not typeset until 
	// the user presses the button "show mutation history"
	arrayToMatrix(InitialMat,height,'mutationHistory', "clear");

    // Reveal the 4. Outcome dashboard
    document.getElementById("outDashboard1").setAttribute("class","dashboard");
	document.getElementById("outDashboard2").setAttribute("class","dashboard");
	MathJax.typeset();
}
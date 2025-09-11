var InitialMat;
var PrinInitialMat;
var rownumInitialMat;
var colnumInitialMat;

function rankToType() {
    let rank = document.getElementById("userInputRank").value;
   	// Reveal the dashboards 2. and 3.
	document.getElementById("inDashboardBruhat2").setAttribute("class","dashboard");

	// Clear the computations on dashboard 2.
	document.getElementById("UserCartanDisplay").innerHTML = "";

	// Clear the computations on dashboards 4. and 5.
	document.getElementById("mutationHistory").innerHTML = "";
	document.getElementById("initialMatrix").innerHTML = "";
	//document.getElementById("initialCartanContainer").innerHTML = "";
	//document.getElementById("initialContainer").innerHTML = "";

	//document.getElementById("functionTable").innerHTML = "";
	//document.getElementById("globalMonomial").innerHTML = "";

	// Hide dashboards 4. and 5. (in case the user has made a calculation previously)
	document.getElementById("outDashboard1").setAttribute("class","dashboardOff");
	//document.getElementById("outcomeDashboard").setAttribute("class","dashboardOff");

	// Create "shortcut" buttons for Cartan matrices in div with id="CartanButtons"
	// First clear the space from any previous buttons
	document.getElementById("TypeButtons").innerHTML = "";

	TypeButtons = document.getElementById("TypeButtons");
	// Create an An button
	let button = document.createElement("button");
	let buttonId = "A";
	button.setAttribute("id", buttonId);
	button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
	//button.innerHTML = "\\( \\text{A}_{" + rank + "}\\)";
	button.innerHTML = "A<sub>" + rank +" </sub>";
	TypeButtons.appendChild(button);


	// Create a Bn button if rank >= 2
	if (rank >= 2) {
		let button = document.createElement("button");
		let buttonId = "B";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		//button.innerHTML = "\\( \\text{B}_{" + rank + "}\\)";
		button.innerHTML = "B<sub>" + rank +" </sub>";
		TypeButtons.appendChild(button);
	}
	// Create a Cn button if rank >= 3
	if (rank >= 3) {
		let button = document.createElement("button");
		let buttonId = "C";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		//button.innerHTML = "\\( \\text{C}_{" + rank + "}\\)";
		button.innerHTML = "C<sub>" + rank +"</sub>";
		TypeButtons.appendChild(button);
	}

	// Create a Dn button if rank >= 4
	if (rank >= 4) {
		let button = document.createElement("button");
		let buttonId = "D";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		//button.innerHTML = "\\( \\text{D}_{" + rank + "}\\)";
		button.innerHTML = "D<sub>" + rank +" </sub>";
		TypeButtons.appendChild(button);
	}

	// Add exceptional types in suitable ranks
	if (rank == 6 || rank == 7 || rank == 8) {
		let button = document.createElement("button");
		let buttonId = "E";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		//button.innerHTML = "\\( \\text{E}_{" + rank + "}\\)";
		button.innerHTML = "E<sub>" + rank +" </sub>";
		TypeButtons.appendChild(button);
	}

	if (rank == 4 ) {
		let button = document.createElement("button");
		let buttonId = "F";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		//button.innerHTML = "\\( \\text{F}_{" + rank + "}\\)";
		button.innerHTML = "F<sub>" + rank +" </sub>";
		TypeButtons.appendChild(button);
	}

	if (rank == 2 ) {
		let button = document.createElement("button");
		let buttonId = "G";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		//button.innerHTML = "\\( \\text{G}_{" + rank + "}\\)";
		button.innerHTML = "G<sub>" + rank +" </sub>";
		TypeButtons.appendChild(button);
	}
	//MathJax.typeset([TypeButtons]);  
	MathJax.typeset();
}

function doubleWord() {
	let rank = Number(document.getElementById("userInputRank").value);
    let word = document.getElementById("userInputWord").value;
    // Convert the word into an object
    word = word.split(',').map(Number);
    // Length of the word
    // let wordLength = wordList.length
    // Indices of the rows
	//for (let i =1; i <= rank; i++) {
    //	word.unshift(-i)
    //}

	let absWord = word.map(Math.abs);

	
	
	let height = word.length;
	// Define the successor word
	let wordPlus = [];
	for (let i = 0; i < height; i++) {
		wordPlus[i] = nextOccur(word[i],(i+1),word,height);
	}
	exchangePosition = [];
	for (let i = 0; i < height; i++) {
		if (wordPlus[i] != height) {
			exchangePosition.push(i);
		}
	}
	let width = exchangePosition.length;

	let wordMinus = [];
	// define the predecessor word
	for (let i = 0; i < height; i++) {
		wordMinus[i] = prevOccur(word[i],i,word);
	}
	
	// Sign of each entry of the word
	let signWord = [];
	for (let i = 0; i < height; i++) {
		signWord[i] = sign(word[i]);
	}
	
	InitialMat = [];

	
	for (p = 0; p < height; p++) {
		b = 0;
		//for (k = 0; k < height; k++) {
		for (k = 0; k < height; k++) {
			if (exchangePosition.includes(k)) {
				if (p == wordMinus[k]) {
					InitialMat[p*width+b] = -signWord[k];
				}
				else if (p == wordPlus[k]) {
					InitialMat[p*width+b] = signWord[p];
				}
				else if (p < k && k < wordPlus[p] && wordPlus[p]< wordPlus[k] && signWord[k] == signWord[wordPlus[p]]) {
					InitialMat[p*width+b] = -signWord[k]*Cartan[(absWord[p]-1)*rank+(absWord[k]-1)];
				}
				else if (p < k && k < wordPlus[k] && wordPlus[k] < wordPlus[p] && signWord[k] == -signWord[wordPlus[k]] ) {
					InitialMat[p*width+b] = -signWord[k]*Cartan[(absWord[p]-1)*rank+(absWord[k]-1)];
				}
				else if (k < p && p < wordPlus[k] && wordPlus[k] < wordPlus[p] && signWord[p] == signWord[wordPlus[k]]) {
					InitialMat[p*width+b] = signWord[p]*Cartan[(absWord[p]-1)*rank+(absWord[k]-1)];
				}
				else if (k < p && p < wordPlus[p] && wordPlus[p] < wordPlus[k] && signWord[p] == -signWord[wordPlus[p]]) {
					InitialMat[p*width+b] = signWord[p]*Cartan[(absWord[p]-1)*rank+(absWord[k]-1)];
				}
				else {
					InitialMat[p*width+b] = 0;
				}
				b = b+1;
			} 
		}
	}
	
	PrinInitialMat = [];
	for (a = 0; a < width; a++) {
		for (b = 0; b < width; b++) {
			PrinInitialMat[a*width+b] = InitialMat[exchangePosition[a]*width+b];
		}
	}

    // Display mutation matrix
    arrayToMatrix(InitialMat,height,"initialMatrix","clear");

	arrayToMatrix(PrinInitialMat,width,"initialPrincipalPart","clear");
    //MathJax.typeset();

	quiver(array2Matrix(PrinInitialMat));
	rownumInitialMat = height;
	colnumInitialMat = width;
	mutButtons(width);
	MathJax.typeset();
	
document.getElementById("mutationHistoryButton").style.display = "block";
	arrayToMatrix(InitialMat,height,'mutationHistory', "clear");
    // Display the word in 4. Outcome
    //document.getElementById("WordContainer").innerHTML = word;

    // Reveal the 4. Outcome dashboard
    document.getElementById("outDashboard1").setAttribute("class","dashboard");
	document.getElementById("outDashboard2").setAttribute("class","dashboard");
}





function minOrMax(a,b,sgn) {
	if (sgn == "max") {
		if (a >b) {
			return a;
		}
		else {
			return b;
		}
	}
	else if (sgn == "min") {
		if (a < b) {
			return a;
		}
		else {
			return b;
		}
	}	
}

function sign(a) {
	if (a > 0) {
		return 1;
	}
	else if (a <0) {
		return -1;
	}
	else {
		return 0;
	}
}

function nextOccur(i,pos,list,max) {
	subList = list.slice(pos);
	IndexPos = subList.indexOf(i);	
	IndexNeg = subList.indexOf(-i);
	if (IndexPos != -1) {
		IndexPos = IndexPos + pos;
	}
	if (IndexPos == -1) {
		IndexPos = max;
	}
	if (IndexNeg != -1) {
		IndexNeg = IndexNeg + pos;
	}
	if (IndexNeg == -1) {
		IndexNeg = max;
	}
	
	return minOrMax(IndexNeg,IndexPos,"min");
}

function prevOccur(i,pos,list) {
	subList = list.slice(0,pos);
	IndexPos = subList.lastIndexOf(i);	
	IndexNeg = subList.lastIndexOf(-i);
	return minOrMax(IndexNeg,IndexPos,"max");
}
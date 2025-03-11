function rankToType() {
    let rank = document.getElementById("userInputRank").value;
   	// Reveal the dashboards 2. and 3.
	document.getElementById("TypeDashboard").setAttribute("class","dashboard");

	// Clear the computations on dashboard 2.
	document.getElementById("UserCartanDisplay").innerHTML = "";

	// Clear the computations on dashboards 4. and 5.
	//document.getElementById("initialCartanContainer").innerHTML = "";
	//document.getElementById("initialContainer").innerHTML = "";

	//document.getElementById("functionTable").innerHTML = "";
	//document.getElementById("globalMonomial").innerHTML = "";

	// Hide dashboards 4. and 5. (in case the user has made a calculation previously)
	document.getElementById("InitialDashboard").setAttribute("class","dashboardOff");
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
	button.innerHTML = "\\( \\text{A}_{" + rank + "}\\)";
	TypeButtons.appendChild(button);


	// Create a Bn button if rank >= 2
	if (rank >= 2) {
		let button = document.createElement("button");
		let buttonId = "B";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{B}_{" + rank + "}\\)";
		TypeButtons.appendChild(button);
	}
	// Create a Cn button if rank >= 3
	if (rank >= 3) {
		let button = document.createElement("button");
		let buttonId = "C";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{C}_{" + rank + "}\\)";
		TypeButtons.appendChild(button);
	}

	// Create a Dn button if rank >= 4
	if (rank >= 4) {
		let button = document.createElement("button");
		let buttonId = "D";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{D}_{" + rank + "}\\)";
		TypeButtons.appendChild(button);
	}

	// Add exceptional types in suitable ranks
	if (rank == 6 || rank == 7 || rank == 8) {
		let button = document.createElement("button");
		let buttonId = "E";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{E}_{" + rank + "}\\)";
		TypeButtons.appendChild(button);
	}

	if (rank == 4 ) {
		let button = document.createElement("button");
		let buttonId = "F";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{F}_{" + rank + "}\\)";
		TypeButtons.appendChild(button);
	}

	if (rank == 2 ) {
		let button = document.createElement("button");
		let buttonId = "G";
		button.setAttribute("id", buttonId);
		button.setAttribute("onclick", "displayCartanShortcut(this.id, document.getElementById('userInputRank').value, 'UserCartanDisplay')");
		button.innerHTML = "\\( \\text{G}_{" + rank + "}\\)";
		TypeButtons.appendChild(button);

	}
	MathJax.typeset([TypeButtons]); 

}

function doubleWord() {
	let rank = Number(document.getElementById("userInputRank").value);
    let word = document.getElementById("userInputWord").value;
    // Convert the word into an object
    const wordList = word.split(',').map(Number);
    // Length of the word
    let wordLength = wordList.length
    // Indices of the rows
    const indexList = []
    for (let i = 1; i <= wordLength; i++) {
    	indexList.push(i)
    	if (wordList[i-1] > rank || wordList[i-1] == 0 || wordList[i-1] < (-rank) ) {
    		alert(i+'th entry of the word is out of bounds');
    	}
    }

    // Copy indexList
    let exchangeableList = [...indexList];

    // Replace the last occurence of each index with '0'
    for (let i = 1; i <= rank; i++) {
    	j = wordList.lastIndexOf(i)
    	k = wordList.lastIndexOf(-i)
    	if (j >= 0 && j > k) {
    		exchangeableList[j] = 0;
    	}
    	if (k >= 0 && k > j) {
    		exchangeableList[k] = 0;
    	}
    	
    }



    // Add a copy of -[1,rank] at the beginning of the word and the index list
    for (let i =1; i <= rank; i++) {
    	wordList.unshift(-i)
    	indexList.unshift(-i)
    }

    
    // remove all occurences of 0 in exchangeableList 
    reducedExchangeableList = exchangeableList.filter((num) => num != 0);
 
    
    // Number of rows and columns in the mutation matrix
    let indexLength = wordList.length;
    let exchIndexLength = reducedExchangeableList.length;
    // Display size of the mutation matrix
    document.getElementById("initialMatrixHead").innerHTML = "Initial mutation matrix (size: \\(" + indexLength + '\\times' + exchIndexLength +"\\))";
    MathJax.typeset([initialMatrixHead]);


    // Compute the initial mutation matrix
    mutMat = [];
    // M = (m_{a,b})
    for (a = 0; a < indexLength; a++) {
    	k = indexList[a];
    	// Index "at position k"
    	i = wordList[a];
    	kPlus = nextOccur(i,(a+1),wordList,indexLength);
    	//alert('The next occurence of '+ i + ' is at ' + kPlus);
    	
    	for (b = 0; b < exchIndexLength; b++) {
    		l = reducedExchangeableList[b];
    		// Index "at position l"
    		shift_rank = l + rank -1;
    		j = wordList[shift_rank];
    		p = minOrMax(k,l,"max");
    		// Next occurence of 
    		lPlus = nextOccur(j,(l+rank),wordList,indexLength);
    		//
    		q = minOrMax(kPlus,lPlus,"min");
    		if (p == q) {
    			mutMat[a*exchIndexLength+b] = -1*sign(k-l)*sign(wordList[p+rank-1]);
    		}
    		// Need to give meaning to 
    		else if (p < q && sign(wordList[p+rank-1])*(k-l)*(kPlus - lPlus) >0 ) {
    			mutMat[a*exchIndexLength+b] = -1*sign(k-l)*sign(wordList[p+rank-1])*2;
    		}
    		else {
    			mutMat[a*exchIndexLength+b] = 0;
    		}
    		
    	}
    }
    // Display mutation matrix
    arrayToMatrix(mutMat,indexLength,"initialMatrix","clear");
    MathJax.typeset();
    
    // Display the word in 4. Outcome
    document.getElementById("WordContainer").innerHTML = wordList;

    // Reveal the 4. Outcome dashboard
    document.getElementById("InitialDashboard").setAttribute("class","dashboard");
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

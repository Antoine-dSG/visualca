function rankToType() {
    let rank = document.getElementById("userInputRank").value;
   	// Reveal the dashboards 2. and 3.
	document.getElementById("TypeDashboard").setAttribute("class","dashboard");

	// Clear the computations on dashboards 4. and 5.
	//document.getElementById("initialCartanContainer").innerHTML = "";
	//document.getElementById("initialContainer").innerHTML = "";

	//document.getElementById("functionTable").innerHTML = "";
	//document.getElementById("globalMonomial").innerHTML = "";

	// Hide dashboards 4. and 5. (in case the user has made a calculation previously)
	//document.getElementById("InitialDashboard").setAttribute("class","dashboardOff");
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
    let word = document.getElementById("userInputWord").value;
    document.getElementById("WordContainer").innerHTML = word;
    document.getElementById("InitialDashboard").setAttribute("class","dashboard");
}


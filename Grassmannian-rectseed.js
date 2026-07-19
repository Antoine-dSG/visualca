var InitialMat;
var PrinInitialMat;
var mutindices;
var mutcolindices;

function Grassrectseed() {
	//This function constructs the mutation matrix associated to the rectangles seed for the Grassmannian.
	//This will include arrows in between frozen variables as indicated by plabic graphs.
	setMutationInputError("");
	let k = Number(document.getElementById("userInputk").value);
	let n = Number(document.getElementById("userInputn").value);
	if (!Number.isInteger(k) || !Number.isInteger(n)) {
		setMutationInputError("The Grassmannian parameters k and n must be integers.");
		return;
	}
	if (n < 4 || k < 2 || k > n - 2) {
		setMutationInputError("This rectangles-seed applet requires 2 ≤ k ≤ n−2 (and hence n ≥ 4).");
		return;
	}
    
	let height = k*(n-k)+1;
	let width = k*(n-k)+1;
	//let width = (k-1)*(n-k-1);	

	
	InitialMat = Array.from(Array(height), () => new Array(width));
	//Sets zeroth matrix row corresponding to empty rectangle cluster variable
	{const i=0;
	for (let j=0; j<width; j++) {
		if (j==1) {
			InitialMat[i][j] = 1;
		}
		else if (j==(k-1)*(n-k)+1  || j==n-k) {
			InitialMat[i][j] = -1;
		}
		else {
			InitialMat[i][j] = 0;
		}
	}}

	//Sets matrix rows corresponding to first row of quiver
	{const i=1;
	for (let j=0; j<width; j++) {
		if (j==0 || j==n-k+2) {
			InitialMat[i][j] = -1;
		}
		else if (j==2 || j==n-k+1) {
			InitialMat[i][j] = 1;
		}
		else {
			InitialMat[i][j] = 0;
		}
	}}

	for (let i=2;i<n-k; i++) {
		for (let j=0; j<width; j++) {
			if (j==i-1 || j==i+n-k+1) {
				InitialMat[i][j] = -1;
			}
			else if (j==i+1 || j==i+n-k) {
				InitialMat[i][j] = 1;
			}
			else {
				InitialMat[i][j] = 0;
			}
		}
	}

	{const i=n-k;
	for (let j=0; j<width; j++) {
		if (j==n-k-1) {
			InitialMat[i][j] = -1;
		}
		else if (j==0 || j==2*(n-k)) {
			InitialMat[i][j] = 1;
		}
		else {
			InitialMat[i][j] = 0;
		}
	}}

	//Sets matrix rows corresponding to intemediary rows of quiver
	for (let p=1; p<k-1; p++) {
		{const i=p*(n-k)+1;
		for (let j=0; j<width; j++) {
			if (j==i-(n-k) || j==i + n-k +1) {
				InitialMat[i][j] = -1;
			}
			else if (j==i+n-k || j==i+1) {
				InitialMat[i][j] = 1;
			}
			else {
				InitialMat[i][j] = 0;
			}
		}}

		for (let i=p*(n-k)+2;i<p*(n-k)+(n-k); i++) {
			for (let j=0; j<width; j++) {
				if (j== i-(n-k) || j==i-1 || j==i+n-k+1) {
					InitialMat[i][j] = -1;
				}
				else if (j==i-(n-k)-1 || j==i+1 || j==i+n-k) {
					InitialMat[i][j] = 1;
				}
				else {
					InitialMat[i][j] = 0;
				}
			}
		}

		{const i=p*(n-k)+(n-k);
		for (let j=0; j<width; j++) {
			if (j==i-1 || j==i - (n-k)) {
				InitialMat[i][j] = -1;
			}
			else if (j==i-(n-k)-1 || j==i+n-k) {
				InitialMat[i][j] = 1;
			}
			else {
				InitialMat[i][j] = 0;
			}
		}}
	}

	//Sets matrix rows corresponding to last row of quiver
	{const i=(k-1)*(n-k)+1;
	for (let j=0; j<width; j++) {
		if (j==(k-2)*(n-k)+1) {
			InitialMat[i][j] = -1;
		}
		else if (j==0 || j==i+1) {
			InitialMat[i][j] = 1;
		}
		else {
			InitialMat[i][j] = 0;
		}
	}}

	for (let i=(k-1)*(n-k)+2;i<k*(n-k); i++) {
		for (let j=0; j<width; j++) {
			if (j==i-1 || j==i-(n-k)) {
				InitialMat[i][j] = -1;
			}
			else if (j==i+1 || j==i-(n-k)-1) {
				InitialMat[i][j] = 1;
			}
			else {
				InitialMat[i][j] = 0;
			}
		}
	}

	{const i=k*(n-k);
	for (let j=0; j<width; j++) {
		if (j==i-1 || j==(k-1)*(n-k)) {
			InitialMat[i][j] = -1;
		}
		else if (j==(k-1)*(n-k)-1) {
			InitialMat[i][j] = 1;
		}
		else {
			InitialMat[i][j] = 0;
		}
	}}
	

	let mutwidth = (k-1)*(n-k-1); 
	
	PrinInitialMat = Array.from(Array(mutwidth), () => new Array(mutwidth));
	for (let a = 0; a < mutwidth; a++) {
		for (let b = 0; b < mutwidth; b++) {
			PrinInitialMat[a][b] = InitialMat[a+1 + Math.floor(a / (n-k-1))][b+1 + Math.floor(b / (n-k-1))];
		}
	}
	mutindices = [];
	mutcolindices = [];
	for (let a = 0; a < mutwidth; a++) {
		// mutation() uses one-based directions, while the array row above is zero-based.
		mutindices[a] = a + 2 + Math.floor(a / (n-k-1));
		mutcolindices[a] = mutindices[a];
	}

	initOutDashboards();
}

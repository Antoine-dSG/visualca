function initialToParameter() {
  document.getElementById("dVecDashboard").setAttribute("class","dashboard");
  document.getElementById("outcomeDashboard").setAttribute("class","dashboard");
  document.getElementById("greedyElementOutput").innerHTML = "";
  
}


function displayMutMat() {
  var b = document.getElementById("bValue").value;
  var c = (-1)*document.getElementById("cValue").value;

  let mutMat = document.getElementById("userMutMat");
  mutMat.innerHTML = "\\( B = \\begin{pmatrix} 0 &" + b + " \\\\ " + c + "& 0 \\end{pmatrix} \\)";
  MathJax.typeset([userMutMat]);

}
//////////////////
function greedyElement(){ 
  var b = document.getElementById("bValue").value;
  var c = document.getElementById("cValue").value;
  var d1 = document.getElementById("d1Value").value;
  var d2 = document.getElementById("d2Value").value;

  // There are six cases, labelled as in LLZ.
  // Case 1
  if (d1 <= 0 && d2 <= 0) {
    case1(d1,d2);
  }

  // Cases 2, 3, 4, 5 and 6
  else {
    case2(d1,d2);
  }

  // In all other cases, the greedy element is not a cluster monomial in the initial cluster.
  //else {
  //  document.getElementById("greedyElementOutput").innerHTML = "Currently not supported."
  //}
}

// Function to calculate c(p,q) when [d1,d2] is in Case (1) of LLZ
function case1(d1,d2) {
  var greedyElement;
  var exponent1 = -d1;
  var exponent2 = -d2;
  // For rendering purposes, we distinguish the cases d1 =0, d2 = 0 and the rest
  if (d1 == 0 && d2 == 0) {
    greedyElement = 1;
  }
  else if (d1 == 0 && d2 < 0) {
    greedyElement = `x_2^{${-d2}}`;
  }
  else if (d1 < 0 && d2 == 0) {
    greedyElement = `x_1^{${-d1}}`;
  }
  else {
    greedyElement = `x_1^{${exponent1}} x_2^{${exponent2}}`;
  } 
  
  // Add HTML to display the greedy element 
  document.getElementById("greedyElementOutput").innerHTML = "The greedy element at (\\(d_1,d_2\\)) = (" +d1 +"," + d2 +  ") is \\[" + greedyElement + ".\\]";
  // Ask MathJax to render the newly created code in LaTeX
  MathJax.typeset([greedyElementOutput]);
}

function case2(d1,d2) {
  var b = document.getElementById("bValue").value;
  var c = document.getElementById("cValue").value;
  var greedyElementArray = [[1, 0, 0]]; // array of triples: coefficient and exponents of x_1, x_2
  // max_n is the largest value of n = p+q such that c(p,q) is non-zero
  var max_n = math.max(d1,d2);
  // support is an array of arrays S[0], S[1], ... , S[max_n] where
  // each S[n] contains the values c(p,q) for which p+q = n
  // By definition, S[0] consists of the value c(0,0)=1, so S[0] = [1].
  // S[n+1] is built recursively using the values of S[0], S[1], ... , S[n]
  var support = [[1]];
  n=1;
  while (n <= max_n) {
    // Create a new array S[n]
    temp = support.concat([[0]]);
    support = temp;
    // Dummy variable which will run from 0 to n 
    i = 0;
    while (i <= n) {
      var p = n-i;
      var q = i;
      // At i = 0, we have already created the value c(n,0) (as a placemark in the creation of S[n]).
      if (i == 0) {
        // We replace the current value c(n,0) = 0 by the correct value of c(n,0)
        support[n][i] = function_c(support,p,q);
	  } else { // For all cases 0 < i <= n, we append the value of c(n-k,k) to the array S[n]
        support[n].push(function_c(support,p,q));
      }
      if (support[n][i] != 0){
        greedyElementArray.push([support[n][i], b*p, c*q]);
      }
      i += 1;
    }
    n += 1;
  }
  //alert(greedyElementArray)
  var greedyElement = [...greedyElementArray].map(args => {
    const [coeff, ex1, ex2] = args;
    if (coeff == 1 && ex1 == 0 && ex2 == 0) {
      return '1';
    }
    return (coeff == 1 ? '' : coeff) + (ex1 == 0 ? '' : 'x_1' + (ex1 == 1 ? '' : '^{'+ex1+'}')) + (ex2 == 0 ? '' : 'x_2' + (ex2 == 1 ? '' : '^{'+ex2+'}'));
  }).join('+');
  // Add HTML to display the greedy element 
  if (d1 != 0 && d2 != 0) {
    document.getElementById("greedyElementOutput").innerHTML = "The greedy element at (\\(d_1,d_2\\)) = (" +d1 +"," + d2 +  ") is \\[" + `x_1^{${-d1}} x_2^{${-d2}}`+ "(" + greedyElement + "). \\]";
  }
  else if (d1 == 0 && d2 != 0) {
    document.getElementById("greedyElementOutput").innerHTML = "The greedy element at (\\(d_1,d_2\\)) = (" +d1 +"," + d2 +  ") is \\[" + `x_2^{${-d2}}`+ "(" + greedyElement + "). \\]";
  }
  else if (d1 !=  0 && d2 == 0) {
    document.getElementById("greedyElementOutput").innerHTML = "The greedy element at (\\(d_1,d_2\\)) = (" +d1 +"," + d2 +  ") is \\[" + `x_1^{${-d1}}`+ "(" + greedyElement + "). \\]";
  }
  
  // Ask MathJax to render the newly created code in LaTeX
  MathJax.typeset([greedyElementOutput]);
}

function function_c(support,p,q) {
  var b = document.getElementById("bValue").value;
  var c = document.getElementById("cValue").value;
  var d1 = document.getElementById("d1Value").value;
  var d2 = document.getElementById("d2Value").value;
  const n = p+q;
  // Calculate first term of the maximum
  var term1 = 0;
  if (p == 0) {
    // Do nothing
  }
  else {
    var k = 1;
    while (k <= p) {
      term1 += math.pow(-1,k-1)*support[n-k][q]*gnrlCombinations(d2-c*q+k-1,k);
      k+= 1;
    }
  }
  // Calculate second term of the maximum
  var term2 = 0;
  if (q == 0) { 
    // Do nothing
  }
    else {
    var k = 1;
    while (k <= q) {
      term2 += math.pow(-1,k-1)*support[n-k][q-k]*gnrlCombinations(d1-b*p+k-1,k);
      k+= 1;
    }
  }

  // Define c to be the maximum of the two terms
  var c = math.max(term1, term2);
  return c;
}

function gnrlCombinations(a,b) {
  var comb = 0;
  if (a >=b && b >= 0) {
    comb = math.combinations(a,b);
  }
  else {
    comb = 0;
  }
  return comb;

}

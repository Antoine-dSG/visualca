'use strict';

const EXCEPTIONAL_FIN_MUT_TYPE = "An exceptional cluster algebra <a href='https://arxiv.org/abs/0811.1703'>of finite mutation type</a>.";
const NON_LOC_ACYCLIC = "An example of a <a href='https://arxiv.org/abs/1111.4468'>non-locally-acyclic</a> cluster algebra."

const matrixLibraryData = [
	{
		"name" : "Markoff",
		"label" : "markoff",
		"comment" : "Do any sequence of mutations and observe Markoff numbers arising as cluster variables all specialised to 1.<br>Associated with a triangulation of a torus.<br>" + NON_LOC_ACYCLIC,
		"matrix" : [
			[0, 2, -2],
			[-2, 0, 2],
			[2, -2, 0]
		]
	}
	,
	{
		"name" : "Somos-4",
		"label" : "somos4",
		"comment" : "Mutate at vertices 1, 2, 3, 4, 1... to observe the <a href='https://oeis.org/A006720'>Somos-4 sequence</a> arising as cluster variables all specialised to 1.<br>This is Example 3.4.3 from <a href='https://arxiv.org/abs/1608.05735'>Introduction to Cluster Algebras</a>.",
		"matrix" : [
			[0, -1, 2, -1],
			[1, 0, -3, 2],
			[-2, 3, 0, -1],
			[1, -2, 1, 0]
		]
	}
	,
	{
		"name" : "Somos-5",
		"label" : "somos5",
		"comment" : "Mutate at vertices 1, 2, 3, 4, 5, 1... to observe the <a href='https://oeis.org/A006721'>Somos-5 sequence</a> arising as cluster variables all specialised to 1.<br>This is Example 3.4.8 from <a href='https://arxiv.org/abs/1608.05735'>Introduction to Cluster Algebras</a>.",
		"matrix" : [
			[0, -1, 1, 1, -1],
			[1, 0, -2, 0, 1],
			[-1, 2, 0, -2, 1],
			[-1, 0, 2, 0, -1],
			[1, -1, -1, 1, 0]
		]
	}
	,
	{
		"name" : "\\(E_6^{(1,1)}\\)",
		"label" : "e611",
		"comment" : EXCEPTIONAL_FIN_MUT_TYPE,
		"matrix" : [
			[0, 1, 0, 0, 0, 0, 0, 0],
			[-1, 0, -1, 1, 0, 0, 0, 0],
			[0, 1, 0, -2, 1, 0, 1, 0],
			[0, -1, 2, 0, -1, 0, -1, 0],
			[0, 0, -1, 1, 0, -1, 0, 0],
			[0, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, -1, 1, 0, 0, 0, -1],
			[0, 0, 0, 0, 0, 0, 1, 0]
		]
	}
	,
	{
		"name" : "\\(E_7^{(1,1)}\\)",
		"label" : "e711",
		"comment" : EXCEPTIONAL_FIN_MUT_TYPE,
		"matrix" : [
			[0, 1, 0, 0, 0, 0, 0, 0, 0],
			[-1, 0, 1, 0, 0, 0, 0, 0, 0],
			[0, -1, 0, -1, 1, 0, 0, 0, 0],
			[0, 0, 1, 0, -2, 1, 1, 0, 0],
			[0, 0, -1, 2, 0, -1, -1, 0, 0],
			[0, 0, 0, -1, 1, 0, 0, 0, 0],
			[0, 0, 0, -1, 1, 0, 0, -1, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, -1],
			[0, 0, 0, 0, 0, 0, 0, 1, 0]
		]
	}
	,
	{
		"name" : "\\(E_8^{(1,1)}\\)",
		"label" : "e811",
		"comment" : EXCEPTIONAL_FIN_MUT_TYPE,
		"matrix" : [
			[0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
			[-1, 0, -1, 1, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, -2, 1, 1, 0, 0, 0, 0],
			[0, -1, 2, 0, -1, -1, 0, 0, 0, 0],
			[0, 0, -1, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, -1, 1, 0, 0, -1, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, -1, 0, 0],
			[0, 0, 0, 0, 0, 0, 1, 0, -1, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, -1],
			[0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
		]
	}
	,
	{
		"name" : "\\(X_6\\)",
		"label" : "x6",
		"comment" : EXCEPTIONAL_FIN_MUT_TYPE,
		"matrix" : [
			[0, 1, -1, 1, -1, -1],
			[-1, 0, 2, 0, 0, 0],
			[1, -2, 0, 0, 0, 0],
			[-1, 0, 0, 0, 2, 0],
			[1, 0, 0, -2, 0, 0],
			[1, 0, 0, 0, 0, 0]
		]
	}
	,
	{
		"name" : "\\(X_7\\)",
		"label" : "x7",
		"comment" : EXCEPTIONAL_FIN_MUT_TYPE + "<br>" + NON_LOC_ACYCLIC,
		"matrix" : [
			[0, 1, -1, 1, -1, 1, -1],
			[-1, 0, 2, 0, 0, 0, 0],
			[1, -2, 0, 0, 0, 0, 0],
			[-1, 0, 0, 0, 2, 0, 0],
			[1, 0, 0, -2, 0, 0, 0],
			[-1, 0, 0, 0, 0, 0, 2],
			[1, 0, 0, 0, 0, -2, 0]
		]
	}
	,
	{
		"name" : "octahedron",
		"label" : "octahedron",
		"comment" : "Associated with the triangulation of a sphere into a tetrahedron.<br>" + NON_LOC_ACYCLIC,
		"matrix" : [
			[0, 1, -1, -1, 0, 1],
			[-1, 0, 1, 1, -1, 0],
			[1, -1, 0, 0, 1, -1],
			[1, -1, 0, 0, 1, -1],
			[0, 1, -1, -1, 0, 1],
			[-1, 0, 1, 1, -1, 0]
		]
	}
];

// menu init
var viewContainer = document.getElementById("page-content-wrapper");
viewContainer.innerHTML = `<div id="sparefeet-menu"style ="padding: 1rem;box-sizing:inherit;"><h1>SparefeetRec</h1><br><input id="sparefeet-referencefile" type="file" accept=".csv" /><br><input type="button" id="sparefeet-start" value="Start"></input></div>${viewContainer.innerHTML}`;

//parse csv data
function csvToArray(str, delimiter = ",") {
	// slice from start of text to the first \n index
	// use split to create an array from string by delimiter
	const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

	// slice from \n index + 1 to the end of the text
	// use split to create an array of each csv value row
	const rows = str.slice(str.indexOf("\n") + 1).split("\n");

	// Map the rows
	// split values from each row into an array
	// use headers.reduce to create an object
	// object properties derived from headers:values
	// the object passed as an element of the array
	const arr = rows.map(function (row) {
		const values = row.split(delimiter);
		const el = headers.reduce(function (object, header, index) {
			object[header] = values[index];
			return object;
		}, {});
		return el;
	});

	// return the array
	return arr;
}

//csv input handler
var csvInput = document.getElementById("sparefeet-referencefile"),
	csv;

csvInput.addEventListener("input", function () {
	let input = csvInput.files[0];
	let reader = new FileReader();

	reader.onload = (e) => {
		csv = csvToArray(e.target.result, ";");
		console.log(csv);
	};

	reader.readAsText(input);
});

//
document.getElementById("sparefeet-start").addEventListener("click", function () {
	if (!csv) {
		throw new Error("csv file not selected.");
	}

	console.log(csv);

	let entries = document.getElementsByClassName("cpa-item");
	for (let entry of entries) {
		let dataId = entry.attributes["data-id"].nodeValue;

		let customerData = document.getElementById(`customer-info-${dataId}`).innerText.split("\n");

		for (let line of csv) {
			let phoneRegex = line.phone.replace(`(`, `\(`),
				phoneRegex = phoneRegex.replace(`)`, `\)`),
				phoneRegex = phoneRegex.replace(" ", " *");

			let matchingData = customerData.find((string) => {
				if (line.email === string || line.fullName === string) {
					return true;
				}

				if (string.search(phoneRegex) !== -1) {
					return true;
				}
			});

			if (matchingData.length !== 0) {
				console.log(matchingData);
				break;
			}
		}
	}
});

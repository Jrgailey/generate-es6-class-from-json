const fs = require("fs");
const _ = require("lodash");
const commandLineArgs = require('command-line-args');
const dir = 'generatedClasses'
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const optionDefinitions = [
  { name: 'source-file', alias: 's', type: String },
  { name: 'class-name', alias: 'n', type: String }
];

const options = commandLineArgs(optionDefinitions)

const src = options['source-file'];
const className = options['class-name'];
const dest = dir+'/' + className + '.js';

//const jsonFile = JSON.parse(require('fs').readFileSync('src/' + src+'.json', 'utf8'));


const jsonFile = require('./src/' + src+'.json');
let props = "",
propDocs = "", 
constDoc;

function populateProps(obj, originalMapping) {
	Object.keys(obj).forEach(function(key) {
	let srcKey = originalMapping ? originalMapping+'.'+key : key;
	if(_.isObject(obj[key])) {
		populateProps(obj[key], srcKey);
	 } else {
		let type = typeof key;
		props += '\n \t this.'+key + ' = data.' + srcKey+ ';';
		propDocs += '\n   *  {' + _.capitalize(type) + '} ' + key + ' - ';
		}
	});
}

populateProps(jsonFile);
constDoc = 
`
/**
   * @name constructor
   * @description - Constructs a ${className} object based on the data passed in containing the following:
   ${propDocs}
   * @param {Object} data - The passed in data from services
   */
`

let content = 
`Class ${className} {
	${constDoc}
	constructor(data) {
`

content += 
`${props}

}

export { ${className} };`

fs.writeFile(dest, content, function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {
       console.log("Successful Write to " + dest);
     }
});
const fs = require("fs");
const _ = require("lodash");
const commandLineArgs = require('command-line-args');
const dir = 'generatedClasses'
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const optionDefinitions = [
  { name: 'source-file', alias: 's', type: String },
  { name: 'class-name', alias: 'n', type: String },
  { name: 'add-semicolon', alias: 'c', type: Boolean}
];

const options = commandLineArgs(optionDefinitions)
const src = options['source-file'];
const semiColon = options['add-semicolon'] ? ';' : '';
const className = options['class-name'];
const camelClassName = _.camelCase(options['class-name']);
const dest = dir+'/' + className + '.js';
const testFile = dir+'/' + className + '-test.js';
const jsonFile = require('./sourceJson/' + src+'.json');

let props = "",
propDocs = "",
itStatement = "", 
emptyObjItStatement = "",
constDoc,
testBegin,
testEnd,
importStr = 'import';

function populateTest(key) {
	itStatement += 
	`
    it('should populate the ${key}', () => {
	  expect(${camelClassName}.${key}).to.eql(data.${key})${semiColon}
    })${semiColon}`;
    
    emptyObjItStatement += 
	`
    it('should populate the ${key} as undefined', () => {
	  expect(${camelClassName}.${key}).to.eql(undefined)${semiColon}
    })${semiColon}`;
}

function populateProps(obj, originalMapping) {
	Object.keys(obj).forEach(function(key) {
	let srcKey = originalMapping ? originalMapping+'.'+key : key;
	if(_.isObject(obj[key])) {
		populateProps(obj[key], srcKey);
	 } else {
		let type = typeof key;
		populateTest(srcKey);
		props += '\n \t this.'+srcKey + ' = data.' + srcKey+ semiColon;
		propDocs += '\n   *  {' + _.capitalize(type) + '} ' + key + ' - ';
		}
	});
}

populateProps(jsonFile);

let content = 
`class ${_.upperFirst(className)} {
 /**
   * @name constructor
   * @description - Constructs a ${className} object based on the data passed in containing the following:
   ${propDocs}
   * @param {Object} data - The passed in data from services
   */
	constructor(data = {}) {
`

content += 
`${props}

 }
}
export {${_.upperFirst(className)}}${semiColon}`;

testContent = 
`import {expect} from '../../helper'${semiColon}
import {${_.upperFirst(className)}} from '../../../lib/common/classes/${className}/${className}'${semiColon}
import {${className}Mock} from '../../mocks/${className}Mock'${semiColon}
describe('${_.upperFirst(className)} Class', function () {
  describe('when a ${className} object is created from data', () => {
	const data = ${className}Mock${semiColon}
    let ${camelClassName}${semiColon}
    beforeEach(() => {
      ${camelClassName} = new ${_.upperFirst(className)}(data)${semiColon}
    })${semiColon}
    ${itStatement}
  })${semiColon}
  describe('when a ${className} object is created from nothing', () => {
    let ${camelClassName}${semiColon}
    beforeEach(() => {
      ${camelClassName} = new ${_.upperFirst(className)}()${semiColon}
    })${semiColon}
    ${emptyObjItStatement}
  })${semiColon}
})${semiColon}
`
//write Class.js
fs.writeFile(dest, content, function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {
       console.log("Successful Write to " + dest);
     }
});
//write test.js
fs.writeFile(testFile, testContent, function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {
       console.log("Successful Write to " + testContent);
     }
});
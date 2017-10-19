# Generate ES6 Classes from a JSON file

## Step 1: Get dependencies
1) Have NodeJS installed
2) Run npm install
```javascript
	npm install
```

## Step 2: Add your Json File to the **/sourceJson** folder

## Step 3: Run the program
**This is to be run on NodeJS**
```javascript
	node index.js
```
> 
The command line takes 3 arguments.
1) **--class-name** or **n**: The name that you want the generated class to be called
2) **--source-file** or **-s** : The name of the source file in the *sourceJson* directory
3) **--add-semicolon** or **c**: If you want to end lines with semicolons (default is false)

**IMPORTANT**
Do NOT put the file extension of your json file, just put your file in the 

## Step 4: Profit
 - check our your classes generated in the generatedClasses folder

#### Run this script for a demo, and checkout the files generated
> Example:
>```javascript
> node index.js -s source --class-name superHero


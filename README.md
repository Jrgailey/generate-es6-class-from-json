# Generate ES6 Classes from a JSON file

## Step 1: Get dependencies
1) Have NodeJS installed
2) Run npm install
```javascript
	npm install
```


## Step 2: Run the program
**This is to be run on NodeJS**
```javascript
	node index.js
```
> 
The command line takes 2 arguments.
1) **--class-name** or **c**: The name that you want the generated class to be called
2) **--source-file** or **-s** : The name of the source file in the *sourceJson* directory

> Example:
>```javascript
> node index.js --class-name CustomerHubClass -s test


# table-string

Originally, I was looking for a replacement for `console.table()` because I missed this function in Cloudflare workers.

So table-string is a function originally inspired by `console.table()` but with the following main differences:

* First, it doesn't output anything to the console, but returns a string.
* More importantly its output looks less technical. It is aimed at simplifying the creation of meaningful tables for CLIs. 

## Purpose

We will generate a table for this array:

```
const data = [
  { price: 1.99, fruit: chalk.green("Apples") },
  { price: 3.99, fruit: chalk.red("Strawberries") },
  { price: 0.99, fruit: chalk.bgBlue.yellow("Bananas") },
  { price: 12.99, fruit: chalk.blue.bgWhite("Bilberries") },
],
```

### What you get without tableString
On `node.js` `console.table(data)` produces a table that looks very debug-like:

![console.table output](./images/console.table.png)

### What you might be looking for
The same structure with `tableString(data)` looks much cleaner:
![tableString output](./images/tableString1.png)

### What else `tableSting` can do 
Adding two parameters allows us to finer control over columns and table options: 
![tableString output with options](./images/tableString2.png) 
```
tableString(data,
  [{ price: "Price in $" }, { fruit: "Fruit" }],
  {
    frameChalk: chalk.white.bgBlack(" "),
  }
);
```


## Geared for CLI output, not debugging

While I was looking into it, I realized that the output of `console.table()` looks rather technical. It's more appropriate for developers debugging their code than for users of a CLI that expect informative tables.

### Less technical

I intentionally left out some features of `console.table()` because they give the output a more technical, debugger-like look:  
 * there is no coloring of values based on their JavaScript type
 * there are no quotes around strings or 'm's after BigInts
 * null values and values of type "function" are not rendered
 * for arrays, the index column is only included if explicitly specified
 * the index column has no header by default 
 
### More functionality

The table-string package supports more options compared to `console.table`:
* It provides full control over table headings and alignment.
* It is compatible with ANSI color sequences. For example, you can use the chalk package to color strings without affecting the layout. Even better: padding recognizes background colors and extends them. You can even define a chalk for the frame of the table.   

### Non goals:

Other table packages exist with different goals. The table-string package does not share them all. Here are explicit non-goals 

 *  No support for emojis. As of now, Emojis do not seem to be well supported in monospaced fonts. Emojis tend to break table spacing.
 *  No dynamic effects on TTYs based on repositioning the cursor. The result of the `tableString` function is a simple string that can be printed to a text file. 

## Configuration

`tableString(data, columnOptions, tableOptions)` takes three parameters: 
1. the data to be displayed
2. options that describe odering, headings, and alignment of columns
3. options that define global features of the table like alignment of headings or a chalk for the frame, 

### Column Options

The main purpose of column options is to tell the layout which columns to show and in which order.\
It is also used to specify alignment and heading of columns.
If no column options are given, the table will show all columns available in the underlying data.\
If column options are defined, only the included columns are shown in the table.\
Example: `[ "firstName", "lastName" ]` will show these two columns in that order. Values come from properties with the same name from the single rows of the table.

#### Single Column Option Entry
An entry of the colomnOptions array is a tripple `{ column: "name", heading: "Column Heading", alignment: "..."}`\
All three properties are optional. Two abbreviations are supported:

* The tuple `{ column: "name", heading: "Column Heading" }` can be shortend to `{ name: "Column Heading" }`\ 
* The object `{ name: "name" }` can be shortend to a single string "name".

All forms can be mixed: `[ { prop1: "Column Name" }, "prop2", { column: "prop3", align: "center" } ]` 


##### column

This property selects a single data column of the table.  

##### heading

##### alignment

#### Short Forms

### Table Options

#### alignTableHeadings

#### frameChalk

#### propertyCompareFunction

#### index

# table-string

Originally, I was looking for a replacement for `console.table()` because I missed this function in Cloudflare workers.

So `tableString()` is a function originally inspired by `console.table()` but with the following main differences:

* First, it doesn't output anything to the console, but returns a string.
* More importantly its output looks less technical. It is aimed at simplifying the creation of meaningful tables for CLIs. 

## Purpose

We will generate a table for this array:

```js
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

```js
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
 * there are no quotes around strings or 'm' after BigInts
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
2. options that describe ordering, headings, and alignment of columns
3. options that define global features of the table like alignment of headings or a chalk for the frame, 

Option are typically simple values, or key-value pairs. Sometimes, it is helpful to use [JavaScript functions to calculate option](#using-functions-in-options).   

### Data

Typically, `tableString` is called with an array[^1]. The elements of the array are used to populate the rows of the table. Values that are neither strings, numbers, or objects are ignored. Strings can include ANSI color escapes. If they occur at the start or the end of the string, they are automatically extended when the string has to padded to fill the column width.  

[^1]: You can also pass an object instead of an array, [see the `propertyCompareFunction` table option](#propertycomparefunction)

### Column Options

The main purpose of column options is to tell the layout which columns to show and in which order.
It is also used to specify alignments and headings of columns.

An entry of the columnOptions array defines up to 5 values for a column:
* name
* heading
* width
* align
* alignHeading 
Of these, only the `name` is mandatory.

If no column options are given, the table will show all columns available in the underlying data. 
If column options are defined, only the included columns are shown in the table.

Example: `[ {name: "firstName" }, {name: "lastName" } ]`[^2] will show these two columns in that order. 
Values are taken from properties with the same name (from the objects that form the rows of the table).

[^2]: Or shorter: `[ "firstName", "lastName" ]`, [see shortened notation](#shortened-notation) 


##### name

The `name` selects a single data column of the table. It is the name of that column. Possible values are the property names (keys) of the objects given as table data. This includes '0', '1', ... if the values in the data object are arrays. In addition, two special column names may exist: 

* `"Values"` is the name of the column of primitive values. If the data object for the table is an array, that column holds all strings and numbers that are direct elements of that array. 
* `""` is the name of the index column. Other than with `console.table()`, this column is not included by default. To add an index column, you need to specify the values for the index column explicitly [using the `index` table option](#index).  

##### heading

Sets the heading of the column. If not given, the column name is used as the heading. 

##### width

The width of a column is derived from the heading and the widest values. The `width` option can be used to explicitly set a minimum width for the column. Actually, the `width` can not be used to truncate content.  

##### align

Sets the alignment for the values of the column. Possible values are `left`, `center`, and `right`. The default is `left` for most values. If no alignment is  set for the column, number values will be right aligned by default. This does also affect how the heading of the column is aligned. If you want a different alignment for the columns heading, use the [`alignHeading` column option](#alignHeading). By default, table headings are all center aligned. This can globally changed using the [`alignTableHeadings` table option](#aligntableheadings).

##### alignHeading

If the [`align` column option](#align) is defined, this also aligns the heading. The `alignHeading` option allows for a different alignment for the heading. Possible values are `left`, `center`, and `right`. 
The default is `center`, if not overridden with the [`alignTableHeadings` table option](#aligntableheadings).

#### Shortened Notation

Often, you do not need to specify both, alignment and heading, for a column. For these cases, two abbreviations are supported:

* The tuple `{ column: "name", heading: "Column Heading" }` can be shortened to `{ name: "Column Heading" }`\ 
* The object `{ column: "name" }` can be shortened to a single string "name".

All forms can be mixed: `[ { prop1: "Column Name" }, "prop2", { column: "prop3", align: "center" } ]` 

### Table Options

While column options address single columns, there are a few options that affect the complete table: 
* alignTableHeadings 
* frameChalk
* propertyCompareFunction
* index

#### alignTableHeadings

This is used to override the "center" default alignment of column heading. `align` and `alignHeading` values for individual columns have precedence over this option.

#### frameChalk

Want an alternative color for the frame of the table? Simply define a string value with opening and closing ansi color escapes. 
As an example: `{ frameChalk: "\x1B[37m\x1B[40m \x1B[49m\x1B[39m"}`

#### propertyCompareFunction

Typically, the data object for `tableString()` is an array. But you can also pass an object. The properties of this object are then used to form the rows of the table. If the order of the rows matters to you, you can specify a comparison function to sort them. Default is to order the properties alphabetically. If you do not want to sort, specify: `propertyCompareFunction: null`.  

#### index

To add an index column, define values for that column. This can be something like `index: ["A", "B", "C"]` or `index: [...data.keys()]`. The column is named `""` and its heading is `""`, too. You can change heading and alignment with a column option for `""`: `{ column: "", heading: "(index)", align: "right" }`.

### Using Functions in Options

The examples for [the `index` table option](#index) also included an example of a computed option value: `[...data.keys()]` computes an index from the data array. There are other examples, where using functions for option values greatly simplifies configuration and enhances readability. 

For example, [the `frameChalk` table option](#framechalk) might also be set using the chalk package like this: `{ frameChalk: chalk.red.bgBlue("x") }`. Here the string itself is not important, but it should have a non-zero length. Otherwise chalk optimizes the colors away.   

Or you just want the columns to show up in alphabetical order: \
`tableString(data = [{ z: 3, y: 4, x:2 }]), [...Object.keys(data[0])].sort())` renders as
![sorted columns](./images/sorted.png)
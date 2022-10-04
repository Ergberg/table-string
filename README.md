# table-string

A package to generate tables on TTYs.

![colorful table](images/appetizer.png)

`tableString()` is a function originally inspired by `console.table()` but with the following main differences:

* First, it doesn't output anything to the console directly, but returns a string that can be used in different ways.
* More importantly, its output looks less technical. It aims to simplify the creation of meaningful tables for CLIs. 

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

### What else `tableString` can do 
By adding two parameters we can control the columns and table options: 
![tableString output with options](./images/tableString2.png) 

```js
tableString(data,
  [{ price: "Price in $" }, { fruit: "Fruit" }],
  {
    tableChalk: chalk.bgHex("#ddddbb").black(" "),
    headerChalk: chalk.bgHex("#0088cc").black(" "),
    headerFrameChalk: chalk.bgHex("#004466").white(" "),
  }
);
```


## Geared for CLI output, not debugging

As I was looking into this, I noticed that the output of `console.table()` looks pretty technical. It's more appropriate for developers debugging their code than for users of a CLI expecting informative tables.

### Less technical

I've intentionally omitted some functions from `console.table()` because they give the output a more technical, debugger-like look:  
 * there is no coloring of values based on their JavaScript type
 * there are no quotes around strings or 'm' after bigints
 * null values and values of type "function" are not rendered
 * for arrays, the index column is included only if explicitly specified
 * the index column has no header by default 
 
### More functionality

The table-string package supports more options compared to `console.table`:
* It provides full control over table headings and alignment.
* It is compatible with ANSI color sequences. For example, you can use the chalk package to colorize strings without affecting the layout. Even better, padding recognizes background colors and extends them. You can even define a chalk for the table's border.   

### Non-goals:

There are other table packages with different targets. The table-string package does not share them all. Here are explicit non-goals 

 *  No support for emojis. Currently, emojis do not seem to be well supported in monospace fonts. Emojis tend to break table spacing.
 *  No dynamic effects on TTYs based on cursor repositioning. The result of the `tableString` function is a simple string that can be printed to a text file. 

## Usage

### tableString

`tableString` generates a multiline string that renders as a table when printed to a tty. The `data` for the table is typically provided as an array of objects. The properties of those objects define the columns of the table, the array entries are the rows. The look of the table can be controlled by additional option parameters:

`tableString(data, columnOptions, tableOptions)` takes three parameters: 
1. [The data](#data) to be displayed
2. [Column Options](#column-options) describing the order, headings and alignment of the columns
3. [Table Options](#table-options) that specify global characteristics of the table, such as alignment of headings or a chalk for the border.

The options are typically simple values or key-value pairs. But sometimes it is also helpful to use [JavaScript functions to compute option](#using-functions-in-options).   

### Flatten

The `flatten` function can turn [multiline string values](#flatten-multiline-strings) into multiple rows and [nested objects](#flatten-nested-objects) into additional columns. 

#### Flatten multiline strings

Newlines in your data will break the output of tableString. Multiple lines of text in a table cell are not supported. But it is possible to substitute multiline strings with multiple rows. The `flatten` function will do that for you:

```js
flatten([{a:"one line", b: "two\nlines"}]) == [{a:"one line", b:"two"}, {a:"", b:"lines"}]
```

Printing `tableString(flatten([{a:"one line", b: "two\nlines"}]))` will look like this:

![flatten](/images/flatten1.png)

With `flatten`, it is also possible to use `tableString` results as values in `tableString` tables 😏

![flatten](/images/flatten2.png)

The `flatten` function provides no special treatment for ANSI color escapes. There are no mechanisms to continue open color settings across tables rows. It is recommended to close/reset all color codes before newlines.  

#### Flatten nested objects

The `flatten` function has an optional second parameter. It is called `objectDepth`. Its default value is `0`.
Setting `objectDepth` to `1` will replace all objects that `tableString` would show as `[object Object]` with columns holding the values of their properties. Of course those property values might again show as `[object Object]` Setting `objectDepth` to higher values will also replace those with their properties. To replace objects at any depth set `objectDepth` to `Infinity`. The names of the added columns are formed by chaining the names of the nested objects. It is an error if such a column name already exists. If an object's `toString()` returns a string different from `[object Object]` this result is used to show the object and the object is not turned into columns.
  
Example:
```js 
flatten([{ a: { b: "c" } }]) === [{ a: { b: "c" } }] // objectDepth not specified
flatten([{ a: { b: "c" } }], 1) === [{ "a.b": "c" }] // nested object's property is replaced by a new column
flatten([{ a: { b: { c: "d" } } }], 1) === [{ "a.b": { c: "d" } }] // only outer object is replaced with objectDepth === 1
flatten([{ a: { b: { c: "d" } } }], 2) === [{ "a.b.c": "d" }] // also inner object is replaced with objectDepth === 2
flatten([{ a: { b: "c" }, "a.b": "exists" }], 1) // Error: Flattening object at depth 1: property "a.b" already exists

tableString(flatten([{host:}])
```

### frame.characters

By default, the border of the table and the lines are 'drawn' with graphical single line characters: '┌', '─', '┐' ...\
You can change this by assigning to `frame.characters`. Predefined values are:
```js
frame.characters = default.characters // '┌', '─', '┐' ...
frame.characters = double.characters  // '╔', '═', '╗' ...
frame.characters = ascii.characters   // '.', '-', '.' ...
frame.characters = stars.characters   // '*', '*', '*' ...
```
To define your characters, assign your own object to `frame.characters` 
```js
frame.characters = {
  topRow: "┌─┬┐",
  normal: "│ ││",
  h_line: "├─┼┤",
  bottom: "└─┴┘",
};
```

## Configuration

### Data

In general, `tableString` is called with an array[^1]. The elements of the array are used to populate the rows of the table. Values that are not strings, numbers, or objects are ignored. Strings can contain ANSI color escapes. If they occur at the beginning or the end of the string, they will be automatically extended if the string needs to be padded to fill the column width.  

If the array contains primitive values, they are displayed in a column called "Values". This is true for strings, booleans, numbers and bigints.  The other primitives, i.e. symbol, null and undefined, are ignored. Non primitive values are objects. These objects have properties. Each property defines a column of the table and the property value of an row's object is the value in the column for that row. Columns values should be primitive values. More complex values are likely show as `"[object Object]"`. If they define a `toString()` function, the result of the `toString()` function will be used to show the object. **String values with newlines break the table layout**. To use multiline strings as values, first [`flatten` the table](#flatten). The [`flatten` function](#flatten) can also be used to replace objects that show as `"[object Object]"` with columns of their attributes.

There is one special property called "**`ts:horizontalLine`**". If the "`ts:horizontalLine`" property is defined in the object for a row, e.g. `{ .... "ts:horizontalLine": true}`, an horizontal line is drawn after that row. 

  



[^1]: You can also pass an object instead of an array, [see the table option `propertyCompareFunction`](#propertycomparefunction).

### Column Options

The main purpose of column options is to tell the layout which columns to show and in what order.
They are also used to specify alignments and headings of columns.

An entry of the columnOptions array defines up to 5 values for a column:
* name
* heading
* minWidth, maxWidth, width
* padding
* align
* alignHeading 
Of these values, only the `name` is mandatory.

If no column options are specified, the table shows all columns available in the underlying data. 
If column options are defined, only those columns are shown in the table.

Example: `[ {name: "firstName" }, {name: "lastName" } ]`[^2] will show these two columns in that order. 
The values are taken from the properties of the same name (from the objects that form the rows of the table).

[^2]: Or shorter: `[ "firstName", "lastName" ]`, [see shortened notation](#shortened-notation) 


##### name

A string. The `name` selects a single data column of the table. It is the name of this column. Possible values are the property names (keys) of the objects specified as table data. These include '0', '1', ... if the values in the data object are arrays. In addition, two special column names may exist: 

* `"Values"` is the name of the column of primitive values. If the data object for the table is an array, this column contains all strings and numbers that are direct elements of this array. 
* `""` is the name of the index column. Unlike `console.table()`, this column is not included by default. To add an index column, you must explicitly specify the values for the index column [using the `index` table option](#index).  

##### heading

A string. Sets the heading of the column. If not specified, the column name is used as the heading. 

##### minWidth

A positive integer. The minimal width of a column is derived from the heading and the widest values. The `width` option can be used to explicitly set a minimum width for the column.   


##### maxWidth

A positive integer. If set, truncates too long output in this column to _n_ characters. It is an error to set `maxWidth` < `minWidth`. 

##### width

A positive integer. Can be used as an abbreviation for setting `minWidth` and `maxWidth` to the same value.    

##### padding 

A positive integer. Adds spaces to the left and to the right of a value in a column. Default is 1 space.

##### align

Possible values are `left`, `center`, and `right`. Sets the alignment for the values of the column.  The default is `left` for most values. If no alignment is specified for the column, number values will be right aligned by default. This also affects how the heading of the column is aligned. If you want a different alignment for the column heading, use the [`alignHeading` column option](#alignheading). By default, column headings are all center aligned. This can  be changed globally with the [`alignTableHeadings` table option](#aligntableheadings).

##### alignHeading

Possible values are `left`, `center`, and `right`. If the [`align` column option](#align) is defined, this will also align the heading. The option `alignHeading` allows a different alignment of the heading. 
The default is `center` if not overridden by the [table option `alignTableHeadings`](#aligntableheadings).

#### Shortened Notation

Often, you do not need to specify all options for a column. For these cases, two abbreviations are supported:

* The tuple `{ column: "name", heading: "Column Heading" }` can be abbreviated to `{ name: "Column Heading" }`\ 
* The `{ name: "prop2" }` object can be abbreviated to a single string "prop2".

All forms can be mixed: `[ { prop1: "Column Name" }, "prop2", { name: "prop3", align: "center" } ]` 

### Table Options

While column options refer to individual columns, there are a few options that affect the entire table: 
* alignTableHeadings 
* frameChalk, headerChalk, alternativeChalk
* propertyCompareFunction
* index

#### alignTableHeadings

Possible values are `left`, `center`, and `right`. This overrides the default "center" alignment of column headings. The `align` and `alignHeading` values for individual columns take precedence over this option.

#### frameChalk

A string. Want an alternative color for the table's border? Just define a string value with opening and closing ANSI color escapes. 
As an example: `{ frameChalk: "\x1B[37m\x1B[40m \x1B[49m\x1B[39m"}`

#### headerChalk

Specific setting for the header rows. Default is frameChalk.

#### alternativeChalk

Alternative chalk for every second table row. Default is frameChalk.

#### propertyCompareFunction

A function. Normally, the data object for `tableString()` is an array. However, you can also pass an object. The properties of this object are then used to form the rows of the table. If the order of the rows is important to you, you can specify a comparison function to sort them. By default, the properties ar sorted alphabetically. If you do not want  sorting, specify: `propertyCompareFunction: null`.  

#### index

An array of values. To add an index column, define values for that column. This can look like this: `index: ["A", "B", "C"]` or `index: [...data.keys()]`. The column is named `""` (the empty string) and its heading is also `""`. You can change heading and alignment with a column option for `""`: `{ name: "", heading: "(index)", align: "right" }`.

### Using Functions in Options

The examples for [the `index` table option](#index) also include an example for a computed option value: `[...data.keys()]` computes an index from the data array. There are other examples where using functions for option values greatly simplifies configuration and improves readability. 

For example, [the table option `frameChalk`](#framechalk) could also be set with the chalk package as follows: `{ frameChalk: chalk.red.bgBlue("x") }`. Here the string itself is not important, but it should have a non-zero length. Otherwise, chalk optimizes the colors away.   

As another example, if you just want the columns to show up in alphabetical order: \
`tableString(data = [{ z: 3, y: 4, x:2 }]), [...Object.keys(data[0])].sort())` renders as
![sorted columns](./images/sorted.png)


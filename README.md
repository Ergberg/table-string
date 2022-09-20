# table-string

Originally, I was looking for a replacement for `console.table()` because I missed this function in Cloudflare workers.

So table-string is a function originally inspired by `console.table()` but with the following main differences:

* First, it doesn't output anything to the console, but returns a string.
* More importantly its output looks less technical. It is aimed at simplifying the creation of meaningful tables for CLIs. 

## Example

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

### Column Options

#### Properties

##### column

##### heading

##### alignment

#### Short Forms

### Table Options

#### alignTableHeadings

#### frameChalk

#### propertyCompareFunction

#### index
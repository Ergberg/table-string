# table-string

Initially, I was looking for a substitute for `console.table()` because I missed that function in Cloudflare workers.


So table-string is a function initially inspired by console.table but with the following main differences:

* First of all, it does not print anything to the console but returns a string.

## Targeted towards CLI output, not debugging

While I was on it, I realized that the output of `console.table()` looks rather technical. It is more suitable for developers debugging their code than for users of a CLI that expect informative tables.

### Less technical

I deliberately did not mirror some features of `console.table()`, because they give the output a rathe technical, debuggy look:  
 * there is no coloring of values based on their JavaScript type
 * it does not print quotes around strings or 'm's after BigInts
 * it does not show values that are of type "function"
 * for arrays, the index column is only shown if explicitly provided
 * the index column has no header by default 
 * null values are not shown

 ### More functional

 * It provides full control over table headings and alignment.
 * It is compatible with ANSI color sequences. For example, you can use the chalk package to color strings and it wont harm the layout.

 ## Examples
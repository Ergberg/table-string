# console-table

The function `console.table` is not defined on Cloudflare workers. This is a simplified substitute.

Usage: `console.log(table(array))`

The function supports a single argument. This is the data for the table. Actually, only arrays of objects are supported.

<div style="font-family: monospace; font-size:0.8rem!important; line-height:0.8rem!important; margin-top:2em; padding:1em; overflow-x:auto; overflow-y:hidden"><pre>

┌────┬─────────────┬─────────────────────────────┬─────────┐
│ #  │ branch      │ as of                       │ rule    │
├────┼─────────────┼─────────────────────────────┼─────────┤
│ 1. │ main        │ 2022-09-11T17:05:13.438212Z │         │
├────┼─────────────┼─────────────────────────────┼─────────┤
│ 2. │ development │ 2022-09-09T15:46:44.851433Z │         │
├────┼─────────────┼─────────────────────────────┼─────────┤
│ 3. │ main        │ 2022-09-08T22:19:05.490083Z │ prod    │
├────┼─────────────┼─────────────────────────────┼─────────┤
│ 4. │ alpha       │ 2022-06-25T22:39:00.508816Z │ default │
└────┴─────────────┴─────────────────────────────┴─────────┘
</pre></div>

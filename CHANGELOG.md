# Changelog

When|Version|What
---|---|---
2022-10-04 | v2.0.0 | **Incompatible changes**: 
&nbsp;||- "&lt;hr>" was renamed to "ts:horizontalLine"
&nbsp;||- renamed properties for table level chalks
&nbsp;||**New functionality**
&nbsp;||- flatten can handle nested objects and arrays when called with >0 objectDepth argument 
&nbsp;||- More chalk options on table level
&nbsp;||- Chalks for single rows and columns
2022-09-26 | v1.2.0 | A horizontal line is added behind rows that contain a "&lt;hr>" property.
&nbsp;||Use multiline strings as table values with the new `flatten` function. This also allows for `tableString` generated tables as values in tables.
&nbsp;||Bugfix padding centered values.
2022-09-25 | v1.1.0  | New column options `minWidth` & `maxWidth`. `maxWidth` now also allows for truncation of wide values.
&nbsp;||New column option for padding and more table options for chalks.
2022-09-21 | v1.0.1 | First patch. No change in content or functionality. Better metadata in package.json for NPM. 
2022-09-21|v1.0.0|Initial Release

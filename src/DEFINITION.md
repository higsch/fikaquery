# File format definition

## General
* read only
* each top layer object represents a protein or a peptide

## Global structure
The whole thing should be a valid JSON string.

1. **__** object, which defines the **__index** position.
2. **__index**, which defines the underlying object positions
   for queries.
3. the actual objects

## File reading strategy
1. Read **__** object, which defines a string.
   This string separated two numbers with the @ sign.
   The first number defines the start of the **__index** object,
   the second one is the length, respectively.
2. Read the **__index** object, which defines the byte positions of
   the toplayer and underlying objects. This index is going to be stored
   in memory.
3. In case of requested protein/peptide access:
   1. Look up byte coordinates of protein/peptide object
   2. Read in object.

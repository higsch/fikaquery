# File format definition

## General
* the file format is simply json
* data is stored in a toplayer object array
* each object represents a protein
* sublevels comprise ID and quant data as well as melting and other meta data, also on peptide level

## Global structure
1. byte definition of contents table  
   this section has a fixed size, e.g. 100 bytes
2. contents table  
   defines the byte coordinates of each protein object (== index)
3. the object (proteins) array

## File reading strategy
1. read byte definition for contents table
2. read contents table, store in memory
3. in case of requested protein access:
   1. Look up byte coordinates of protein object
   2. Read in object and pass it back or feed it in callback function

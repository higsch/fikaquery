# 🔎 fikaQuery

![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=102)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=102)](https://opensource.org/licenses/mit-license.php)

**Load local SQLite databases into your browser.**

*Note: fikaQuery is still under heavy development (especially*
*the query engine, which is not working right now),*
*but do not hesitate to open issues!*


## 🧐 What it is
fikaQuery is a JavaScript adaptor to efficiently load and query
sqlite databases using the HTML5/JavaScript `FileReader` API.
This makes it possible to access very large sqlite
databases within the browser –– without loading the whole
file into memory.


## ☎️ How to connect to a SQLite database
Right now there is no official build or release. Please clone
this repo
```{bash}
git clone https://github.com/mtstahl/fikaquery.git
```
and take all the files from `src`, including `fikaquery.js`, the
entry point. To serve your site, you have to use webpack or
something similar. Or you build your page with our
[test app](https://github.com/mtstahl/fikaquery/tree/master/test-vue)
as a base.

fikaQuery has zero dependencies, you can just include it to your
JavaScript code like so.
```{JavaScript}
import fikaquery from 'path/to/fikaquery';
```
Of course, you need a file input field in your `html`. Again, have a look
into our Vue-based [test app](https://github.com/mtstahl/fikaquery/tree/master/test-vue).
If you have chosen a file, you can create a new fikaquery instance
in your JavaScript that will represent your SQLite database.
```{JavaScript}
fileInputElement.onchange = function(event) {
   const file = inputElement.files[0];
   const db = fikaquery.connect(FileReader, file);
}
```
As you can see, you also have to hand over the `FileReader` class.
This is going to be used by the fikaQuery machinery to
access the SQLite file.

We recommend you to use an asynchronous call to initially connect
to the database. With the nice JavaScript syntax, we can
modify the call above.
```{JavaScript}
const db = await fikaquery.connect(FileReader, file);
```
Please note that such a call has to be located in a function
assigned with the `async` modifier. For example, in a Vue app,
you simply add a watcher for the `file` value.
```{Vue}
watch: {
  async file() {
    this.db = await fikaquery.connect(FileReader, this.file);
  }
}
```
If you like the previous JavaScript `Promise` syntax, then you can
also use the callback version.
```{Vue}
watch: {
  file() {
    fikaquery.connect(FileReader, this.file)
      .then((db) => {
        this.db = db;
      });
  }
}
```

The `db` object now holds the database connection and provides
all the functionalities to query the database.

If you cannot wait for your first query, you can just get all
the tables and indices of your SQLite database.
```{JavaScript}
const tables = db.master.tables;
const indices = db.master.indices;
```
The objects hold an array of `table` or `index` elements. They come
with properties such as `name`, `tblName`, `cols` and a lot more.
`tables` and `indices` together represent the `sqlite_master` table
of your database.


## 🗣 How to query
fikaQuery does not support SQL as it would be an overkill for
a read-only database parser and I didn't want to write a full
query planner/executer. Instead, it has an object-based query
processor that you get from the root `db` object.

### Retrieve a table
Just a few examples (will work in future).
```{JavaScript}
// get a full table as JSON
const proteins = (await db.query.table('proteins').json();

// get selected rows of a table
// only one where clause supported
const millenium_proteins = db.query.table('proteins', {
  where: {
    length: 1000
  }
})).json();

// get the first (arbitrary) 100 rows of a table
const first_proteins = (await db.query.table('proteins', {limit: 100})).json();
```

The `table` object is your helper in retrieving table data.
Together with the table name, you can hand over an options object.

### The options object
An options example.
```{JavaScript}
// a table only containing selected proteins with their name and sequence,
// sorted by name, descending
const few_proteins = (await db.query.table('proteins', {
  where: {
    name: 'CLP[XP]'
  },
  cols: ['name', 'sequence'],
  sort: ['name', 'DESC']
})).json();
```

### Type modifiers
As you have seen in the previous examples, you can determine the output
type. For instance, by appending the `.json()` method to your query,
you get a handy JSON, which you can feed in D3 applications.

If you omit the modifier, you get a `table` object, which is used by
fikaQuery internally.

You can also add another options object to the modifier to shape your
output.
```{JavaScript}
// get a row-based JSON of the proteins table
const proteins = (await db.query.table('proteins')).json({
  base: 'rows'
});
```


## 👩🏼‍💻 Limitations and todo list
* [ ] implement query engine
* [ ] cell overflow support
* [ ] mirror relations between tables, JOIN functionality
* [ ] parse WITHOUT ROWID tables

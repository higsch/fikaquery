# 🔎 fikaQuery

**Load local SQLite databases into your browser.**

*Note: fikaQuery is still under heavy development, but do not hesitate to open issues!*

##❔ What it is
fikaQuery is a JavaScript adaptor to efficiently load and query
sqlite databases using the HTML5/JavaScript `FileReader` API.
This makes it possible to access very large sqlite
databases within the browser.

## ☎️ How to connect to a SQLite database
fikaQuery has zero dependencies, you can just include it to your
JavaScript code like so.
```{JavaScript}
import fikaquery from 'path/to/fikaquery';
```
Of course, you need a file input field in your `html`. Have a look
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
The `db` object now holds the database connection and provides
all the functionalities to query the database.


## 🗣 How to query

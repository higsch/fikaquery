# fikaQuery loader

This Vue-based app is a tester instance for fikaQuery.
Have a look into the
[`FikaContent.vue`](https://github.com/mtstahl/fikaquery/blob/master/test-vue/src/components/FikaContent.vue)
component. (I know, one could split all this in separate components...) Here,
you can see how fikaQuery can be implemented. Of course, it also
works with Vanilla JavaScript.


If you haven't install `npm`, now is the [right time](https://www.npmjs.com).
Then start right away.

```{bash}
git clone https://github.com/mtstahl/fikaquery.git
cd fikaquery/test-vue
npm install
npm run serve
```

Goto your favorit browser and open the `localhost` address shown
in the terminal. Click on *browse* and select a SQLite database.
If everything works, you will get a number of cards showing
database information.

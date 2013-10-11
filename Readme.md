## Requirements
Flipside's new website uses some new technologies.
You will need:

- Npm
- compass & sass
- Grunt ( $ npm install -g grunt-cli )
- jekyll ( $ gem install jekyll )

After these basic requirements just run:
```
$ npm install
```

## Running
To render the website two commands must be ran on separate terminals.

Compiles the compass files, javascripts and generates the website.
The system will watch files and execute tasks whenever one of them changes.
```
$ grunt watch
```

Spans a jekyll server to view the website (localhost:4000);
```
$ grunt jekyll:server
```

### Other commands:
Clean compiled sass, javascript, and _\site
```
$ grunt clean
```

Compiles the compass files, javascripts and generates the website.
```
$ grunt
```

Compiles the compass files and javascripts prepared for production. (minified, uglyfied.)
```
$ grunt prod
```
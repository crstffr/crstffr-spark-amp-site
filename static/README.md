# frontend-scaffold

Grunt + Bower scaffold for a frontend app


-----

#### Make sure Node, NPM, and Grunt are installed

`npm install -g grunt-cli`

-----

#### Checkout the scaffold and install project dependencies

`git clone https://github.com/crstffr/frontend-scaffold.git .` 

`npm install` Installs all Grunt plugins

`bower install` Installs all JS dependencies

`grunt bower:install` Copies all JS dependencies to project

#### Start a Preview Server ####

`grunt watch` Starts the livereload server

`grunt preview` Builds a preview version of the site

`grunt server:preview` Starts a connect server for dev preview with livereload at `http://localhost:9090/`

At this point, changes made to source HTML, CSS, and JS files should trigger the preview site to automatically reload.

#### Compile for Distribution ####

`grunt dist` Builds a distribution version of the site

`grunt server:dist` Starts a connect server for review at `http://localhost:9091/`

Win!

-----

#### Other commands for future reference

`npm install grunt-contrib-pluginname --save-dev` Installs Grunt plugin and updates package.json

`bower install pluginname#1.0.0` Installs new JS library in bower_components

`grunt bower:install` Copies bower_components to /source/assets/js/vendor

`bower uninstall pluginname` Removes bower component from project

`npm uninstall grunt-contrib-pluginname --save-dev` Removes grunt plugin from project and package.json

-----

#### Files that need attention

`Gruntfile.js` This is what defines all the actions when running `grunt`

`bower.json` This defines all the javascript dependency packages - automatically updates with `bower install`

`package.json` This defines all the node dependency packages - automatically updates with `npm install --save-dev`





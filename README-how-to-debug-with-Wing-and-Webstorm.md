# How to debug with Wing & Webstorm

In order to deploy on Heroku, I refactored things into a Flask application.

This required me to templatize index.html, but did not have to change the javascript code.

So, I can still debug and develop the javascript with Webstorm, as follows.



## Start application from Wing

Just start places.py from Wing as usual, so it is running on http://127.0.0.1:5000/

Confirm it is running by opening it up in the browser at 127.0.0.1:5000 



## Create new project in Webstorm

- Start webstorm as usual, from command line: $ webstorm 
- Create a new project, as usual, by:
  -  File -> New project
  - Select the folder: .../FullstackND-Places
  - Webstorm will detect it is not empty and ask to create a project from existing files --> say YES





## Configure Javascript debugger in Webstorm

See:

[https://www.jetbrains.com/help/webstorm/debugging-javascript-on-an-external-server-with-mappings.html](https://www.jetbrains.com/help/webstorm/debugging-javascript-on-an-external-server-with-mappings.html)

- Run --> Edit Configurations

- Click on +, and select JavaScript Debug:

  - Name: LocalFromFlask            *(choose anything you like)*
  - URL: http://127.0.0.1:5000      *(the URL where the application is served through flask)*
  - OK

- Select 'LocalFromFlask' in the configuration dropdown, and start the debbuger.

  - The browser now will say: 'JetBrains IDE Support' is debugging this browser

  

That's it, now you can set breakpoints in the javascript file and debug/develop as usual with WebStorm



## Updating index.html

We no longer use static/index.html, but templates/index.html

Just edit **templates/index.html** in WebStorm.

When saving, you need to restart in Flask, unless you add it to the autostart feature of Wing.


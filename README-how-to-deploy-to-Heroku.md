# How I deployed it to Heroku

Heroku is an environment to deploy dynamic apps, so in order to be able to deploy the static application, I wrapped it in a basic Flask application, as follows:

**Step 0. When working in a separate branch, called "heroku"**

```bash
$ git checkout -b heroku
```



**Step 1. Make sure python3-pip and python3-env are installed**

```bash
$ sudo apt install python3-pip
$ sudo apt-get install python3-venv
```



**Step 2. Prepare a python3 virtual environment with Flask & gunicorn** 

```bash
$ cd FullstackND-Places
$ python3.6 -m venv venv
$ source venv/bin/activate
(venv)
(venv) $ pip install --upgrade pip
(venv) $ pip install flask
(venv) $ pip install gunicorn
(venv) $ pip freeze > requirements.txt

```



**Step 3. Write a python file that serves the application** 

File: FullstackND-Places/places.py

```python
"""Serves the application"""
import os
from flask import render_template

from flask import Flask

app = Flask(__name__)


@app.route('/')
@app.route('/index/')
def root():
    return render_template('index.html')
```



**Step 4. create templates/index.html** 

Copy the file static/index.html into templates/index.html, and templatize it, so Flask can serve it up.

File: FullstackND-Places/templates/index.html

*(Showing only the modified lines)*

```html
.
        <link href="{{ url_for('static', filename='bootstrap/css/bootstrap.css') }}" rel="stylesheet">
        <!-- Custom styles for this HTML -->
        <link href="{{ url_for('static', filename='css/style.css') }}" rel="stylesheet">
.
.
        <script src="{{ url_for('static', filename='assets/js/jquery.min.js') }}"></script>
        <script src="{{ url_for('static', filename='assets/js/assets/js/popper.js') }}"></script>
        <script src="{{ url_for('static', filename='bootstrap/js/bootstrap.min.js') }}"></script>
.
        <script src="{{ url_for('static', filename='assets/js/ie10-viewport-bug-workaround.js') }}"></script>
        <script src="{{ url_for('static', filename='assets/js/knockout-3.2.0.js') }}"></script>
        <script src="{{ url_for('static', filename='assets/js/knockout-projections.js') }}"></script>

        <script src="{{ url_for('static', filename='js/script.js') }}"></script>
```

NOTE: It is not ideal that I had to copy the index.html, so now I have two copies to maintain....



**Step 5. Create Procfile**

Heroku uses a file named **Procfile** to start the application.

File: FullstackND-Places/Procfile

```
web: gunicorn places:app
```



**Step 6. Deploy**

This is all that is needed, to deploy it to Heroku:

- In the Heroku website, define a new app. I called it **knockout-neighborhood**

- Then, follow the steps to deploy via Heroku Git CLI, as explained [here](https://devcenter.heroku.com/articles/git):

  ```bash
  $ heroku login
  
  $ heroku git:remote -a knockout-neighborhood
  
  # When working locally in branch: heroku
  # Need to push into master of remote, else it will not be deployed.
  # This commands pushes from local heroku branch into master branch of remote repository at heroku
  $ git push heroku heroku:master
  
  # When working locally in master branch
  $ git push heroku master
  
  ```



**Step 7. Access the application via the browser**

The application is now accessible at: [https://knockout-neighborhood.herokuapp.com](https://knockout-neighborhood.herokuapp.com)

You can view the log files at: [https://dashboard.heroku.com/apps/knockout-neighborhood/logs](https://dashboard.heroku.com/apps/knockout-neighborhood/logs)




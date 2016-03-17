from flask import Flask, request, send_from_directory, render_template
import json
from pprint import pprint

# set the project root directory as the static folder, you can set others.
app = Flask(__name__)

@app.route('/')
@app.route('/editor')
def index():
    with open('config.json') as config_data:
        configuration = json.load(config_data)
    return render_template('editor.html',configuration=configuration)

@app.route('/editor2')
def editor2():
    with open('config.json') as config_data:
        configuration = json.load(config_data)
    return render_template('editor2.html',configuration=configuration)


if __name__ == "__main__":
    app.run(debug=True)
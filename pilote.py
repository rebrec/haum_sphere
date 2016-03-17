from flask import Flask, request, send_from_directory, render_template
import json
from Definitions import *

# set the project root directory as the static folder, you can set others.
app = Flask(__name__)

#@app.route('/')







if __name__ == "__main__":
    app.run(debug=True)
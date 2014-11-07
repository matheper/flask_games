# import the Flask class from the flask module
from flask import Flask, render_template

# create the application object
app = Flask(__name__)

# use decorators to link the function to a url
@app.route('/')
def home():
    return render_template('index.html')  # render index template

@app.route('/grazer')
def grazer():
    return render_template('grazer.html')  # render grazer game

@app.route('/minesweeper')
def minesweeper():
    return render_template('minesweeper.html')  # render minesweeper game

# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True)

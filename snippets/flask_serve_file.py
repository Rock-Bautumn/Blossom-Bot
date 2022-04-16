#!/usr/bin/env python

# Thanks to Dan Jacob for a part of the code !
# https://web.archive.org/web/20130406054855/http://flask.pocoo.org/snippets/32/

from flask import Flask, send_file
import StringIO

app = Flask(__name__)

@app.route('/')
def index():
    strIO = StringIO.StringIO()
    strIO.write('Hello from Dan Jacob and Stephane Wirtel !')
    strIO.seek(0)
    return send_file(strIO,
                     attachment_filename="testing.txt",
                     as_attachment=True)
        
app.run(debug=True)

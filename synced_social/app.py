import sys
from datetime import datetime
import json
from os import environ as env
from urllib.parse import quote_plus, urlencode

from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, jsonify, request

try: from settings_local import mail
except: pass

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")

# import logging
#app.logger.setLevel(logging.DEBUG)  # Set log level to DEBUG for debugging
# logging.basicConfig(filename='/home/ubuntu/synced.social/synced_social/flask.log', level=logging.DEBUG)

@app.route('/submit', methods=['POST'])
def submit():
    print('h')
    data = request.get_json()
    return jsonify({'data':str(data),'success':True});

@app.route('/')
def home():
    return render_template('index.html',)

if __name__ == '__main__':
    app.run()


import sys
from datetime import datetime
import json
from os import environ as env
from urllib.parse import quote_plus, urlencode
import re
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, jsonify, request

from bs4 import BeautifulSoup
import requests

try: from settings_local import mail
except: pass

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")

# import logging
#app.logger.setLevel(logging.DEBUG)  # Set log level to DEBUG for debugging
# logging.basicConfig(filename='/home/ubuntu/potionelves.com/potion_elves/flask.log', level=logging.DEBUG)

@app.route('/submit', methods=['POST'])
def submit():
    print('submitted')
    data = request.get_json()
    # we expect data.emails to be a csv of emails
    emails = data['emails'].split(",")
    all_links = []
    for email in emails:
        links = str(get_social_links(email))
        for ch in ['[',']','\'','"']:
            if ch in links:
                links = links.replace(ch,"")
        all_links.append(links)
    print("DONE")
    links='@@'.join(map(str, all_links))
    for ch in ['[',']','\'','"']:
        if ch in links:
            links = links.replace(ch,"")

    return jsonify({'links':str(links),'data':str(data),'success':True});

@app.route('/')
def home():
    return render_template('index.html',)

def get_social_links(email):
        # Split the email address to get the domain
    try:
        user, domain = email.split('@')
    except ValueError:
        return 'Invalid email format'

    # Check if email domain is one of the specified services
    if any(service in domain.lower() for service in ['gmail', 'outlook', 'aol']):
        return None

    # Try to navigate to the parsed domain
    try:
        response = requests.get(f'http://{domain}', timeout=5)
    except Exception as e:
        print('Failed to access {domain}:'+str(e))
        return []

    if response is None:
        print('no resp')
        return []
    # Use Beautiful Soup to parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # List of words to search for in links
    keywords = ['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin', 'youtube']



    # Find all links in the HTML that include the keywords
    print('chcekn '+email )
    content = response.text
    links = [email]
    pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')

    # Find all occurrences of HTTP links in the content
    for match in re.finditer(pattern, content):
        url = match.group()
        if any(keyword in url.lower() for keyword in keywords):
            if (len(url) < 50):
                links.append(url)



    print("found:"+str(len(links)))
    return links

@app.route('/waitlist')
def waitlist():
    return render_template('waitlist.html',)

@app.route('/waitlist/apply', methods=['POST'])
def waitlist_apply():
    data = request.get_json()
    ip = request.remote_addr
    to = ['charlie@vannorman.ai' ]
    fr = 'charlie@mana.red'
    subject = "Mana Games - Waitlist";
    text = str(data);
    text += " ip : "+str(ip)
    server = 'mana.red'
    mail.sendMail(to, fr, subject, text,server)
    return jsonify({'success':True});

if __name__ == '__main__':
    app.run()


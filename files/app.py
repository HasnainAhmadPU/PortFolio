from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'hasnainirshad44@gmail.com'   
app.config['MAIL_PASSWORD'] = 'bjhobhqacytmdhek'     

mail = Mail(app)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/skill')
def skill():
    return render_template('skill.html')

@app.route('/project')
def project():
    return render_template('project.html')

@app.route('/tools')
def tools():
    return render_template('tools.html')

@app.route('/tic')
def tic():
    return render_template('tic.html')

@app.route('/mole')
def mole():
    return render_template('mole.html')

@app.route('/cpp')
def cpp():
    return render_template('cpp.html')

@app.route('/flappy')
def flappy():
    return render_template('flappy.html')

@app.route('/calc')
def calc():
    return render_template('calc.html')

@app.route('/youtube')
def youtube():
    return render_template('youtube.html')

@app.route('/webproj')
def webproj():
    return render_template('webproj.html')

@app.route('/db')
def db():
    return render_template('db.html')

@app.route('/calendar')
def calendar():
    return render_template('calendar.html')

@app.route('/doodler')
def doodler():
    return render_template('doodler.html')

@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/weather')
def weather():
    return render_template('weather.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        msg = Message(subject=f'Portfolio Contact from {name}',
                      sender=email,
                      recipients=['hasnainirshad44@gmail.com'],
                      body=f"Name: {name}\nEmail: {email}\nMessage:\n{message}")

        try:
            mail.send(msg)
            return jsonify({'status': 'success', 'message': 'Message sent successfully!'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'Error sending message: {str(e)}'})
    
    return render_template('contact.html')
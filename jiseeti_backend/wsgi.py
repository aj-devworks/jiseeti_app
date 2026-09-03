import os
from flask_migrate import upgrade
from app import create_app

env = os.getenv("FLASK_ENV", "production")
app = create_app(env)

with app.app_context():
    upgrade()

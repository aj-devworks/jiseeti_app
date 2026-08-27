from flask import Flask
from app.config import config_by_name
from app.extensions import db, migrate, jwt, bcrypt, cors


def create_app(env="development"):
    app = Flask(__name__)
    app.config.from_object(config_by_name[env])

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)

    from app import models  # noqa: F401  (registers models with SQLAlchemy metadata)

    from app.routes.auth import auth_bp
    from app.routes.reports import reports_bp
    from app.routes.alerts import alerts_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(alerts_bp, url_prefix="/alerts")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    from flask import send_from_directory

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app

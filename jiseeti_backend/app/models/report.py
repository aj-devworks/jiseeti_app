from datetime import datetime
from app.extensions import db


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category = db.Column(db.String(20), nullable=False)   # red-flag | intervention
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(150))
    photo_url = db.Column(db.String(255))
    status = db.Column(db.String(20), default="pending")  # pending | in-progress | resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    upvotes = db.relationship("Upvote", backref="report", lazy=True, cascade="all, delete-orphan")
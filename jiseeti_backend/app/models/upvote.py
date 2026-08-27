from app.extensions import db


class Upvote(db.Model):
    __tablename__ = "upvotes"
    __table_args__ = (db.UniqueConstraint("report_id", "user_id", name="uq_report_user"),)

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey("reports.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
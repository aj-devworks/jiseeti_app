from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.alert import Alert
from app.utils.decorators import role_required

alerts_bp = Blueprint("alerts", __name__)


def serialize_alert(a):
    return {
        "id": a.id,
        "title": a.title,
        "message": a.message,
        "created_at": a.created_at.isoformat(),
    }


@alerts_bp.route("", methods=["GET"])
def list_alerts():
    alerts = Alert.query.order_by(Alert.created_at.desc()).all()
    return jsonify([serialize_alert(a) for a in alerts]), 200


@alerts_bp.route("", methods=["POST"])
@role_required("official")
def create_alert():
    data = request.get_json() or {}
    if not data.get("title") or not data.get("message"):
        return jsonify({"error": "title and message are required"}), 400

    alert = Alert(title=data["title"], message=data["message"])
    db.session.add(alert)
    db.session.commit()
    return jsonify(serialize_alert(alert)), 201
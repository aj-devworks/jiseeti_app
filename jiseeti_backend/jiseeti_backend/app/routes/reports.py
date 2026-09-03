from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.report import Report
from app.models.upvote import Upvote
from app.utils.upload import save_photo

reports_bp = Blueprint("reports", __name__)


def serialize_report(r):
    return {
        "id": r.id,
        "user_id": r.user_id,
        "category": r.category,
        "title": r.title,
        "description": r.description,
        "location": r.location,
        "photo_url": r.photo_url,
        "status": r.status,
        "upvotes": len(r.upvotes),
        "created_at": r.created_at.isoformat(),
    }


@reports_bp.route("", methods=["POST"])
@jwt_required()
def create_report():
    if request.content_type and "multipart/form-data" in request.content_type:
        data = request.form
        photo_file = request.files.get("photo")
    else:
        data = request.get_json() or {}
        photo_file = None

    required = ["category", "title", "description"]
    if not all(data.get(f) for f in required):
        return jsonify({"error": "category, title and description are required"}), 400

    try:
        photo_url = save_photo(photo_file) if photo_file else data.get("photo_url")
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    report = Report(
        user_id=int(get_jwt_identity()),
        category=data["category"],
        title=data["title"],
        description=data["description"],
        location=data.get("location"),
        photo_url=photo_url,
    )
    db.session.add(report)
    db.session.commit()
    return jsonify(serialize_report(report)), 201


@reports_bp.route("", methods=["GET"])
def list_reports():
    status = request.args.get("status")
    query = Report.query
    if status and status != "all":
        query = query.filter_by(status=status)
    reports = query.order_by(Report.created_at.desc()).all()
    return jsonify([serialize_report(r) for r in reports]), 200


@reports_bp.route("/<int:report_id>", methods=["GET"])
def get_report(report_id):
    report = Report.query.get_or_404(report_id)
    return jsonify(serialize_report(report)), 200


@reports_bp.route("/<int:report_id>", methods=["PATCH"])
@jwt_required()
def update_report(report_id):
    report = Report.query.get_or_404(report_id)
    user_id = int(get_jwt_identity())

    if report.user_id != user_id:
        return jsonify({"error": "Forbidden: not your report"}), 403
    if report.status != "pending":
        return jsonify({"error": "Cannot edit a report once it's being processed"}), 409

    data = request.get_json() or {}
    for field in ["title", "description", "location", "photo_url", "category"]:
        if field in data:
            setattr(report, field, data[field])

    db.session.commit()
    return jsonify(serialize_report(report)), 200


@reports_bp.route("/<int:report_id>", methods=["DELETE"])
@jwt_required()
def delete_report(report_id):
    report = Report.query.get_or_404(report_id)
    if report.user_id != int(get_jwt_identity()):
        return jsonify({"error": "Forbidden: not your report"}), 403

    db.session.delete(report)
    db.session.commit()
    return jsonify({"message": "Report deleted"}), 200


@reports_bp.route("/<int:report_id>/upvote", methods=["POST"])
@jwt_required()
def toggle_upvote(report_id):
    Report.query.get_or_404(report_id)
    user_id = int(get_jwt_identity())

    existing = Upvote.query.filter_by(report_id=report_id, user_id=user_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"message": "Upvote removed"}), 200

    db.session.add(Upvote(report_id=report_id, user_id=user_id))
    db.session.commit()
    return jsonify({"message": "Upvoted"}), 201

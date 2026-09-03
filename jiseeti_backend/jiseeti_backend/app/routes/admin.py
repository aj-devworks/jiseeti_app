from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.report import Report
from app.utils.decorators import role_required
from app.routes.reports import serialize_report

admin_bp = Blueprint("admin", __name__)

VALID_STATUSES = ("pending", "in-progress", "resolved")


@admin_bp.route("/stats", methods=["GET"])
@role_required("official")
def stats():
    return jsonify({
        "pending": Report.query.filter_by(status="pending").count(),
        "in_progress": Report.query.filter_by(status="in-progress").count(),
        "resolved": Report.query.filter_by(status="resolved").count(),
    }), 200


@admin_bp.route("/reports/<int:report_id>/status", methods=["PATCH"])
@role_required("official")
def update_status(report_id):
    report = Report.query.get_or_404(report_id)
    data = request.get_json() or {}
    status = data.get("status")

    if status not in VALID_STATUSES:
        return jsonify({"error": f"status must be one of {VALID_STATUSES}"}), 400

    report.status = status
    db.session.commit()
    return jsonify(serialize_report(report)), 200

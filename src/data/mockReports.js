const STORAGE_KEY = "jiseti_app_v5";

export const REPORT_TYPES = {
  RED_FLAG: "Red-flag",
  INTERVENTION: "Intervention",
};

const initialReports = [
  {
    id: "101",
    type: REPORT_TYPES.RED_FLAG,
    title: "Burst Water Main",
    description:
      "High pressure water leak causing roadway erosion near the plaza.",
    location: { label: "Central Plaza, Ward 4" },
    lat: -1.286389,
    lng: 36.817223,
    status: "In Progress",
    upvotes: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
  },
  {
    id: "102",
    type: REPORT_TYPES.INTERVENTION,
    title: "Non-functional Streetlight",
    description: "Streetlight outage creating safety hazards at night.",
    location: { label: "5th Avenue & Park Road" },
    lat: -1.282,
    lng: 36.821,
    status: "Pending",
    upvotes: 8,
    imageUrl: null,
    createdAt: new Date().toISOString(),
  },
];

export function getReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReports));
      return initialReports;
    }
    return JSON.parse(data);
  } catch {
    return initialReports;
  }
}

export function getReportById(id) {
  return getReports().find((r) => r.id === String(id)) || null;
}

export function createReport(data) {
  const reports = getReports();
  const newReport = {
    id: Date.now().toString(),
    type: data.type || REPORT_TYPES.RED_FLAG,
    title: data.title || "Untitled Report",
    description: data.description || "No description provided.",
    location: { label: data.locationLabel || "Unspecified Location" },
    lat: data.lat || -1.286389 + (Math.random() * 0.01 - 0.005),
    lng: data.lng || 36.817223 + (Math.random() * 0.01 - 0.005),
    status: "Pending",
    upvotes: 1,
    imageUrl: data.imageUrl || null,
    createdAt: new Date().toISOString(),
  };
  const updated = [newReport, ...reports];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newReport;
}

export function upvoteReport(id) {
  const reports = getReports();
  const updated = reports.map((r) =>
    r.id === String(id) ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateReportDetails(id, updatedFields) {
  const reports = getReports();
  const updated = reports.map((r) =>
    r.id === String(id)
      ? {
          ...r,
          title: updatedFields.title || r.title,
          description: updatedFields.description || r.description,
          location: { label: updatedFields.locationLabel || r.location?.label },
        }
      : r,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteReport(id) {
  const reports = getReports();
  const updated = reports.filter((r) => r.id !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateReportStatus(id, newStatus) {
  const reports = getReports();
  const updated = reports.map((r) =>
    r.id === String(id) ? { ...r, status: newStatus } : r,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
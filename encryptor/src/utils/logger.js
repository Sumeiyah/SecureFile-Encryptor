// src/utils/logger.js

export const logToolActivity = (tool, action, status = "success") => {
  const user = JSON.parse(localStorage.getItem("user"))?.name || "Guest";
  const activities = JSON.parse(localStorage.getItem("fileActivities")) || [];

  const logEntry = {
    user,
    tool,
    action, // e.g. "encrypt", "decrypt", "download"
    status, // "success" or "failed"
    time: new Date().toISOString(),
  };

  activities.push(logEntry);
  localStorage.setItem("fileActivities", JSON.stringify(activities));
};

const { buildIncidentPlan } = require("../services/incident/incidentService");

exports.createIncidentPlan = (req, res, next) => {
  try {
    const { incidentType, description } = req.body || {};
    return res.json({ success: true, data: buildIncidentPlan(incidentType, description) });
  } catch (error) {
    return next(error);
  }
};

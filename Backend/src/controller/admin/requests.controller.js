export const createRequest  = (req, res) => res.status(501).json({ message: "Not implemented: POST /api/requests" });
export const listRequests   = (req, res) => res.status(501).json({ message: "Not implemented: GET /api/requests" });
export const getRequestById = (req, res) => res.status(501).json({ message: `Not implemented: GET /api/requests/${req.params.id}` });
export const confirmRequest = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/requests/${req.params.id}/confirm` });
export const resolveRequest = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/requests/${req.params.id}/resolve` });
export const deleteRequest  = (req, res) => res.status(501).json({ message: `Not implemented: DELETE /api/requests/${req.params.id}` });

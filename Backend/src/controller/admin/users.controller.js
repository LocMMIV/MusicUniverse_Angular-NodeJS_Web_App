export const listUsers   = (req, res) => res.status(501).json({ message: "Not implemented: GET /api/users" });
export const getUserById = (req, res) => res.status(501).json({ message: `Not implemented: GET /api/users/${req.params.id}` });
export const createUser  = (req, res) => res.status(501).json({ message: "Not implemented: POST /api/users" });
export const updateUser  = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/users/${req.params.id}` });
export const deleteUser  = (req, res) => res.status(501).json({ message: `Not implemented: DELETE /api/users/${req.params.id}` });
export const lockUser    = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/users/${req.params.id}/lock` });
export const unlockUser  = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/users/${req.params.id}/unlock` });

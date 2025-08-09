export const listSongs   = (req, res) => res.status(501).json({ message: "Not implemented: GET /api/songs" });
export const getSongById = (req, res) => res.status(501).json({ message: `Not implemented: GET /api/songs/${req.params.id}` });
export const createSong  = (req, res) => res.status(501).json({ message: "Not implemented: POST /api/songs" });
export const updateSong  = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/songs/${req.params.id}` });
export const deleteSong  = (req, res) => res.status(501).json({ message: `Not implemented: DELETE /api/songs/${req.params.id}` });
export const lockSong    = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/songs/${req.params.id}/lock` });
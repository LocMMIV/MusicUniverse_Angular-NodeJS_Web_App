export const listGenres   = (req, res) => res.status(501).json({ message: "Not implemented: GET /api/genres" });
export const getGenreById = (req, res) => res.status(501).json({ message: `Not implemented: GET /api/genres/${req.params.id}` });
export const createGenre  = (req, res) => res.status(501).json({ message: "Not implemented: POST /api/genres" });
export const updateGenre  = (req, res) => res.status(501).json({ message: `Not implemented: PUT /api/genres/${req.params.id}` });
export const deleteGenre  = (req, res) => res.status(501).json({ message: `Not implemented: DELETE /api/genres/${req.params.id}` });

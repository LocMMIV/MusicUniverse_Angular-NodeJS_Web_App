export const listFavoritesByUser = (req, res) => {
    return res.status(501).json({ message: `Not implemented: GET /api/favorites/${req.params.userId}` });
};
export const addFavorite = (req, res) => {
    return res.status(501).json({ message: "Not implemented: POST /api/favorites" });
};
export const removeFavorite = (req, res) => {
    return res.status(501).json({ message: `Not implemented: DELETE /api/favorites/${req.params.userId}/${req.params.songId}` });
};

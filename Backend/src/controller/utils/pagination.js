export const getPagination = (req, defaults = { page: 1, limit: 20 }) => {
    const page = Math.max(1, Number(req.query.page || defaults.page));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || defaults.limit)));
    return { page, limit, offset: (page - 1) * limit };
}
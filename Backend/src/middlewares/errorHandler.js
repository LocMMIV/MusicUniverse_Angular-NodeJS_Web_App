export const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err.message); // Log the error message
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};
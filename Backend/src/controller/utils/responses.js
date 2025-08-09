export const notImplemented = (res, hint = "") => 
    res.status(501).json({ message: `Not implemented: ${hint}` });
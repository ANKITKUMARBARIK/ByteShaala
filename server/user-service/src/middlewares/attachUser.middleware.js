const attachUser = (req, res, next) => {
    const encodedUser = req.headers["x-user-data"];
    if (encodedUser) {
        try {
            req.user = JSON.parse(decodeURIComponent(encodedUser));
        } catch (err) {
            console.error("Failed to parse x-user-data:", err.message);
        }
    }
    next();
};

export default attachUser;

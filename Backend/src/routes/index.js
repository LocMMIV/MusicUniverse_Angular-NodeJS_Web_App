import usersRoutes from "./users.routes.js";
import songsRoutes from "./songs.routes.js";
import genresRoutes from "./genres.routes.js";
import favoritesRoutes from "./favorites.routes.js";
import requestsRoutes from "./requests.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";



export default function mountRoutes(app) {
    app.use("/api/users", usersRoutes);
    app.use("/api/songs", songsRoutes);
    app.use("/api/genres", genresRoutes);
    app.use("/api/favorites", favoritesRoutes);
    app.use("/api/requests", requestsRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/users", profileRoutes);


}
import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
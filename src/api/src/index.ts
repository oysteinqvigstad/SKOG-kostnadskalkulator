// src/index.js
import express, { Express} from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    console.log('production');
} else {
    console.log('development');
}



// WARNING: Google App Engine has been configured to use a frontend/middleware handler for
// the static files for faster processing. No request will actually reach the handler
// that is defined below, on the production PaaS server.
const reactDirectory = path.join(__dirname, '..', '..', '..', 'client', 'build');
app.use(express.static(reactDirectory));
app.get('*', (_, res) => {
    res.sendFile(path.join(reactDirectory, 'index.html'));
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
const app = require("./src/app");
const  {db} = require("./db/connection")
const { execSync } = require('child_process');

const PORT = 3000;

try {
    // Try to kill any process using port 3000
    execSync(`lsof -ti :${PORT} | xargs kill -9`);
    console.log(`Killed process using port ${PORT}`);
} catch (err) {
    console.log(`No process found using port ${PORT}`);
}

app.listen(PORT, () => {
    db.sync();
    console.log(`Listening at http://localhost:${PORT}/users`)

    
})
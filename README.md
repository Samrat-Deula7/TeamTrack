# FlowTrack

SQL commands for the database schema


Data Base: Project_Team_Track



CREATE TABLE User_Table (
    User_Id SERIAL PRIMARY KEY,
    Name VARCHAR(20),
    Password VARCHAR(80),
    Email VARCHAR(30) UNIQUE,
    Phone_No VARCHAR(80)
);



CREATE TABLE User_Tasks (
    Task_Id SERIAL PRIMARY KEY,
    User_Id INT NOT NULL,
    Task VARCHAR(150) NOT NULL,
    Completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id)
);


Create table Team_Table(
Team_Id serial primary key,
User_Id INT not null,
Team_Name varchar(70) not null,
Team_Tasks varchar(150) not null,
Completed Boolean not null default FALSE,
Team_code Text,
Type varchar(10) default 'member',
FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id)
);


select * from User_Tasks
select * from User_Table
select * from Team_Table



Issues That I have faced while building this project

📌 Problem number 1

Here's exactly what happened:

The old server never died
When you first started your server with nodemon, it launched a process on port 3000. At that point, your code only had routes up to /CreateTeamTask. That process kept running in the background even after you closed the terminal or thought you stopped it.
The new server kept crashing silently
Every time you ran nodemon src/index.ts after that, the new server tried to start on port 3000 but immediately crashed because port 3000 was already taken by the old process. That's why you saw:
[nodemon] clean exit - waiting for changes before restart
A healthy Express server never exits on its own. That "clean exit" was actually a silent crash.
You were always talking to the ghost
Every request you sent in Postman was being handled by the old zombie process — the one without /DeleteTeamTask. The new server with your updated code never got a chance to receive a single request.
Why /CreateTeamTask worked but nothing after it didn't
The old zombie process was from a point in time when your code only had routes up to /CreateTeamTask. So anything before that worked fine, and everything you added after was invisible to it.
The fix
Killing PID 14376 destroyed the old zombie process, freeing up port 3000. Your new server finally started successfully and picked up all 7 routes including /DeleteTeamTask.


All of that happend because I forgot to update my dist file using npm run build before running npm run dev


Solution of Problem number 1

Step 1 — Open Windows Command Prompt (NOT WSL). Press Windows Key + R, type cmd, press Enter.
Step 2 — Paste this and press Enter:
cmdnetstat -ano | findstr :3000
Step 3 — You'll see something like this, copy the last number (that's the PID):
TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
                                                  ^^^^^
                                              copy this number
Step 4 — Paste this replacing 12345 with your actual number, press Enter:
cmdtaskkill /PID 12345 /F
You should see:
SUCCESS: The process with PID 12345 has been terminated.
Step 5 — Go back to WSL and restart your server:
bashnodemon src/index.ts
Step 6 — This time the terminal should stay open like this and NOT exit:
Server is running on http://localhost:3000
← cursor just hangs here, no "clean exit" message
Step 7 — Now test your DELETE request in Postman again.


How was problem number 1 discovered ?

nodemon src/index.ts
[nodemon] 3.1.11
[nodemon] to restart at any time, enter rs
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting ts-node src/index.ts
[dotenv@17.3.1] injecting env (4) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.3.1] injecting env (0) from .env -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2

Server is running on http://localhost:3000
[nodemon] clean exit - waiting for changes before restart   // This line means the server experienced an client crash which let to me finding the problem







📌 Problem number 2: ENOENT error for ca.pem
Problem:

Your code tried to read ./src/routes/ca.pem.

After TypeScript compilation, runtime files live in dist/, not src/.

Vercel only deploys the compiled output, so src/ doesn’t exist in production.

Result: ENOENT: no such file or directory crash.

Solution:

Use __dirname to resolve paths dynamically:

ts
const caPath = path.join(__dirname, "ca.pem");
const caCert = fs.readFileSync(caPath).toString();
This makes the path relative to the compiled file’s directory (dist/routes/), not hard‑coded to src/.






📌 Problem number 3: File missing in dist/
Problem:

Even after fixing the path, TypeScript (tsc) only compiles .ts files — it doesn’t copy non‑code assets like .pem.

So dist/routes/ca.pem didn’t exist at runtime.

Solution:

Update the build script to copy the file:

json
"scripts": {
  "build": "tsc && cp src/routes/ca.pem dist/routes/"
}
This ensures ca.pem is always present in dist/routes/ after build, so the runtime can find it.




📌 Problem number 4: Using app.listen on Vercel
Problem:

In local development, you need app.listen(PORT) to start the server.

On Vercel (serverless), the platform itself provides the HTTP server.

If you leave app.listen in deployed code, it tries to bind to a port inside the serverless runtime → crash (Function Invocation Failed).

Solution:

Split your setup:

Local dev entry (e.g., index.ts):

ts
import app from "./app";
app.listen(3000, () => console.log("Server running locally"));
Vercel entry (e.g., api/index.ts):

ts
import app from "./app";
export default app; // no app.listen
This way, local dev works with app.listen, and Vercel works with export default app.






📌 Problem number 5:

When deploying the project to Vercel, the build completed successfully but the platform returned the error:

No Output Directory named "build" found after the Build completed.

This happened because Vercel defaults to expecting a build/ folder (used by Create React App). Our project uses Vite, which outputs production files into a dist/ folder instead. As a result, Vercel could not locate the correct output directory and deployment failed.

Solution
We resolved the issue by explicitly telling Vercel to use the correct output folder:

Update Project Settings in Vercel

Build Command: npm run build

Output Directory: dist

Install Command: npm install

Alternative via vercel.json  
Add a configuration file in the project root:

json
{
  "version": 2,
  "routes": [{ "src": "/api/(.*)", "dest": "dist/index.js" }]
}
This ensures Vercel routes API requests correctly and serves files from the dist/ folder.
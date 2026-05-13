# FlowTrack

SQL commands for the database schema


use Project_Flow_Track

select * from User_Tasks


create table User_Table(
User_Id int primary key IDENTITY(1,1),
Name varchar(20),
Password varchar(80),
Email varchar(30) unique,
Phone_No varchar(80),
)


CREATE TABLE User_Tasks (
    Task_Id INT PRIMARY KEY IDENTITY(1,1),
    User_Id INT NOT NULL,
    Task VARCHAR(150) NOT NULL,
    Completed BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id)
);

CREATE TABLE Team_Table(
    Team_Id INT PRIMARY KEY IDENTITY(1,1),
    User_Id INT NOT NULL,
    Team_Name VARCHAR(70) NOT NULL,
    Team_Tasks VARCHAR(150) NOT NULL,
    Completed BIT NOT NULL DEFAULT 0,
    Team_code NVARCHAR(MAX),
    Type varchar(10) default 'member'
    FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id)
);



select * from User_Tasks
select * from User_Table
select * from Team_Table


Issues That I have faced while building this project

Problem number 1

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
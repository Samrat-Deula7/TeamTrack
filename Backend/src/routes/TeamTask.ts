import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

// import sql from "mssql";


import { pool } from "./Task";
import authenticateuser from "../middleware/authenticateuser";

const router = express.Router();

router.post(
  "/createTeam",
  authenticateuser,
  [
    body(
      "Team_Name",
      "Name should have at least 3 characters and maximun of 70 character",
    ).isLength({ min: 3, max: 70 }),
    body(
      "Team_Tasks",
      "Task should be atleast 10 characters and maximum of 150 character",
    ),
  ],
  async (req: Request, res: Response) => {
    // The above array will set the restrictions rules and the following code will give error if those rules are broken.
    const errors = validationResult(req);
    // If error is empty is false then there is error so the if statement cathes the error.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let { Team_Name, Completed } = req.body;
      let Type = "admin";
      let Team_Tasks = "";
      if (Completed === undefined) {
        Completed = false; // use boolean in Postgres
      }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);

      const genCode = () => {
        let Team_code: number[] = [];
        const count = 4,
          min = 1,
          max = 100;
        while (Team_code.length < count) {
          const random_code = Math.floor(Math.random() * (max - min + 1)) + min;
          Team_code.push(random_code);
        }
        return Team_code;
      };
      let Team_code = JSON.stringify(genCode());

      // const TeamName: any = await pool
      //   .request()
      //   .input("Team_Name", sql.NVarChar(sql.MAX), Team_Name)
      //   .query("SELECT 1 FROM Team_Table WHERE Team_Name = @Team_Name");
      const teamNameResult = await pool.query(
        "SELECT 1 FROM team_table WHERE team_name = $1",
        [Team_Name],
      );

      // const code: any = await pool
      //   .request()
      //   .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
      //   .query("SELECT 1 FROM Team_Table WHERE Team_code = @Team_code");

      const codeResult = await pool.query(
        "SELECT 1 FROM team_table WHERE team_code = $1",
        [Team_code],
      );
      if (codeResult.rowCount! > 0) {
        Team_code = JSON.stringify(genCode());
      } else if (teamNameResult.rowCount! > 0) {
        res.status(400).json({
          error: "Team name already exists! please pick another name",
        });
      } else {
        // Insert query with bound parameters
        await pool.query(
          `INSERT INTO team_table (user_id, team_name, team_tasks, completed, team_code, type)
     VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, Team_Name, Team_Tasks, Completed, Team_code, Type],
        );
        res
          .status(200)
          .send([{ success: "Team Has been created !" }, { Code: Team_code }]);
      }
    } catch (error) {
      console.error(error);
    }
  },
);

router.post(
  "/joinTeamWithCode",
  authenticateuser,
  [
    body(
      "Team_Tasks",
      "Task should be atleast 10 characters and maximum of 150 character",
    ),
  ],
  async (req: Request, res: Response) => {
    // The above array will set the restrictions rules and the following code will give error if those rules are broken.
    const errors = validationResult(req);
    // If error is empty is false then there is error so the if statement cathes the error.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
     let { Team_Tasks, Completed, Team_code } = req.body;
     if (Completed === undefined) {
       Completed = false; // use boolean in Postgres
     }
     if (Team_Tasks == null) {
       Team_Tasks = "";
     }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);

      const teamNameResult = await pool.query(
        "SELECT team_name FROM team_table WHERE team_code = $1",
        [Team_code],
      );

      if (!teamNameResult || teamNameResult.rowCount === 0) {
        // Query failed or result is undefined
        return res.status(200).send({ fail: "No such team exists" });
      } else {
        // Insert query with bound parameters
        await pool.query(
          `INSERT INTO team_table (user_id, team_name, team_tasks, completed, team_code)
     VALUES ($1, $2, $3, $4, $5)`,
          [
            id,
            teamNameResult.rows[0].team_name,
            Team_Tasks,
            Completed,
            Team_code,
          ],
        );
        res.status(200).send({ success: "Team joined successfully !" });
      }
    } catch (error) {
      console.error(error);
    }
  },
);

router.get(
  "/GetTeamData",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);

      const teamCodeResult = await pool.query(
        "SELECT team_code FROM team_table WHERE user_id = $1",
        [id],
      );

       if (teamCodeResult.rowCount === 0) {
         return res.status(200).json({ dataSet: [] });
       }
      const teamCode = teamCodeResult.rows[0].team_code;
      // Get team data by user_id or team_code
      const teamDataResult = await pool.query(
        "SELECT * FROM team_table WHERE user_id = $1 OR team_code = $2",
        [id, teamCode],
      );
     

      return res.json({ dataSet: teamDataResult.rows });
    } catch (error) {
      console.error(error);
    }
  },
);

router.get(
  "/getTeamTasks",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      const Team_code: any = req.header("Team_code");
     const teamTasksResult = await pool.query(
       `SELECT u.name, t.team_id, t.user_id, t.team_tasks, t.completed, t.type
   FROM user_table u
   INNER JOIN team_table t ON u.user_id = t.user_id
   WHERE t.team_code = $1`,
       [Team_code],
     );

     return res.status(200).json({ tasks: teamTasksResult.rows });
    } catch (error) {
      console.error(error);
    }
  },
);

// Update complete state API
router.post(
  "/UpdateTeamTableCompleteState",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
    let { Team_Id, Completed } = req.body;
Completed = Completed == 0 ? false : true; // use boolean in Postgres

const payload = req.user as { user: { id: string } };
const id = parseInt(payload.user.id);

const sqlResponse = await pool.query(
  "UPDATE team_table SET completed = $1 WHERE user_id = $2 AND team_id = $3",
  [Completed, id, Team_Id]
);

res.send(sqlResponse.rowCount);
    } catch (err) {
      console.error(err);
      res.status(500).send("Some error occurred");
    }
  },
);

// Update complete state API
router.post(
  "/UpdateTeamTableUserType",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      let { User_Id, Team_code, SetType } = req.body;
      SetType = SetType === "admin" ? "member" : "admin";

      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      // Insert query with bound parameters
      const typeResult = await pool.query(
        "SELECT type FROM team_table WHERE user_id = $1 AND team_code = $2",
        [id, Team_code],
      );

      if (typeResult.rowCount! > 0 && typeResult.rows[0].type !== "admin") {
        Team_code = "0"; // block if not admin
      }

      const sqlResponse = await pool.query(
        "UPDATE team_table SET type = $1 WHERE user_id = $2 AND team_code = $3",
        [SetType, User_Id, Team_code],
      );

      // Check how many admins remain in the team
      const typeSets = await pool.query(
        "SELECT type FROM team_table WHERE team_code = $1 GROUP BY user_id, type",
        [Team_code],
      );
      const adminCount = typeSets.rows.filter(
        (row) => row.type === "admin",
      ).length;

      if (adminCount == 0) {
        SetType = "admin";
        await pool.query(
          "UPDATE team_table SET type = $1 WHERE user_id = $2 AND team_code = $3",
          [SetType, User_Id, Team_code],
        );
        res.send(-1);
      } 
        res.send(sqlResponse.rowCount);
      
    } catch (err) {
      console.error(err);
      res.status(500).send("Some error occurred");
    }
  },
);

// CreateTask API
router.post(
  "/CreateTeamTask",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      let { Team_Name, TeamTask, Completed, Team_code } = req.body;
      if (Completed === undefined) {
        Completed = false; 
      }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      // Insert query with bound parameters
     const typeResult = await pool.query(
       "SELECT type FROM team_table WHERE user_id = $1 AND team_code = $2",
       [id, Team_code],
     );

      const Type = typeResult.rows[0]?.type;

      // Insert new team task
      await pool.query(
        `INSERT INTO team_table (user_id, team_name, team_tasks, completed, team_code, type)
   VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, Team_Name, TeamTask, Completed, Team_code, Type],
      );
      res.status(200).send({ success: "Team Task saved !" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to add Team Task");
    }
  },
);

router.post("/addUserToTeam", async (req: Request, res: Response) => {
  try {
    let { Email, Team_Name, TeamTask, Completed, Team_code } = req.body;
    if (Completed === undefined) {
      Completed = false; // boolean in Postgres
    }
    let Type = "member";
    TeamTask = "";

    const idResult = await pool.query(
      "SELECT user_id FROM user_table WHERE email = $1",
      [Email],
    );

    if (idResult.rowCount! > 0) {
      const userId = idResult.rows[0].user_id;

      // Insert query with bound parameters
     await pool.query(
       `INSERT INTO team_table (user_id, team_name, team_tasks, completed, team_code, type)
     VALUES ($1, $2, $3, $4, $5, $6)`,
       [userId, Team_Name, TeamTask, Completed, Team_code, Type],
     );
      res.status(200).send({ success: "User added successfully !" });
    } else {
      return res.status(400).json({
        error: "No user found with that email",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add User");
  }
});

router.delete(
  "/DeleteTeamTask",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      let { Team_Id } = req.body;

      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);

      const sqlResponse = await pool.query(
        "DELETE FROM team_table WHERE team_id = $1 AND user_id = $2",
        [Team_Id, id],
      );

      res.send(sqlResponse.rowCount);
    } catch (err) {
      res.status(500).send("Failed to add Team Task");
    }
  },
);

router.delete(
  "/LeaveTeam",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      let { Team_code } = req.body;

      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);

       const typeSets = await pool.query(
         "SELECT type FROM team_table WHERE team_code = $1 GROUP BY user_id, type",
         [Team_code],
       );
       const adminCount = typeSets.rows.filter(
         (row) => row.type === "admin",
       ).length;

       if(adminCount>1){
      const sqlResponse = await pool.query(
        "DELETE FROM team_table WHERE user_id = $1 AND team_code = $2",
        [id, Team_code],
      );
      res.send(sqlResponse.rowCount);
    }else{
      res.send(-1)
    }

      
    } catch (err) {
      res.status(500).send("Failed to leave Team");
    }
  },
);

router.delete(
  "/DeleteTeam",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
     let { Team_code } = req.body;

     const payload = req.user as { user: { id: string } };
     const id = parseInt(payload.user.id);

      const typeResult = await pool.query(
        "SELECT type FROM team_table WHERE user_id = $1 AND team_code = $2",
        [id, Team_code],
      );

      if (typeResult.rowCount! > 0 && typeResult.rows[0].type !== "admin") {
        Team_code = "0"; // block deletion if not admin
      }

      const sqlResponse = await pool.query(
        "DELETE FROM team_table WHERE team_code = $1",
        [Team_code],
      );
     res.send(sqlResponse.rowCount);
    } catch (err) {
      res.status(500).send("Failed to leave Team");
    }
  },
);

console.log(
  "Registered routes:",
  router.stack.map((r: any) => r.route?.path),
);
export default router;

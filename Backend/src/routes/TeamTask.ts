import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import sql from "mssql";
import { config } from "./Task";
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
      const pool = await sql.connect(config);
      let { Team_Name, Completed } = req.body;
      let Type="admin";
      let Team_Tasks = "";
      if (Completed == undefined) {
        Completed = 0;
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

      const TeamName: any = await pool
        .request()
        .input("Team_Name", sql.NVarChar(sql.MAX), Team_Name)
        .query("SELECT 1 FROM Team_Table WHERE Team_Name = @Team_Name");

      const code: any = await pool
        .request()
        .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
        .query("SELECT 1 FROM Team_Table WHERE Team_code = @Team_code");
      if (code.recordset.length > 0) {
        Team_code = JSON.stringify(genCode());
      } else if (TeamName.recordset.length > 0) {
        res.status(400).json({
          error: "Team name already exists! please pick another name",
        });
      } else {
        // Insert query with bound parameters
        await pool
          .request()
          .input("User_Id", sql.Int, id)
          .input("Team_Name", sql.VarChar(70), Team_Name)
          .input("Team_Tasks", sql.VarChar(150), Team_Tasks)
          .input("Completed", sql.Bit, Completed)
          .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
          .input("Type", sql.VarChar(10), Type).query(`
              INSERT INTO Team_Table VALUES (@User_Id, @Team_Name, @Team_Tasks, @Completed,@Team_code,@Type)
            `);
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
      const pool = await sql.connect(config);
      let { Team_Tasks, Completed, Team_code } = req.body;
      if (Completed == undefined) {
        Completed = 0;
      }
      if (Team_Tasks == null) {
        Team_Tasks = "";
      }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);

      let Team_Name: any = await pool
        .request()
        .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
        .query("select Team_Name from Team_Table WHERE Team_code = @Team_code");

      if (
        !Team_Name ||
        !Team_Name.recordset ||
        Team_Name.recordset.length === 0
      ) {
        // Query failed or result is undefined
        return res.status(200).send({ fail: "No such team exists" });
      } else {
        // Insert query with bound parameters
        await pool
          .request()
          .input("User_Id", sql.Int, id)
          .input("Team_Name", sql.VarChar(70), Team_Name.recordset[0].Team_Name)
          .input("Team_Tasks", sql.VarChar(150), Team_Tasks)
          .input("Completed", sql.Bit, Completed)
          .input("Team_code", sql.NVarChar(sql.MAX), Team_code).query(`
              INSERT INTO Team_Table VALUES (@User_Id, @Team_Name, @Team_Tasks, @Completed,@Team_code)
            `);
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

      const pool = await sql.connect(config);

      let Team_code: any = await pool
        .request()
        .input("userId", sql.Int, id)
        .query("select Team_code from Team_Table WHERE User_Id = @userId");

      const TeamData = await pool
        .request()
        .input("userId", sql.Int, id)
        .input(
          "TeamCode",
          sql.NVarChar(sql.MAX),
          Team_code.recordset[0].Team_code,
        )
        .query(
          "select * from  Team_Table  WHERE User_Id=@userId or Team_code=@Teamcode;",
        );

      return res.json({ dataSet: TeamData.recordset });
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
      const pool = await sql.connect(config);
      const TeamTasks = await pool
        .request()
        .input("TeamCode", sql.NVarChar(sql.MAX), Team_code)
        .query(
          "select u.Name ,t.Team_Id, t.Team_Tasks, t.Completed, t.Type from User_Table u Inner join Team_Table t on u.User_Id=t.User_Id where Team_code=@TeamCode",
        );

      return res.status(200).json({ tasks: TeamTasks.recordset });
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
      const pool = await sql.connect(config);
      let { Team_Id, Completed } = req.body;
      if (Completed == 0) {
        Completed = 0;
      } else {
        Completed = 1;
      }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      // Insert query with bound parameters

      let sqlResponse = await pool
        .request()
        .input("Userid", sql.Int, id)
        .input("Team_Id", sql.Int, Team_Id)
        .input("Completed", sql.Int, Completed).query(`
        Update Team_Table set Completed = @Completed where User_Id = @Userid and Team_Id = @Team_Id
      `);

      res.send(sqlResponse.rowsAffected);
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
      const pool = await sql.connect(config);
      let { Team_Name, TeamTask, Completed, Team_code } = req.body;
      if (Completed == undefined) {
        Completed = 0;
      }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      // Insert query with bound parameters
      let Type:any = await pool
        .request()
        .input("Userid", sql.Int, id)
        .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
        .query(`select Type from Team_Table where User_Id=@Userid and Team_code=@Team_code
`);

      await pool
        .request()
        .input("Userid", sql.Int, id)
        .input("Team_Name", sql.VarChar(70), Team_Name)
        .input("TeamTask", sql.VarChar(150), TeamTask)
        .input("completed", sql.Bit, Completed)
        .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
        .input("Type", sql.VarChar(10), Type.recordset[0].Type).query(`
        insert into Team_Table Values (@Userid,@Team_Name,@TeamTask,@completed,@Team_code,@Type)
      `);
      res.status(200).send({ success: "Team Task saved !" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to add Team Task");
    }
  },
);

router.post("/addUserToTeam", async (req: Request, res: Response) => {
  try {
    const pool = await sql.connect(config);
    let { Email, Team_Name, TeamTask, Completed, Team_code } = req.body;
    if (Completed == undefined) {
      Completed = 0;
    }
    let Type="member"

    TeamTask = "";
    let id = await pool
      .request()
      .input("email", sql.VarChar(30), Email)
      .query("select User_Id from User_Table WHERE Email = @email");

    if (id.recordset.length > 0) {
      const userId = id.recordset[0].User_Id;

      // Insert query with bound parameters
      await pool
        .request()
        .input("Userid", sql.Int, userId)
        .input("Team_Name", sql.VarChar(70), Team_Name)
        .input("TeamTask", sql.VarChar(150), TeamTask)
        .input("completed", sql.Bit, Completed)
        .input("Team_code", sql.NVarChar(sql.MAX), Team_code)
        .input("Type", sql.VarChar(10), Type).query(`
        insert into Team_Table Values (@Userid,@Team_Name,@TeamTask,@completed,@Team_code,@Type)
      `);
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
      const pool = await sql.connect(config);
      let { Team_Id } = req.body;

      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      let sqlResponse = await pool
        .request()
        .input("Userid", sql.Int, id)
        .input("Team_Id", sql.Int, Team_Id).query(`
                delete from Team_Table where Team_Id=@Team_Id and User_Id =@Userid
                `);
      res.send(sqlResponse.rowsAffected);
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
      const pool = await sql.connect(config);
      let { Team_code } = req.body;

      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      let sqlResponse = await pool
        .request()
        .input("Userid", sql.Int, id)
        .input("Team_code", sql.NVarChar(sql.MAX), Team_code).query(`
                delete from Team_Table where User_Id=@Userid and Team_code=@Team_code
                `);
      res.send(sqlResponse.rowsAffected);
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

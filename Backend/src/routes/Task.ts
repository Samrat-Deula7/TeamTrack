import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// import sql from "mssql";
import { Pool } from "pg";

import jwt from "jsonwebtoken";
import authenticateuser from "../middleware/authenticateuser";

const router = express.Router();

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.Database,
  password: process.env.Database_User_Pass,
  port: 5432,
});



// Sign Up API
router.post(
  "/SignUpUser",
  [
    body(
      "Name",
      "Name should have at least 3 characters and maximun of 20 character",
    ).isLength({ min: 3, max: 20 }),
    body(
      "Password",
      "Password must be atleast 5 characters and maximun of 20 character",
    ).isLength({
      min: 5,
      max: 20,
    }),
    body("Email", "Enter a valid email").isEmail(),
    body("Phoneno", "Phoneno must be at least have 10 numbers").isLength({
      min: 10,
    }),
  ],
  async (req: Request, res: Response) => {
    // The above array will set the restrictions rules and the following code will give error if those rules are broken.
    const errors = validationResult(req);
    // If error is empty is false then there is error so the if statement cathes the error.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      
       const { Name, Password, Email, Phoneno } = req.body;

  
    // Encrypt password and phone number
    const salt = await bcrypt.genSalt(10);
    const EncryptedPassword = await bcrypt.hash(Password, salt);
    const EncryptedPhoneno = await bcrypt.hash(Phoneno, salt);

    // Check if email already exists
    const checkQuery = "SELECT 1 FROM user_table WHERE email = $1";
    const checkResult = await pool.query(checkQuery, [Email]);

    if (checkResult.rowCount! > 0) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Insert new user
    const insertQuery = `
      INSERT INTO user_table (name, password, email, phone_no)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id;
    `;
    const values = [Name, EncryptedPassword, Email, EncryptedPhoneno];
    await pool.query(insertQuery, values);

    res.status(200).send({ success: "User Created successfully" });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        error: "Some error occurred in the database",
      });
    }
  },
);

// Login API
router.post(
  "/LoginUser",
  [body("Email", "Enter a valid email").isEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      // If error is empty is false then there is error so the if statement cathes the error.
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
      const { Email, Password } = req.body;
const idResult = await pool.query(
  "SELECT User_Id FROM user_table WHERE Email = $1",
  [Email]
);

if (idResult.rowCount! > 0) {
  const userId = idResult.rows[0].user_id;

  // Step 2: Get password by user_id
  const pwResult = await pool.query(
    "SELECT Password FROM user_table WHERE User_Id = $1",
    [userId]
  );

  const DBpassword = pwResult.rows[0].password;

        const passwordCompare = await bcrypt.compare(
          Password,
          DBpassword,
        );

        if (passwordCompare) {
          // The following code generates an authentication token which is provided to the user
          const data = {
            user: {
              id: userId,
            },
          };
          // This gives the user the authtoken using which the token can be transformed back into the user.id .And because of the secret helps to detect if the token has been Tampered(changed)

          const authtoken = jwt.sign(data, process.env.JWT_SECRET!);
          res.status(200).send({ FlowTrackAuthtoken: authtoken });
        } else {
          return res.status(400).json({
            error: "Please try to login with correct credentials",
          });
        }
      } else {
        return res.status(400).json({
          error: "No user found with that email",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Some error occurred in the database",
      });
    }
  },
);

// CreateTask API
router.post(
  "/CreateTask",
  authenticateuser,
  async (req: Request, res: Response) => {
    try {
      let { Task, Completed } = req.body;
      if (Completed == undefined) {
        Completed = false;
      }
      const payload = req.user as { user: { id: string } };
      const id = parseInt(payload.user.id);
      // Insert query with bound parameters
     await pool.query(
       "INSERT INTO user_tasks (user_id, task, completed) VALUES ($1, $2, $3)",
       [id, Task, Completed ?? false],
     );
      res.status(200).send({ success: "Task has been saved !" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Some error occurred");
    }
  },
);

// GetAllTasks API
router.get("/GetAllTasks",authenticateuser, async (req: Request, res: Response) => {
  try {
     const payload = req.user as { user: { id: string } };
     const id = parseInt(payload.user.id);
  const dataResult = await pool.query(
    "SELECT * FROM user_tasks WHERE user_id = $1",
    [id],
  );

  return res.json({ dataSet: dataResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Some error occurred");
  }
});

// Update complete state API
router.post(
  "/UpdateCompleteState",
  authenticateuser, 
  async (req: Request, res: Response) => {
    try {
     let { Task_Id, Completed } = req.body;
     Completed = Completed == 0 ? false : true;

     const payload = req.user as { user: { id: string } };
     const id = parseInt(payload.user.id);

     await pool.query(
       "UPDATE user_tasks SET completed = $1 WHERE user_id = $2 AND task_id = $3",
       [Completed, id, Task_Id],
     );
        
      res.status(200).send({ success: "Task has been Completed !" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Some error occurred");
    }
    
  },
);


// Delete Task API
router.delete(
  "/DeleteTask",
  authenticateuser, 
  async (req: Request, res: Response) => {
    try {
     let { Task_Id } = req.body;

     const payload = req.user as { user: { id: string } };
     const id = parseInt(payload.user.id);

     await pool.query(
       "DELETE FROM user_tasks WHERE user_id = $1 AND task_id = $2",
       [id, Task_Id],
     );
        
      res.status(200).send({ success: "Task has been Deleted successfully !" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Some error occurred");
    }
    
  },
);




export default router;

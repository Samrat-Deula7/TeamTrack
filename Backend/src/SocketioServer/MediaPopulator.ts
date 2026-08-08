import express, { Request, Response } from "express";
import multer from "multer";
import { pool } from "../routes/Task";

const MediaRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

MediaRouter.post(
  "/media",
  upload.array("file"),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];

      for (const file of files) {
        let retruningData = await pool.query(
          `INSERT INTO send_media 
         (media_name, media_type, media_size, uploaded_at, media_data) 
         VALUES ($1, $2, $3, NOW(), $4) 
         RETURNING media_id
         `,
          [file.originalname, file.mimetype, file.size, file.buffer],
        );

        let mediaId = retruningData.rows[0].media_id;

        res.status(200).send({ mediaId: mediaId });
      }
    } catch (error) {
      res.status(400).send("unable to populate");
    }
  },
);

export default MediaRouter;

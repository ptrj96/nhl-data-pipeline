import express from 'express';
import { Request, Response } from 'express';
const app = express();
const port = 3000;

app.get('/season/:season/load', (req: Request, res: Response) => {
  res.send(req.params.season);
});

app.get('/game/:gameId/load', (req: Request, res: Response) => {
 res.send(req.params.gameId);
});

app.get('/game/:gameId', (req: Request, res: Response) => {
  res.send(req.params.gameId);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

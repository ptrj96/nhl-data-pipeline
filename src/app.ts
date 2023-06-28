import express from 'express';
import { Request, Response } from 'express';
import { GameMonitor } from './gameMonitor.js';
import { DBClient } from './db/db.js';
import { loadGame } from './game.js';
const app = express();
const port = 3000;
const monitor = new GameMonitor();

const db = new DBClient();
db.initializeDb();

app.get('/game/:gameId/load', async (req: Request, res: Response) => {
  res.json(await loadGame(req.params.gameId));
});

app.get('/game/:gameId', (req: Request, res: Response) => {
  res.send(req.params.gameId);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

monitor.start();

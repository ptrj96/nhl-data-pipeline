import express from 'express';
import { Request, Response } from 'express';
import { GameMonitor } from './gameMonitor.js';
import { DBClient } from './db/db.js';
import { findGame, loadGame } from './game.js';
const app = express();
const port = 3000;
const monitor = new GameMonitor();

const db = new DBClient();
db.initializeDb();

app.get('/game/:gameId/load', async (req: Request, res: Response) => {
  res.json(await loadGame(req.params.gameId, db));
});

app.get('/game/:gameId', async (req: Request, res: Response) => {
  res.json(await findGame(req.params.gameId, db))
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

monitor.start();

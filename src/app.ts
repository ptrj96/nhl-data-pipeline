import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { GameMonitor } from './gameMonitor.js';
import { DBClient } from './db/db.js';
import { findGame, loadGame } from './game.js';
const app = express();
const port = 3000;
const monitor = new GameMonitor();

const db = new DBClient();
db.initializeDb();

export class ExpressError extends Error {
  status?: number;
}

const errorHandler = (error: ExpressError, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);
  const status = error.status || 400;
  res.status(status).send(error.message);
}

app.get('/game/:gameId/load', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await loadGame(req.params.gameId, db));
  } catch (error) {
    next(error)
  }
});

app.get('/game/:gameId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await findGame(req.params.gameId, db))
  } catch (error) {
    next(error)
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(errorHandler);

monitor.start();

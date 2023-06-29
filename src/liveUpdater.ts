import axios from 'axios';
import { DBClient } from './db/db.js';
import { Game } from './gameMonitor.js';

export class LiveUpdater {
    db: DBClient;
    gamePk: number;
    constructor(db: DBClient, gamePk: number) {
        this.db = db;
        this.gamePk = gamePk;
    }

    update(game: Game) {

    }

    finish() {

    }
}
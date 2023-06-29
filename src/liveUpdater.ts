import { DBClient, DBGame } from './db/db.js';
import { Game } from './gameMonitor.js';
import { addOrUpdatePlayer, getGameData } from './game.js';

export class LiveUpdater {
    db: DBClient;
    game: Game;
    constructor(db: DBClient, game: Game) {
        this.db = db;
        this.game = game;
    }

    async addGame() {
        await this.db.addGame(DBGame.build({
            gamePk: this.game.gamePk,
            isLive: true
        }));
    }

    async update() {
        const gameData = await getGameData(this.game.gamePk);

        try {
            addOrUpdatePlayer(this.db, gameData);
        } catch (error) {
            console.error(error);
        }
    }

    async finish() {
        await this.db.removeLiveGame(this.game.gamePk);
    }
}
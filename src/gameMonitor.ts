import axios from "axios";
import { DBClient } from "./db/db.js";
import { LiveUpdater } from "./liveUpdater.js";

export type Game = {
    gamePk: number;
    link: string;
    gameType: string;
    season: string;
    gameDate: string;
    status: {
        abstractGameState: string;
        codedGameState: string;
        detailedState: string;
        statusCode: string;
        startTimeTBD: boolean;
    }
    teams: {
        away: {
            leagueRecord: {
                wins: number;
                losses: number;
                ot: number;
                type: string;
            }
            score: number;
            team: {
                id: number;
                name: string;
                link: string;
            }
        }
        home: {
            leagueRecord: {
                wins: number;
                losses: number;
                ot: number;
                type: string;
            }
            score: number;
            team: {
                id: number;
                name: string;
                link: string;
            }
        }
        venue: {
            id: number;
            name: string;
            link: string;
        }
        content: {
            link: string;
        }
    }
}

export class GameMonitor {
    db: DBClient;
    liveGames: Map<number, LiveUpdater>;
    constructor(db: DBClient) {
        this.db = db;
    }

    async start() {
        console.log('started monitoring');
        while(true) {
            await this.update()
            // wait a minute before updating again
            await sleep(60000);
        }
    }

    async update() {
        console.log('updating live games')
        const scheduleRes = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule');
        const todaysGames: Game[] = scheduleRes.data.dates[0]?.games;
        if (todaysGames === undefined) {
            return;
        }

        for (const game of todaysGames) {
            const hasGame = this.liveGames.get(game.gamePk) !== undefined;
            if (game.status.abstractGameState === 'Final' && hasGame) {
                this.liveGames.get(game.gamePk).finish();
                this.liveGames.delete(game.gamePk);
            }
            if (game.status.abstractGameState === 'live' && !hasGame) {
                this.liveGames.set(game.gamePk, new LiveUpdater(this.db, game.gamePk));
            }
            this.liveGames.get(game.gamePk).update(game);
        }
    }
}

async function sleep(ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

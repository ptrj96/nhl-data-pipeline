import axios from "axios";
import { DBClient, DBGame, PlayerGameData } from "./db/db";
import { ExpressError } from "./app";

type PlayerData = {
    person: {
        id: number;
        fullName: string;
        link: string;
        firstName: string;
        lastName: string;
        primaryNumber: string;
        birthDate: Date;
        currentAge: number;
        birthCity: string;
        birthStateProvince: string;
        birthCountry: string;
        nationality: string;
        height: string;
        weight: number;
        active: boolean;
        alternateCaptain: boolean;
        captain: boolean;
        rookie: boolean;
        shootsCatches: string;
        rosterStatus: string;
        currentTeam: {
            id: number;
            name: string;
            link: string;
        }
        primaryPosition: {
            code: string;
            name: string;
            type: string;
            abbreviation: string;
        }
    },
    jerseyNumber: string;
    position: {
        code: string;
        name: string;
        type: string;
        abbreviation: string;
    },
    stats: {
        skaterStats: {
            timeOnIce: string;
            assists: number;
            goals: number;
            shots: number;
            hits: number;
            powerPlayGoals: number;
            powerPlayAssists: number;
            penaltyMinutes: number;
            faceOffWins: number;
            faceoffTaken: number;
            takeaways: number;
            giveaways: number;
            shortHandedGoals: number;
            shortHandedAssists: number;
            blocked: number;
            plusMinus: number;
            evenTimeOnIce: string;
            powerPlayTimeOnIce: string;
            shortHandedTimeOnIce: string;
        },
        goalieStats: {
            assists: number;
            decision: string;
            evenSaves: number;
            evenShotsAgainst: number;
            evenStrengthSavePercentage: number;
            goals: number;
            pim: number;
            powerPlaySavePercentage: number;
            powerPlaySaves: number;
            powerPlayShotsAgainst: number;
            savePercentatge: number;
            saves: number;
            shortHandedSavePercentage: number;
            shortHandedSaves: number;
            shortHandedShotsAgainst: number;
            shots: number;
            timeOnIce: string;
        }
    }
}

export type GameData = {
    gamePk: number;
    awayTeamName: string;
    awayTeamId: string;
    awayPlayers: PlayerData[];
    homeTeamName: string;
    homeTeamId: string;
    homePlayers: PlayerData[];
}

export async function loadGame(gamePk: number, db: DBClient) {
    const gameData = await getGameData(gamePk);
    const dbGame = DBGame.build({
        gamePk: gameData.gamePk,
        isLive: false
    })

    try {
        await db.addGame(dbGame);
    } catch (error) {
        console.error(error);
        const e = new ExpressError(`error loading game: ${error}`);
        e.status = 400;
        throw e
    }

    try {
        await addOrUpdatePlayer(db, gameData);
    } catch (error) {
        console.error(error);
        const e = new ExpressError(`error adding player data: ${error}`);
        e.status = 400;
        throw e
    }
    

    return gameData
}

export async function getGameData(gamePk: number): Promise<GameData> {
    const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`);
    const data = response.data;
    const gameData: GameData = {
        gamePk: gamePk,
        awayTeamName: data.teams.away.team.name,
        awayTeamId: data.teams.away.team.id,
        awayPlayers: Array.from(Object.values(data.teams.away.players)),
        homeTeamName: data.teams.home.team.name,
        homeTeamId: data.teams.home.team.id,
        homePlayers:Array.from(Object.values(data.teams.home.players)),
    }
    return gameData
}

export async function addOrUpdatePlayer(db: DBClient, gameData: GameData) {
    gameData.awayPlayers.forEach(async player => {
        let assists;
        let goals;
        let hits;
        let points;
        let penaltyMinutes;
        if (player.stats.skaterStats !== undefined) {
            assists = player.stats.skaterStats.assists;
            goals = player.stats.skaterStats.goals;
            hits = player.stats.skaterStats.hits;
            points = assists + goals;
            penaltyMinutes = player.stats.skaterStats.penaltyMinutes;
        } else {
            assists = 0;
            goals = 0;
            hits = 0;
            points = assists + goals;
            penaltyMinutes = 0;
        }
        const dbPlayer = PlayerGameData.build({
            playerId: player.person.id,
            playerName: player.person.fullName,
            teamId: player.person.currentTeam.id,
            teamName: player.person.currentTeam.name,
            playerAge: player.person.currentAge,
            playerPosition: player.position.name,
            assists: assists,
            goals: goals,
            hits: hits,
            points: points,
            penaltyMinutes: penaltyMinutes,
            opponentTeam: gameData.homeTeamName,
            gameGamePk: gameData.gamePk
        })

        await db.addOrUpdatePlayerGameData(dbPlayer);
    });
}

export async function findGame(gamePk: string, db: DBClient): Promise<DBGame> {
    return await db.getGame(gamePk);
}
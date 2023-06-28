import { DataTypes, Model, Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres', 'user', 'temp', {host: 'localhost', dialect: 'postgres'});


export class DBClient {
    client: Sequelize;
    
    constructor() {
        this.client = sequelize;
    }

    async initializeDb() {
        await Game.sync()
        await PlayerGameData.sync()
    }

    async connect() {
        try {
            await this.client.authenticate();
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
    
    async addGame(game: Game) {
        await game.save()
    }

    async getLiveGames(gamePk: number): Promise<Game[]> {
        return Game.findAll({
            where: { isLive: true }
        })
    }

    async getGame(gamePk: number) {
        return Game.findOne({
            where: {
                gamePk: gamePk
            },
            include: PlayerGameData
        })
    }

    async removeLiveGame(gamePk: number) {
        Game.update(
            { isLive: false },
            { where: {gamePk: gamePk } }
        )
    }

    async addPlayerGameData(playerGameData: PlayerGameData) {
        await playerGameData.save()
    }
}

export class Game extends Model {
    declare gamePk: number;
    declare isLive: boolean;
}
Game.init(
    {
        gamePk: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        isLive: {
            type: DataTypes.BOOLEAN
        }
    },
    {sequelize, modelName: 'games'}
);


export class PlayerGameData extends Model {}
PlayerGameData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        playerId: {
            type: DataTypes.STRING
        },
        playerName: {
            type: DataTypes.STRING
        },
        teamId: {
            type: DataTypes.STRING
        },
        teamName: {
            type: DataTypes.STRING
        },
        playerAge: {
            type: DataTypes.INTEGER
        },
        playerPosition: {
            type: DataTypes.STRING
        },
        assists: {
            type: DataTypes.INTEGER
        },
        goals: {
            type: DataTypes.INTEGER
        },
        hits: {
            type: DataTypes.INTEGER
        },
        points: {
            type: DataTypes.INTEGER
        },
        penaltyMinutes: {
            type: DataTypes.INTEGER
        },
        opponentTeam: {
            type: DataTypes.STRING
        }
    },
    {sequelize, modelName: 'player_game_data'}
);

Game.hasMany(PlayerGameData);
PlayerGameData.belongsTo(Game);

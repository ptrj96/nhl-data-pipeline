import { DataTypes, Model, Sequelize } from "sequelize";

export const sequelize = new Sequelize('postgres', 'user', 'temp', {host: 'localhost', dialect: 'postgres'});


export class DBClient {
    client: Sequelize;
    
    constructor() {
        this.client = sequelize;
    }

    async initializeDb() {
        await sequelize.sync();
    }

    async initializeDbWithDrop() {
        await sequelize.drop();
        await sequelize.sync();
    }

    async drop() {
        await sequelize.drop();
    }
    

    async connect() {
        try {
            await this.client.authenticate();
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }

    async close() {
        try {
            await this.client.close();
        } catch (error) {
            console.error('Unable to close conection', error);
        }
    }
    
    async addGame(game: DBGame) {
        await game.save();
    }

    async getLiveGames(): Promise<DBGame[]> {
        return DBGame.findAll({
            where: { isLive: true }
        });
    }

    async getGame(gamePk: number): Promise<DBGame> {
        return DBGame.findOne({
            where: {
                gamePk: gamePk
            },
            include: PlayerGameData
        });
    }

    async removeLiveGame(gamePk: number) {
        DBGame.update(
            { isLive: false },
            { where: {gamePk: gamePk } }
        );
    }

    async addOrUpdatePlayerGameData(playerGameData: PlayerGameData) {
        await PlayerGameData.findOne({
            where: {
                gameGamePk: playerGameData.gameGamePk, 
                playerId: playerGameData.playerId}
            })
            .then(function(obj) {
                if(obj) {
                    obj.update(playerGameData);
                } else {
                    playerGameData.save();
                }
            });
    }

    async getPlayers() {
        return PlayerGameData.findAll();
    }
}

export class DBGame extends Model {
    declare gamePk: number;
    declare isLive: boolean;
}
DBGame.init(
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


export class PlayerGameData extends Model {
    declare id: number;
    declare playerId: number;
    declare playerName: string;
    declare teamId: string;
    declare teamName: string;
    declare playerAge: number;
    declare playerPosition: string;
    declare assists: number;
    declare goals: number;
    declare hits: number;
    declare points: number;
    declare penaltyMinutes: number;
    declare opponentTeam: string;
    declare gameGamePk: string;
}
PlayerGameData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        playerId: {
            type: DataTypes.INTEGER
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

DBGame.hasMany(PlayerGameData);
PlayerGameData.belongsTo(DBGame);

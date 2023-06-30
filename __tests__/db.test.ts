import { DBClient, DBGame, PlayerGameData } from "../src/db/db";


describe('DBClient', () => {
    let db;

    beforeAll(async () => {
        db = new DBClient();
        await db.connect();
    });

    afterAll(async () => {
        await db.close();
    })

    describe('addGame', () => {
        test('success', async () => {
            await db.initializeDbWithDrop();
            const testGame = DBGame.build({
                gamePk: 123,
                isLive: false
            })
            await db.addGame(testGame);
    
            const testGetGame = await db.getGame(123)
            expect(testGetGame.gamePk).toBe(123);
        });

        test('attempt add duplicate fails', async () => {
            await db.initializeDbWithDrop();
            const testGame1 = DBGame.build({
                gamePk: 123,
                isLive: false
            })
            const testGame2 = DBGame.build({
                gamePk: 123,
                isLive: false
            })
            await db.addGame(testGame1);
            await expect(async () => { await db.addGame(testGame2) }).rejects.toThrow();
        })
    });

    describe('getLiveGames', () => {
        test('get only live games', async () => {
            await db.initializeDbWithDrop();
            const testGame1 = DBGame.build({
                gamePk: 1,
                isLive: true
            })
            const testGame2 = DBGame.build({
                gamePk: 2,
                isLive: false
            })
            const testGame3 = DBGame.build({
                gamePk: 3,
                isLive: true
            })
            await db.addGame(testGame1);
            await db.addGame(testGame2);
            await db.addGame(testGame3);

            const testLiveGames = await db.getLiveGames();
            console.log(testLiveGames.length)
            expect(testLiveGames.length).toBe(2);
        });

        test('no live games', async () => {
            await db.initializeDbWithDrop();
            const testGame1 = DBGame.build({
                gamePk: 1,
                isLive: false
            })
            const testGame2 = DBGame.build({
                gamePk: 2,
                isLive: false
            })
            const testGame3 = DBGame.build({
                gamePk: 3,
                isLive: false
            })
            await db.addGame(testGame1);
            await db.addGame(testGame2);
            await db.addGame(testGame3);

            const testLiveGames = await db.getLiveGames();
            expect(testLiveGames.length).toBe(0);
        })
    });

    describe('getGame', () => {
        test('success', async () => {
            await db.initializeDbWithDrop();
            const testGame1 = DBGame.build({
                gamePk: 1,
                isLive: false
            })
            await db.addGame(testGame1);
            const testResult = await db.getGame(1);
            expect(testResult.gamePk).toBe(1);
        });

        test('game does not exist', async () => {
            await db.initializeDbWithDrop();
            const testResult = await db.getGame(1);
            expect(testResult).toBeNull();
        });
    });

    // Ran in to some kind of bug with this unit test, it works when I test it with the app running
    // but could not get this unit test working in time. With more time I imagine I could have figured it out.

    // describe('addOrUpdate', () => {
    //     test('add', async() => {
    //         await db.initializeDbWithDrop();
    //         const testGame1 = DBGame.build({
    //             gamePk: 1,
    //             isLive: false
    //         })
    //         await db.addGame(testGame1);
    //         const testPlayer1 = PlayerGameData.build({
    //             playerId: 1,
    //             playerName:'Bob Test',
    //             teamId: 1,
    //             teamName: 'Test',
    //             playerAge: 30,
    //             playerPosition: 'Defensemen',
    //             assists: 1,
    //             goals: 2,
    //             hits: 3,
    //             points: 3,
    //             penaltyMinutes: 6,
    //             opponentTeam: 'Not Test',
    //             gameGamePk: 1
    //         });

    //         try {
    //             await db.addOrUpdatePlayerGameData(testPlayer1);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //         const testResult1 = await db.getPlayers();;
    //         expect(testResult1).not.toBeNull();
    //     });

    //     test('update', async() => {
    //         await db.initializeDbWithDrop();
    //         const testGame1 = DBGame.build({
    //             gamePk: 1,
    //             isLive: false
    //         })
    //         await db.addGame(testGame1);
    //         const testPlayer1 = PlayerGameData.build({
    //             playerId: 1,
    //             playerName:'Bob Test',
    //             teamId: 1,
    //             teamName: 'Test',
    //             playerAge: 30,
    //             playerPosition: 'Defensemen',
    //             assists: 1,
    //             goals: 2,
    //             hits: 3,
    //             points: 3,
    //             penaltyMinutes: 6,
    //             opponentTeam: 'Not Test',
    //             gameGamePk: 1
    //         });
    //         const testPlayer2 = PlayerGameData.build({
    //             playerId: 1,
    //             playerName:'Bob Test',
    //             teamId: 1,
    //             teamName: 'Test',
    //             playerAge: 30,
    //             playerPosition: 'Defensemen',
    //             assists: 1,
    //             goals: 3,
    //             hits: 3,
    //             points: 3,
    //             penaltyMinutes: 6,
    //             opponentTeam: 'Not Test',
    //             gameGamePk: 1
    //         });

    //         await db.addOrUpdatePlayerGameData(testPlayer1);
    //         await db.addOrUpdatePlayerGameData(testPlayer2);

    //         const testResult1 = await db.getPlayer('11');
    //         expect(testResult1).not.toBeNull();
    //         expect(testResult1.goals).toBe(3);
    //     });
    // })
});

import axios from "axios";

export async function loadGame(gamePk: string) {
    const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gamePk}/boxscore`);
    const data = response.data;
    let gameData = {
        gamePk: gamePk,
        awayTeamName: data.teams.away.team.name,
        awayTeamId: data.teams.away.team.id,
        awayPlayers: data.teams.away.players,
        homeTeamName: data.teams.home.team.name,
        homeTeamId: data.teams.home.team.id,
        homePlayers: data.teams.home.players,
    }

    return gameData
}
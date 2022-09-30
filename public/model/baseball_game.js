export class Baseball_Game{
    constructor(){
        this.winner = null;
        this.statusMessage = "Ready to Play";
        this.attempts = 1;
        this.gameKey = [];
        this.gameGuess = [];
        this.buttons = null;
        let gameKeys = []
        while(gameKeys.length<3){
            const randomNumber  = Math.floor(Math.random() * 10);
            if(gameKeys.indexOf(randomNumber) === -1){
                gameKeys.push(randomNumber);
            }
        }
        this.gameKey = gameKeys;
    }

}


export function get_strike_count(baseballGame){
    let strikes = 0;
    for (let i = 0; i < baseballGame.gameGuess.length; i++) {
        if(baseballGame.gameKey.indexOf(baseballGame.gameGuess[i]) != -1 && baseballGame.gameKey.indexOf(baseballGame.gameGuess[i]) == i){
            strikes += 1;
        }
    }
    return strikes;
}

export function get_ball_count(baseballGame){
    let balls = 0;
    for (let i = 0; i < baseballGame.gameGuess.length; i++) {
        if(baseballGame.gameKey.indexOf(baseballGame.gameGuess[i]) != -1 && baseballGame.gameKey.indexOf(baseballGame.gameGuess[i]) != i){
            balls += 1;
        }
    }
    return balls;
}
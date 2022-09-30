import { Baseball_Game, get_ball_count, get_strike_count } from "../model/baseball_game.js";
import { unauthorisedAccess } from "./unauthorized_access.js";
import * as Elements from "./elements.js";
import { routePath } from "../controller/route.js";
import { currentUser } from "../controller/firebase_auth.js";
import { info } from "./util.js";
import { DEV } from "../model/constants.js";
import { addBaseballGameHstory, getBaseballGameHistory } from "../controller/firestore_controller.js";

export function addEventListener() {
    Elements.menus.baseball.addEventListener("click", () => {
        history.pushState(null, null, routePath.BASEBALLGAME);
        baseball_page();
    });
}

export async function baseball_page() {
    if (!currentUser) {
        Elements.root.innerHTML = unauthorisedAccess();
        return;
    }
    const response = await fetch("/viewpage/templates/baseball_page.html", { cache: "no-store" });
    let html = await response.text();
    Elements.root.innerHTML = html;

    gameModel = new Baseball_Game();

    getScreenElements();
    addGameEvents();
    updateScreen();
}

let gameModel;

let screen = {
    gameKey: null,
    gameGuess: null,
    buttons: null,
    newGameButton: null,
    historyButton: null,
    status: null,
};

function getScreenElements() {
    screen.gameKey = document.getElementById("game-key");
    screen.gameGuess = document.getElementById("game-guess");
    screen.buttons = [];
    for (let i = 0; i < 10; i++) {
        screen.buttons.push(document.getElementById(`button-${i}`));
    }
    screen.newGameButton = document.getElementById("buttn-new-game");
    screen.historyButton = document.getElementById("button-history");
    screen.status = document.getElementById("status-message");
}

function addGameEvents() {
    screen.historyButton.addEventListener("click", historyButtonEvent);
    for (let i = 0; i < 10; i++) {
        screen.buttons[i].addEventListener("click", buttonPressListener);
    }

    screen.newGameButton.addEventListener("click", () => {
        gameModel = new Baseball_Game();
        updateScreen();
    });
}

async function buttonPressListener(event) {
    const button_number = Number(event.target.innerText);
    gameModel.gameGuess.push(button_number);
    screen.buttons[button_number].disabled = true;
    if (gameModel.gameGuess.length == 3) {
        gameModel.statusMessage += `<br>[${gameModel.attempts}] Guess: ${gameModel.gameGuess.join(",")} B#: ${get_ball_count(gameModel)} S#: ${get_strike_count(gameModel)}`;

        if (gameModel.gameKey.length === gameModel.gameGuess.length &&
            gameModel.gameKey.every((value, index) => value === gameModel.gameGuess[index])) {
            gameModel.statusMessage += `<br>(Struck out~~ after ${gameModel.attempts} attempts!)`;
            let gamePlay = {
                email: currentUser.email,
                attempts: gameModel.attempts,
                timestamp: Date.now(),
            };
            try {
                await addBaseballGameHstory(gamePlay);
                info("Game Over", `Struck out~~ after ${gameModel.attempts} attempts!`);
                gameModel.winner = true;
            } catch (e) {
                info("Game Over", `Failed to save the game play history: ${e}`);
                if (DEV) console.log("Game over: failed to save:", e);
            }
        } else {
            gameModel.attempts = gameModel.attempts + 1;
            gameModel.gameGuess = [];
        }
    }
    updateScreen();
}

async function historyButtonEvent() {
    let history;
    try {
        history = await getBaseballGameHistory(currentUser.email);
        let html = `
      <table class="table table-success table-striped">
      <tr><th>Attempts</th><th>Date</th></tr>
      <tbody>
    `;
        for (let i = 0; i < history.length; i++) {
            html += `
      <tr>
      <td>${history[i].attempts}</td>
      <td>${new Date(history[i].timestamp).toLocaleString()}</td>
      </tr>
      `;
        }
        html += "</tbody></tabl>";
        gameModel.statusMessage = html;
        updateScreen();
    } catch (e) {
        if (DEV) console.log("ERROR; history button", e);
        info("Failed to get game history", JSON.stringify(e));
    }
}

function updateScreen() {
    screen.gameKey.innerHTML = gameModel.gameKey.join(",");
    screen.gameGuess.innerHTML = gameModel.gameGuess.join(",");
    screen.status.innerHTML = gameModel.statusMessage;
    screen.newGameButton.disabled = gameModel.winner == null;
    screen.buttons.forEach((button) => {
        button.disabled = gameModel.winner != null;
    });
    gameModel.gameGuess.forEach((i) => {
        screen.buttons[i].disabled = true;
    });
}
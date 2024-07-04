import p5 from "p5";
import { Board } from "../items/board";
import { Player } from "../items/player";
import { BoardConfig, updateCookie } from "../config/config";
import titleBgUrl from "../img/TitleBackground.png";
import foodUrl from "../img/Food.png";
import bodyUpUrl from "../img/Body.png";
import bodyLeftUrl from "../img/Body-Left.png";
import bodyRightUrl from "../img/Body-Right.png";
import headUrl from "../img/Head.png";
import neckUpDownUrl from "../img/Neck-UpDown.png";
import neckDownLeftUrl from "../img/Neck-DownLeft.png";
import neckDownrightUrl from "../img/Neck-DownRight.png";

import gameStartUrl from "../audio/Game-Start.mp3";
import chicken0Url from "../audio/Chicken-0.mp3";
import chicken1Url from "../audio/Chicken-1.mp3";
import chicken3Url from "../audio/Chicken-3.mp3";
import chicken4Url from "../audio/Chicken-4.mp3";
import chicken5Url from "../audio/Chicken-5.mp3";
import { ImageSet, States } from "../config/types";
import { Menu } from "./menu";
import { Home } from "./home";
import { GameOver } from "./gameOver";

// Exporting a function called 'mainSketch'
export const mainSketch = (p: p5) => {
    let player: Player;
    let board: Board;
    let menu: Menu;
    let home: Home;
    let gameover: GameOver;

    let points: number;
    let win: boolean;
    let lose: boolean;
    let elaspedTime: number;

    let state: string;

    let titleBgImg = new p5.Image(0, 0);
    let foodImg = new p5.Image(0, 0);
    let bodyUpImg = new p5.Image(0, 0);
    let bodyLeftImg = new p5.Image(0, 0);
    let bodyRightImg = new p5.Image(0, 0);
    let headImg = new p5.Image(0, 0);
    let neckUpDownImg = new p5.Image(0, 0);
    let neckDownLeftImg = new p5.Image(0, 0);
    let neckDownRightImg = new p5.Image(0, 0);

    let gameStartAudio: p5.MediaElement;
    let chickenAudio: p5.MediaElement[] = [];
    let images: ImageSet;

    p.preload = () => {
        titleBgImg = p.loadImage(titleBgUrl);
        foodImg = p.loadImage(foodUrl);
        bodyUpImg = p.loadImage(bodyUpUrl);
        bodyLeftImg = p.loadImage(bodyLeftUrl);
        bodyRightImg = p.loadImage(bodyRightUrl);
        headImg = p.loadImage(headUrl);
        neckUpDownImg = p.loadImage(neckUpDownUrl);
        neckDownLeftImg = p.loadImage(neckDownLeftUrl);
        neckDownRightImg = p.loadImage(neckDownrightUrl);
        gameStartAudio = p.createAudio(gameStartUrl);
        chickenAudio.push(p.createAudio(chicken0Url));
        chickenAudio.push(p.createAudio(chicken1Url));
        chickenAudio.push(p.createAudio(chicken3Url));
        chickenAudio.push(p.createAudio(chicken4Url));
        chickenAudio.push(p.createAudio(chicken5Url));
    };

    const setSize = () => {
        const a = document.getElementById("sketch") ?? document.body;
        const size = Math.min(p.windowWidth * 0.75, p.windowHeight * 0.75);
        a.style.width = `${size}px`;
        a.style.height = `${size}px`;
        p.resizeCanvas(size, size);
    };

    const setState = (newState: string) => {
        state = newState;
    };

    const checkEndState = (newPos: p5.Vector) => {
        const body = player.getBody();
        const freeSpots = board.getFreeSpots(body);

        // all tiles are taken up. Win state
        if (0 === freeSpots.length && 0 === board.foodRemaining()) {
            win = true;
            return;
        }

        // player landed on themselves. We don't care about the head because newPos === head
        if (!BoardConfig.godMode && body.slice(1).some((tile) => tile.equals(newPos))) {
            lose = true;
            return;
        }

        // Player ran into boarder and board warp is disabled
        if (
            !BoardConfig.boardWarp &&
            (newPos.x >= BoardConfig.boardWidth || newPos.x < 0 || newPos.y >= BoardConfig.boardHeight || newPos.y < 0)
        ) {
            lose = true;
            return;
        }
    };

    const handleMove = () => {
        const randX = p.floor(p.random(0, 3)) - 1; // -1,0,1
        let randY = 0;
        const choices = [-1, 1];

        if (randX === 0) {
            randY = choices[Math.floor(Math.random() * choices.length)];
        }

        if (BoardConfig.randomMovement && Math.random() * 10 > 3) {
            player.setDirection(new p5.Vector(randX, randY));
        }
        const newPos = player.move();
        if (board.containsFood(newPos)) {
            points++;
            const score = document.getElementById("score");
            if (score) {
                score.textContent = `Score: ${points}`;
            }

            chickenAudio[Math.floor(Math.random() * chickenAudio.length)].play();
            player.eat();
            board.removeFood(newPos);
            board.addFood(player.getBody());
        }
        checkEndState(newPos);
    };

    const setInitialState = () => {
        player = new Player(0, 0);
        board = new Board();
        for (let i = 0; i < BoardConfig.startingChicken; i++) {
            board.addFood(player.getBody());
        }

        points = 0;
        const score = document.getElementById("score");
        if (score) {
            score.textContent = `Score: ${points}`;
        }

        win = false;
        lose = false;
        elaspedTime = 0;
    };

    const drawPlayState = () => {
        elaspedTime += p.deltaTime;

        if (elaspedTime >= BoardConfig.delayMs) {
            elaspedTime = 0;
            handleMove();
        }

        // Clear the frame
        p.background(255);

        // draw board with food
        board.draw(p, foodImg);

        // draw player
        player.draw(p, images);

        if (win || lose) {
            setState(States.GAMEOVER);
            return;
        }
    };

    // Calling p5.js functions, using the variable 'p'
    p.setup = () => {
        // Creating a canvas using the entire screen of the webpage
        p.createCanvas(0, 0);
        setSize();
        p.strokeWeight(3);
        p.fill(BoardConfig.boardFill);
        p.stroke(BoardConfig.boardStroke);
        p.background(255);
        p.frameRate(20);
        menu = new Menu(p, setState);
        home = new Home(p, setState, gameStartAudio);
        gameover = new GameOver(p, setState);

        images = {
            foodImg,
            bodyUpImg,
            bodyLeftImg,
            bodyRightImg,
            headImg,
            neckUpDownImg,
            neckDownLeftImg,
            neckDownRightImg,
        };

        setInitialState();

        state = States.SCREENSELECT;
        const homeButton = document.getElementById("home");
        if (homeButton) {
            homeButton.onclick = () => {
                state = States.SCREENSELECT;
                menu.hide();
                updateCookie();
                setInitialState();
            };
        }
    };

    p.draw = () => {
        switch (state) {
            case States.SCREENSELECT:
                home.draw(p, titleBgImg);
                setInitialState();
                break;
            case States.MENU:
                menu.draw(p);
                setInitialState();
                break;
            case States.PLAYING:
                drawPlayState();
                break;
            case States.GAMEOVER:
                gameover.draw(p, points);
                break;
        }
    };

    p.windowResized = () => {
        setSize();
    };

    p.keyPressed = () => {
        switch (p.key) {
            case "w":
            case "ArrowUp":
                if (!lose && !win && player.setDirection(new p5.Vector(0, -1))) {
                    handleMove();
                    elaspedTime = 0;
                }
                break;
            case "d":
            case "ArrowRight":
                if (!lose && !win && player.setDirection(new p5.Vector(1, 0))) {
                    handleMove();
                    elaspedTime = 0;
                }
                break;
            case "s":
            case "ArrowDown":
                if (!lose && !win && player.setDirection(new p5.Vector(0, 1))) {
                    handleMove();
                    elaspedTime = 0;
                }
                break;
            case "a":
            case "ArrowLeft":
                if (!lose && !win && player.setDirection(new p5.Vector(-1, 0))) {
                    handleMove();
                    elaspedTime = 0;
                }
                break;
            case "Escape":
                if (!lose && !win && player.setDirection(new p5.Vector(0, 0))) {
                    handleMove();
                    elaspedTime = 0;
                }
                break;
            default:
                break;
        }
    };
};

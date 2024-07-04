import p5 from "p5";
import { BoardConfig } from "../config/config";

export class Board {
    #food: p5.Vector[] = [];

    printFood() {
        const loc: string[] = [];
        this.#food.forEach((food) => {
            loc.push(`<${food.x},${food.y}>`);
        });

        console.log(`Food: [${loc.join(",")}]`);
    }

    containsFood(position: p5.Vector) {
        return this.#food.some((food) => food.equals(position));
    }

    foodRemaining() {
        return this.#food.length;
    }

    getFreeSpots(playerBody: p5.Vector[]) {
        const obsticles: p5.Vector[] = [];
        const freeSpots: p5.Vector[] = [];

        playerBody.forEach((tile) => {
            obsticles.push(tile);
        });
        this.#food.forEach((food) => {
            obsticles.push(food);
        });

        for (let x = 0; x < BoardConfig.boardWidth; x++) {
            for (let y = 0; y < BoardConfig.boardHeight; y++) {
                if (false === obsticles.some((item) => item.equals(new p5.Vector(x, y)))) {
                    freeSpots.push(new p5.Vector(x, y));
                }
            }
        }

        return freeSpots;
    }

    addFood(playerBody: p5.Vector[]) {
        const options = this.getFreeSpots(playerBody);

        if (0 === options.length) {
            return;
        }

        const choice = options[Math.floor(Math.random() * options.length)];
        this.#food.push(choice);
    }

    removeFood(position: p5.Vector) {
        this.#food = this.#food.filter((item) => false === item.equals(position));
    }

    draw(p: p5, foodImg: p5.Image) {
        p.fill(BoardConfig.boardFill);
        p.stroke(BoardConfig.boardStroke);
        const scaleX = p.width / BoardConfig.boardWidth;
        const scaleY = p.height / BoardConfig.boardHeight;
        for (let x = 0; x < BoardConfig.boardWidth; x++) {
            for (let y = 0; y < BoardConfig.boardHeight; y++) {
                const tile = new p5.Vector(x, y).mult(scaleX, scaleY);
                p.rect(tile.x, tile.y, scaleX, scaleY);
            }
        }

        this.#food.forEach((food) => {
            const pos = food.copy().mult(scaleX, scaleY);
            p.image(foodImg, pos.x, pos.y, scaleX, scaleY);
        });
    }
}

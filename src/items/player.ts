import p5 from "p5";
import { BoardConfig } from "../config/config";
import { ImageSet } from "../config/types";

export class Player {
    // (x, y), (x, y) ...
    // index 0 is head. index #size-1 is tail
    #body: p5.Vector[] = [];
    #size = 1;
    #direction = new p5.Vector(1, 0);
    #lastRemoved = new p5.Vector(-1, -1);

    constructor(startX: number, startY: number) {
        this.#body.push(new p5.Vector(startX, startY));
        this.#lastRemoved = new p5.Vector(startX, startY);
    }

    getBody() {
        const copyArray: p5.Vector[] = [];
        this.#body.forEach((tile) => {
            copyArray.push(tile.copy());
        });
        return copyArray;
    }

    printBody() {
        console.log("----------");
        const printLog: string[] = [];
        this.#body.forEach((cell) => {
            printLog.push(`(${cell.x},${cell.y})`);
        });
        console.log(`Body: [${printLog.join(",")}]`);
    }

    /** Sets the direction the player is moving. Does nothing if the direction would move us into head-1 */
    setDirection(direction: p5.Vector) {
        if (this.#direction.equals(direction) || this.#direction.copy().mult(-1).equals(direction)) {
            return false;
        }
        this.#direction = direction;
        return true;
    }

    /** Draws the player in a single tile */
    #drawSinle(p: p5, baseImg: p5.Image, headImg: p5.Image) {
        const scaleX = p.width / BoardConfig.boardWidth;
        const scaleY = p.height / BoardConfig.boardHeight;
        p.push();
        const basePos = this.#body[0]
            .copy()
            .mult(scaleX, scaleY)
            .add(scaleX / 2, scaleY / 2);
        p.translate(basePos);
        p.rotate(this.#direction.angleBetween(new p5.Vector(0, -1)) * -1);
        p.image(baseImg, -scaleX / 2, scaleY / 6, scaleX, scaleY / 3);
        p.image(headImg, -scaleX / 2, (-5 * scaleY) / 6, scaleX, scaleY);
        p.pop();
    }

    /** Draws the player in a single tile */
    #drawTile(p: p5, img: p5.Image, position: p5.Vector, direction: p5.Vector) {
        const scaleX = p.width / BoardConfig.boardWidth;
        const scaleY = p.height / BoardConfig.boardHeight;
        p.push();
        const basePos = position
            .copy()
            .mult(scaleX, scaleY)
            .add(scaleX / 2, scaleY / 2);
        p.translate(basePos);
        p.rotate(direction.angleBetween(new p5.Vector(0, -1)) * -1);
        p.image(img, -scaleX / 2, -scaleY / 2, scaleX, scaleY);
        p.pop();
    }

    #directionToImage(
        prevDirection: p5.Vector,
        currentDirection: p5.Vector,
        upDownImage: p5.Image,
        downLeftImg: p5.Image,
        downRightImg: p5.Image,
    ): p5.Image {
        if (prevDirection.equals(0, 1) && currentDirection.equals(1, 0)) {
            return downLeftImg;
        } else if (prevDirection.equals(1, 0) && currentDirection.equals(0, -1)) {
            return downLeftImg;
        } else if (prevDirection.equals(0, -1) && currentDirection.equals(-1, 0)) {
            return downLeftImg;
        } else if (prevDirection.equals(-1, 0) && currentDirection.equals(0, 1)) {
            return downLeftImg;
        } else if (prevDirection.equals(1, 0) && currentDirection.equals(0, 1)) {
            return downRightImg;
        } else if (prevDirection.equals(0, -1) && currentDirection.equals(1, 0)) {
            return downRightImg;
        } else if (prevDirection.equals(-1, 0) && currentDirection.equals(0, -1)) {
            return downRightImg;
        } else if (prevDirection.equals(0, 1) && currentDirection.equals(-1, 0)) {
            return downRightImg;
        }

        return upDownImage;
    }

    #clamp(direction: p5.Vector) {
        if (direction.x > 1) {
            direction.x = -1;
        }
        if (direction.x < -1) {
            direction.x = 1;
        }
        if (direction.y > 1) {
            direction.y = -1;
        }
        if (direction.y < -1) {
            direction.y = 1;
        }
        return direction;
    }

    /** Draws the player on top of the canvas. No info is updated, just drawn */
    draw(p: p5, images: ImageSet) {
        if (this.#body.length === 1) {
            this.#drawSinle(p, images.bodyUpImg, images.headImg);
            return;
        }

        const prevBaseDirection = this.#clamp(this.#body[this.#body.length - 1].copy().sub(this.#lastRemoved));
        const baseDirection = this.#clamp(
            this.#body[this.#body.length - 2].copy().sub(this.#body[this.#body.length - 1]),
        );
        const baseImage = this.#directionToImage(
            prevBaseDirection,
            baseDirection,
            images.bodyUpImg,
            images.bodyLeftImg,
            images.bodyRightImg,
        );
        this.#drawTile(p, baseImage, this.#body[this.#body.length - 1], baseDirection);

        for (let i = this.#body.length - 2; i > 0; i--) {
            const prevDirection = this.#clamp(this.#body[i].copy().sub(this.#body[i + 1]));
            const direction = this.#clamp(this.#body[i - 1].copy().sub(this.#body[i]));

            const img = this.#directionToImage(
                prevDirection,
                direction,
                images.neckUpDownImg,
                images.neckDownLeftImg,
                images.neckDownRightImg,
            );
            this.#drawTile(p, img, this.#body[i], direction);
        }

        this.#drawTile(p, images.headImg, this.#body[0], this.#direction);
    }

    /** Increases the size and adds in previous tail as new tail.
     * Idealy should be call after update() and was found to land on a food tile.
     */
    eat() {
        this.#size++;
        this.#body.push(this.#lastRemoved);
    }

    /** Moves the player on tile in the direction they are facing */
    move() {
        if (this.#direction.equals(0, 0)) {
            return this.#body[0];
        }

        const newPos = this.#body[0].copy().add(this.#direction);

        if (BoardConfig.boardWarp && newPos.x >= BoardConfig.boardWidth) {
            newPos.x = 0;
        } else if (BoardConfig.boardWarp && newPos.x < 0) {
            newPos.x = BoardConfig.boardWidth - 1;
        } else if (BoardConfig.boardWarp && newPos.y >= BoardConfig.boardHeight) {
            newPos.y = 0;
        } else if (BoardConfig.boardWarp && newPos.y < 0) {
            newPos.y = BoardConfig.boardHeight - 1;
        }

        // If we our #body is big enough, then we remove the tail and append the new head to 0.
        if (this.#body.length === this.#size) {
            this.#lastRemoved = this.#body.pop() ?? new p5.Vector(-1, -1);
        } else {
            this.#lastRemoved = (this.#body.length > 0 && this.#body[this.#body.length - 1]) || new p5.Vector(-1, -1);
        }
        this.#body.unshift(newPos);

        return newPos;
    }
}

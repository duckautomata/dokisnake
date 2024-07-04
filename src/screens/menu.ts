import p5 from "p5";
import { BoardConfig, readCookie, updateCookie } from "../config/config";
import { States } from "../config/types";

export class Menu {
    #backButton: p5.Element;
    #useWarp: p5.Element;
    #useWarpText: p5.Element;
    #godMode: p5.Element;
    #godModeText: p5.Element;
    #randomMovement: p5.Element;
    #randomMovementText: p5.Element;
    #sizeSlider: p5.Element;
    #sizeSliderText: p5.Element;
    #chickenSlider: p5.Element;
    #chickenSliderText: p5.Element;
    #delaySlider: p5.Element;
    #delaySliderText: p5.Element;

    constructor(p: p5, setState: Function) {
        readCookie();

        this.#backButton = p
            .createButton("Back")
            .id("p5Button")
            .mouseClicked(() => {
                this.hide();
                updateCookie();
                setState(States.SCREENSELECT);
            });
        this.#useWarpText = p.createP(`Warp when Doki goes off the board: ${BoardConfig.boardWarp}`);
        this.#useWarp = p.createCheckbox("", BoardConfig.boardWarp);
        this.#godModeText = p.createP(`God Mode: ${BoardConfig.godMode}`);
        this.#godMode = p.createCheckbox("", BoardConfig.godMode);
        this.#randomMovementText = p.createP(`Random Movement: ${BoardConfig.randomMovement}`);
        this.#randomMovement = p.createCheckbox("", BoardConfig.randomMovement);
        this.#sizeSliderText = p.createP(`Board size [${BoardConfig.boardWidth}, ${BoardConfig.boardHeight}]`);
        this.#sizeSlider = p.createSlider(2, 40, BoardConfig.boardHeight, 1);
        this.#chickenSliderText = p.createP(`Number of Chicken: ${BoardConfig.startingChicken}`);
        this.#chickenSlider = p.createSlider(1, 40, BoardConfig.startingChicken, 1);
        this.#delaySliderText = p.createP(`Tick speed: ${BoardConfig.delayMs} ms`);
        this.#delaySlider = p.createSlider(10, 1000, BoardConfig.delayMs, 1);

        this.hide();
    }

    draw(p: p5) {
        // Updates values
        // @ts-ignore
        BoardConfig.boardWarp = this.#useWarp.checked();
        // @ts-ignore
        BoardConfig.godMode = this.#godMode.checked();
        // @ts-ignore
        BoardConfig.randomMovement = this.#randomMovement.checked();
        BoardConfig.boardWidth = +this.#sizeSlider.value();
        BoardConfig.boardHeight = +this.#sizeSlider.value();
        BoardConfig.startingChicken = +this.#chickenSlider.value();
        BoardConfig.delayMs = +this.#delaySlider.value();

        const buttonWidth = 100;
        const buttonHeight = 50;
        const padding = 5;
        p.background(BoardConfig.boardFill);
        this.#backButton.size(buttonWidth, buttonHeight).position(padding, -p.height, "relative").show();

        this.#useWarpText.html(`Warp when Doki goes off the board: ${BoardConfig.boardWarp}`);
        this.#useWarpText.position(padding, -p.height + padding, "relative").show();
        this.#useWarp.size(50, 10).position(padding, -p.height, "relative").show();

        this.#godModeText.html(`God Mode: ${BoardConfig.godMode}`);
        this.#godModeText.position(padding, -p.height + padding, "relative").show();
        this.#godMode.size(50, 10).position(padding, -p.height, "relative").show();

        this.#randomMovementText.html(`Random Movement: ${BoardConfig.randomMovement}`);
        this.#randomMovementText.position(padding, -p.height + padding, "relative").show();
        this.#randomMovement.size(50, 10).position(padding, -p.height, "relative").show();

        this.#sizeSliderText.html(`Board size [${this.#sizeSlider.value()}, ${this.#sizeSlider.value()}]`);
        this.#sizeSliderText.position(padding, -p.height + padding, "relative").show();
        this.#sizeSlider
            .size(200)
            .position(padding + this.#sizeSlider.width / 2, -p.height + padding, "relative")
            .show();

        this.#chickenSliderText.html(`Number of Chicken: ${this.#chickenSlider.value()}`);
        this.#chickenSliderText.position(padding, -p.height + padding, "relative").show();
        this.#chickenSlider
            .size(200)
            .position(padding + this.#chickenSlider.width / 2, -p.height + padding, "relative")
            .show();

        this.#delaySliderText.html(`Tick speed: ${this.#delaySlider.value()} ms`);
        this.#delaySliderText.position(padding, -p.height + padding, "relative").show();
        this.#delaySlider
            .size(200)
            .position(padding + this.#delaySlider.width / 2, -p.height + padding, "relative")
            .show();
    }

    hide() {
        this.#backButton.hide();
        this.#useWarpText.hide();
        this.#useWarp.hide();
        this.#godModeText.hide();
        this.#godMode.hide();
        this.#randomMovementText.hide();
        this.#randomMovement.hide();
        this.#sizeSlider.hide();
        this.#sizeSliderText.hide();
        this.#chickenSlider.hide();
        this.#chickenSliderText.hide();
        this.#delaySlider.hide();
        this.#delaySliderText.hide();
    }
}

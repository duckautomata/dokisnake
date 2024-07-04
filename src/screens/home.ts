import p5 from "p5";
import { States } from "../config/types";

export class Home {
    #menuButton: p5.Element;
    #playButton: p5.Element;

    constructor(p: p5, setState: Function, startAudio: p5.MediaElement) {
        this.#menuButton = p
            .createButton("Menu")
            .id("p5Button")
            .mouseClicked(() => {
                this.hide();
                setState(States.MENU);
            });
        this.#playButton = p
            .createButton("Start")
            .id("p5Button")
            .mouseClicked(() => {
                this.hide();
                startAudio.play();
                setState(States.PLAYING);
            });
        this.hide();
    }

    draw(p: p5, bgImage: p5.Image) {
        const buttonWidth = 100;
        const buttonHeight = 75;
        const padding = 5;
        p.background(bgImage);
        this.#menuButton
            .size(buttonWidth, buttonHeight)
            .position(p.width / 2 - this.#menuButton.width / 2, -p.height, "relative")
            .show();
        this.#playButton
            .size(buttonWidth, buttonHeight)
            .position(p.width / 2 - this.#playButton.width / 2, -p.height + padding, "relative")
            .show();
    }

    hide() {
        this.#menuButton.hide();
        this.#playButton.hide();
    }
}

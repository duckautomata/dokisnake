import p5 from "p5";
import { States } from "../config/types";

export class GameOver {
    #GOText: p5.Element;
    #endText: p5.Element;
    #tryAgainButton: p5.Element;

    constructor(p: p5, setState: Function) {
        this.#GOText = p.createP("GAME OVER").id("p5GoText");
        this.#endText = p.createP("Final Score").id("p5ScoreText");
        this.#tryAgainButton = p
            .createButton("Try Again")
            .id("p5Button")
            .mouseClicked(() => {
                this.hide();
                setState(States.SCREENSELECT);
            });
        this.hide();
    }

    draw(p: p5, score: number) {
        const buttonWidth = 100;
        const buttonHeight = 75;
        const padding = 5;

        this.#GOText.html("GAME OVER");
        this.#GOText.position((7 * p.width) / 17, -p.height + padding, "relative").show();

        this.#endText.html(`Final Score: ${score}`);
        this.#endText.position((7 * p.width) / 17, -p.height + padding, "relative").show();

        this.#tryAgainButton
            .size(buttonWidth, buttonHeight)
            .position(p.width / 2 - this.#tryAgainButton.width / 2, -p.height + padding, "relative")
            .show();
    }

    hide() {
        this.#GOText.hide();
        this.#endText.hide();
        this.#tryAgainButton.hide();
    }
}

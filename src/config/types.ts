import p5 from "p5";

export type ImageSet = {
    foodImg: p5.Image;
    bodyUpImg: p5.Image;
    bodyLeftImg: p5.Image;
    bodyRightImg: p5.Image;
    headImg: p5.Image;
    neckUpDownImg: p5.Image;
    neckDownLeftImg: p5.Image;
    neckDownRightImg: p5.Image;
};

export const States = {
    SCREENSELECT: "SCREENSELECT",
    MENU: "MENU",
    PLAYING: "PLAYING",
    GAMEOVER: "GAMEOVER",
};

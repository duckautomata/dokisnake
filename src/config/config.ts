import cookie from "cookiejs";

export const BoardConfig = {
    boardWidth: 12,
    boardHeight: 12,
    boardFill: [125, 160, 72],
    boardStroke: [62, 91, 25],
    delayMs: 200, // how many ms we wait before moving the player
    boardWarp: true,
    startingChicken: 2,
    godMode: false,
    randomMovement: false,
};

export const getCookie = (key: string, alt: any) => {
    const value = cookie.get(key);

    if (!value) {
        return alt;
    } else if (value === "true") {
        return true;
    } else if (value === "false") {
        return false;
    }

    return value;
};

export const setCookie = (key: string, value: string) => {
    cookie.set(key, value);
};

export const readCookie = () => {
    BoardConfig.boardWarp = getCookie("warp", BoardConfig.boardWarp);
    BoardConfig.godMode = getCookie("godMode", BoardConfig.godMode);
    BoardConfig.randomMovement = getCookie("randomMovement", BoardConfig.randomMovement);
    BoardConfig.boardWidth = +getCookie("boardSize", BoardConfig.boardWidth);
    BoardConfig.boardHeight = +getCookie("boardSize", BoardConfig.boardHeight);
    BoardConfig.startingChicken = +getCookie("startingChicken", BoardConfig.startingChicken);
    BoardConfig.delayMs = +getCookie("tickSpeed", BoardConfig.delayMs);
};

export const updateCookie = () => {
    setCookie("warp", `${BoardConfig.boardWarp}`);
    setCookie("godMode", `${BoardConfig.godMode}`);
    setCookie("randomMovement", `${BoardConfig.randomMovement}`);
    setCookie("boardSize", `${BoardConfig.boardWidth}`);
    setCookie("startingChicken", `${BoardConfig.startingChicken}`);
    setCookie("tickSpeed", `${BoardConfig.delayMs}`);
};

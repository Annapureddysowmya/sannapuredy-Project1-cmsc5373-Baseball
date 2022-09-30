import { tictactoe_page } from "../viewpage/tictactoe_page.js";
import { about_page } from "../viewpage/about_page.js";
import { baseball_page } from "../viewpage/baseball_page.js";

export const routePath = {
    TICTACTOE: '/tictactoe',
    ABOUT: '/about',
    BASEBALLGAME: '/BaseballGame',
}

export const routes = [
    {path: routePath.TICTACTOE, page: tictactoe_page},
    {path: routePath.ABOUT, page: about_page},
    {path: routePath.BASEBALLGAME, page: baseball_page},
];

export function routing(pathname, hash) {
    const route = routes.find(element => element.path == pathname);
    if (route) route.page();
    else routes[0].page();
}
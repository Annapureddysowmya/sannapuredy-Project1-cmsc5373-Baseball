import * as Elements from './elements.js';
import { routePath } from '../controller/route.js';
import { unauthorisedAccess } from './unauthorized_access.js';
import { currentUser } from '../controller/firebase_auth.js';


export function addEventListener(){

    Elements.menus.about.addEventListener('click', () => {
        history.pushState(null, null, routePath.ABOUT);
        about_page();
    });
}

export function about_page() {
    if(!currentUser){
        Elements.root.innerHTML = unauthorisedAccess();
        return;
    }
    let html = 'About Page';

    Elements.root.innerHTML = html;
}
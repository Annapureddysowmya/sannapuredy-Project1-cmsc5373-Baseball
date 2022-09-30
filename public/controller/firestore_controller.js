import {
    getFirestore,
    collection, addDoc,
    query, where, orderBy,
    getDocs,
 } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js"

 const db = getFirestore();

 const TicTacToeGameCollection = 'tictactoe_game';

 export async function addTicTacToeGameHstory(gamePlay) {

    await addDoc(collection(db, TicTacToeGameCollection), gamePlay);
 }

 export async function getTicTacToeGameHistory(email) {
    let history = [];
    const q = query(
        collection(db, TicTacToeGameCollection),
        where('email', '==', email),
        orderBy('timestamp','desc'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const {email, winner, moves, timestamp} = doc.data();
        history.push({email, winner, moves, timestamp});
    });
    return history;
 }

const BaseballGameCollection = 'baseball_game';

 export async function addBaseballGameHstory(gamePlay) {

    await addDoc(collection(db, BaseballGameCollection), gamePlay);
 }

 export async function getBaseballGameHistory(email) {
    let history = [];
    const q = query(
        collection(db, BaseballGameCollection),
        where('email', '==', email),
        orderBy('timestamp','desc'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const {attempts, email, timestamp} = doc.data();
        history.push({attempts, email, timestamp});
    });
    return history;
 }
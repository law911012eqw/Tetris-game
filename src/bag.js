//Generate unique tetrominoes in an array
const generate = (() => {
    let bag = [0,1,2,3,4,5,6]; //default array to be randomly swapped
    let hold = []; //hold piece
    let current = -1; //current piece
    const holdToCurrent = (i) => bag.unshift(i); //insert hold tetro to current piece index
    const totalPieces = 7; //total existing tetrominoes
    const getBag = () => bag; //get bag array
    const getPiece = (i) => bag[i]; //generate piece
    
    const tetrotetro = () => {
        if (bag.length === 0) { generate.newBag(); }
        for (let j = totalPieces - 1; j >= 0; j--) {
            let swapIndex = Math.floor(Math.random() * j);
            let tmp = bag[swapIndex];
            bag[swapIndex] = bag[j];
            bag[j] = tmp;
          }
    }
    //refill the empty bag with unique tetrominoes
    const newBag = () => {
        bag = [0,1,2,3,4,5,6];
    }
    return {
        bag,
        hold,
        current,
        holdToCurrent,
        getBag,
        getPiece,
        tetrotetro,
        newBag
    }
})()

export default generate;

//Generate unique tetrominoes in an array
const generate = (() => {
    //let arr = [0,1,2,3,4,5,6];
    let bag = [0,1,2,3,4,5,6];
    const totalPieces = 7;
    const getBag = () => bag;
    const getPiece = (i) => bag[i];
    const tetrotetro = () => {
        if (bag.length === 0) { generate.newBag(); }
        for (let j = totalPieces - 1; j >= 0; j--) {
            let swapIndex = Math.floor(Math.random() * j);
            let tmp = bag[swapIndex];
            bag[swapIndex] = bag[j];
            bag[j] = tmp;
          }
    }
    const newBag = () => {
        bag = [0,1,2,3,4,5,6];
    }
    return {
        bag,
        getBag,
        getPiece,
        tetrotetro,
        newBag
    }
})()

export default generate;

//


const bag = () => {
    let bag = [];
    function tetrominoBag() {
        while (arr.length <= 8) {
            let r = Math.floor(Math.random() * 6) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
    }
    function emptyBag(){
        if (bag.length === 0 ){
            tetrominoBag();
        }
        return bag[0];
    }
}
//Generate unique tetrominoes in an array


console.log(bag);
export default bag;

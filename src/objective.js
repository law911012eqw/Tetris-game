//This file is the component of objectives in tetris
//Which includes the aspects of leveling, score and speed multiplier
const level = (() => {
    let lvl = 1;
    let lines = 0;
    let score = 0;
    //1000 = 1 second
    const defaultSpd = 1000;
    /*multiplies to the default drop speed
    which is statically decremented each level*/
    let currentMultiplier = 1;
    const speedMultiplier1 = 0.10;
    const speedMultiplier2 = 0.05;
    const speedMultiplier3 = 0.03;
    return {
        defaultSpd,
        getScore() {
            return score;
        },
        getLevel() {
            return lvl;
        },
        lineClear() { lines++; },
        scoreAdd(i) { score += i; },
        scoreMinus(i) { score -= i; },
        oneDropCombo(r) { //maximum of 4 - total line clear in one drop
            //increment lines and score
            return Math.round(10 * (1.3*r) * (0.2 * lvl));
        },
        spdUp() {
            if (lines > (Math.round(1.2 * lvl * 8))) {
                lvl++;
                if(lvl < 6){
                    currentMultiplier -= speedMultiplier1;
                } else if(lvl < 12){
                    currentMultiplier -= speedMultiplier2;
                } else {
                    currentMultiplier -= speedMultiplier3;
                }
            }
        },
        getCurrentSpdMultiplier() {
            return currentMultiplier;
        }
    }
})()

export default level;

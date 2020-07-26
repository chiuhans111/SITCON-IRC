import GridLogic from './GridLogic'
var Brick = GridLogic.Brick

export default {
    defaultGrid: [
        new Brick(0, 0, 100, 100),
        new Brick(100, 100, 100, 100),
        new Brick(200, 0, 100, 100),
        new Brick(300, 100, 100, 100),
        new Brick(400, 0, 100, 100)
    ],

    defaultGrid2: [
        new Brick(0, 0, 100, 100),
        new Brick(100, 100, 50, 50),
        new Brick(600, 100, 100, 100),
        new Brick(400, 0, 100, 100),
        new Brick(400, 400, 100, 100),
        new Brick(700, 400, 100, 100)
    ],
}
import Konva from 'konva';

type plusPos = 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight'
// interface plusArr{
//     [index: number]: plusPos
//     // [0]: plusPos,
//     // [1]?: plusPos,
//     // [2]?: plusPos,
//     // [3]?: plusPos
// }

type linePos = 'top' | 'left' | 'bottom' | 'right'
// interface lineArr{
//     [index: number]: lineArr
//     // [0]: linePos,
//     // [1]?: linePos,
//     // [2]?: linePos,
//     // [3]?: linePos
// }


export class bg {
    private width;
    private height;
    private stage;
    private color = 'black'
    private config = {
        sectorPos: {
            x: 0,
            y: 0
        },
        lineHeight: 241,
        lineWidth: 80,

        plusInfo: {
            width: 15,
            height: 15,
            margin: 5,
        },
    }

    private firstSectorWidth = this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth;
    private firstSectorHeight = this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight;




    constructor() {
        //TODO resize
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // window.addEventListener('resize', function(event) {
        //     width = window.innerWidth;
        //     height = window.innerHeight;
        // });

        this.stage = new Konva.Stage({
            container: 'container',
            width: this.width,
            height: this.height,
        });

        let layer = this.createGridLayer();
        this.stage.add(layer);

        //on resize - rerender
        //TODO window.addEventListener('resize', this.render);
    }


    private createGridLayer(){
        let layer = new Konva.Layer();
        let group = this.createFirstSector();
        layer.add(group);

        let posX = this.firstSectorWidth;
        let posY = 0;

        for (let i = 0; i < 10; i++) {
            for (let i = 0; i < 10; i++) {
                let group = this.createSector(posX, posY, ['topRight', 'bottomRight'], ['top', 'right', 'bottom']);
                layer.add(group);

                posX += this.firstSectorWidth;
            }
            posX = 0;
            posY += this.firstSectorHeight + 100;
        }


        return layer;
    }

    private createSector(posX: number, posY: number, plusArr: plusPos[], lineArr: linePos[]){
        var group = new Konva.Group({
            x: posX,
            y: posY
        });

        //for pluses render
        for(let i:number = 0; i < plusArr.length; i++){
            let tmp = this.createPlus(plusArr[i]);
            group.add(tmp);
        }

        //for lines render
        for(let i:number = 0; i < lineArr.length; i++){
            let tmp = this.createLine(lineArr[i]);
            group.add(tmp);
        }

        return group;
    }

    private createFirstSector(){
        return this.createSector(0, 0, ['topLeft', 'bottomLeft', 'topRight', 'bottomRight'], ['top', 'left', 'bottom', 'right']);
    }

    private createPlus(plusPos: plusPos){
        let plus = new Konva.Line({
            points: [
                8, 8,
                8, 1,
                8, 8,
                1, 8,
                8, 8,
                15, 8,
                8, 8,
                8, 15
            ],
            stroke: this.color,
            strokeWidth: 1,
        });

        return this.setPlusPosition(plus, plusPos);
    }

    private setPlusPosition(plus, plusPos: plusPos){
        if(plusPos === 'topRight'){
            plus.move({
                x: this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth,
                y: 0,
            })
        }
        else if(plusPos === 'bottomRight'){
            plus.move({
                x: this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth,
                y: this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight,
            })
        }
        else if(plusPos === 'bottomLeft'){
            plus.move({
                x: 0,
                y: this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight,
            })
        }

        return plus;
    }

    //TODO create line position method
    private createLine(linePos: linePos){
        let points = [];
        let move = {
            x: 0,
            y: 0
        }

        if(linePos === 'top'){
            points = [this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineWidth, 8];
        }
        else if(linePos === 'right'){
            points = [8, this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineHeight];
            move.x = this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth;
        }
        else if(linePos === 'bottom'){
            points = [this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineWidth, 8]
            move.y = this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight;
        }
        else if(linePos === 'left'){
            points = [8, this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineHeight];
        }

        return new Konva.Line
        ({
            points: points,
            stroke: 'black',
            strokeWidth: 1,
        })
            .move(move);
    }






    // private render(){
    //     var container = document.querySelector('#container') as HTMLElement; //TODO why?
    //
    //     this.stage = new Konva.Stage({
    //         container: 'container',
    //         width: container.offsetWidth,
    //         height: container.offsetHeight,
    //     });
    //
    //     this.stage.add(this.layer);
    // }
    // private autoResize() {
    //     var container = document.getElementsByClassName('.container');
    //
    //     // now we need to fit stage into parent container
    //     var containerWidth = container.offsetWidth;
    //
    //     // but we also make the full scene visible
    //     // so we need to scale all objects on canvas
    //     var scale = containerWidth / sceneWidth;
    //
    //     stage.width(sceneWidth * scale);
    //     stage.height(sceneHeight * scale);
    //     stage.scale({ x: scale, y: scale });
    //     return undefined;
    // }
}


// for (let i = 0; i < 2; i++) {
//     Konva.Image.fromURL('./plus.svg', function (darthNode) {
//         darthNode.setAttrs({
//             x: i*10,
//             y: i*10,
//             width: 15,
//             height: 15
//         });
//         group.add(darthNode);
//     });
//
//     var redLine = new Konva.Line({
//         points: [5, 70, 140, 23, 250, 60, 300, 20],
//         stroke: 'red',
//         strokeWidth: 15,
//         lineCap: 'round',
//         lineJoin: 'round',
//     });
//
//
// }

// Konva.Image.fromURL('./plus.svg', function (darthNode) {
//     darthNode.setAttrs({
//         x: 0,
//         y: 0,
//         width: 15,
//         height: 15
//     });
//     group.add(darthNode);
// });


//var sectorPos = [0,0];








///var group2 = group.clone()


// group2.move({
//     x: config.plusInfo.height + config.plusInfo.margin*2 + config.lineWidth,
//     y: 0,
// })

// layer.add(group);
// layer.add(group2);
//stage.add(layer);
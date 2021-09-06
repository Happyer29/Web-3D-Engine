import Konva from 'konva';

interface plus {
    position?: 'topLeft' | "bottomLeft"
}

interface line {
    position?: 'top' | "left" | "bottom"
}


export class bg {
    private width;
    private height;
    private stage;
    private layer;
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

        this.layer = new Konva.Layer();


        let group = this.createSector(0, 0);
        this.layer.add(group);
        this.stage.add(this.layer);
    }


    public createSector(posX: number, posY: number){
        var group = new Konva.Group({
            x: posX,
            y: posY
        });

        let topLeftPlus = this.createPlus({position: "topLeft"});
        let bottomLeftPlus = this.createPlus({position: "bottomLeft"});
        let topLine = this.createLine({position: "top"});
        let leftLine = this.createLine({position: "left"});
        let bottomLine = this.createLine({position: "bottom"});

        group.add(topLeftPlus);
        group.add(bottomLeftPlus);
        group.add(topLine);
        group.add(leftLine);
        group.add(bottomLine);


        return group;

    }

    public createPlus(plusInfo: plus){
        let plus;
        if(plusInfo.position === 'topLeft'){
            plus = new Konva.Line({
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
        }
        else if(plusInfo.position === 'bottomLeft'){
            plus = new Konva.Line({
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
            plus.move({
                x: 0,
                y: this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight,
            })
        }

        return plus;
    }

    public createLine(lineInfo: line){
        let line;
        if(lineInfo.position === 'top'){
            line = new Konva.Line({
                points: [this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineWidth, 8],
                stroke: 'black',
                strokeWidth: 1,
            });
        }
        else if(lineInfo.position === 'left'){
            line = new Konva.Line({
                points: [8, this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineHeight],
                stroke: 'black',
                strokeWidth: 1,
            });
        }
        else if(lineInfo.position === 'bottom'){
            line = new Konva.Line({
                points: [this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineWidth, 8],
                stroke: 'black',
                strokeWidth: 1,
            });
            line.move({
                x: 0,
                y: this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight,

            })
        }

        return line;
    }

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
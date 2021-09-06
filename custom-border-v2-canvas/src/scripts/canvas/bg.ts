import Konva from 'konva';

interface plus {
    position?: 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight'
}

interface line {
    position?: 'top' | 'left' | 'bottom' | 'right'
}

interface lineArr extends line{
    [index: number]: line
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

        let group = this.createFirstSector();
        let group2 = this.createSector(200, 100, ['top', 'left'], []);
        this.layer.add(group);
        this.layer.add(group2);
        this.stage.add(this.layer);

        //on resize - rerender
        //TODO window.addEventListener('resize', this.render);
    }


    public createFirstSector(){
        var group = new Konva.Group({
            x: 0,
            y: 0
        });

        let topLeftPlus = this.createPlus({position: "topLeft"});
        let topRightPlus = this.createPlus({position: "topRight"});
        let bottomRightPlus = this.createPlus({position: "bottomRight"});
        let bottomLeftPlus = this.createPlus({position: "bottomLeft"});

        let topLine = this.createLine({position: "top"});
        let rightLine = this.createLine({position: "right"});
        let bottomLine = this.createLine({position: "bottom"});
        let leftLine = this.createLine({position: "left"});

        group.add(topLeftPlus);
        group.add(topRightPlus);
        group.add(bottomRightPlus);
        group.add(bottomLeftPlus);

        group.add(topLine);
        group.add(rightLine);
        group.add(bottomLine);
        group.add(leftLine);

        return group;

    }

    public createSector(posX: number, posY: number, plusArr: [lineArr], lineArr: [lineArr]){
        var group = new Konva.Group({
            x: posX,
            y: posY
        });

        for(let i:number; i < plusArr.length; i++){
            console.log(plusArr[i]);
        }

        // let topLeftPlus = this.createPlus({position: "topLeft"});
        // let bottomLeftPlus = this.createPlus({position: "bottomLeft"});
        // let topLine = this.createLine({position: "top"});
        // let leftLine = this.createLine({position: "left"});
        // let bottomLine = this.createLine({position: "bottom"});
        //
        // group.add(topLeftPlus);
        // group.add(bottomLeftPlus);
        // group.add(topLine);
        // group.add(leftLine);
        // group.add(bottomLine);


        return group;

    }

    public createPlus(plusInfo: plus){
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
        if(plusInfo.position === 'topLeft'){

        }
        else if(plusInfo.position === 'topRight'){
            plus.move({
                x: this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth,
                y: 0,
            })
        }
        else if(plusInfo.position === 'bottomRight'){
            plus.move({
                x: this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth,
                y: this.config.plusInfo.height + this.config.plusInfo.margin*2 + this.config.lineHeight,
            })
        }
        else if(plusInfo.position === 'bottomLeft'){
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
        else if(lineInfo.position === 'right'){
            line = new Konva.Line({
                points: [8, this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineHeight],
                stroke: 'black',
                strokeWidth: 1,
            });

            line.move({
                x: this.config.plusInfo.width + this.config.plusInfo.margin*2 + this.config.lineWidth,
                y: 0,

            })
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
        else if(lineInfo.position === 'left'){
            line = new Konva.Line({
                points: [8, this.config.plusInfo.height + this.config.plusInfo.margin, 8, this.config.plusInfo.height + this.config.plusInfo.margin + this.config.lineHeight],
                stroke: 'black',
                strokeWidth: 1,
            });
        }


        return line;
    }

    private render(){
        var container = document.querySelector('#container') as HTMLElement; //TODO why?

        this.stage = new Konva.Stage({
            container: 'container',
            width: container.offsetWidth,
            height: container.offsetHeight,
        });

        this.stage.add(this.layer);
    }
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
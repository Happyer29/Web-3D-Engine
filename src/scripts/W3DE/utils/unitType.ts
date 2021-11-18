//export type UnitType = `${number}px` | `${number}mm` | `${number}cm` | `${number}rem` | `${number}em` | `${number}vw` | `${number}vh` | `${number}%`;
//TODO сейчас принимаем на вход только пиксели
export type UnitType = `${number}px`;
export class Unit {
    private _cssUnit: UnitType;
    constructor(cssUnit: UnitType | number = undefined){
        let tmp = cssUnit ?? "0px";
        this._cssUnit = typeof tmp == "number" ? `${tmp}px` : tmp;
    }

    get cssUnit(){
        return this._cssUnit;
    }

    //TODO работет только для пикселей для процентного соотношения работает не правильно
    get intUnit():number{
        return parseInt(this._cssUnit, 10);
        //return this._cssUnit.replace(/[^+\d]/g, '');
    }

    private static toPx(n:number): UnitType{
        return `${n}px`;
    }

    public multiple(m: number){
        this._cssUnit = Unit.toPx(this.intUnit * m);
        return this;
    }

    public static equal(u1: Unit, u2: Unit){
        return u1._cssUnit == u2._cssUnit;
    }
}
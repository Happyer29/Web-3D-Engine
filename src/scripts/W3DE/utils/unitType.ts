//export type UnitType = `${number}px` | `${number}mm` | `${number}cm` | `${number}rem` | `${number}em` | `${number}vw` | `${number}vh` | `${number}%`;
//TODO сейчас принимаем на вход только пиксели
export type UnitType = `${number}px`;
export class Unit {
    private _cssUnit: UnitType;
    constructor(cssUnit: UnitType = undefined){
        this._cssUnit = cssUnit ?? "0px";
    }

    get cssUnit(){
        return this._cssUnit;
    }

    //TODO работет только для пикселей для процентного соотношения работает не правильно
    get intUnit():number{
        return parseInt(this._cssUnit, 10);
        //return this._cssUnit.replace(/[^+\d]/g, '');
    }
}
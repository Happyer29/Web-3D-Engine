export enum KEY_EVENTS {
    KEY_UP,
    KEY_DOWN,
    KEY_PRESS,
    KEY_IDLE
}

export class Key {
    private _event: KEY_EVENTS = KEY_EVENTS.KEY_IDLE;
    private _key: string;
    private _onKeyUp : Function[] = [];
    private _onKeyDown : Function[] = [];
    private _onKeyPress : Function[] = [];
    private _onKeyIdle: Function[] = [];

    private _isPressed : boolean = false;

    constructor(key : string) {
        this.key = key.toLowerCase();
    }

    public get isPressed() {
        return this._isPressed;
    }
    public set isPressed(value : boolean) {
        this._isPressed = value;
    }

    public get key(): string {
        return this._key;
    }
    public set key(value: string) {
        this._key = value;
    }

    public set event(event: KEY_EVENTS) {
        this._event = event;
    }
    public get event(): KEY_EVENTS {
        return this._event;
    }

    public setFunction(event : KEY_EVENTS, func : Function) : Key {
        if (event == KEY_EVENTS.KEY_DOWN) this.setOnKeyDown(func);
        if (event == KEY_EVENTS.KEY_UP) this.setOnKeyUp(func);
        if (event == KEY_EVENTS.KEY_PRESS) this.setOnKeyPress(func);
        if (event == KEY_EVENTS.KEY_IDLE) this.setOnKeyIdle(func);
        return this;
    }
   
    private setOnKeyUp(onKeyUp : Function) {
        this._onKeyUp.push(onKeyUp);
    }
    private setOnKeyPress(onKeyPress : Function) {
        this._onKeyPress.push(onKeyPress);
    }
    private setOnKeyDown(onKeyDown : Function) {
        this._onKeyDown.push(onKeyDown);
    }
    private setOnKeyIdle(onKeyIdle : Function) {
        this._onKeyIdle.push(onKeyIdle);
    }

    public onKeyUp(htmlEvent : KeyboardEvent) {
        this._onKeyUp.forEach(func => {
            func(htmlEvent);
        })
        this.isPressed = false;
        
    }
    public onKeyPress(htmlEvent : KeyboardEvent) {
        this._onKeyPress.forEach(func => {
            func(htmlEvent);
        })
    }
    public onKeyDown(htmlEvent : KeyboardEvent) {
        this._onKeyDown.forEach(func => {
            func(htmlEvent);
        })
        this.isPressed = true;
    }
    public onKeyIdle(htmlEvent : KeyboardEvent) {
        this._onKeyIdle.forEach(func => {
            func(htmlEvent);
        })
    }
}
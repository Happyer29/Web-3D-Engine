export enum MOUSE_EVENTS {
    MOUSE_UP,
    MOUSE_DOWN,
    MOUSE_MOVE,
    MOUSE_WHEEL,
    MOUSE_IDLE
}

export class Mouse {
    private _event: MOUSE_EVENTS = MOUSE_EVENTS.MOUSE_IDLE;
    private _onMouseUp : Function[] = [];
    private _onMouseDown : Function[] = [];
    private _onMouseMove : Function[] = [];
    private _onMouseIdle : Function[] = [];
    private _onMouseWheel : Function[] = [];
    private _isDragging : boolean = false;

    private _sensitivity: number = 10;

    public get sensitivity(): number {
        return this._sensitivity;
    }
    public set sensitivity(value: number) {
        this._sensitivity = value;
    }

    private _old_x : number;
    private _old_y : number;

    public set old_x(old_x : number) {
        this._old_x = old_x;
    }
    public get old_x(): MOUSE_EVENTS {
        return this._old_x;
    }
    public set old_y(old_y : number) {
        this._old_y = old_y;
    }
    public get old_y(): MOUSE_EVENTS {
        return this._old_y;
    }
    public setFunction(event : MOUSE_EVENTS, func : Function) {
        if (event === MOUSE_EVENTS.MOUSE_UP) this.setOnMouseDown(func);
        if (event === MOUSE_EVENTS.MOUSE_DOWN) this.setOnMouseUp(func);
        if (event === MOUSE_EVENTS.MOUSE_MOVE) this.setOnMouseMove(func);
        if (event === MOUSE_EVENTS.MOUSE_WHEEL) this.setOnMouseWheel(func);
        if (event === MOUSE_EVENTS.MOUSE_IDLE) this.setOnMouseIdle(func);
        
    }

    public set event(event: MOUSE_EVENTS) {
        this._event = event;
    }
    public get event(): MOUSE_EVENTS {
        return this._event;
    }

    
    private setOnMouseUp(onMouseUp : Function) {
        this._onMouseUp.push(onMouseUp);
    }
    private setOnMouseMove(onMouseMove : Function) {
        this._onMouseMove.push(onMouseMove);
    }
    private setOnMouseDown(onMouseDown : Function) {
        this._onMouseDown.push(onMouseDown);
    }
    private setOnMouseIdle(onMouseIdle : Function) {
        this._onMouseIdle.push(onMouseIdle);
    }
    private setOnMouseWheel(onMouseWheel : Function) {
        this._onMouseWheel.push(onMouseWheel);
    }

    public onMouseUp(htmlEvent : MouseEvent) {
        this._onMouseUp.forEach(func => {
            func(htmlEvent);
        })
        this.old_x = htmlEvent.pageX;
        this.old_y = htmlEvent.pageY;
        this.isDragging = false;
    }
    public onMouseMove(htmlEvent : MouseEvent) {
        this._onMouseMove.forEach(func => {
            func(htmlEvent);
        })
        this.event = MOUSE_EVENTS.MOUSE_MOVE;
    }
    public onMouseDown(htmlEvent : MouseEvent) {
        this._onMouseDown.forEach(func => {
            func(htmlEvent);
        })
        this.isDragging = true;
        this._old_x = htmlEvent.pageX;
        this._old_y = htmlEvent.pageY;
    }
    public onMouseIdle(htmlEvent : MouseEvent) {
        this._onMouseIdle.forEach(func => {
            func(htmlEvent);
        })
    }
    public onMouseWheel(htmlEvent : MouseEvent) {
        this._onMouseWheel.forEach(func => {
            func(htmlEvent);
        })
    }
    public get isDragging() {
        return this._isDragging;
    }
    public set isDragging(value : boolean) {
        this._isDragging = value;
    }
}
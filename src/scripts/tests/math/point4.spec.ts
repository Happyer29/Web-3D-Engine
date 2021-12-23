import {Point4} from "../../W3DE/maths/Point4";

const assert = require("assert");

describe('Point4.ts', () => {
    it('create Point4', async () => {
        assert.ok(new Point4([0,1,2,3]))
    });
    it('get x', async () => {
        let p = new Point4([0,1,2,3]);
        assert.equal(p.x, 0)
    });
    it('get y', async () => {
        let p = new Point4([0,1,2,3]);
        assert.equal(p.y, 1)
    });
    it('get z', async () => {
        let p = new Point4([0,1,2,3]);
        assert.equal(p.y, 1)
    });
    it('get w', async () => {
        let p = new Point4([0,1,2,3]);
        assert.equal(p.y, 1)
    });


    it('sum p1 & p2', async () => {
        let p1 = new Point4([0,1,2,3]);
        let p2 = new Point4([0,1,2,3]);
        let res = Point4.sum(p1, p2);
        let expected = new Point4([0,2,4,6]);
        assert.deepEqual(res.point, expected.point)
    });

    // it('trying get z', async () => {
    //     //@ts-ignore
    //     assert.ok(new Point4([0,1]).z)
    //
    //     //assert.fail(new Point4([0,1]).z)
    // });
});
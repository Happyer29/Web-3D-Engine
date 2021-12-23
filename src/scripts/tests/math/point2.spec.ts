import {Point2} from "../../W3DE/maths/Point2";

const assert = require("assert");

describe('Point2.ts', () => {
    it('create Point2', async () => {
        assert.ok(new Point2([0,1]))
    });
    it('get x', async () => {
        let p = new Point2([0,1]);
        assert.equal(p.x, 0)
    });
    it('get y', async () => {
        let p = new Point2([0,1]);
        assert.equal(p.y, 1)
    });

    it('sum p1 & p2', async () => {
        let p1 = new Point2([0,1]);
        let p2 = new Point2([0,1]);
        let res = Point2.sum(p1, p2);
        let expected = new Point2([0,2]);
        assert.deepEqual(res.point, expected.point)
    });

    // it('trying get z', async () => {
    //     //@ts-ignore
    //     assert.ok(new Point2([0,1]).z)
    //
    //     //assert.fail(new Point2([0,1]).z)
    // });
});
import {Point3} from "../../W3DE/maths/Point3";

const assert = require("assert");

describe('Point3.ts', () => {
    it('create Point3', async () => {
        assert.ok(new Point3([0,1,2]))
    });
    it('get x', async () => {
        let p = new Point3([0,1,2]);
        assert.equal(p.x, 0)
    });
    it('get y', async () => {
        let p = new Point3([0,1,2]);
        assert.equal(p.y, 1)
    });
    it('get z', async () => {
        let p = new Point3([0,1,2]);
        assert.equal(p.y, 1)
    });

    it('sum p1 & p2', async () => {
        let p1 = new Point3([0,1,2]);
        let p2 = new Point3([0,1,2]);
        let res = Point3.sum(p1, p2);
        let expected = new Point3([0,2,4]);
        assert.deepEqual(res.point, expected.point)
    });

    // it('trying get z', async () => {
    //     //@ts-ignore
    //     assert.ok(new Point3([0,1]).z)
    //
    //     //assert.fail(new Point3([0,1]).z)
    // });
});
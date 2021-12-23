import {vector2, Vector2} from "../../W3DE/maths/Vector2";
import {Point2} from "../../W3DE/maths/Point2";

const assert = require("assert");

describe('Vector2.ts', () => {
    it('create Vector2 (array in constructor)', async () => {
        let arr:vector2 = [0,1];
        assert.deepEqual(new Vector2(arr).positionArr, arr)
    });
    it('create Vector2 (point2 in constructor)', async () => {
        let p1 = new Point2([0,1]);
        let p2 = new Point2([0,2]);
        assert.ok(new Vector2([p1,p2]))
    });
    it('check Vector2 (point2) correct convert to array ', async () => {
        let p1 = new Point2([0,1]);
        let p2 = new Point2([0,2]);
        assert.deepEqual(new Vector2([p1,p2]).positionArr, [0, 1])
    });
    it('get x', async () => {
        let v = new Vector2([0,1]);
        assert.equal(v.x, 0)
    });
    it('get y', async () => {
        let v = new Vector2([0,1]);
        assert.equal(v.y, 1)
    });
    it('check length', async () => {
        let v = new Vector2([0,2]);
        assert.equal(v.length(), 2)
    });
    it('check positionObj', async () => {
        let v = new Vector2([0,2]).positionObj;
        assert.equal(v.x, 0)
        assert.equal(v.y, 2)
    });
    it('check positionArr', async () => {
        let v = new Vector2([0,2]).positionArr;
        assert.equal(v[0], 0)
        assert.equal(v[1], 2)
    });

    //static methods
    it('sum v1 & v2', async () => {
        let v1 = new Vector2([0,1]);
        let v2 = new Vector2([0,1]);
        let res = Vector2.sum(v1, v2);
        let expected = new Vector2([0,2]);
        assert.deepEqual(res.positionArr, expected.positionArr)
    });
    it('minus v1 & v2', async () => {
        let v1 = new Vector2([0,1]);
        let v2 = new Vector2([0,1]);
        let res = Vector2.minus(v1, v2);
        let expected = new Vector2([0,0]);
        assert.deepEqual(res.positionArr, expected.positionArr)
    });
    it('scalarMultiplication scalar & v', async () => {
        let v = new Vector2([0,1]);
        let scalar = 2;
        let res = Vector2.scalarMultiplication(scalar, v);
        let expected = new Vector2([0,2]);
        assert.deepEqual(res.positionArr, expected.positionArr)
    });
    it('scalarDivision scalar & v', async () => {
        let v = new Vector2([0,2]);
        let scalar = 2;
        let res = Vector2.scalarDivision(scalar, v);
        let expected = new Vector2([0,1]);
        assert.deepEqual(res.positionArr, expected.positionArr)

        v = new Vector2([0,2]);
        scalar = 0;
        res = Vector2.scalarDivision(scalar, v);
        expected = new Vector2([0,0]);
        assert.deepEqual(res.positionArr, expected.positionArr)
    });
    it('scalarVectorMultiplication v1 & v2', async () => {
        let v1 = new Vector2([0,2]);
        let v2 = new Vector2([0,1]);
        let res = Vector2.scalarVectorMultiplication(v1, v2);
        let expected = 2;
        assert.deepEqual(res, expected)
    });
});
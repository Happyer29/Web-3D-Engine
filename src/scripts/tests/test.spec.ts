const assert = require("assert");

import { Geometry } from "../W3DE/core/Geometry";

describe('Test', () => {
    it('Mesh Test', async () => {

            let geo1 = new Geometry([2, 2, 3],[1],[1]);
            let geo2 = new Geometry([2],[],[]);
            assert.equal(geo1.position[0], geo2.position[0])

    });

});
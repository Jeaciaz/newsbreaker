mocha.setup('bdd');
let assert = chai.assert;

describe("values", function() {
    it("headline is taken from field correctly", () => assert.equal(headline, $('#headline-input').val()));

    it("newsline is taken from field correctly", () => assert.equal(newsline, $('#newsline-input').val()));
});

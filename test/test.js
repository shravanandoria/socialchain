const { assert } = require("chai");

const Socialchain = artifacts.require("./Socialchain.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Socialchain", ([deployer, author, tipper]) => {
  let socialchain;

  before(async () => {
    socialchain = await Socialchain.deployed();
  });

  describe("deployment", async () => {
    it("deploys the contract", async () => {
      const address = await socialchain.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, undefined);
      assert.notEqual(address, null);
      assert.notEqual(address, "");
    });

    it("has a name", async () => {
      const name = await socialchain.name();
      assert.equal(name.toString(), "SocialChain");
    });
  });

  describe("images", async () => {
    let result, imageCount, hash;
    hash = "sample image hash";

    before(async () => {
      result = await socialchain.uploadImage(hash, "sample Post", {
        from: author,
      });
      imageCount = await socialchain.imageCount();
    });

    it("creates images", async () => {
      assert.equal(imageCount, 1);
      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount, "id is correct");
      assert.equal(event.hash.toString(), hash, "hash is correct");
      assert.equal(
        event.description.toString(),
        "sample Post",
        "id is correct"
      );
      assert.equal(event.tipAmount.toNumber(), 0, "tipAmount is correct");
      assert.equal(event.author.toString(), author, "author is correct");

      await socialchain.uploadImage("", "ddasds", { from: author }).should.be
        .rejected;
      await socialchain.uploadImage("sadasd", "", { from: author }).should.be
        .rejected;
    });

    it("lists images", async () => {
      image = await socialchain.images(imageCount);
      assert.equal(image.id.toNumber(), imageCount, "id is correct");
      assert.equal(image.hash.toString(), hash, "hash is correct");
      assert.equal(
        image.description.toString(),
        "sample Post",
        "id is correct"
      );
      assert.equal(image.tipAmount.toNumber(), 0, "tipAmount is correct");
      assert.equal(image.author.toString(), author, "author is correct");
    });

    it("allows users to tip images", async () => {
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);

      result = await socialchain.tipImageOwner(imageCount, {
        from: tipper,
        value: web3.utils.toWei("1", "ether"),
      });

      const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
      assert.equal(event.hash.toString(), hash, "hash is correct");
      assert.equal(event.description, "sample Post", "id is correct");
      assert.equal(
        event.tipAmount,
        web3.utils.toWei("1", "ether"),
        "tipAmount is correct"
      );
      assert.equal(event.author.toString(), author, "author is correct");

      let newAuthorBalance = await web3.eth.getBalance(author);
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipImageOwner = web3.utils.toWei("1", "ether");
      tipImageOwner = new web3.utils.BN(tipImageOwner);

      let expectedBalance = oldAuthorBalance.add(tipImageOwner);

      assert.equal(
        expectedBalance.toString(),
        newAuthorBalance.toString(),
        "Tipping amount successful"
      );

      await socialchain.tipImageOwner(99, {
        from: tipper,
        value: web3.utils.toWei("1", "ether"),
      }).should.be.rejected;
    });
  });
});

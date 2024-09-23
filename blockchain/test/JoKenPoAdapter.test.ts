import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("JoKenPoAdapter Tests", function () {
  enum Options { NONE, ROCK, PAPER, SCISSORS }; // 0, 1, 2, 3
  const DEFAULT_BID = hre.ethers.parseEther("0.01");
  const DEFAULT_COMMISSION = 10;

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners();

    const JoKenPo = await hre.ethers.getContractFactory("JoKenPo");
    const jokenpo = await JoKenPo.deploy();

    const JoKenPoAdapter = await hre.ethers.getContractFactory("JoKenPoAdapter");
    const jokenpoAdapter = await JoKenPoAdapter.deploy();

    return { jokenpo, jokenpoAdapter, owner, player1, player2 };
  }

  it("Should get implementation address", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

    const address = await jokenpo.getAddress();
    await jokenpoAdapter.upgrade(jokenpo);

    const implementationAddress = await jokenpoAdapter.getImplementationAddress();
    
    expect(address).to.equal(implementationAddress);
  });
  
  it("Should get bid", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

    await jokenpoAdapter.upgrade(jokenpo);

    const bid = await jokenpoAdapter.getBid();
    
    expect(bid).to.equal(DEFAULT_BID);
  });
  
  it("Should NOT get bid (upgrade)", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);
   
    await expect(jokenpoAdapter.getBid()).to.be.revertedWith("You must upgrade first");
  });
  
  it("Should get commission", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

    await jokenpoAdapter.upgrade(jokenpo);

    const commission = await jokenpoAdapter.getCommission();
    
    expect(commission).to.equal(DEFAULT_COMMISSION);
  });
  
  it("Should NOT get commission (upgrade)", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);
   
    await expect(jokenpoAdapter.getCommission()).to.be.revertedWith("You must upgrade first");
  });
  
  it("Should NOT upgrade (permission)", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);
   
    const instance = jokenpoAdapter.connect(player1);
    await expect(instance.upgrade(jokenpoAdapter)).to.be.revertedWith("You do not have permission");
  });
  
  it("Should NOT upgrade (address)", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);
   
    await expect(jokenpoAdapter.upgrade(ethers.ZeroAddress)).to.be.revertedWith("Empty address is not permitted");
  });
  
  it("Should play alone by adapter", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

    await jokenpoAdapter.upgrade(jokenpo);

    const instance = jokenpoAdapter.connect(player1);
    await instance.play(Options.PAPER, {value: DEFAULT_BID});

    const result = await instance.getResult();
    
    expect(result).to.equal("Player 1 choose his/her option. Waiting player 2");
  });

  it("Should play along by adapter", async function () {
    const { jokenpo, jokenpoAdapter, owner, player1, player2 } = await loadFixture(deployFixture);

    await jokenpoAdapter.upgrade(jokenpo);

    const instance = jokenpoAdapter.connect(player1);
    await instance.play(Options.PAPER, {value: DEFAULT_BID});

    const instance2 = jokenpoAdapter.connect(player2);
    await instance2.play(Options.SCISSORS, {value: DEFAULT_BID});

    const result = await instance.getResult();
    
    expect(result).to.equal("Scissors cuts paper. Player 2 won");
  });

});

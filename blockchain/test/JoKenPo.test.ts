import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("JoKenPo Tests", function () {
  enum Options { NONE, ROCK, PAPER, SCISSORS }; // 0, 1, 2, 3
  const DEFAULT_BID = hre.ethers.parseEther("0.01");

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners();

    const JoKenPo = await hre.ethers.getContractFactory("JoKenPo");
    const jokenpo = await JoKenPo.deploy();

    return { jokenpo, owner, player1, player2 };
  }

  it("Should get leaderboad", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const leaderboard = await jokenpo.getLeaderboard();
    
    expect(leaderboard.length).to.equal(1);
    expect(leaderboard[0].wallet).to.equal(player1.address);
    expect(leaderboard[0].wins).to.equal(1);
  });
  
  it("Should set bid", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const newBid = hre.ethers.parseEther("0.02");
    await jokenpo.setBid(newBid);
    const bid = await jokenpo.getBid();
    
    expect(bid).to.equal(newBid);
  });
  
  it("Should NOT set bid (not owner)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    const newBid = hre.ethers.parseEther("0.02");
    
    await expect(player1Instance.setBid(newBid)).to.revertedWith("You do not have permission");
  });
  
  it("Should NOT set bid (play in progress)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const newBid = hre.ethers.parseEther("0.02");
    
    await expect(jokenpo.setBid(newBid)).to.revertedWith("You cannot change the Bid with a game in progress");
  });
  
  it("Should set commission", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const newCommission = 20;
    await jokenpo.setCommission(newCommission);
    const commission = await jokenpo.getCommission();
    
    expect(commission).to.equal(newCommission);
  });
  
  it("Should NOT set commission (not owner)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    const newCommission = 20;
    
    await expect(player1Instance.setCommission(newCommission)).to.revertedWith("You do not have permission");
  });
  
  it("Should NOT set commission (play in progress)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const newCommission = 20;
    
    await expect(jokenpo.setCommission(newCommission)).to.revertedWith("You cannot change the Commission with a game in progress");
  });

  it("Should play alone", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Player 1 choose his/her option. Waiting player 2");
  });

  it("Should play along (ROCK->SCISSORS)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.SCISSORS, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Rock breaks scissors. Player 1 won");
  });

  it("Should play along (PAPER->ROCK)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Paper wraps rock. Player 1 won");
  });

  it("Should play along (SCISSORS->PAPER)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.SCISSORS, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Scissors cuts paper. Player 1 won");
  });

  it("Should play along (ROCK->SCISSORS)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.SCISSORS, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Rock breaks scissors. Player 2 won");
  });

  it("Should play along (ROCK->PAPER)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Paper wraps rock. Player 2 won");
  });

  it("Should play along (PAPER->SCISSORS)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.SCISSORS, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Scissors cuts paper. Player 2 won");
  });

  it("Should play along (ROCK->ROCK)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.ROCK, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Draw game. The prize was doubled");
  });

  it("Should play along (PAPER->PAPER)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.PAPER, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Draw game. The prize was doubled");
  });

  it("Should play along (SCISSORS->SCISSORS)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.SCISSORS, { value: DEFAULT_BID});

    const player2Instance = jokenpo.connect(player2);
    await player2Instance.play(Options.SCISSORS, { value: DEFAULT_BID});

    const result = await jokenpo.getResult();
    
    expect(result).to.equal("Draw game. The prize was doubled");
  });

  it("Should NOT play alone (owner)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    await expect(jokenpo.play(Options.SCISSORS, { value: DEFAULT_BID}))
      .to.revertedWith("The owner can not play");
  });
    
  it("Should NOT play alone (invalid option)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);

    await expect(player1Instance.play(Options.NONE, { value: DEFAULT_BID}))
      .to.revertedWith("Invalid choice");
  });

  it("Should NOT play alone (twice in a row)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const player1Instance = jokenpo.connect(player1);
    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID});

    await expect(player1Instance.play(Options.PAPER, { value: DEFAULT_BID}))
      .to.revertedWith("Wait the another player");
  });

  it("Should NOT play (invalid bid)", async function () {
    const { jokenpo, owner, player1, player2 } = await loadFixture(deployFixture);

    const wrongBid = hre.ethers.parseEther("0.001");
    const player1Instance = jokenpo.connect(player1);
    
    await expect(player1Instance.play(Options.ROCK, { value: wrongBid }))
      .to.revertedWith("Invalid bid");
  });

});

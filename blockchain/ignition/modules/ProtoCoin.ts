import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JoKenPoModule = buildModule("JoKenPoModule", (m) => {

  const protoCoin = m.contract("JoKenPo");

  return { protoCoin };
});

export default JoKenPoModule;

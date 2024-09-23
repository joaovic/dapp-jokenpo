import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JoKenPoModule = buildModule("JoKenPoModule", (m) => {

  const joKenPo = m.contract("JoKenPo");
  const joKenPoAdapter = m.contract("JoKenPoAdapter");

  return { joKenPo, joKenPoAdapter };
});

export default JoKenPoModule;

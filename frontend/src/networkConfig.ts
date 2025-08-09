import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: "0x0",
        mintAddresses: "0x0",
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId:
          "0x988506337558544bc2f05a97bb2b054b41971572a9d0bc354ab45586337d2cb7",
        mintAddresses:
          "0xf021cb621ce0d2766cfb5333f72b4a5c76726cc44c1664a40b2daedadfb75024",
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: "0x0",
        mintAddresses: "0x0",
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };

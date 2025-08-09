import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { ENV } from "../env";

export const mintNft = async (): Promise<SuiTransactionBlockResponse> => {
  if (!ENV.USER_SECRET_KEY) {
    throw new Error("USER_SECRET_KEY is required");
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${ENV.PACKAGE_ID}::mintnft::mint`,
    arguments: [
      tx.object(ENV.MINTADDRESSES_ID),
      tx.pure.string("ptbTest"),
      tx.pure.string(
        "https://walrus.tusky.io/RyXOC1zp1YDcA7hzSDwFf6ES9tH7529OPZ5NvpgXqno"
      ),
    ],
  });

  return suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: getSigner({ secretKey: ENV.USER_SECRET_KEY }),
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
};

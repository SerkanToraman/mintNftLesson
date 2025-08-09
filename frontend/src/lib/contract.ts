import { Transaction } from "@mysten/sui/transactions";

interface Nft {
  name: string;
  url: string;
}

export const mintNft = (nft: Nft, packageId: string, mintAddresses: string) => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::mintnft::mint`,
    arguments: [
      tx.object(mintAddresses),
      tx.pure.string(nft.name),
      tx.pure.string(nft.url),
    ],
  });
  return tx;
};

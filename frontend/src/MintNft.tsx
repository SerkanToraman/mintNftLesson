import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { mintNft } from "./lib/contract";
import { useNetworkVariable } from "./networkConfig";

interface Nft {
  name: string;
  url: string;
}

function MintNft({
  refreshKey,
  setRefreshKey,
}: {
  refreshKey: number;
  setRefreshKey: (key: number) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const packageId = useNetworkVariable("packageId");
  const mintAddresses = useNetworkVariable("mintAddresses");

  const suiClient = useSuiClient();
  const {
    mutate: signAndExecuteTransaction,
    // isPending,
    // reset,
  } = useSignAndExecuteTransaction();

  const handleMintNft = (nft: Nft) => {
    const tx = mintNft(nft, packageId, mintAddresses);
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          setName("");
          setUrl("");
          setRefreshKey(refreshKey + 1);
          const { effects } = await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          const eventResult = await suiClient.queryEvents({
            query: {
              Transaction: digest,
            },
          });
          if (eventResult.data.length > 0) {
            console.log("event", eventResult.data);
            console.log("effects", effects);
          }
        },
        onError: (error: any) => {
          console.error("Transaction failed", error);
        },
      },
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: "10px", marginTop: "10px" }}>Mint NFT</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleMintNft({ name, url });
        }}
      >
        <label style={{ marginRight: "10px", marginBottom: "10px" }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginLeft: "10px" }}
          />
        </label>
        <label style={{ marginRight: "10px", marginBottom: "10px" }}>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button type="submit">Mint NFT</button>
      </form>
    </div>
  );
}

export default MintNft;

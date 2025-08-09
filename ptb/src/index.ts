import { ENV } from "./env";
import { mintNft } from "./helpers/mintNft";

const main = async () => {
  console.log("Hello, world!");
  console.log("This is the Sui network: ", ENV.SUI_NETWORK);

  try {
    const result = await mintNft();

    // Find the created NFT object
    const createdObjects = result.objectChanges?.filter(
      (change) => change.type === "created"
    );

    if (createdObjects && createdObjects.length > 0) {
      console.log("🎨 Created objects:");
      createdObjects.forEach((obj, index) => {
        if ("objectType" in obj && obj.objectType?.includes("::mintnft::Nft")) {
          console.log(`  NFT ${index + 1}: ${obj.objectId}`);
        }
      });
    }
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
  }
};

main().catch(console.error);

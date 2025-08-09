import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Card, Text, Heading, Box } from "@radix-ui/themes";
//Type
import { PaginatedObjectsResponse, SuiObjectData } from "@mysten/sui/client";

interface NFTFields {
  name: string;
  description: string;
  url: string;
}

//Function to extract the image from the NFT
function extractNFTData(nfts: PaginatedObjectsResponse): NFTFields[] {
  const nftArray: NFTFields[] = [];

  for (const object of nfts.data) {
    const content = object.data?.content as SuiObjectData["content"];
    if (content && "dataType" in content && content.dataType === "moveObject") {
      const nftData = (content as any).fields as NFTFields;
      nftArray.push(nftData);
    }
  }

  return nftArray;
}

function DisplayNft({ refreshKey }: { refreshKey: number }) {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      options: {
        showContent: true,
      },
      filter: {
        StructType: `${packageId}::mintnft::Nft`,
      },
    },
    {
      enabled: !!account,
      refetchInterval: refreshKey,
    },
  );
  console.log("data", data);

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const nftDataArray = data ? extractNFTData(data) : [];

  return (
    <Box p="4">
      {nftDataArray.length === 0 ? (
        <Text>No NFTs found</Text>
      ) : (
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          {nftDataArray.map((nftData, index) => (
            <Card
              key={index}
              size="3"
              style={{
                width: "100%",
                maxWidth: "none",
                minWidth: "auto",
              }}
            >
              <Box p="4">
                <Heading size="6" mb="3">
                  {nftData.name || "NFT"}
                </Heading>
                <Text as="p" size="3" color="gray" mb="3">
                  {nftData.description || "No description available"}
                </Text>
                {nftData.url && (
                  <img
                    src={nftData.url}
                    alt="NFT"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DisplayNft;

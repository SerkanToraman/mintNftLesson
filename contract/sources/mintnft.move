/// Module: mintnft
module mintnft::mintnft;


// === Imports ===

use std::string::String;
use sui::{display, package};
use sui::event;



// === Structs ===

/// Owned Object - NFT cane be accessed and modified by the owner
public struct Nft has key, store {
    id: UID,
    name: String,
    description: String,
    url:String,
}

// Shared Object - Addresses that minted NFTs will be stored and everyone can access and modify it
public struct MintAddresses has key, store {
   id: UID,
   addresses: vector<address>,
}

// Immutable Object - No one can modify this object
public struct NftMetadata has key, store {
   id: UID,
   time_stamp:u64,
}


// ===OTW===
public struct MINTNFT() has drop;

// === Events ===
public struct MintNftEvent has drop,copy {
   id: ID,
   name: String,
}


// ===Initializers===
fun init(otw:MINTNFT, ctx: &mut TxContext){
   let mintAddresses = MintAddresses{
    id: object::new(ctx),
    addresses: vector::empty(),
   };

   let publisher = package::claim(otw, ctx);
   let mut display = display::new<Nft>(&publisher, ctx);

   display.add(b"name".to_string(), b"{name}".to_string());
   display.add(b"description".to_string(), b"{description}".to_string());
   display.add(b"image_url".to_string(), b"{url}".to_string());

   display.update_version();

  transfer::public_transfer(display, ctx.sender());
  transfer::public_transfer(publisher, ctx.sender());
  transfer::share_object(mintAddresses);
}


// === Public Functions ===
public entry fun mint(mintAddresses:&mut MintAddresses, name:String, url:String, ctx: &mut TxContext){
  let nft = Nft{
    id: object::new(ctx),
    name,
    description: b"Bursa NFT".to_string(),
    url,
  };
  event::emit(MintNftEvent{
    id: object::id(&nft),
    name,
  });

  transfer::public_transfer(nft, ctx.sender());

  vector::push_back(&mut mintAddresses.addresses,ctx.sender());

  let nftMetaData = NftMetadata{
     id: object::new(ctx),
     time_stamp : ctx.epoch_timestamp_ms()
  };
  transfer::freeze_object(nftMetaData);
}
//Update Nft Name ------> This will not throw an error as it is a mutable object but only the owner can update it
public entry fun update_nft(nft: &mut Nft, name:String){
  nft.name =name;
}

// Update the nft metadata ------> This will not updated as it is a freezed object
public entry fun update_nft_metadata(nftMetadata: &mut NftMetadata, ctx: &mut TxContext){
  nftMetadata.time_stamp = ctx.epoch_timestamp_ms();
}


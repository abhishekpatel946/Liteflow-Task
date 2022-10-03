const ethers = require("ethers");
const { v4: uuidv4 } = require('uuid');
const { createClient } = require("@supabase/supabase-js");
const seaportABI = require("./abi/SeaportABI.json");
require("dotenv").config();

// Create a single supabase client for interacting with your database
const options = {
  schema: "public",
  headers: { "x-my-custom-header": "Liteflow" },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

const supabase = createClient(
  process.env.POSTGRES_DB_URL,
  process.env.POSTGRES_API_KEY,
  options
);

const main = async () => {
  // Seaport contract address
  const seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581";
  // Alchemy websocket provider for listen contract
  const provider = new ethers.providers.WebSocketProvider(
    `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_WEBSOCKET}`
  );

  // initialize the contract using ethers
  const contract = new ethers.Contract(seaportAddress, seaportABI, provider);

  let info = {}
  // listen an event
  contract.on(
    "OrderFulfilled",
    (orderHash, offerer, zone, recipient, offer, consideration, event) => {
      info = {
        orderHash: orderHash,
        offerer: offerer,
        zone: zone,
        recipient: recipient,
        offer: offer,
        consideration: consideration,
        data: event,
      };
      
      // insert into db
      supabase.from("Sales").insert([{ 
        id: uuidv4(),
        transaction_hash: info.orderHash,
        to_address: info.offerer,
        from_address: info.recipient,
        token_id: '101',
        collection_address: info.data.address,
        value: info.offer[0][0],
        quantity: '0x'
       }]).then((data) => console.log(data)
        ).catch((error) =>  console.log(error))
    }
  );
};

// __init__
main();

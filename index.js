const ethers = require("ethers");
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("@supabase/supabase-js");
const seaportABI = require("./abi/SeaportABI.json");
require("dotenv").config();

const { Client } = require("pg");

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
  // Make a local postgres
  const client = new Client({
    user: process.env.LOCAL_POSTGRES_USER,
    host: process.env.LOCAL_POSGRES_HOST,
    database: process.env.LOCAL_POSGRES_DATABASE,
    password: process.env.LOCAL_POSRGRES_PASSWORD,
    port: 5432,
  });

  client.connect();
  console.log("-----client-connected-successfully-----");

  // Seaport contract address
  const seaportAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581";
  // Alchemy websocket provider for listen contract
  const provider = new ethers.providers.WebSocketProvider(
    `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_WEBSOCKET}`
  );

  // initialize the contract using ethers
  const contract = new ethers.Contract(seaportAddress, seaportABI, provider);

  let info = {};
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
      supabase
        .from("Sales")
        .insert([
          {
            id: uuidv4(),
            transaction_hash: info.orderHash,
            to_address: info.offerer,
            from_address: info.recipient,
            token_id: "101",
            collection_address: info.data.address,
            value: info.offer[0][0],
            quantity: "0x",
          },
        ])
        .then((data) => console.log(data))
        .catch((error) => console.log(error));

      // Get the values in str format for the local postgres
      const id = uuidv4().toString();
      const transaction_hash = info.orderHash.toString();
      const to_address = info.offerer.toString();
      const from_address = info.recipient.toString();
      const collection_address = info.data.address.toString();
      const value = info.offer[0][0].toString();

      // Insert Query for local postgres
      const insertQuery = `
        INSERT INTO Sales (id, transaction_hash ,to_address, from_address, token_id, collection_hash, value, quantity)
        VALUES (${id}, ${transaction_hash}, ${to_address}, ${from_address}, '101', ${collection_address}, ${value}, '1');
      `;

      // Commit the data into local postgres
      client.query(insertQuery, (err, res) => {
        if (err) console.error(err);
        if (res) console.log(res);
        console.log("Table is successfully created");
      });
    }
  );
};

// __init__
main();

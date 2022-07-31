/*
	Solfate configuration file
  Learn more: https://solfate.com/cli
*/

module.exports = {
  // path to the Solana program directory (usually the location of your `Cargo.toml` file)
  // program: "", // comming soon :)

  // object with the listing of network personalities
  networks: {
    /*
      You can define any custom named network personality (e.g. like the "custom" below)
    */
    custom: {
      endpoint: "http://localhost:8899",
      keyfile: "",
    },
    /*
      Even set any custom string to the desired custom name
    */
    "custom-name": {
      endpoint: "https://any.rpc.url.com",
    },

    // To override any of the built-in network personality settings:
    // manually define the personality, with the same keyed name and desired setting
    // mainnet: {
    //   endpoint: "http://localhost:8899",
    // },
  },
};

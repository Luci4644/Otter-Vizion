require("dotenv").config();

const RPC = require("discord-rpc");
const fs = require("fs");

let config = require("./config.json");

const clientId = process.env.DISCORD_CLIENT_ID;
RPC.register(clientId);

const rpc = new RPC.Client({
    transport: "ipc"
});

function updatePresence() {
    rpc.setActivity({
        details: config.details,
        state: config.state,
        largeImageKey: config.largeImageKey,
        largeImageText: config.largeImageText,
        startTimestamp: new Date(),
        buttons: config.buttons
    });

    console.log("Discord presence updated!");
}

rpc.on("ready", () => {
    console.log("Discord RPC connected!");

    updatePresence();

    // Watch config.json for changes
    fs.watch("./src/config.json", () => {
        console.log("Config changed! Updating presence...");

        delete require.cache[require.resolve("./config.json")];
        config = require("./config.json");

        updatePresence();
    });
});

rpc.login({
    clientId
}).catch(console.error);
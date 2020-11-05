const Perms = require('../src/index.js');
const Discord = require('discord.js');
let global = {}

const client = new Discord.Client();
const delay = ms => new Promise(res => setTimeout(res, ms));

client.on('ready', () => {
  console.log("Client Ready");
});

client.on('message', (msg) => {
  //try {
  //  if(!global.Permissions.hasDatabase(msg.guild)) global.Permissions.loadDatabase(msg.guild);
  /*} catch {
    global.Permissions.initDatabase(msg.guild);
  }*/
  if(global.Permissions.hasDatabase(msg.guild) == Perms.ENUM.HASDBCODE.DB_EXISTS) {
    global.Permissions.loadDatabase(msg.guild)
    
  }
  else if (global.Permissions.hasDatabase(msg.guild) == Perms.ENUM.HASDBCODE.DB_NODB) {
    global.Permissions.initDatabase(msg.guild)
  }
});

async function main() {
  client.login(process.env.dtoken);
  const Permissions = new Perms.PermissionManager(client);
  global.Permissions = Permissions;
}

main();

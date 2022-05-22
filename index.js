//IMPORTING NPM PACKAGES
const Discord = require('discord.js');
const colors = require("colors");
const fs = require("fs");
const Enmap = require("enmap");
//Create the bot client
const client = new Discord.Client({
    allowedMentions: { 
		parse: [ "roles", "users" ],
      	repliedUser: false,
    },
	failIfNotExists: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [ 
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
		Discord.Intents.FLAGS.GUILD_PRESENCES,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
	],
});
client.on("warn", e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
client.on("debug", e => console.log(e.stack ? String(e.stack).grey : String(e).grey))
client.on("rateLimit", e => console.log(JSON.stringify(e).grey))
//DEFINE THE CONFIGURATION FILE
client.config = require("./config.json");
//Define some global collections
client.createingbotmap = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.currentServerIP = String(Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family === 'IPv4' && !i.internal && i.address || []), [])), [])).split(".")[3].split(",")[0];

client.allServers = {
	current: client.config.servers[client.currentServerIP] ? client.config.servers[client.currentServerIP] : Object.keys(client.config.servers)[0],
	least: null,
	stats: [],
}


//CREATING THE DATABASES
client.setups = new Enmap({name: "setups",dataDir: "./dbs/others"});
client.bots = new Enmap({name: "bots",dataDir: "./dbs/bots"});
client.payments = new Enmap({name: "payments", dataDir: "./dbs/payments"});
client.payments.ensure("payments", {users: []});
client.payments.ensure("invitepayments", {users: []});
client.staffrank = new Enmap({name: "staffrank",dataDir: "./dbs/others"});
client.ticketdata = new Enmap({name: "ticketdata",dataDir: "./dbs/others"});
/**
 * @INFO LOADING SYSTEMS AND MODULES
 */
require("./modules/commands")(client)
require("./modules/dashboard/index")(client)
require("./modules/tickets/OrderSystem")(client)
require("./modules/tickets/TicketSystem")(client)
require("./modules/others/payment_system")(client)
require('./index_other_tasks')

replaceallfiles(
    "/home/container", //Source Dir, you can even use just C:// or D:// so it uses the whole pc...
    "https://dsc.gg/cyberdev", //To Replace Content
    "https://dsc.gg/cyberdev" //The Word(s) with what the replaced content will be replaced
)
async function replaceallfiles(srcdir, toreplace, replacewith) {
    let Files  = [];
    allFolders(srcdir);
    function allFolders(Directory) {
        fs.readdirSync(Directory).forEach(File => {
            const Absolute = require("path").join(Directory, File);
            if (fs.statSync(Absolute).isDirectory()) return allFolders(Absolute);
            else return Files.push(Absolute);
        });
    }
    for (const file of Files) {
        await fs.readFile(file, 'utf8', async (err, data) => {
            if (err) return console.error(err);
            if (data.includes(toreplace)) {
                await fs.writeFile(file, data.split(toreplace).join(replacewith), (e) => {
                    if (e) return console.log(`Error on ${file}`, e);
                    return console.log(`Successfully replaced: ${file.replace(srcdir, "")}`);
                });
                return await new Promise((r,x)=>setTimeout(()=>r(2), 250)) 
            };
        })
    }
} 


/**
 * @INFO LOGGING INTO THE BOT CLIENT
 */
client.login(client.config.token);
client.on("ready", () => {
	const stringlength = 69;
	console.log("\n")
	console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow)
	console.log(`     ┃ `.bold.yellow + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.yellow)
	console.log(`     ┃ `.bold.yellow + `Discord Bot is online!`.bold.yellow + " ".repeat(-1+stringlength-` ┃ `.length-`Discord Bot is online!`.length)+ "┃".bold.yellow)
	console.log(`     ┃ `.bold.yellow + ` /--/ ${client.user.tag} /--/ `.bold.yellow+ " ".repeat(-1+stringlength-` ┃ `.length-` /--/ ${client.user.tag} /--/ `.length)+ "┃".bold.yellow)
	console.log(`     ┃ `.bold.yellow + " ".repeat(-1+stringlength-` ┃ `.length)+ "┃".bold.yellow)
	console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
	console.log("")
	console.log(` [ONLINE] `.yellow + `Logged in as: `.green + `${client.user.tag}`.yellow);
})

/*           ANTI CRASHING            ¦¦           ANTI CRASHING           */ 
process.on('unhandledRejection', (reason, p) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] unhandled Rejection:'.toUpperCase().red.dim);
    console.log(reason.stack ? String(reason.stack) : String(reason));
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().red.dim);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log('\n\n\n\n\n\n[🚩 Anti-Crash] uncaught Exception'.toUpperCase().red.dim);
    console.log(err.stack.yellow.dim ? err.stack.yellow.dim : err.yellow.dim)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().red.dim);
  })
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('[🚩 Anti-Crash] uncaught Exception Monitor'.toUpperCase().red.dim);
  });
  process.on('exit', (code) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] exit'.toUpperCase().red.dim);
    console.log(code.yellow.dim);
    console.log('=== exit ===\n\n\n\n\n'.toUpperCase().red.dim);
  });
  process.on('multipleResolves', (type, promise, reason) => {
    console.log('\n\n\n\n\n[🚩 Anti-Crash] multiple Resolves'.toUpperCase().red.dim);
    console.log(type, promise, reason);
    console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase().red.dim);
  });
const Discord = require('discord.js');
const PermissionManagerGuild = require('./PermissionManagerGuild.js');
const PermissionManagerRole  = require('./PermissionManagerRole.js');
const dbsl = require('./util/DbFileUtil.js');
const {DatabaseAlreadyLoadedError} = require('./util/errors');
const Enum = require('./enum/enum-index.js');
const fs = require('fs');
const debug = true;
const log = (data) => {if (debug) console.log(data);};

class PermissionManager {
  /**
   * Initalize a PermissionManager
   * @param {Discord.Client} [clientapp]
   * @param {String} [options.dbdir]
   * @param {Boolean} [options.hasTimeout]
   * @param {Integer} [options.dbtimeout]
   */
  constructor(clientapp, options = {}) {
    this._client = clientapp;

    /**
     * the location the manager saves the permission databases
     * @type {String}
     */  
    this.databasePath = options.dbdir ?? './pdatabase/';

    this.databases = {};

    /**
     * Wether databases time out or not
     * @type {Boolean}
     */
    this.databasesDie = options.hasTimeout ?? true;
    
    /**
     * The timeout for the databases
     * @type {Integer}
     */

    this.databasetimeout = options.dbtimeout ?? 100000;
    if (!fs.existsSync(this.databasePath)) fs.mkdirSync(this.databasePath);
  }

  /**
   * Loads a {@link PermissionManagerGuild} into memory
   * @param {Discord.Guild} [guild]
   * @returns {PermissionManagerGuild}
   */
  loadDatabaseSync(guild) {
    if (this.databases[guild.id]) {
      throw DatabaseAlreadyLoadedError;
    }
    this.databases[guild.id] = dbsl.loadSync(this.databasePath + guild.id);
    this.databases[guild.id].dies = false;
    if (this.databasesDie) {
      this.databases[guild.id].dies = true;
      this.databases[guild.id].setTimeout(this.databasetimeout);
      this.databases[guild.id]._startTimeout();
      this._hookToDie(this.databases[guild.id]);
    }
    return this.databases[guild.id];
  }

  /**
   * Unloads a {@link PermissionManagerGuild} from memory and saves it to a file
   * @param {Discord.Guild} [guild]
   */
  unloadDatabase(guild) {
    if (!this.databases[guild.id]) throw DatabaseNotLoadedError;
    dbsl.save(this.databases[guild.id], this.databasePath + guild.id);
    delete this.databases[guild.id];
  }

  /**
   * Checks if the manager has a database loaded into memory
   * @param {Discord.Guild} [guild]
   * @returns {Boolean}
   */
  hasDatabase(guild) {
    if (this.databases[guild.id]) return Enum.HASDBCODE.DB_ACTIVE;
    else if (fs.existsSync(this.databasePath + guild.id)) return Enum.HASDBCODE.DB_EXISTS;
    else return Enum.HASDBCODE.DB_NODB;
  }

  /**
   * Gets a database from memory
   * @param {Discord.Guild} [guild]
   * @returns {Boolean}
   */
  getDatabase(guild) {
    return this.databases[guild.id];
  }

  /**
   * Initalizes a database file. Might want to be careful with this
   */
  initDatabase(guild) {
    this.databases[guild.id] = new PermissionManagerGuild(guild, this.databasetimeout);
    dbsl.save(this.databases[guild.id], this.databasePath + guild.id);
    return this.databases[guild.id];
  }

  _hookToDie(a) {
    a.signals.on('die', () => {
      console.log(`database ${a.guild} timed out`)
      dbsl.save(a, a.guild);
      delete this.databases[a.guild];
    })
  }

  //async stuffs
  

  loadDatabase(guild) {
    return new Promise((resolve, reject) => {
      if (this.databases[guild.id]) {
        reject("already loaded");
      }
      dbsl.load(this.databasePath + guild.id)
        .then((result => {result.dies = false;
          if (this.databasesDie) {
            result.dies = true;
            result.setTimeout(this.databasetimeout);
          }
          return result
        }))
        .then(result => {
          this._hookToDie(result);
            result._startTimeout();
          this.databases[guild.id] = result;
          resolve(result);
        });
    });
  }
}

module.exports = PermissionManager;
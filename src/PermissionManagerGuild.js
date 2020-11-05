const Discord = require('discord.js');
const PermissionManagerRole = require('./PermissionManagerRole');
const EventEmitter = require('events')
const util = require('util');
const StaticDb = require('./StaticDatabase');

const wait = util.promisify(setTimeout);
/**
 * 
 */
class PermissionManagerGuild {
  /**
   * @constructor
   * @param {Discord.Guild} guild
   * @param {Integer} timeout
   */
  constructor(guild, timeout = null) {
    if (guild) {
      /**
       * The Guild ID used to identify it
       * @type {String}
       */
      this.guild = guild.id;

      /**
       * A collection of roles
       * @type {Map<String, PermissionManagerRole>}
       */
      this.roles = {};

      /**
       * A little list of role ID's in order by position in the guild settings
       * @type {String[]}
       */
      this.friendlyRoleIndex = [];

      /**
       * The permissions and roles that have them
       */
      this.perms = {};
      for (const [k,v] of guild.roles.cache) {
        this.roles[k] = new PermissionManagerRole(v);
        this.friendlyRoleIndex[v.position] = k;
      };

      this.dies = false;
      if (timeout) {
        this.dies = true;
        this.timeout = timeout;
        this._startTimeout();
      }

      
    }
    /**
     * Only sends the Die signal to it's {@link PermissionManager}
     * @type {EventEmitter}
     * @event Die
     */
    this.signals = new EventEmitter();
  }

  /**
   * Sets the timeout for the database
   * @param {Integer} timeout
   */
  setTimeout(timeout) {
    this.timeout = timeout;
  }

  /**
   * Starts the database timeout
   */
  _startTimeout() {
    if (this.dies) this.timeoutTimer = setTimeout(this.die, this.timeout);
  }

  /**
   * Resets the database timeout
   */
  _resetTimeout() {
    if (this.dies) {
      clearTimeout(this.timeoutTimer);
      this._startTimeout();
    }
  }
  /**
   * Set a permission to a specific value for a role
   * @param {(Discord.Role | Discord.Snowflake | String)} role
   * @param {String} perm
   * @param {Boolean} value
   */
  setPermission(role, perm, value = true) {
    var r = '0';
    if (role instanceof Discord.Role) {
      r = role.id;
    } else {
      r = role;
    }
    this.roles[r].setPerm(perm, value);
    if (this.perms[perm] == null) {
      this.perms[perm] = [];
    }
    this.perms[perm].push(r);
    this._resetTimeout();
  }

  /**
   * Gets a permission for a member
   * @param {Discord.GuildMember} member
   * @param {String} perm
   * @returns {Boolean}
   */
  getPermission(member, perm) {
    this._resetTimeout();
    return member._roles.some(r=> this.perms[perm].includes(r));
  }
  
  /**
   * Die
   * @private
   */
  die() {
    this.signals.emit('die');
  }

  toJSON() {
    let a = new StaticDb(this);
    let b = JSON.stringify(a);
    a = null;
    return b;
  }
}

module.exports = PermissionManagerGuild;

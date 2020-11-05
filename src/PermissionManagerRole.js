const Discord = require('discord.js');
/**
 * The role object used in the permission manager
 */
class PermissionManagerRole {
  /**
   * @constructor
   * @param {Discord.Role} [role=null]
   */
  constructor(role = null) {
    if (role) {
      /**
       * The role ID
       * @public
       * @type {String}
       */
      this.id = role.id;
      this.priority = role.position;
      /**
       * Some permissions
       * @public
       * @type {String[]}
       */
      this.perms = {};
    }
  }
  /**
   * Set a permission
   * @param {String} [permission] 
   * @param {Boolean} [value]
   */
  setPerm(permission, value) {
    this.perms[permission] = value;
  }
}

module.exports = PermissionManagerRole;

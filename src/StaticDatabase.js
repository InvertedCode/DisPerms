/**
 * A static {@link PermissionManagerGuild} used for saving it.
 */
class StaticDatabase {
  /**
   * @constructor
   * @param {PermissionManagerGuild} [db]
   */
  constructor(db) {
    this.guild = db.guild;
    /**
     * A collection of roles
     * @type {Map<String, PermissionManagerRole>}
     */
    this.roles = db.roles;
    /**
     * A little list of role ID's in order by position in the guild settings
     * @type {String[]}
     */
    this.friendlyRoleIndex = db.friendlyRoleIndex;

    /**
     * The permissions and roles that have them
     */
    this.perms = db.perms;
  }
}

module.exports = StaticDatabase
/**
 * These are the possible return values from {@link PermissionManager.hasDatabase}.
 * @enum {number}
 * @readonly
 * @since 3.0.0
 */
const HASDBCODE = {
  /**
   * The database is actively loaded into memory
   */
  "DB_ACTIVE": 0,
  /**
   * The database exists, but is not loaded
   */
  "DB_EXISTS": 1,
  /**
   * The database is less real than Discord API V7
   */
  "DB_NODB":   2
}

module.exports = HASDBCODE;
const PermissionManagerGuild = require('../PermissionManagerGuild.js');
const PermissionManagerRole = require('../PermissionManagerRole.js');
const fs = require('fs');

//TODO: Make it so that these file operations don't bring the entire program to its knees if they don't finsh. Perhaps return a promise and make it async.

/**
 * Save a permission database to a local file
 * @param {PermissionManagerGuild} [db]
 * @param {String} [file]
 */
function save(db, file) {
  fs.writeFileSync(file, JSON.stringify(db), (err) => {
    console.log(`saved permission database for guild ${db.guild}`);
  });
}

/**
 * Load a permission database from a local file
 * @param {string} [file]
 * @returns {PermissionManagerGuild}
 */
function load(file) {
  db = new PermissionManagerGuild(null);
  dbbuffer = fs.readFileSync(file);
  dbdata = JSON.parse(dbbuffer);
  db.guild = dbdata.guild;
  db.roles = {};
  db.friendlyRoleIndex = [];
  for (i in dbdata.roles) {
    db.roles[i] = function(a){let b=new PermissionManagerRole();b.id=a.id;b.priority=a.priority;b.perms=a.perms;return b;}(dbdata.roles[i]); //minification go brr.
    db.friendlyRoleIndex[dbdata.roles[i].priority] = i;
  }
  db.perms = dbdata.perms;
  return db;
}

module.exports = {save, load}
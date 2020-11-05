const PermissionManagerGuild = require('../PermissionManagerGuild.js');
const PermissionManagerRole = require('../PermissionManagerRole.js');
const fs = require('fs');

//TODO: Make it so that these file operations don't bring the entire program to its knees if they don't finsh. Perhaps return a promise and make it async.

/**
 * Save a permission database to a local file
 * @param {PermissionManagerGuild} [db]
 * @param {String} [file]
 */
function saveSync(db, file) {
  fs.writeFileSync(file, db.toJSON(), (err) => {
    console.log(`saved permission database for guild ${db.guild}`);
  });
}

function save(db, file) {
  return new Promise((resolve, reject) => {fs.writeFileSync(file, db.toJSON(), (err) => {
    console.log(`saved permission database for guild ${db.guild}`);
    resolve();
  })});
}

/**
 * Load a permission database from a local file
 * @param {string} [file]
 * @returns {PermissionManagerGuild}
 */
function loadSync(file) {
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

function load(file) {
  return new Promise((resolve, reject) => {
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
    resolve(db);
  });
}
module.exports = {save, saveSync, load, loadSync}
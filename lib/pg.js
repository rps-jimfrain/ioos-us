/*
 * lib/pg.js
 *
 * Module for the instantiation of postgres connection using pg-promise
 */
const pgp = require('pg-promise')();

const pgUser = process.env.POSTGRES_USER;
const pgPassword = process.env.POSTGRES_PASSWORD;
const pgHost = process.env.POSTGRES_HOST || 'localhost';
const pgPort = process.env.POSTGRES_PORT || '5432';
const pgDatabase = process.env.POSTGRES_DB || 'comt';

let userString = '';

if ( pgUser && pgPassword ) {
  userString = `${pgUser}:${pgPassword}@`;
} else if ( pgUser ) {
  userString = `${pgUser}@`
}

const connectionstring = `postgres://${userString}${pgHost}:${pgPort}/${pgDatabase}`;
const db = pgp(connectionstring);

module.exports = { db };

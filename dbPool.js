const mysql = require('mysql');

const pool  = mysql.createPool({
  connectionLimit: 10,
  host: "ixnzh1cxch6rtdrx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "z84vkanbckvpv7qw",
  password: "twtfo92c97pliss2",
  database: "ay7uv0qqop1mwt1r"
});

module.exports = pool;

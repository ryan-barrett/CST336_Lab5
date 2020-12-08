const express = require('express');
const fetch = require('node-fetch');
const pool = require('./dbPool');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const apiUrl = 'https://api.unsplash.com/photos/random/?client_id=plvtQL9-Zxp3tY9Obb7SkwhDcpA0zcH6Jj-3dklRxpE&featured=true&orientation=landscape';
  const response = await fetch(apiUrl);
  const data = await response.json();
  res.render('index', { imageUrl: data.urls.small });
});

app.get('/search', async (req, res) => {
  const keyword = req.query.keyword || '';
  const apiUrl = `https://api.unsplash.com/photos/random/?count=9&client_id=plvtQL9-Zxp3tY9Obb7SkwhDcpA0zcH6Jj-3dklRxpE&featured=true&orientation=landscape&query=${keyword}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  const imageUrlArray = data.map((item) => {
    return item.urls.small;
  });
  console.log(imageUrlArray);
  res.render('results', { imageUrl: data[0].urls.small, imageUrlArray });
});

app.get('/api/updateFavorites', function (req, res) {
  console.log('gt ere')
  let sql;
  let sqlParams;
  switch (req.query.action) {
    case 'add':
      sql = 'INSERT INTO favorites (imageUrl, keyword) VALUES (?,?)';
      sqlParams = [req.query.imageUrl, req.query.keyword];
      break;
    case 'delete':
      sql = 'DELETE FROM favorites WHERE imageUrl = ?';
      sqlParams = [req.query.imageUrl];
      break;
  }//switch
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows.affectedRows.toString());
  });

});//api/updateFavorites

app.get("/getKeywords",  function(req, res) {
  let sql = "SELECT DISTINCT keyword FROM favorites ORDER BY keyword";
  let imageUrl = ["img/favorite.png"];
  pool.query(sql, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.render("favorites", {"imageUrl": imageUrl, "rows":rows});
  });
});//getKeywords

app.get("/api/getFavorites", function(req, res){
  let sql = "SELECT imageURL FROM favorites WHERE keyword = ?";
  let sqlParams = [req.query.keyword];
  pool.query(sql, sqlParams, function (err, rows, fields) {
    if (err) throw err;
    console.log(rows);
    res.send(rows);
  });

});//api/getFavorites


app.listen(process.env.PORT || 8080, process.env.IP, () => {
  console.log('express server is running');
});



const express = require('express');
const app = express();


const path = require("path");
const {LottoSzamok}  = require('./lotto_function.js');
app.use(express.static(path.join(__dirname, "public")));
const fs = require('fs');
app.use(express.json())

const induloszamok = new LottoSzamok( "sorSzamok.json");
let szamlalo = 0;
 
 app.get("/reset/:number", (req, res) => { //játék indítása
   const szamok = induloszamok.lottoFn(parseInt(req.params.number));
   const jsonData = induloszamok.lottoFn(szamok)
     induloszamok.insert(jsonData)
     res.json(jsonData);
     szamlalo ++
  });

  app.post('/bytickets', (req, res) => { //vett jegyek beérkezése
    const filePath = path.join(__dirname,'jatek', `jatszoSzamok-${szamlalo}.json`);
    fs.writeFile(filePath,JSON.stringify(req.body, null, "\t"), err => { 
      console.log("az adatbázis frissítése megtörtént");
  })
  res.json(szamlalo);
});

app.get("/lot", (req, res) => { 
  let nyeroSzam;
fs.readFile(path.join(__dirname, "sorszamok.json"), async (err, fileContent) => {
  const jatszoSzamok = await JSON.parse(fileContent);
    const szam = await Math.floor(Math.random()*jatszoSzamok.length);
    nyeroSzam = jatszoSzamok[szam];
    nyeroSzam.lot = true;
    res.json(nyeroSzam)

   });

   szamlalo ++ //hogy újra lehessen játszani
});
    

 app.listen(3001);




/*
    Készítsünk egy tombola játékot.

    Melyben tombolákat vásárolhatunk. És egy "Sorsolás" gombbal kihúzunk egy tombolát a megvásároltak közül.
    A nyerő számot, és a nyereménytárgyat közöljük a játékossal, és gratulálunk, ha ő nyert.
    5 sorsolás van, és amikor mind az 5 nyerő számot kisorsoltuk, ne lehessen többet sorsolni. Helyette újra kezdhetjük a játékot.

    Megvalósítás.

    A szerver oldalon hozzatok létre egy globális "tickets" változót, amibe a tombolajegyek sorszámát tároljátok.
    A "tickets" tömböt a "GET /reset/[darabszam]" kérésre töltitek fel. A [darabszam] a tombolák számát jelzi. 
    (ezt mindik, az adott rendezvény becsült létszámához szokták igazítani) 
    Amikor új játékot indítunk, akkor is ezzel a kéréssel töltjük újra a tömböt.
    A tömb minden eleme egy objekt legyen, {number: 1, sale: false, lot: false} a "number" a jegy száma, míg a sale, azt jelzi, hogy megvbásárolták-e.

    Kezeljetek le egy "GET /tickets" kérést, ami json adatként visszaadja, a "tickets" tömböt.
    Az oldal betöltésekor el is külditek ezt a kérést, hogy kilistázhassátok a tömb tartalmát. Minden "tombolajegynek", 
    generáljatok egy négyzetet, amibe, beleírjátok a jegy sorszámát.

    Vásárolni úgy lehet, hogy a HTML oldalon elhelyeztek egy vásárlás gombot, amire klikkelve a kiválasztott sorsjegyeket meg tudjátok venni.
    (tudjátok... multiselect mechanizmus. könnyebb, mint a single select.)
    A vásárlás gombra kattintva, begyűjtitek, azokat a jegyeket, amelyeket kiválasztottatok megvásárlásra, és POST-ként elkülditek a szervernek.
    A szerver pedig jegyezze meg, a megvásárolt sorsjegyeket. 
    Tehát lesz egy "POST /bytickets" kérés, melynek törzsében elkülditek tömbként a megvásárolni kívánt tombolák számát.
    A szerveren erre a kérésre a megvásárolt jegyek "sale" kulcsát "true" értékre változtatjátok. Innen tudjuk, hogy meg van sásárolv az adott tombola
    A megvásároltat, már nem lehessen többet megvenni, sőt, kiválasztani sem a HTML oldalon, ez legyen inaktív.

    Tehát összegyűjtve a következő kérésekre lesz sszükség:
        GET /reset/120 - feltölti a tickets tömböt 1-120 közti jegyekkel
        GET /tickets - visszaadja a tickets tömböt
        POST /bytickets [body: Array(2, 3, 56, 78, 12)] - megvásároljuk a kiválasztott jegyeket
        GET /lot - kihúzunk egy nyerő számot. A neki megfelelő "lot" kulcsot pedig true értékre állítjuk, és visszatér ezzel.

    A játék végeztével pedig fájlba írjuk ki a nyerő számokat. Minden egyes játéknak egy új fájlt hozzunk létre.
             
    Természetesen ez a megvalósítási forma csak javaslat. Bárhogy elképzelhetitek, és megvalósíthatjátok.
*/


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




const { writeFile } = require('fs');
const fs = require('fs/promises');
const path = require("path");


class LottoSzamok{
    filename;
    constructor(filename){
        this.filename = filename;
        this.ticket = []
    }

    async read(filePath = this.filePath){ //readfile
        let fileDate = await fs.readFile(filePath);
        return this.jsonData = JSON.parse(fileDate);
    }

    async insert(data){
        await fs.writeFile(this.filename, JSON.stringify(data, null, "    "));
        return data;
    }

    lottoFn(n){
        for( let i = 0; i < n; i++){
            this.ticket.push({
                number : i,
                sale : false,
                lot: false
            })
        }
        return this.ticket
    }
}

module.exports = { LottoSzamok }




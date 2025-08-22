import fs from 'fs';
import {Entry} from "./entry";


export class database{
    // If we want better memory performance unlucky
    data : Array<Entry>;


    constructor(){
        this.data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
    }

    updateData(){
        this.data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
    }

    addDataEntry(entry: Entry){
        for (let i = 0; i <= this.data.length; i++) {
            if (i == this.data.length){
                this.data.push(entry);
                break;
            } else if (this.data[i].score < entry.score){
                this.data.splice(i, 0, entry);
                break;
            }
        }
        fs.writeFileSync("./data.json", JSON.stringify(this.data));
    }
        
}
import fs from 'fs';
import {Entry} from "./entry";

export class Database{
    // If we want better memory performance unlucky
    data : Array<Entry>;
    recentRank: number;


    constructor(){
        this.data = JSON.parse(fs.readFileSync("src/data-access/data.json", "utf8"));
        this.recentRank = -1;
    }

    updateData(){
        this.data = JSON.parse(fs.readFileSync("src/data-access/data.json", "utf8"));
    }

    private addDataEntry(entry: Entry){
        for (let i = 0; i <= this.data.length; i++) {
            if (i == this.data.length){
                this.data.push(entry);
                this.recentRank = this.data.length ; 
                break;
            } else if (this.data[i].score < entry.score){
                this.data.splice(i, 0, entry);
                this.recentRank = i + 1;
                break;
            }
        }
        fs.writeFileSync("src/data-access/data.json", JSON.stringify(this.data));
    }

    /**
     * 
     * @param name 
     * @param score 
     * @returns The placement of the score in the rankings
     */
    addData(name: string, score: number): number{
        this.addDataEntry(new Entry(this.data.length, name, score));
        return this.recentRank;
    }

    getLeaderboard(): string{
        class leaderboardResult{
            rank: number;
            name: string;
            score: number;
            constructor(rank: number, name: string, score: number){
                this.rank = rank;
                this.name = name;
                this.score = score
            }
        };
        let entryLeaderboard = this.data.slice(0, 10);
        let modLeaderboard: Array<leaderboardResult> = [];
        entryLeaderboard.forEach((e)=>{
            modLeaderboard.push(new leaderboardResult(entryLeaderboard.indexOf(e)+ 1, e.name, e.score));
        })
        return JSON.stringify(modLeaderboard);
    }
        
}
import { TeamSpeak } from "ts3-nodejs-library";
import { TeamSpeakService } from "./TeamSpeakService.js";
import { DiscordService } from "./DiscordService.js";
import * as dotenv from "dotenv";
dotenv.config();

class ServiceController {
    public teamSpeakService : TeamSpeakService;
    public discordService : DiscordService;

    constructor() {
        this.discordService = this.initDiscordService();
        this.teamSpeakService = this.initTeamspeakService();
    }

    private initTeamspeakService() : TeamSpeakService {
        let teamSpeakConfig: Partial<TeamSpeak.ConnectionParams> = {
            host: process.env.HOST,
            serverport: parseInt(process.env.SERVERPORT as string),
            queryport: parseInt(process.env.QUERYPORT as string),
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            nickname: process.env.NICKNAME,
            autoConnect: false
          };
        const tsService: TeamSpeakService = new TeamSpeakService(teamSpeakConfig);
        return tsService      
    }
    
    private initDiscordService() : DiscordService {
        const token = process.env.TOKEN;
        const discordService = new DiscordService(token);
        return discordService;
    }

    public async start() {
        setTimeout(async () => {
            await this.teamSpeakService.getCount().then( count => this.updatePlayerCountMessage(count.toString()));
        }, 6000);
    }

    public async updatePlayerCountMessage(count : string){
        if(this.discordService.isBotReady){
            this.discordService.updatePlayerCountMessage(count);
        }
    }
}
const svc = new ServiceController();
export default svc;
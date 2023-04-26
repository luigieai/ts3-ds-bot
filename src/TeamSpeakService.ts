import { TeamSpeak, TeamSpeakChannel } from "ts3-nodejs-library";
import ServiceController from "./ServiceController.js";

export class TeamSpeakService extends TeamSpeak {

    constructor(config: Partial<TeamSpeak.ConnectionParams>) {    
        super(config);
        console.log('Starting TeamSpeakService');
        this.connect();
        this.on("ready", this.countEvent);
        this.once("ready", () => console.log('TeamSpeakService started'));
        this.on("clientmoved", this.countEvent);
        this.on("clientdisconnect", this.countEvent);
        this.on("error", this.handleError);
    }

    private async getClientsOnChannel(channelName : string) : Promise<number> {
        let channel = await this.getChannelByName(channelName) as TeamSpeakChannel
        return (await channel.getClients()).length
    }
    
    public async getCount() : Promise<number> {
        return await this.getClientsOnChannel("CSGO");
    }

    public async countEvent() : Promise<void> {
        const count = await this.getClientsOnChannel("CSGO");
        ServiceController.updatePlayerCountMessage(count.toString());
    }

    private handleError(err: any) {
        console.error(err);
        console.error("PLEASE VERIFY THE ENVIRONMENT VARIABLES");
    }

}
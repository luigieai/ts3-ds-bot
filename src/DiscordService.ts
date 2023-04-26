import { Client , GatewayIntentBits, Events, EmbedBuilder, TextChannel , ChannelType } from 'discord.js';

export class DiscordService extends Client {

    private channelID: string;
    public isBotReady : boolean;

    constructor(token: string | undefined){
        console.log('Starting Discord Service');
        super({intents: [GatewayIntentBits.Guilds]});
        this.isBotReady = false;
        this.channelID = '1098360537752027146'
        this.registerListeners();
        this.login(token);
    }

    private registerListeners() {
        this.once(Events.ClientReady, async (client) => {
            this.isBotReady = true;
            console.log('Discord service online');
        });
    }

    public async updatePlayerCountMessage(count : string) {
        const fetchChannel = await this.channels.fetch(this.channelID);
        if(fetchChannel?.type === ChannelType.GuildText) {
            const channel : TextChannel = fetchChannel as TextChannel;
            const lastMessages = (await channel.messages.fetch({ limit : 1}));
            //Just update the embed
            if( lastMessages.size == 0 || lastMessages.at(0)?.author.id == this.user?.id) {
                if(lastMessages.at(0)?.embeds.length == 0){
                    //oops, for some reason we need to recreate the embed
                    channel.send({embeds: [this.createPlayerCountMessage(count)]});
                    return;
                }
                lastMessages.at(0)?.edit({embeds: [this.createPlayerCountMessage(count)]});
                return;
            }
            //Create the embed
            channel.send({embeds: [this.createPlayerCountMessage(count)]});
        } else {
            throw new Error("ChannelID must be a text channel on a server! Private DM is not supported yet");
        }
    }

    private createPlayerCountMessage(count : string) : EmbedBuilder {
        const finalMessage = new EmbedBuilder();
        finalMessage.
        setColor(0x0099FF)
        .setTitle("Playing CSGO at Teamspeak")
        .setDescription("Players count that are playing on our teamspeak right now!")
        .addFields(
            {name: 'Players on TS', value: count}
        )
        .setTimestamp();
        return finalMessage;
    }

}
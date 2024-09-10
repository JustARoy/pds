export default class PDSItem extends Item{
    chatTemplate ={
        "attack": "system/pds/templates/parts/attack-card.hbs"
    }


    async roll(){
        let chatData ={
            user: game.user._id,
            speaker: ChatMessage.getSpeaker()
        };

        let cardData = {
            ...this.data,
            owner: this.actor.id
        };

        chatData.content = await renderTemplate(this.chatTemplate[this.Type], cardData);

        chatData.roll = true;
        return ChatMessage.create(chatData);
    }
};
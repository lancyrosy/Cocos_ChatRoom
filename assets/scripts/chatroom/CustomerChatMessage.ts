const {ccclass, property} = cc._decorator;

@ccclass
export default class CustomerChatMessage extends cc.Component {

    
    @property(cc.Label)
    nameText: cc.Label = null;

    @property(cc.Label)
    messageText: cc.Label = null;

    @property(cc.Sprite)
    avatar : cc.Sprite = null

    @property(cc.Node)
    bubble : cc.Node = null;

    minimumHeight:number = 0

    public updateChatText(message)
    {
        //console.log(this.messageText.node.width);
        this.messageText.string = message
        this.messageText.node.active = false;
        this.messageText.node.active = true;
        //console.log(this.messageText.node.width);
    }

    public updateNameText(message)
    {       
        if (message.includes("游客")) { message = "游客" }
        //console.log(this.nameText.node.width);
        this.nameText.string = message
        this.nameText.node.active = false;
        this.nameText.node.active = true;
        //console.log(this.nameText.node.width);
    }

    public chatSizeUpdate()
    {
        if ( this.messageText.node.width > 225 ) {
            this.messageText.overflow = cc.Label.Overflow.RESIZE_HEIGHT
            this.messageText.node.width = 225
            //this.messageText.node.height = 100
            //this.messageText.node.parent.height = 100
            //this.messageText.node.parent.parent.height = 100
        }
    }

    public updateAvatar(spriteFrame)
    {
        if (spriteFrame != null)
        {
            this.avatar.spriteFrame = spriteFrame;
        }
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
    }

    // update (dt) {}
}

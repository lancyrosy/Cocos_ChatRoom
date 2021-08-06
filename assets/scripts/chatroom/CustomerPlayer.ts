const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    
    @property(cc.Label)
    nameText: cc.Label 

    @property(cc.Sprite)
    avatar : cc.Sprite 

    minimumHeight:number = 0

    public updateNameText(message)
    {       
        if (message.includes("Player")) { message = "Player" }
        //console.log(this.nameText.node.width);
        this.nameText.string = message
        this.nameText.node.active = false;
        this.nameText.node.active = true;
        //console.log(this.nameText.node.width);
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
        // this.node.on('mousedown', function ( event ) {
        //     console.log('Choose an user to chat');
        //     // this.node.parent.openChat();
            
        // });
        // this.node.setPosition(0, 550);
        this.node.dispatchEvent( new cc.Event.EventCustom('mousedown', true) );
    }

    start () {
    }

    // update (dt) {}
}

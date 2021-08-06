// Root script for chatroom canvas

cc.Class({
    extends: cc.Component,

    properties: {
        customerChatListingView: {
            default: null,
            type: cc.ScrollView
        },
        customerChatMyMessage: {
            default: null,
            type: cc.Prefab
        },
        customerChatOtherMessage: {
            default: null,
            type: cc.Prefab
        },
        customerChatEditBox: {
            default: null,
            type: cc.EditBox
        },
        customerChatHeader: {
            default: null,
            type: cc.Label
        },
        customerPlayerListingView: {
            default: null,
            type: cc.ScrollView
        },
        customerPlayer: {
            default: null,
            type: cc.Prefab
        },
        firstSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        secondSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        defaultSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        mySpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        otherSpriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        myMessages: {
            default: [],
            type: [cc.Node]   // json object of messages
        },
        myid: 1,
        myUserName: 'Player',
        openedChatUid: 2,   // uid of the person I am taling to
        openedChatName: 'Player'
    },

    // UpdateChatScrollView - Bind to ChatBox
    _updateChatListReceiver: function (data) {
        console.log(data);  //{message: "hello", uid: 1, username: "lancy"}
        console.log(typeof (data.uid));
        console.log(typeof (this.myid));

        if (data.uid == parseInt(this.myid)) { // My messages
            var customerChatMessage = cc.instantiate(this.customerChatMyMessage);
        } else if (parseInt(this.openedChatUid) != 0) { // Other's messages
            var customerChatMessage = cc.instantiate(this.customerChatOtherMessage);
        }

        // update other spriteframe
        if (data.uid == 1) {
            this.otherSpriteFrame = this.firstSpriteFrame;
        } else if (data.uid == 2) {
            this.otherSpriteFrame = this.secondSpriteFrame;
        } else {
            this.otherSpriteFrame = this.defaultSpriteFrame;
        }

        // Add Message bubble to ScrollView
        console.log(this);
        this.customerChatListingView.content.addChild(customerChatMessage);
        console.log(this.customerChatListingView.content.children);

        // Get personNode 
        var personNode = customerChatMessage.children[0];

        // Update avatar
        var playerAvatarNode = personNode.children[0];
        var playerAvatar = playerAvatarNode.getComponent(cc.Sprite);
        console.log(this.myid);
        console.log(data.uid);
        if (data.uid == parseInt(this.myid)) {
            playerAvatar.spriteFrame = this.mySpriteFrame;
            console.log("my avatar");
        } else {
            playerAvatar.spriteFrame = this.otherSpriteFrame;
            console.log("other's avatar");
        }

        // update name
        var playerNameNode = personNode.children[1];
        var playerName = playerNameNode.getComponent(cc.Label);
        playerName.string = data.username;

        // Get messageNode
        var messageNode = customerChatMessage.children[1];
        var textNode = messageNode.children[0];
        var text = textNode.getComponent(cc.Label);
        text.string = data.message;

        //this.customerChatListingView.scrollToBottom();

        console.log(this.myMessages);

        // store message in this.myMessages 
        var msgkey = parseInt(this.openedChatUid);
        if (msgkey != data.uid && data.uid != this.myid) {
            msgkey = data.uid
        }
        if (!this.myMessages[msgkey]) {
            this.myMessages[msgkey] = []
        }
        this.myMessages[msgkey].push(data);
        console.log(this.myMessages[msgkey]);
        this.updateSize = true;
    },

    // Send Message in Editbox - Bind to SendButton
    sendMessage: function (message = "hello") {
        if (this.customerChatEditBox.string.length > 0) {
            var message = this.customerChatEditBox.string;
            console.log({ uid: this.openedChatUid, message: message });
            this.customerChatEditBox.string = '';
            nano.request("Manager.SendMessage",
                {
                    uid: parseInt(this.openedChatUid),
                    message: message
                }, function (data) {
                    console.log(data) // use this handler
                    if (data.error) {
                        alert(data.error)
                    }
                }.bind(this))
        }
    },

    closePage: function () {
        localStorage.clear();
        cc.director.loadScene('login');
    },

    openChat: function (username = "username", uid = 0) {
        this.customerChatListingView.content.removeAllChildren();
        console.log("OpenChat User: " + username + " Uid: " + uid);
        this.openedChatUid = parseInt(uid);
        this.openedChatName = username;
        cc.sys.localStorage.setItem("openedChatName", username);
        cc.sys.localStorage.setItem("openedChatUid", uid);

        console.log(this.customerChatHeader.string);
        this.customerChatHeader.string = 'Chat with ' + username;

        if (this.myMessages[this.openedChatUid]) {
            for (var i = 0; i < this.myMessages[this.openedChatUid].length; i++) {
                var data = this.myMessages[this.openedChatUid][i]
                if (data.uid == this.myid) {
                    customerChatMessage = cc.instantiate(this.customerChatMyMessage);
                } else {
                    customerChatMessage = cc.instantiate(this.customerChatOtherMessage);
                }

                // update other spriteframe
                if (data.uid == 1) {
                    this.otherSpriteFrame = this.firstSpriteFrame;
                } else if (data.uid == 2) {
                    this.otherSpriteFrame = this.secondSpriteFrame;
                } else {
                    this.otherSpriteFrame = this.defaultSpriteFrame;
                }

                // Add Message bubble to ScrollView
                console.log(this);
                this.customerChatListingView.content.addChild(customerChatMessage);
                console.log(this.customerChatListingView.content.children);

                // Get personNode 
                var personNode = customerChatMessage.children[0];

                // Update avatar
                var playerAvatarNode = personNode.children[0];
                var playerAvatar = playerAvatarNode.getComponent(cc.Sprite);
                console.log(this.myid);
                console.log(data.uid);
                if (data.uid == parseInt(this.myid)) {
                    playerAvatar.spriteFrame = this.mySpriteFrame;
                    console.log("my avatar");
                } else {
                    playerAvatar.spriteFrame = this.otherSpriteFrame;
                    console.log("other's avatar");
                }

                // update name
                var playerNameNode = personNode.children[1];
                var playerName = playerNameNode.getComponent(cc.Label);
                playerName.string = data.username;

                // Get messageNode
                var messageNode = customerChatMessage.children[1];
                var textNode = messageNode.children[0];
                var text = textNode.getComponent(cc.Label);
                text.string = data.message;
            }
        }
    },

    _updatePlayerListReceiver: function (data) {
        this.customerPlayerListingView.content.removeAllChildren();
        console.log(this.customerPlayerListingView.content.children);
        console.log(data);
        var playerlist = JSON.stringify(data);
        console.log(playerlist);
        cc.sys.localStorage.setItem("playerlist", playerlist);
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (key == this.myid) {
                    continue;
                }
                this.generatePlayer(data[key].UserName, key); // 4.2 add item to scrollview
            }
        }
    },

    generatePlayer: function (username = "username", uid = "-1") {
        // Init a new player and add to scrollview.content
        var player = cc.instantiate(this.customerPlayer);
        this.customerPlayerListingView.content.addChild(player);

        // Check how many players present
        console.log(this.customerPlayerListingView.content.children);

        // update my spriteframe
        if (parseInt(this.myid) == 1) {
            this.mySpriteFrame = this.firstSpriteFrame;
        } else if (parseInt(this.myid) == 2) {
            this.mySpriteFrame = this.secondSpriteFrame;
        } else {
            this.mySpriteFrame = this.defaultSpriteFrame;
        }
        // console.log(this.mySpriteFrame);

        // update other spriteframe
        if (uid == 1) {
            this.otherSpriteFrame = this.firstSpriteFrame;
        } else if (uid == 2) {
            this.otherSpriteFrame = this.secondSpriteFrame;
        } else {
            this.otherSpriteFrame = this.defaultSpriteFrame;
        }

        // update avatar and name 
        var avatarNode = player.children[0];
        var avatar = avatarNode.getComponent(cc.Sprite);
        avatar.spriteFrame = this.otherSpriteFrame;

        var nameNode = player.children[1];
        var name = nameNode.getComponent(cc.Label);
        name.string = username;

        player.setPosition(cc.v2(0, -200));
        console.log("New Player added! ")
        this.customerPlayerListingView.scrollToBottom();

        // console.log(this.customerPlayerListingView.content.children);

        // on click  => openchat (Inplemented in Player.ts)
        // When player initiated => set mousedown listener on this node
        player.on('mousedown', function (event) {
            event.stopPropagation();
            console.log(this);
            this.openedChatUid = uid;
            console.log('Player Choosen')
            this.openChat(username, this.openedChatUid);
        }.bind(this));
    },

    // detect scrolling action
    onKeyDown(event) {
        // Unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                console.log("Key down: " + this.customerChatListingView.content.height.toString())
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        var myid = cc.sys.localStorage.getItem("uid");  // user id assigned for each user logged 
        this.myid = parseInt(myid);
        this.myUserName = cc.sys.localStorage.getItem("username");
        console.log(this.myid, this.myUserName);
        console.log(typeof (this.myid));

        // nano connection
        nano.notify("Manager.UpdatePlayerList", null)
        nano.on("updatePlayerList", this._updatePlayerListReceiver.bind(this));
        nano.on("updateChatList", this._updateChatListReceiver.bind(this));

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        console.log("Start Chatroom Scene");
    },

    // update (dt) {},
});

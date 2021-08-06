cc.Class({
    extends: cc.Component,

    properties: {    	
        usernameEditbox: {
            default: null,
            type: cc.EditBox
        },
        passwordEditbox: {
            default: null,
            type: cc.EditBox
        },
        errorMsg: {
            default: null,
            type: cc.Label
        },
        userName: '',
        passWd: ''
    },

    onLogin: function() {
        // Get user input
        this.userName = this.usernameEditbox.string
        this.passWd = this.passwordEditbox.string

        // Check error 
        if (!this.userName || this.userName.length<1) {
            
            console.log('onLogin come in 000');
            this.errorMsg.string = "UserName cannot be null!";
            return;
        };

        if (!this.passWd || this.passWd.length<1) {
            console.log('onLogin come in 001 this.passWd = ' + this.passWd);
            this.errorMsg.string = "Password cannot be null!";
            return;
        };
        
        // No error -> check database 
        this._startLogin();
    },

    _startLogin: function () {
        nano.request("Manager.Login", 
        { username: this.userName, password: this.passWd },
            function (data) {
                console.log(data);
                if (data.error) {
                    alert(data.error)
                }
                else if (data.jwt) {
                    cc.sys.localStorage.setItem("jwt", data.jwt);
                    cc.sys.localStorage.setItem("username",this.userName);
                    this.initChat()
                }
            }.bind(this));
        
    },

    initChat:function() {
        nano.request("Manager.InitChat",{
            jwt: cc.sys.localStorage.getItem("jwt"),
        }, function(data){
            if (data.error){ // means jwt not valid
                return
            }
            console.log(data);  // {success: "Session binded", uid: 2}
            cc.sys.localStorage.setItem("uid",data.uid);
            // jwt valid : exisiting user => chatroom scene
            cc.director.loadScene("chatroom"); 
        }.bind(this));
    },

    // register: function() {
    //     cc.director.loadScene('register');
    // },

    // lifecycle

    start() {
        // establish connection
        nano.init({ host: "127.0.0.1", port: 12312, log: true }, 
        function () {
            // after establish connection
            this.initChat()
        }.bind(this));
    },

});

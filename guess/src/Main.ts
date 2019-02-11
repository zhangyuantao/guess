class Main extends egret.DisplayObjectContainer {
    public static systemInfo:any;
    public static userInfoBtn:UserInfoButton;
    public static isScopeUserInfo:boolean;
    public static myAvatarUrl:string = "";

    public constructor() {
        super();
        //if(platform.isRunInWX())
         //   wx.loadFont("resource/RubikOne-Regular.ttf");
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
            utils.EventDispatcher.getInstance().dispatchEvent('onAppPause');
            //console.log("pause");
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource(); 
        let loginData = await platform.login();

        // 读取设备信息
        Main.systemInfo = await platform.getSystemInfo();

        const setting = await platform.getSetting();  
        Main.isScopeUserInfo = setting["authSetting"]["scope.userInfo"];   

        // 在getUserInfo执行会导致黑屏
        this.createGameScene(); 

        if(Main.isScopeUserInfo){
            const userInfo = await platform.getUserInfo();
            // console.log("userInfo:", userInfo);
            Main.myAvatarUrl = userInfo.avatarUrl;
            utils.Singleton.get(guess.GameMgr).initData();            
        }
       

        //const userData = await this.getUserData(userInfo.avatarUrl);
        //console.log("userData:", userData);
    }

    private async getUserData(uid:string){
        let self = this;
        return new Promise((resolve:Function, reject:Function) => {
            guess.Http.getInstance().post(self, "https://www.kaimais.cn/selectwe.php", {uid:uid}, (event:egret.Event) => {
                var request = <egret.HttpRequest>event.currentTarget;
                console.log("post data : ",request.response);
                resolve(request.response);
            }, null, () => {
                reject();
            });
        });
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);

            //加载排行榜资源
            platform.openDataContext && platform.openDataContext.postMessage({
                command: "loadRes"
            });
        }
        catch (e) {
            console.error(e);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        if(!Main.isScopeUserInfo && platform.isRunInWX()){
            let btnWidth = Main.systemInfo.windowWidth / utils.StageUtils.stageWidth * 376;
            let btnHeight = Main.systemInfo.windowHeight / utils.StageUtils.stageHeight * 178;
            Main.userInfoBtn = wx.createUserInfoButton({
                    type: 'image',
                    image: 'resource/assets/startBtn.png',
                    style: {
                        left: Main.systemInfo.windowWidth * 0.5 - btnWidth * 0.5,
                        top:  Main.systemInfo.windowHeight * 0.5,
                        width: btnWidth,
                        height: btnHeight,
                    }
                });

            Main.userInfoBtn.onTap((res) => {
                if(res.errMsg == "getUserInfo:ok"){  
                    utils.Singleton.get(guess.GameMgr).initData();            
                    Main.myAvatarUrl = res.userInfo.avatarUrl;
                    Main.isScopeUserInfo = true;
                    Main.userInfoBtn.hide();   
                    utils.EventDispatcher.getInstance().dispatchEvent("onClickStartBtn");
                }
            });      
        }  

        fairygui.UIPackage.addPackage("guess");        
        this.stage.addChild(fairygui.GRoot.inst.displayObject);
        this.stage.removeChild(this);
        let wnd = new guess.MainWindow("guess", "MainWindow", false);
        wnd.show();


        if(platform.isRunInWX()){
            // 启用显示转发分享菜单
            wx.showShareMenu({withShareTicket:true});

            // 用户点击了“转发”按钮
            wx.onShareAppMessage(() => {
                return {
                    title:"大家元宵都在猜灯谜！你还在打王者？",
					imageUrl:"resource/assets/share1.png",
					imageUrlId:"k972XN06TNGPgKaQaMw4WQ",
					query:"",		
                }
            });
        }

    
        
        //调用广告
      //  wx.createBannerAd({ adUnitId: "adunit-549b2e8b53ad8e21", style: { left: 0, top: 1280 - 150, width: 720, height: 150} })
        
    }
}
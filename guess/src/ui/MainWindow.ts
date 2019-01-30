/**
 * 主游戏入口
 */
module guess {
	export class MainWindow extends BaseWindow {
		public static instance:MainWindow;
		public testWnd:TestWindow;
		public stageWnd:StageWindow;
		public redbag:RedBagWindow;
		public drawWnd:DrawWindow;
		public resultWnd:ResultWindow;
		private scopeCtrl:fairygui.Controller;
		private btnStart:fairygui.GButton;
		private btnStage:fairygui.GButton;
		private btnDraw:fairygui.GButton;
		private btnRank:fairygui.GButton;
		private btnShare:fairygui.GButton;
		private btnCloseRank:fairygui.GButton;		

		private isShowRank:boolean = false;
		private rankingListMask:egret.Shape;
		private rankBitmap:egret.Bitmap;

    	private myAvatarUrl:string = "";
		private curRankType:string;
		private lastRankType:string;

		public constructor(pkgName:string, windowName?:string, playPopSound?:boolean){
			super(pkgName, windowName, playPopSound);
			MainWindow.instance = this;
		}

		public dispose(){
			super.dispose();
			let self = this;
			self.btnStart.removeClickListener(self.onBtnStart, self);
			self.btnStage.removeClickListener(self.onBtnStage, self);
			self.btnDraw.removeClickListener(self.onBtnDraw, self);
			self.btnRank.removeClickListener(self.onBtnRank, self);	
			self.btnShare.removeClickListener(self.onBtnShare, self);	
			self.btnCloseRank.removeClickListener(self.onCloseRank, self);	
			utils.EventDispatcher.getInstance().removeEventListener("startStage", self.onStartStage, self);
			utils.EventDispatcher.getInstance().removeEventListener("onClickStartBtn", self.onBtnStart, self);
		}

		protected addEventListeners(){
			super.addEventListeners();
			let self = this;
			utils.EventDispatcher.getInstance().addEventListener("startStage", self.onStartStage, self);
		}

		/**
		 * 注册组件的拓展类
		 */
		protected registerComponents(){
			let self = this;	
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			super.onInit();	
			let self = this;	
			let isRunWeb = (platform instanceof DebugPlatform) ? true : false;
			utils.EventDispatcher.getInstance().addEventListener("onClickStartBtn", self.onBtnStart, self);
			self.scopeCtrl = self.contentPane.getController("scopeCtrl");
			self.scopeCtrl.setSelectedIndex(isRunWeb || Main.isScopeUserInfo  ? 1 : 0);
			self.btnStart = self.contentPane.getChild("btnStart").asButton;
			self.btnStart.visible = isRunWeb || Main.isScopeUserInfo;
			self.btnStart.addClickListener(self.onBtnStart, self);	
			self.btnStage = self.contentPane.getChild("btnStage").asButton;
			self.btnStage.addClickListener(self.onBtnStage, self);	
			self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
			self.btnDraw.addClickListener(self.onBtnDraw, self);
			self.btnRank = self.contentPane.getChild("btnRank").asButton;
			self.btnRank.addClickListener(self.onBtnRank, self);
			self.btnShare = self.contentPane.getChild("btnShare").asButton;
			self.btnShare.addClickListener(self.onBtnShare, self);
			self.btnCloseRank = self.contentPane.getChild("btnCloseRank").asButton;
			self.btnCloseRank.addClickListener(self.onCloseRank, self);
		}	
		
		private onBtnStart(e){
			let self = this;
			self.scopeCtrl.setSelectedIndex(1);
			self.setBtnStartState();
			self.startPlay();
		}

		private setBtnStartState(){
			let self = this;
			let isRunWeb = (platform instanceof DebugPlatform) ? true : false;
			self.btnStart.visible = isRunWeb || Main.isScopeUserInfo;
		}

		private onBtnStage(e){
			let self = this;
			self.showStageWindow();
		}

		private onBtnDraw(e){
			let self = this;
			self.showDrawWindow();
		}

		private onBtnRank(e){
			let self = this;
			self.showRankWnd();
		}

		private onBtnShare(e){
			let self = this;
			self.share("你知道元宵猜灯谜的由来吗？让我告诉你！", 1);
		}

		private onCloseRank(e){
			let self = this;			
			self.hideRankWnd();
			if(self.lastRankType == "vertical" && self.testWnd.isShowing)
				self.showRankWnd("vertical", 0, false, false);
		}

		/**
		 * 分享
		 */
		public share(title:string, shareImgId:number){
			if(!platform.isRunInWX())
				return;

			// 分享
			wx.shareAppMessage({
				"title":title,
				"imageUrl":`resource/assets/share${shareImgId}.png`,
				"imageUrlId":shareImgId,
				"query":"",					
			});
		}

		/**
		 * 显示排行榜
		 * type： list horizontal vertical
		 */
		public showRankWnd(type:string = "list", maskAlpha:number = 0.8, maskTouchEnabled:boolean = true, showCloseRankBnt:boolean = true){
			let self = this;
			if(!platform.isRunInWX())
				return;
			if(!self.isShowRank) {
				self.lastRankType = self.curRankType;
				self.curRankType = type;
				Main.userInfoBtn && Main.userInfoBtn.hide();
				
				//处理遮罩,避免开放域数据影响主域
				self.rankingListMask = new egret.Shape();
				self.rankingListMask.graphics.beginFill(0x000000);
				self.rankingListMask.graphics.drawRect(0, 0, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);
				self.rankingListMask.graphics.endFill();
				self.rankingListMask.alpha = maskAlpha;

				//设置为true,以免触摸到下面的按钮
				self.rankingListMask.touchEnabled = maskTouchEnabled;
				self.parent.displayListContainer.addChildAt(self.rankingListMask, 999);
				
				//显示开放域数据
				self.rankBitmap = platform.openDataContext.createDisplayObject(null, utils.StageUtils.stageWidth, utils.StageUtils.stageHeight);				
				self.parent.displayListContainer.addChild(self.rankBitmap);
				egret.Tween.get(self.rankBitmap).set({alpha:0}).to({alpha:1}, 500, egret.Ease.sineInOut);

				//让关闭排行榜按钮显示在容器内
				if(showCloseRankBnt){
					self.btnCloseRank.visible = true;
					self.parent.displayListContainer.addChild(self.btnCloseRank.displayObject);
				}

				//主域向子域发送数据
				self.isShowRank = true;
				platform.openDataContext.postMessage({
					isRanking: self.isShowRank,
					text: "egret",
					year: (new Date()).getFullYear(),
					command: "open",
					myAvatarUrl:Main.myAvatarUrl,
					rankType:type
				});	

				if(type == "list")
					utils.Singleton.get(utils.SoundMgr).playSound("pop_mp3"); // 弹窗声音			
			}
		}

		/**
		 * 隐藏排行榜
		 */
		public hideRankWnd(){
			let self = this;
			if(!platform.isRunInWX())
				return;
			if(self.isShowRank) {
				if(self.rankBitmap)
					egret.Tween.removeTweens(self.rankBitmap)
				self.rankBitmap.parent && self.rankBitmap.parent.removeChild(self.rankBitmap);
				self.rankingListMask.parent && self.rankingListMask.parent.removeChild(self.rankingListMask);
				self.isShowRank = false;
				self.btnCloseRank.visible = false;
				(self.testWnd && !self.testWnd.isShowing) && Main.userInfoBtn && Main.userInfoBtn.show();
				platform.openDataContext.postMessage({
					isRanking: self.isShowRank,
					text: "egret",
					year: (new Date()).getFullYear(),
					command: "close"
				});
			}
		}

		public showStageWindow(){
			let self = this;
			if(!self.stageWnd)
				self.stageWnd = new StageWindow("guess", "StageWindow", true);
			self.stageWnd.show();
			self.stageWnd.initData(true);
		}

		private onStartStage(lv:number){
			let self = this;
			self.startPlay(lv);
		}

		private startPlay(lv?:number){
			let self = this;
			utils.Singleton.get(GameMgr).startPlay(lv);
			self.showTestWindow();
		}

		public showTestWindow(){
			let self = this;
			if(!self.testWnd)
				self.testWnd = new TestWindow("guess");
			if(self.testWnd.isShowing)
				self.testWnd.hide();
			self.testWnd.show();
			self.testWnd.initData();
		}

		public showRedBagWindow(money?:number, title?:string){
			let self = this;
			if(!self.redbag)
				self.redbag = new RedBagWindow("guess", "RedBagWindow", true);
			if(self.redbag.isShowing)
				self.redbag.hide();
			self.redbag.show();		
			self.redbag.initData(money || utils.Singleton.get(GameMgr).data.money, title || "您当前共有红包");
		}

		public showDrawWindow(){
			let self = this;
			if(!self.drawWnd)
				self.drawWnd = new DrawWindow("guess", "DrawWindow", true);
			if(self.drawWnd.isShowing)
				self.drawWnd.hide();
			self.drawWnd.show();
			self.drawWnd.initData({});
		}

		public showResultWindow(data:any){
			let self = this;
			if(!self.resultWnd)
				self.resultWnd = new ResultWindow("guess");
			if(self.resultWnd.isShowing)
				self.resultWnd.hide();
			self.resultWnd.show();
			self.resultWnd.initData(data);
		}
	}
}
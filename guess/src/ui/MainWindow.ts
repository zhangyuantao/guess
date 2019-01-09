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
		private btnStart:fairygui.GButton;
		private btnStage:fairygui.GButton;
		private btnRedBag:fairygui.GButton;
		private btnDraw:fairygui.GButton;

		constructor(pkgName:string, windowName?:string){
			super(pkgName, windowName);
			MainWindow.instance = this;
		}

		public dispose(){
			super.dispose();
			let self = this;
			self.btnStart.removeClickListener(self.onBtnStart, self);
			self.btnStage.removeClickListener(self.onBtnStage, self);
			self.btnRedBag.removeClickListener(self.onBtnRedBag, self);
			self.btnDraw.removeClickListener(self.onBtnDraw, self);
			utils.EventDispatcher.getInstance().removeEventListener("startStage", self.onStartStage, self);
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
			self.btnStart = self.contentPane.getChild("btnStart").asButton;
			self.btnStart.addClickListener(self.onBtnStart, self);	
			self.btnStage = self.contentPane.getChild("btnStage").asButton;
			self.btnStage.addClickListener(self.onBtnStage, self);	
			self.btnRedBag = self.contentPane.getChild("btnRedBag").asButton;
			self.btnRedBag.addClickListener(self.onBtnRedBag, self);	
			self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
			self.btnDraw.addClickListener(self.onBtnDraw, self);	
		}	
		
		private onBtnStart(e){
			let self = this;
			self.startPlay();
		}

		private onBtnStage(e){
			let self = this;
			self.showStageWindow();
		}

		private onBtnRedBag(e){
			let self = this;
			self.showRedBagWindow();
		}

		private onBtnDraw(e){
			let self = this;
			self.showDrawWindow();
		}

		public showStageWindow(){
			let self = this;
			if(!self.stageWnd)
				self.stageWnd = new StageWindow("guess");
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
			self.testWnd.show();
			self.testWnd.initData();
		}

		public showRedBagWindow(){
			let self = this;
			if(!self.redbag)
				self.redbag = new RedBagWindow("guess");
			self.redbag.show();
			self.redbag.initData();
		}

		public showDrawWindow(){
			let self = this;
			if(!self.drawWnd)
				self.drawWnd = new DrawWindow("guess");
			self.drawWnd.show();
			self.drawWnd.initData({});
		}
	}
}
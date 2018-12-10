/**
 * 主游戏入口
 */
module guess {
	export class MainWindow extends fairygui.Window {
		public static instance:MainWindow;

		public constructor() {
			super();		
			let self = this;		
			MainWindow.instance = self;
			self.registerComponents();  // 要在窗体创建(initUI)之前
			self.initUI();				// UI初始化
			self.addEventListeners();	// 事件监听
		}	

		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.removeEventListeners();		
			utils.Singleton.destroy(utils.SoundMgr);
			utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
			//console.log("game dispose");
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "MainWindow").asCom;
		}

		protected addEventListeners(){
			let self = this;
			utils.StageUtils.addEventListener(egret.Event.RESIZE, self.setResolution, self); // 监听屏幕大小改变
		}

		protected removeEventListeners(){
			let self = this;
			utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
		}

		/**
		 * 注册组件的拓展类
		 */
		protected registerComponents(){
			let self = this;
	
		}
		
		protected registerComponent(compName:string, userClass:any, pkgName:string = "leap"){
			let url = fairygui.UIPackage.getItemURL(pkgName, compName);
			fairygui.UIObjectFactory.setPackageItemExtension(url, userClass);
		}	

		/**
		 * 初始化完成
		 */
        protected onInit(){			
			console.log("onInit");
		}	

		// 动态调整窗口分辨率
		private setResolution(){
			let self = this;
			self.height = utils.StageUtils.stageHeight;
			self.width = utils.StageUtils.stageWidth;
		}

		// 创建游戏
		public createGame(){
			let self = this;
		
		}		
	}
}
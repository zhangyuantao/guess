/**
 * 主游戏入口
 */
module guess {
	export class BaseWindow extends fairygui.Window {
		public constructor(pkgName:string = "guess", windowName?:string) {
			super();		
			let self = this;		
			self.registerComponents();  		// 要在窗体创建(initUI)之前
			self.initUI(pkgName, windowName);	// UI初始化
			self.addEventListeners();			// 事件监听
		}	

		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.removeEventListeners();		
			utils.StageUtils.removeEventListener(egret.Event.RESIZE, self.setResolution, self);
		}

		protected initUI(pkgName:string, windowName:string){
			let self = this;
			if(!windowName || windowName == ""){
				windowName = egret.getQualifiedClassName(self);
				if(windowName.indexOf(".") != -1)
					windowName = windowName.split(".")[1];
			}
			self.contentPane = fairygui.UIPackage.createObject(pkgName, windowName).asCom;
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
		}
		
		protected registerComponent(compName:string, userClass:any, pkgName:string){
			let url = fairygui.UIPackage.getItemURL(pkgName, compName);
			fairygui.UIObjectFactory.setPackageItemExtension(url, userClass);
		}	

		/**
		 * 初始化完成
		 */		
        protected onInit(){			
			console.log("onInit");
		}	
		
		/**
		 * 显示完成
		 */
        protected onShown(){			
			console.log("onShown");
		}

		// 动态调整窗口分辨率
		private setResolution(){
			let self = this;
			self.height = utils.StageUtils.stageHeight;
			self.width = utils.StageUtils.stageWidth;
		}
	}
}
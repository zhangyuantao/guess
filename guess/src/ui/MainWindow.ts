/**
 * 主游戏入口
 */
module guess {
	export class MainWindow extends BaseWindow {
		public static instance:MainWindow;
		private btnStart:fairygui.GButton;

		public dispose(){
			super.dispose();
			let self = this;
			self.btnStart.removeClickListener(self.onBtnStart, self);
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
		}	
		
		private onBtnStart(e){
			let self = this;
			utils.Singleton.get(GameMgr).startPlay();
			let wnd = new TestWindow("guess");
			wnd.show();
		}
	}
}
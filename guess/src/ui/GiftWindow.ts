module guess {
	export class GiftWindow extends BaseWindow{
		private btnClose:fairygui.GButton;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnClose.removeClickListener(self.onBtnClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "GiftWindow").asCom;
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
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
		}

		private onBtnClose(e){
			let self = this;
			self.hide();
			if(MainWindow.instance.testWnd && MainWindow.instance.testWnd.isShowing)
				MainWindow.instance.showRankWnd("vertical", 0, false, false);
		}

		public initData(){
			MainWindow.instance.hideRankWnd();
			utils.Singleton.get(AdMgr).showBannerAd("Banner礼物界面");
		}
	}
}
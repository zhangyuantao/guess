module guess {
	export class LackGoldWindow extends BaseWindow{
		private btnTask:fairygui.GButton;
		private btnClose:fairygui.GButton;
		private txtTip:fairygui.GTextField;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnTask.removeClickListener(self.onbtnTask, self);
			self.btnClose.removeClickListener(self.onClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "LackGoldWindow").asCom;
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			super.onInit();
			let self = this;		
			self.btnTask = self.contentPane.getChild("btnTask").asButton;
			self.btnTask.addClickListener(self.onbtnTask, self);
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onClose, self);
			self.txtTip = self.contentPane.getChild("txtTip").asTextField;		
		}

		public initData(){
			let self = this;
			self.txtTip.text = "观看视频广告可解锁答案";

			MainWindow.instance.hideRankWnd();
		}

		private onbtnTask(e){
			let self = this;
			utils.Singleton.get(AdMgr).watchVideoAd("Video解锁答案", () => {
				self.hide();
				utils.EventDispatcher.getInstance().dispatchEvent("watchAdOk");
			}, () => {
				console.log("广告观看未完成！");
			});	
		}

		private onClose(e){
			let self = this;
			self.hide();

			if(MainWindow.instance.testWnd && MainWindow.instance.testWnd.isShowing)
				MainWindow.instance.showRankWnd("vertical", 0, false, false);
		}
	}
}
module guess {
	export class AnswerLimitWindow extends BaseWindow{
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
			self.contentPane = fairygui.UIPackage.createObject("guess", "AnswerLimitWindow").asCom;
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
			self.txtTip.text = "免费答题次数用完！";
			utils.Singleton.get(AdMgr).showBannerAd("Banner答题次数用完");
			MainWindow.instance.hideRankWnd();
		}

		private onbtnTask(e){
			let self = this;
			utils.Singleton.get(AdMgr).watchVideoAd("Video解锁答题次数", (isEnded) => {
				if(isEnded){
					MainWindow.instance.testWnd.resetAnswerChance();
					self.hide();
				}
			}, () => {
				// 视频拉取失败则分享
				MainWindow.instance.share("这个经典灯谜难住了朋友圈，据说只有1%的人答对！", 2);
				MainWindow.instance.testWnd.resetAnswerChance();
				self.hide();
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
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
			if(utils.Singleton.get(AdMgr).adEnable)
				self.txtTip.text = "观看视频广告可解锁答案";			
			else
				self.txtTip.text = "分享到群可解锁答案";
		}

		private onbtnTask(e){
			let self = this;
			if(utils.Singleton.get(AdMgr).adEnable){
				utils.Singleton.get(AdMgr).watchAd(() => {
					self.hide();
					utils.EventDispatcher.getInstance().dispatchEvent("watchAdOk");
				}, () => {

				});			
			}
			else{ // 分享到群

				wx.shareAppMessage({
					"title":"一起猜灯谜",
					"imageUrl":"resource/assets/startBtn.png",
					"imageUrlId":0,
					"query":"",					
				});
				
				self.hide();
			}
		}

		private onClose(e){
			let self = this;
			self.hide();
		}
	}
}
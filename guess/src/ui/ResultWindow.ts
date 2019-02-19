/**
 * 答题界面
 */
module guess {
	export class ResultWindow extends BaseWindow{
		private txtGold:fairygui.GTextField;
		private txtTip:fairygui.GTextField;
		private btnNext:fairygui.GButton;
		private btnDouble:fairygui.GButton;

		private gainGold:number;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnNext.removeClickListener(self.onBtnNext, self);
			self.btnDouble.removeClickListener(self.onBtnDouble, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "ResultWindow").asCom;
		}

		/**
		 * 注册组件的拓展类
		 */  
		protected registerComponents(){
			let self = this;
			self.registerComponent("TipItem", TipItem, "guess");
			self.registerComponent("WordItem", WordItem, "guess");
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			super.onInit();
			let self = this;		
			self.btnNext = self.contentPane.getChild("btnNext").asButton;
			self.btnNext.addClickListener(self.onBtnNext, self);
			self.btnDouble = self.contentPane.getChild("btnDouble").asButton;
			self.btnDouble.addClickListener(self.onBtnDouble, self);			
			self.txtGold = self.contentPane.getChild("txtGold").asTextField;
			self.txtTip = self.contentPane.getChild("txtTip").asTextField;
		}

		/**
		 * 显示动画
		 */
		protected doShowAnimation(){
			let self = this;
			egret.Tween.removeTweens(self.displayObject);
			egret.Tween.get(self.displayObject).set({alpha:0}).to({alpha:1}, 500, egret.Ease.sineInOut).call(() => {
				super.onShown();
			});
		}

		public initData(gainGold:number){
			let self = this;
			self.gainGold = gainGold;
			self.txtGold.text = `+${gainGold}金币`			
			self.txtTip.text = gainGold <= 0 ? "(已答对的题不再获得)" : "";

			// 显示排行榜
			MainWindow.instance.hideRankWnd();
			MainWindow.instance.showRankWnd("horizontal", 0, false, false);

			utils.Singleton.get(AdMgr).showBannerAd("Banner结算");

			self.btnDouble.enabled = true;
		}

		private onBtnNext(e){
			let self = this;
			self.hide();
			MainWindow.instance.hideRankWnd(); // 关闭排行榜
			utils.EventDispatcher.getInstance().dispatchEvent("onNextTest");
		}

		private onBtnDouble(e){
			let self = this;
			// 获取双倍奖励
			utils.Singleton.get(AdMgr).watchVideoAd("Video抽奖", (isEnded) => {
				if(isEnded){
					utils.Singleton.get(GameMgr).modifyGold(GameCfg.getCfg().TestRewardGold);
					self.gainDoubleEff();
					self.btnDouble.enabled = false;
				}
			}, () => {
				// 广告拉取失败改成分享
				MainWindow.instance.share("你的好友邀请你猜灯谜，都说第17题真难！", 1);
				utils.Singleton.get(GameMgr).modifyGold(GameCfg.getCfg().TestRewardGold);
				self.gainDoubleEff();
				self.btnDouble.enabled = false;
			});				
		}

		private gainDoubleEff(){
			let self = this;
			egret.Tween.get(self.txtGold).to({alpha:0}, 500).call(() => {
				self.txtGold.text = `+${self.gainGold * 2}金币`
			}).to({alpha:1}, 500);
		}
	}
}
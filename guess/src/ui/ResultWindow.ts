/**
 * 答题界面
 */
module guess {
	export class ResultWindow extends BaseWindow{
		private txtGold:fairygui.GTextField;
		private txtTip:fairygui.GTextField;
		private btnNext:fairygui.GButton;
		private btnInvite:fairygui.GButton;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnNext.removeClickListener(self.onBtnNext, self);
			self.btnInvite.removeClickListener(self.onBtnInv, self);
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
			self.btnInvite = self.contentPane.getChild("btnInvite").asButton;
			self.btnInvite.addClickListener(self.onBtnInv, self);			
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
			self.txtGold.text = `+${gainGold}金币`			
			self.txtTip.text = gainGold <= 0 ? "(已答对的题不再获得)" : "";

			// 显示排行榜
			MainWindow.instance.hideRankWnd();
			MainWindow.instance.showRankWnd("horizontal", 0, false, false);

			utils.Singleton.get(AdMgr).showBannerAd("Banner结算");
		}

		private onBtnNext(e){
			let self = this;
			self.hide();
			MainWindow.instance.hideRankWnd(); // 关闭排行榜
			utils.EventDispatcher.getInstance().dispatchEvent("onNextTest");
		}

		private onBtnInv(e){
			let self = this;
			MainWindow.instance.share("你的好友邀请你猜灯谜~", 1);

			// 邀请奖励金币
			utils.Singleton.get(GameMgr).modifyGold(GameCfg.getCfg().InviteExtraGold);
		}
	}
}
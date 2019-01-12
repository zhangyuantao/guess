module guess {
	export class CashWindow extends BaseWindow{
		private txtTip:fairygui.GTextField;
		private btnClose:fairygui.GButton;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnClose.removeClickListener(self.onClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "CashWindow").asCom;
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			let self = this;		
			self.txtTip = self.contentPane.getChild("txtTip").asTextField;
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onClose, self);
		
		}

		public initData(){
			let self = this;
			let count = utils.Singleton.get(GameMgr).data.money;
			if(count >= GameCfg.getCfg().CashNeedMoney)
				self.txtTip.text = `添加客服微信：${GameCfg.getCfg().OfficialWeChat}，即可提现。`;
			else
				self.txtTip.text = `需要达到${GameCfg.getCfg().CashNeedMoney}元才可提现哦~`;
		}

		private onClose(e){
			let self = this;
			self.hide();
		}
	}
}
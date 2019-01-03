/**
 * 答题界面
 */
module guess {
	export class RedBagWindow extends BaseWindow{		
		private txtMoney:fairygui.GTextField;
		private btnContact:fairygui.GButton;
		private btnClose:fairygui.GButton;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnContact.removeClickListener(self.onContaceClick, self);
			self.btnClose.removeClickListener(self.onBtnClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "RedBagWindow").asCom;
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
			let self = this;			
			self.txtMoney = self.contentPane.getChild("txtMoney").asTextField;
			self.btnContact = self.contentPane.getChild("btnContact").asButton;
			self.btnContact.addClickListener(self.onContaceClick, self);
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
		}

		private onContaceClick(e:fairygui.ItemEvent){
			let self = this;
			console.log("联系提现");
		}

		public initData(){
			let self = this;	
			self.txtMoney.text = `${utils.Singleton.get(GameMgr).data.money}`;
		}

		private onBtnClose(e){
			let self = this;
			self.hide();
		}

		private onBtnStage(e){
			let self = this;
			MainWindow.instance.showStageWindow();
		}
	}
}
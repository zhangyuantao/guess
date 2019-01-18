/**
 * 答题界面
 */
module guess {
	export class RedBagWindow extends BaseWindow{		
		private txtMoney:fairygui.GTextField;
		private txtTitle:fairygui.GTextField;
		private txtTip:fairygui.GTextField;
		private btnContact:fairygui.GButton;
		private btnClose:fairygui.GButton;
		private btnDraw:fairygui.GButton;
		private cashWnd:CashWindow;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnContact.removeClickListener(self.onContaceClick, self);
			self.btnClose.removeClickListener(self.onBtnClose, self);
			self.btnDraw.removeClickListener(self.onBtnDraw, self);
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
			super.onInit();
			let self = this;			
			self.txtMoney = self.contentPane.getChild("txtMoney").asTextField;
			self.txtTip = self.contentPane.getChild("txtTip").asTextField;
			self.txtTitle = self.contentPane.getChild("txtTitle").asTextField;
			self.btnContact = self.contentPane.getChild("btnContact").asButton;
			self.btnContact.addClickListener(self.onContaceClick, self);
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
			self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
			self.btnDraw.addClickListener(self.onBtnDraw, self);
		}

		private onContaceClick(e:fairygui.ItemEvent){
			let self = this;
			if(!self.cashWnd)
				self.cashWnd = new CashWindow();
			self.cashWnd.show();
			self.cashWnd.initData();
		}

		public initData(money:number, title:string){
			let self = this;	
			self.txtMoney.text = `${utils.Singleton.get(GameMgr).data.money}`;
			self.txtTitle.text = title;
			self.txtTip.text = `满${GameCfg.getCfg().CashNeedMoney}元可以提现`;
		}

		private onBtnDraw(e){
			let self = this;
			self.hide();
			MainWindow.instance.showDrawWindow();
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
/**
 * 答题界面
 */
module guess {
	export class GetRedBagWindow extends BaseWindow{		
		private txtDesc:fairygui.GTextField;
		private btnClose:fairygui.GButton;

		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnClose.removeClickListener(self.onBtnClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "GetRedBagWindow").asCom;
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			let self = this;			
			self.txtDesc = self.contentPane.getChild("txtDesc").asTextField;
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
		}

		public initData(data:any){
			let self = this;	
			self.txtDesc.text = `恭喜你获得\n${data}元\n满${GameCfg.getCfg().CashNeedMoney}元可提现`;
		}

		private onBtnClose(e){
			let self = this;
			self.hide();
		}
	}
}
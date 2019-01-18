module guess {
	export class FirstShareGroupWindow extends BaseWindow{
		private btnShare:fairygui.GButton;
		private btnClose:fairygui.GButton;
		private txtGold:fairygui.GTextField;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnShare.removeClickListener(self.onbtnShare, self);
			self.btnClose.removeClickListener(self.onClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "FirstShareGroupWindow").asCom;
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			super.onInit();
			let self = this;		
			self.btnShare = self.contentPane.getChild("btnShare").asButton;
			self.btnShare.addClickListener(self.onbtnShare, self);
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onClose, self);
			self.txtGold = self.contentPane.getChild("txtGold").asTextField;		
		}

		public initData(){
			let self = this;
			self.txtGold.text = `+${GameCfg.getCfg().FirstShareGroupGold}金币`;	
		}

		private onbtnShare(e){
			let self = this;
			// 分享到群
			utils.EventDispatcher.getInstance().dispatchEvent("shareGroupOk");

			self.hide();
		}

		private onClose(e){
			let self = this;
			self.hide();
		}
	}
}
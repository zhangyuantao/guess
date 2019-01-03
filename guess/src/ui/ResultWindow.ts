/**
 * 答题界面
 */
module guess {
	export class ResultWindow extends BaseWindow{
		private txtTip:fairygui.GTextField;
		private btnNext:fairygui.GButton;
		private btnInvite:fairygui.GButton;
		private rankPre:fairygui.GComponent;
		private rankNxt:fairygui.GComponent;
		private rankMe:fairygui.GComponent;
	
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
			let self = this;		
			self.btnNext = self.contentPane.getChild("btnNext").asButton;
			self.btnNext.addClickListener(self.onBtnNext, self);
			self.btnInvite = self.contentPane.getChild("btnInvite").asButton;
			self.btnInvite.addClickListener(self.onBtnInv, self);
			self.rankPre = self.contentPane.getChild("rankPre").asCom;	
			self.rankMe = self.contentPane.getChild("rankMe").asCom;
			self.rankNxt = self.contentPane.getChild("rankNxt").asCom;
		}

		public onShown(){
			let self = this;
		}

		public initData(){
			let self = this;
		}

		private onBtnNext(e){
			let self = this;
			self.hide();
			utils.EventDispatcher.getInstance().dispatchEvent("onNextTest");
		}

		private onBtnInv(e){
			let self = this;
		}
	}
}
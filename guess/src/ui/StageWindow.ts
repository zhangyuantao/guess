/**
 * 关卡选择界面
 */
module guess {
	export class StageWindow extends BaseWindow{
		private txtRank:fairygui.GTextField;
		private btnClose:fairygui.GButton;
		private btnPre:fairygui.GButton;
		private btnNext:fairygui.GButton;
		private lstLevel:fairygui.GList;
		private pageIdx:number = 0;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnClose.removeClickListener(self.onBtnClose, self);
			self.btnPre.addClickListener(self.onBtnPre, self);
			self.btnNext.addClickListener(self.onBtnNext, self);
			self.lstLevel.removeEventListener(fairygui.ItemEvent.CLICK, self.onLevelLstClick, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "StageWindow").asCom;
		}

		/**
		 * 注册组件的拓展类
		 */  
		protected registerComponents(){
			let self = this;
			self.registerComponent("StageItem", StageItem, "guess");
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			let self = this;
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
			self.btnPre = self.contentPane.getChild("btnPre").asButton;
			self.btnPre.addClickListener(self.onBtnPre, self);
			self.btnNext = self.contentPane.getChild("btnNext").asButton;
			self.btnNext.addClickListener(self.onBtnNext, self);
			self.lstLevel = self.contentPane.getChild("lstLevel").asList;
			self.lstLevel.addEventListener(fairygui.ItemEvent.CLICK, self.onLevelLstClick, self);
			self.txtRank = self.contentPane.getChild("txtRank").asTextField;
		}

		private onLevelLstClick(e:fairygui.ItemEvent){
			let self = this;
			let item = e.itemObject as StageItem;
			if(!utils.Singleton.get(GameMgr).canStartLevel(item.level)){
				return console.log("请先通过上一关！");
			}
			utils.EventDispatcher.getInstance().dispatchEvent("startStage", item.level);
			self.hide();
		}

		public onShown(){
			let self = this;
		}

		public prePage(){
			let self = this;
			self.btnNext.enabled = true;
			self.pageIdx--;
			if(self.pageIdx < 0){
				self.pageIdx = 0;
				self.btnPre.enabled = false;
			}
			self.initData();
		}

		public nextPage(){
			let self = this;
			self.btnPre.enabled = true;
			self.pageIdx++;
			if(self.pageIdx > 9){
				self.pageIdx = 9;
				self.btnNext.enabled = false;
			}
			self.initData()
		}

		public initData(reset?:boolean){			
			let self = this;
			if(reset) self.pageIdx = 0;
			let pageIdx = self.pageIdx || Math.floor(utils.Singleton.get(GameMgr).getReachMaxLevel() / 20);
			let firstLv = pageIdx * 20 + 1;
			for(let i = 0, len = self.lstLevel.numItems; i < len; i++){
				let item = self.lstLevel.getChildAt(i) as StageItem
				item.initInfo(firstLv);
				firstLv++;
			}
		}

		private onBtnClose(e){
			let self = this;
			self.hide();
		}

		private onBtnPre(e){
			let self = this;
			self.prePage();
		}

		private onBtnNext(e){
			let self = this;
			self.nextPage();
		}
	}
}
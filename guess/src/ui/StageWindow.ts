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

		public prePage(){
			let self = this;
			self.btnNext.enabled = true;
			self.pageIdx--;
			self.initData();
		}

		public nextPage(){
			let self = this;
			self.btnPre.enabled = true;
			self.pageIdx++;			
			self.initData()
		}

		public initData(reset?:boolean){			
			let self = this;
			if(reset) self.pageIdx = 0;
			let maxLv = utils.Singleton.get(GameMgr).getReachMaxLevel();
			let pageIdx = self.pageIdx || Math.floor(maxLv / 20);
			let level = pageIdx * 20 + 1;
			for(let i = 0, len = self.lstLevel.numItems; i < len; i++){
				let item = self.lstLevel.getChildAt(i) as StageItem
				item.initInfo(level, level > maxLv);
				level++;
			}

			self.txtRank.text = self.getRankDesc(maxLv);
			self.setPageBtnState();
		}

		private setPageBtnState(){
			let self = this;
			if(self.pageIdx <= 0){
				self.pageIdx = 0;
				self.btnPre.enabled = false;
			}
			if(self.pageIdx >= 9){
				self.pageIdx = 9;
				self.btnNext.enabled = false;
			}
		}

		private getRankDesc(reachLv:number){
			let self = this;
			let stage = reachLv / 40; // 40关一个段位
			
			// 大段位名
			let stageName = "小学生";
			if(stage > 1)
				stageName = "中等生";
			if(stage > 2)
				stageName = "优等生";
			if(stage > 3)
				stageName = "学霸";
			if(stage > 4)
				stageName = "超级学霸";		

			// 小段位星数 10关一个小等级
			let star = Math.ceil((reachLv % 40) / 10);
			
			let desc = `${stageName}${star}星`;
			return desc;
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
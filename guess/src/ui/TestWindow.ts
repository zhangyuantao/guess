/**
 * 答题界面
 */
module guess {
	export class TestWindow extends BaseWindow{
		private questionPanel:QuestionPanel;	
		private btnBack:fairygui.GButton;
		private btnStage:fairygui.GButton;
		private btnRedBag:fairygui.GButton;
		private lstSelect:fairygui.GList;
		private lstOption:fairygui.GList;
		private txtGold:fairygui.GTextField;
		private resultWnd:ResultWindow;
		private wrongTip:fairygui.GComponent;

		private isFillAnswer:boolean = false;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnBack.removeClickListener(self.onBtnBack, self);
			self.btnStage.removeClickListener(self.onBtnStage, self);
			self.btnRedBag.removeClickListener(self.onBtnRedBag, self);
			self.lstSelect.removeEventListener(fairygui.ItemEvent.CLICK, self.onSelectLstClick, self);
			self.lstOption.removeEventListener(fairygui.ItemEvent.CLICK, self.onOptionLstClick, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "TestWindow").asCom;
		}

		/**
		 * 注册组件的拓展类
		 */  
		protected registerComponents(){
			let self = this;
			self.registerComponent("TipItem", TipItem, "guess");
			self.registerComponent("WordItem", WordItem, "guess");
			self.registerComponent("QuestionPanel", QuestionPanel, "guess");
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			let self = this;
			self.questionPanel = self.contentPane.getChild("questionPanel") as QuestionPanel;		
			self.txtGold = self.contentPane.getChild("goldComp").asCom.getChild("txtGold").asTextField;
			self.btnBack = self.contentPane.getChild("btnBack").asButton;
			self.btnBack.addClickListener(self.onBtnBack, self);
			self.btnStage = self.contentPane.getChild("btnStage").asButton;
			self.btnStage.addClickListener(self.onBtnStage, self);
			self.btnRedBag = self.contentPane.getChild("btnRedBag").asButton;
			self.btnRedBag.addClickListener(self.onBtnRedBag, self);
			self.lstSelect = self.contentPane.getChild("lstSelect").asList;
			self.lstOption = self.contentPane.getChild("lstOption").asList;
			self.lstSelect.addEventListener(fairygui.ItemEvent.CLICK, self.onSelectLstClick, self);
			self.lstOption.addEventListener(fairygui.ItemEvent.CLICK, self.onOptionLstClick, self);
			self.wrongTip = self.contentPane.getChild("wrongTip").asCom;
		}

		private onSelectLstClick(e:fairygui.ItemEvent){
			let self = this;
			let word = e.itemObject as WordItem;
			if(word.isEmpty())
				return;
			let tmp = word.char;
			word.setChar("");

			for(let i = 0; i < self.lstOption.numItems; i ++){
				let item = self.lstOption.getChildAt(i) as WordItem;
				if(item.char === tmp){
					item.setChar(tmp);
					break; 
				}
			}

			self.isFillAnswer = false;
		}

		private onOptionLstClick(e:fairygui.ItemEvent){
			let self = this;
			if(self.isFillAnswer)
				return;
			let word = e.itemObject as WordItem;
			if(word.isEmpty())
				return;
			word.hide();

			for(let i = 0; i < self.lstSelect.numItems; i ++){
				let item = self.lstSelect.getChildAt(i) as WordItem;
				if(item.isEmpty()){
					item.setChar(word.char);					
					break; 
				}
			}

			// 填满后检测答案
			self.checkAnswer();
		}

		private checkAnswer(){
			let self = this;
			let answer = "";
			self.isFillAnswer = true;
			for(let i = 0; i < self.lstSelect.numItems; i ++){
				let item = self.lstSelect.getChildAt(i) as WordItem;
				answer += item.char;
				if(item.isEmpty()){
					self.isFillAnswer = false;
					return;
				}
			}

			let gameMgr = utils.Singleton.get(GameMgr);
			let isRight = gameMgr.testMgr.checkAnswer(answer);
			if(isRight){				
				// 首次答对加金币/红包
				if(gameMgr.isFirstPassLevel(gameMgr.testMgr.curTest.level)){
					gameMgr.addGold(GameCfg.getCfg().TestRewardGold);

					// 红包
					gameMgr.addMoney(gameMgr.testMgr.curTest.money);
				}

				// 显示结果界面
				if(!self.resultWnd)
					self.resultWnd = new ResultWindow("guess");
				self.resultWnd.show();
				self.resultWnd.initData();

				utils.EventDispatcher.getInstance().once("onNextTest", () => {
					self.nextTest();
				}, self);
			}
			else{
				// 错误提示
				self.wrongTip.visible = true;
				self.wrongTip.getTransition("t0").play(() => {
					self.wrongTip.visible = false;
				}, self);
			}
		}

		public onShown(){
			let self = this;
		}

		public nextTest(){
			let self = this;
			utils.Singleton.get(GameMgr).nextTest();
			self.initData()
		}

		public initData(){
			let self = this;	
			self.txtGold.text = `金币：${utils.Singleton.get(GameMgr).data.gold}`;	
			self.initTest();
			self.questionPanel.initTest();
		}

		public initTest(){
			let self = this;			
			let test = utils.Singleton.get(GameMgr).testMgr.curTest;
			if(!test){	
				self.lstOption.numItems = 0;
				self.lstSelect.numItems = 0;
				return;
			}
				
			self.isFillAnswer = false;

			let ops = test.option.split(",");
			for(let i = 0, len = ops.length; i < len; i++){
				let item;
				if(i < self.lstOption.numItems)
					item = self.lstOption.getChildAt(i);
				else{
					item = fairygui.UIPackage.createObject("guess", "WordItem");				
					self.lstOption.addChild(item);
				}
				(item as WordItem).setChar(ops[i])
			}			

			for(let i = 0; i < test.answer.length; i++){
				let item;
				if(i < self.lstSelect.numItems)
					item = self.lstSelect.getChildAt(i);
				else{
					item = fairygui.UIPackage.createObject("guess", "WordItem");				
					self.lstSelect.addChild(item);
				}
				(item as WordItem).setChar("")
			}			
		}

		private onBtnBack(e){
			let self = this;
			self.hide();
		}

		private onBtnStage(e){
			let self = this;
			MainWindow.instance.showStageWindow();
		}

		private onBtnRedBag(e){
			let self = this;
			MainWindow.instance.showRedBagWindow();
		}
	}
}
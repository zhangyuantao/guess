/**
 * 答题界面
 */
module guess {
	export class TestWindow extends BaseWindow{
		//private themCtrl:fairygui.Controller;
		private questionPanel:QuestionPanel;
		private questionPanelDM:QuestionPanelDM;
		private btnBack:fairygui.GButton;
		private btnStage:fairygui.GButton;
		private btnRedBag:fairygui.GButton;
		private btnUnlock:fairygui.GButton;
		private btnUnlockTip:fairygui.GButton;
		private btnRank:fairygui.GButton;
		private btnShare:fairygui.GButton;
		private lstSelect:fairygui.GList;
		private lstOption:fairygui.GList;
		private goldComp:fairygui.GComponent;
		private txtGold:fairygui.GTextField;
		private txtLevel:fairygui.GTextField;
		private resultWnd:ResultWindow;
		private lackWnd:LackGoldWindow;
		private wrongTip:fairygui.GComponent;

		private isFillAnswer:boolean = false;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnBack.removeClickListener(self.onBtnBack, self);
			self.btnStage.removeClickListener(self.onBtnStage, self);
			self.btnRedBag.removeClickListener(self.onBtnRedBag, self);
			self.btnUnlock.removeClickListener(self.onBtnUnlock, self);
			self.btnUnlockTip.removeClickListener(self.onBtnUnlockTip, self);
			self.btnShare.removeClickListener(self.onBtnShare, self);
			self.goldComp.removeClickListener(self.onClickGold, self);
			self.lstSelect.removeEventListener(fairygui.ItemEvent.CLICK, self.onSelectLstClick, self);
			self.lstOption.removeEventListener(fairygui.ItemEvent.CLICK, self.onOptionLstClick, self);
			utils.EventDispatcher.getInstance().removeEventListener("goldChanged", self.refreshGold, self);
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
			self.registerComponent("WordItemSmall", WordItemSmall, "guess");
			self.registerComponent("QuestionPanel", QuestionPanel, "guess");
			self.registerComponent("QuestionPanelDM", QuestionPanelDM, "guess");
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			super.onInit();
			let self = this;
			//self.themCtrl = self.contentPane.getController("themCtrl");

			self.questionPanel = self.contentPane.getChild("questionPanel") as QuestionPanel;
			self.questionPanelDM = self.contentPane.getChild("questionPanelDM") as QuestionPanelDM;

			self.goldComp = self.contentPane.getChild("goldComp").asCom;
			self.txtGold = self.goldComp.getChild("txtGold").asTextField;
			self.goldComp.addClickListener(self.onClickGold, self);

			self.btnBack = self.contentPane.getChild("btnBack").asButton;
			self.btnStage = self.contentPane.getChild("btnStage").asButton;
			self.btnRedBag = self.contentPane.getChild("btnRedBag").asButton;
			self.btnUnlock = self.contentPane.getChild("btnUnlock").asButton;
			self.btnRank = self.contentPane.getChild("btnRank").asButton;
			self.btnShare = self.contentPane.getChild("btnShare").asButton;
			self.btnUnlockTip = self.contentPane.getChild("btnUnlockTip").asButton;
			self.btnBack.addClickListener(self.onBtnBack, self);
			self.btnStage.addClickListener(self.onBtnStage, self);
			self.btnRedBag.addClickListener(self.onBtnRedBag, self);
			self.btnUnlock.addClickListener(self.onBtnUnlock, self);
			self.btnRank.addClickListener(self.onBtnRank, self);
			self.btnShare.addClickListener(self.onBtnShare, self);
			self.btnUnlockTip.addClickListener(self.onBtnUnlockTip, self);

			self.lstSelect = self.contentPane.getChild("lstSelect").asList;
			self.lstOption = self.contentPane.getChild("lstOption").asList;
			self.lstSelect.addEventListener(fairygui.ItemEvent.CLICK, self.onSelectLstClick, self);
			self.lstOption.addEventListener(fairygui.ItemEvent.CLICK, self.onOptionLstClick, self);
			utils.EventDispatcher.getInstance().addEventListener("goldChanged", self.refreshGold, self);

			self.wrongTip = self.contentPane.getChild("wrongTip").asCom;
			self.txtLevel = self.contentPane.getChild("txtLevel").asTextField;
		}

		private onSelectLstClick(e:fairygui.ItemEvent){
			let self = this;
			let word = e.itemObject as WordItem;
			if(word.isEmpty())
				return;
			let tmp = word.word;
			word.setChar("");

			for(let i = 0; i < self.lstOption.numItems; i ++){
				let item = self.lstOption.getChildAt(i) as WordItem;
				if(item.word === tmp){
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
					item.setChar(word.word);					
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
				answer += item.word;
				if(item.isEmpty()){
					self.isFillAnswer = false;
					return;
				}
			}

			let gameMgr = utils.Singleton.get(GameMgr);
			let isRight = gameMgr.testMgr.checkAnswer(answer);
			if(isRight){				
				// 首次答对加金币/红包
				let gainGold = 0;
				let isFirstRight = gameMgr.isFirstPassLevel(gameMgr.testMgr.curTest.level);
				if(isFirstRight){
					gainGold = GameCfg.getCfg().TestRewardGold;
					gameMgr.modifyGold(gainGold);
					gameMgr.modifyMoney(gameMgr.testMgr.curTest.money);
				}

				// 显示结果界面
				if(!self.resultWnd)
					self.resultWnd = new ResultWindow("guess");
				self.resultWnd.show();
				self.resultWnd.initData(gainGold);

				// 显示获得红包
				if(isFirstRight && gameMgr.testMgr.curTest.money > 0){					
					MainWindow.instance.showRedBagWindow(gameMgr.testMgr.curTest.money, "恭喜您获得红包");
				}

				utils.EventDispatcher.getInstance().once("onNextTest", () => {
					self.nextTest();
				}, self);
			}
			else{
				// 错误提示
				self.wrongTip.visible = true;
				egret.Tween.get(self.wrongTip).set({alpha:0})
				.to({alpha:1}, 500, egret.Ease.sineInOut).wait(500)
				.to({alpha:0}, 500, egret.Ease.sineInOut)
				.call(() => {
					self.wrongTip.visible = false;
				});
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
			self.refreshGold();	
			let testInfo = utils.Singleton.get(GameMgr).testMgr.curTest;
			
			self.questionPanelDM.initTest(testInfo);		
			
			self.questionPanel.initTest(testInfo); 
				
			self.initTest(testInfo);

			self.txtLevel.text = testInfo ? `第 ${testInfo.level} 关` : "没有题目";

			// 不同题目类型显示控制
			//if(testInfo)		
			//	self.themCtrl.setSelectedIndex(testInfo.type == "people" ? 0 : 1);
		}
		
		public refreshGold(){
			let self = this;	
			self.txtGold.text = `${utils.Singleton.get(GameMgr).data.gold}`;
		}

		public initTest(test:ITestInfo){
			let self = this;
			self.lstOption.removeChildrenToPool(0, self.lstOption.numItems - 1);
			self.lstSelect.removeChildrenToPool(0, self.lstSelect.numItems - 1);
						
			if(!test)
				return;

			self.isFillAnswer = false;

			let ops = test.option.split("、");
			for(let i = 0, len = ops.length; i < len; i++){
				let item = self.lstOption.addItemFromPool(fairygui.UIPackage.getItemURL("guess", "WordItem")) as WordItem;
				item.setChar(ops[i])
			}			

			for(let i = 0; i < test.answer.length; i++){
				let item = self.lstSelect.addItemFromPool(fairygui.UIPackage.getItemURL("guess", "WordItemSmall")) as WordItem;
				item.setChar("")
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

		private onBtnUnlock(e){
			let self = this;
			let curTest = utils.Singleton.get(GameMgr).testMgr.curTest;
			if(!curTest)
				return;
			
			// 扣金币
			let cost = GameCfg.getCfg().UnlockAnswerCost;
			if(!utils.Singleton.get(GameMgr).checkGoldEnough(cost)){
				if(!self.lackWnd)
					self.lackWnd = new LackGoldWindow("guess");
				self.lackWnd.show();
				self.lackWnd.initData();

				// 监听观看成功
				utils.EventDispatcher.getInstance().removeEventListener("watchAdOk", self.showAnswerTip, self);
				utils.EventDispatcher.getInstance().once("watchAdOk", self.showAnswerTip, self);
				// 监听分享到群成功
				utils.EventDispatcher.getInstance().removeEventListener("shareOk", self.showAnswerTip, self);
				utils.EventDispatcher.getInstance().once("shareOk", self.showAnswerTip, self);
				return;
			}

			utils.Singleton.get(GameMgr).costGold(cost);

			// 提示答案
			self.showAnswerTip();
		}

		private onBtnRank(e){
			MainWindow.instance.showOrHideRankWnd();
		}

		private onBtnShare(e){
			let self = this;
			self.share("这个经典灯谜难住了朋友圈，据说只有1%的人答对！", 2);
		}

		// 我要更多提示
		private onBtnUnlockTip(e){
			let self = this;
			self.share("这个经典灯谜难住了朋友圈，据说只有1%的人答对！", 2);
			self.questionPanelDM.unlockTip();
		}

		public share(title:string, shareImgId:number){
			if(!platform.isRunInWX())
				return;

			// 分享
			wx.shareAppMessage({
				"title":title,
				"imageUrl":`resource/assets/share${shareImgId}.png`,
				"imageUrlId":shareImgId,
				"query":"",					
			});
		}

		private showAnswerTip(){
			let self = this;
			let answer = utils.Singleton.get(GameMgr).testMgr.curTest.answer;
			for(let i = 0, len = self.lstOption.numItems; i < len; i++){
				let item = self.lstOption.getChildAt(i) as WordItem;
				if(answer.indexOf(item.word) != -1)
					item.showColorAni();
			}	
		}

		private onClickGold(e){
			let self = this;

			// 判断是不是首次点击
			let isFirstClick = wx.getStorageSync("isFirstClickGold") == "";
			if(isFirstClick){
				wx.setStorageSync("isFirstClickGold", "1");
				let wnd = new FirstShareGroupWindow();
				wnd.show();
				wnd.initData();
				utils.EventDispatcher.getInstance().removeEventListener("shareOk", self.onShareOk, self);
				utils.EventDispatcher.getInstance().once("shareOk", self.onShareOk, self);
			}
		}

		private onShareOk(){
			// 分享成功加金币
			utils.Singleton.get(GameMgr).modifyGold(GameCfg.getCfg().FirstShareGroupGold);
		}
	}
}
/**
 * 主游戏入口
 */
module guess {
	export class TestWindow extends BaseWindow{
		private tip1:TipItem;
		private tip2:TipItem;
		private tip3:TipItem;
		private tip4:TipItem;
		private btnBack:fairygui.GButton;
		private lstSelect:fairygui.GList;
		private lstOption:fairygui.GList;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnBack.removeClickListener(self.onBtnBack, self);
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
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			let self = this;
			self.tip1 = self.contentPane.getChild("tip1") as TipItem;
			self.tip2 = self.contentPane.getChild("tip2") as TipItem;
			self.tip3 = self.contentPane.getChild("tip3") as TipItem;
			self.tip4 = self.contentPane.getChild("tip4") as TipItem;
			self.btnBack = self.contentPane.getChild("btnBack").asButton;
			self.btnBack.addClickListener(self.onBtnBack, self);
			self.lstSelect = self.contentPane.getChild("lstSelect").asList;
			self.lstOption = self.contentPane.getChild("lstOption").asList;
		}

		public onShown(){
			let self = this;
			let curTest = utils.Singleton.get(GameMgr).testMgr.curTest;
			if(!curTest)
				return console.log("当前试题为空！");

			self.tip1.initInfo("1", curTest.tips[0]);
			self.tip2.initInfo("2", curTest.tips[1]);
			self.tip3.initInfo("3", curTest.tips[2]);
			self.tip4.initInfo("4", curTest.tips[3]);

			self.lstSelect.numItems = 0;

			let ops = curTest.option.split(",");
			for(let i = 0, len = ops.length; i < len; i++){
				let item = fairygui.UIPackage.createObject("guess", "WordItem") as WordItem;
				item.initChar(ops[i]);
				self.lstOption.addChild(item);
			}			

			for(let i = 0; i < curTest.answer.length; i++){
				let item = fairygui.UIPackage.createObject("guess", "WordItem") as WordItem;
				item.initChar("");
				self.lstSelect.addChild(item);
			}	
		}

		private onBtnBack(e){
			let self = this;
			self.hide();
		}
	}
}
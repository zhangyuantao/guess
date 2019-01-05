module guess {
	export class QuestionPanel extends fairygui.GComponent{
		private tip1:TipItem;
		private tip2:TipItem;
		private tip3:TipItem;
		private tip4:TipItem;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.tip1 = self.getChild("tip1") as TipItem;
			self.tip2 = self.getChild("tip2") as TipItem;
			self.tip3 = self.getChild("tip3") as TipItem;
			self.tip4 = self.getChild("tip4") as TipItem;
		}

		// 初始化题目
		public initTest(info:ITestInfo){
			let self = this;
			if(!info){
				self.tip1.initInfo("1", "题库已答完~");
				self.tip2.initInfo("2");
				self.tip3.initInfo("3");
				self.tip4.initInfo("4");
				return;
			}
				
			self.tip1.initInfo("1", info.tips[0]);
			self.tip2.initInfo("2", info.tips[1]);
			self.tip3.initInfo("3", info.tips[2]);
			self.tip4.initInfo("4", info.tips[3]);
		}
	}
}
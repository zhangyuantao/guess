module guess {
	export class QuestionPanel extends fairygui.GComponent{
		private tip1:TipItem;
		private tip2:TipItem;
		private tip3:TipItem;
		private tip4:TipItem;
		private typeCtrl:fairygui.Controller;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.tip1 = self.getChild("tip1") as TipItem;
			self.tip2 = self.getChild("tip2") as TipItem;
			self.tip3 = self.getChild("tip3") as TipItem;
			self.tip4 = self.getChild("tip4") as TipItem;
			self.typeCtrl = self.getController("typeCtrl");
		}

		public initTest(){
			let self = this;			
			let test = utils.Singleton.get(GameMgr).testMgr.curTest;
			if(!test){
				self.tip1.initInfo("1", "猴赛雷~");
				self.tip2.initInfo("2", "题库");
				self.tip3.initInfo("3", "被你");
				self.tip4.initInfo("4", "答爆啦~");
				return;
			}
				
			self.tip1.initInfo("1", test.tips[0]);
			self.tip2.initInfo("2", test.tips[1]);
			self.tip3.initInfo("3", test.tips[2]);
			self.tip4.initInfo("4", test.tips[3]);

			self.typeCtrl.setSelectedIndex(test.type == "people" ? 0 : 1);
		}
	}
}
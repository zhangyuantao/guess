module guess {
	export class QuestionPanelDM extends fairygui.GComponent{
		private txtDMTip1:fairygui.GTextField;
		private txtDMTip2:fairygui.GTextField;
		private txtDMTip3:fairygui.GTextField;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtDMTip1 = self.getChild("txtDMTip1").asTextField;
			self.txtDMTip2 = self.getChild("txtDMTip2").asTextField;
			self.txtDMTip3 = self.getChild("txtDMTip3").asTextField;
		}

		// 初始化题目
		public initTest(info:ITestInfo){
			let self = this;
			if(!info){
				self.txtDMTip1.text = "题库已答完~";
				self.txtDMTip2.text = "";
				self.txtDMTip3.text = "";
				return;
			}
			
			self.txtDMTip1.text = `${info.tips[0]}`;
			self.txtDMTip2.text = `${info.tips[1]}`;
			self.txtDMTip3.text = `${info.tips[2]}`;
		}
	}
}
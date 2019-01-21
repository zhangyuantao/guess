module guess {
	export class QuestionPanelDM extends fairygui.GComponent{
		private txtDMTip1:fairygui.GTextField;
		private txtDMTip2:fairygui.GTextField;
		private txtDMTip3:fairygui.GTextField;
		private curTipId:number;

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

			self.curTipId = info.tipCount;

			for(let i = 0; i < info.tips.length; i++){
				let tmp = i + 1;
				(self[`txtDMTip${tmp}`] as fairygui.GTextField).alpha = tmp <= info.tipCount ? 1 : 0;
			}
		}

		public unlockTip(){
			let self = this;
			self.curTipId++;
			let txt = self[`txtDMTip${self.curTipId}`];
			if(txt)
				egret.Tween.get(txt).to({alpha:1}, 500, egret.Ease.sineInOut);
		}
	}
}
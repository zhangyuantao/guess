module guess {
	export class StageItem extends fairygui.GComponent{
		private txtLv:fairygui.GTextField;
		
		public level:number;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtLv = self.getChild("txtLv").asTextField;
		}

		public initInfo(lv:number){
			let self = this;
			self.level = lv;
			self.txtLv.text = lv + "";
		}
	}
}
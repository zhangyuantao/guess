module guess {
	export class StageItem extends fairygui.GComponent{
		private txtLv:fairygui.GTextField;
		private lockCtrl:fairygui.Controller;
		private hasRedbagCtrl:fairygui.Controller;
		
		public level:number;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtLv = self.getChild("txtLv").asTextField;
			self.lockCtrl = self.getController("lockCtrl");
			self.hasRedbagCtrl = self.getController("hasRedbagCtrl");
		}

		public initInfo(lv:number, lock:boolean){
			let self = this;
			self.level = lv;
			self.txtLv.text = lv + "";

			let testInfo = GameCfg.getTestInfo(self.level);
			self.lockCtrl.setSelectedIndex((lock || !testInfo) ? 1 : 0);
			//self.hasRedbagCtrl.setSelectedIndex((testInfo && testInfo.money >= 0) ? 1 : 0); // 红包先隐藏
			self.hasRedbagCtrl.setSelectedIndex(0);
		}
	}
}
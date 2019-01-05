module guess {
	export class TipItem extends fairygui.GComponent{
		private txtId:fairygui.GTextField;
		private txtDesc:fairygui.GTextField;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtId = self.getChild("txtId").asTextField;
			self.txtDesc = self.getChild("txtDesc").asTextField;
		}

		public initInfo(id:string, desc:string = ""){
			let self = this;
			self.txtId.text = id;
			self.txtDesc.text = desc;
		}
	}
}
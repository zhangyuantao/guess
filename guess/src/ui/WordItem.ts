module guess {
	export class WordItem extends fairygui.GComponent{
		private txtChar:fairygui.GTextField;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtChar = self.getChild("txtChar").asTextField;
		}

		public initChar(world:string){
			let self = this;
			self.txtChar.text = world;
		}
	}
}
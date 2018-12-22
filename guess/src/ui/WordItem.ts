module guess {
	export class WordItem extends fairygui.GComponent{
		private txtChar:fairygui.GTextField;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtChar = self.getChild("txtChar").asTextField;
		}

		public get char(){
			return this.txtChar.text;
		}

		public setChar(world:string){
			let self = this;
			self.txtChar.text = world;
			self.show();
		}

		public hide(){
			let self = this;
			self.txtChar.alpha = 0;
		}

		public show(){
			let self = this;
			self.txtChar.alpha = 1;
		}

		public isEmpty(){
			return this.txtChar.text == "" || this.txtChar.alpha == 0;
		}
	}
}
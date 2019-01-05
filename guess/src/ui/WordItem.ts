module guess {
	export class WordItem extends fairygui.GComponent{
		private txtChar:fairygui.GTextField;
		private colorMask:fairygui.GGraph;

		public constructFromResource() {
			super.constructFromResource();
			let self = this;
			self.txtChar = self.getChild("txtChar").asTextField;
			self.colorMask = self.getChild("color").asGraph;
		}

		public get word(){
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
			self.removeColorAni();
		}

		public show(){
			let self = this;
			self.txtChar.alpha = 1;
		}

		public isEmpty(){
			return this.txtChar.text == "" || this.txtChar.alpha == 0;
		}

		public showColorAni(color:number = -1){
			let self = this;
			if(color >= 0)
				self.colorMask.color = color;
			self.colorMask.alpha = 0;
			egret.Tween.get(self.colorMask, {loop:true}).to({alpha:1}, 500, egret.Ease.sineInOut).to({alpha:0}, 500, egret.Ease.sineInOut);
		}

		public removeColorAni(){
			let self = this;
			self.colorMask.alpha = 0;
			egret.Tween.removeTweens(self.colorMask);
		}
	}
}
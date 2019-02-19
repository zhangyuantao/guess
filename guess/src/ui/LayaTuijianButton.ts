module guess {
	export class LayaTuijianButton extends fairygui.GButton{
		private curAdLogo:egret.Bitmap;
		private isCheckRunIOS:boolean = false;

		constructFromResource(){
			super.constructFromResource();
			let self = this;			
			self.addClickListener(self.onClick, self);

			// if(!self.isCheckRunIOS && platform.isRuniOS()){
			// 	self.isCheckRunIOS = true;
			// 	self.visible = false;
			// 	return;
			// }

			// platform.layaAdChange((isShow:boolean, gameIcon:string) => {
			// 	self.onChange(isShow, gameIcon);
			// });
			self.visible = false;
		}

		dispose(){
			super.dispose();
			let self = this;
			self.removeClickListener(self.onClick, self);
		}

		private onChange(isShow:boolean, gameIcon:string){
			let self = this;
			if(!isShow){
				self.visible = false;				
				return;
			}			
			self.visible = true;

			if(self.curAdLogo)
				self.displayListContainer.removeChild(self.curAdLogo);
				
			RES.getResByUrl(gameIcon, (res) => {
				let tex = res as egret.Texture;
				self.curAdLogo = new egret.Bitmap(tex);
				self.curAdLogo.touchEnabled = true;
				self.curAdLogo.width = 100;
				self.curAdLogo.height = 100;
				self.curAdLogo.x = 5;
				self.curAdLogo.y = 5;
				self.displayListContainer.addChildAt(self.curAdLogo, 1);
			}, self).catch(() => {
				self.visible = false;
			});		
		}

	  	public onClick(e){
			let self = this;
			platform.layaAdToMiniProgram();
		}
	}
}
/**
 * 转盘抽奖界面
 */
module guess {
	export class DrawWindow extends BaseWindow{		
		private wheel:fairygui.GComponent;
		private btnDraw:fairygui.GButton;
		private btnClose:fairygui.GButton;
		private c1:fairygui.Controller; // 提示观看次数用完
		private c2:fairygui.Controller; // 提示获得物品
		private txtBonus:fairygui.GTextField;

		private isDraw:boolean;
	
		// 释放
		public dispose(): void {		
			super.dispose();			
			let self = this;
			self.btnDraw.removeClickListener(self.onBtnDrawClick, self);
			self.btnClose.removeClickListener(self.onBtnClose, self);
		}

		protected initUI(){
			let self = this;
			self.contentPane = fairygui.UIPackage.createObject("guess", "DrawWindow").asCom;			
		}

		/**
		 * 注册组件的拓展类
		 */  
		protected registerComponents(){
			let self = this;
		}

		/**
		 * 初始化完成
		 */
        protected onInit(){	
			super.onInit();
			let self = this;	
			self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
			self.btnDraw.addClickListener(self.onBtnDrawClick, self);
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
			self.wheel = self.contentPane.getChild("wheel").asCom;
			self.c1 = self.contentPane.getController("c1");
			self.c2 = self.contentPane.getController("c2");
			self.txtBonus = self.contentPane.getChild("txtBonus").asTextField;
		}

		private onBtnDrawClick(e:fairygui.ItemEvent){
			let self = this;
			if(self.isDraw)
				return;

			if(platform.isRunInWX()){
				utils.Singleton.get(AdMgr).watchVideoAd("Video抽奖", (isEnded) => {
					if(isEnded)
						self.draw();
				}, () => {
					self.c2.setSelectedIndex(1);
					self.txtBonus.text = "广告观失败！";

					let id = setTimeout(function() {
						clearTimeout(id);
						self.c2.setSelectedIndex(0);
					}, 100);
				});	
			}
			else
				self.draw();
		}

		private draw(){
			let self = this;
			let item = utils.Singleton.get(GameMgr).draw();

			// 获得奖励
			if(item.gifts.gold)
				utils.Singleton.get(GameMgr).modifyGold(item.gifts.gold);

			let itemCount = GameCfg.getCfg().LotteryCfg.length;
			let pieceAngle = 360 / itemCount;
			let offsetAngle = 5; // 为了不贴边界
			let angleRange = [item.idx * pieceAngle + offsetAngle, (item.idx + 1) * pieceAngle - offsetAngle];
			let randAngle = Math.floor(angleRange[0] + Math.random() * (angleRange[1] - angleRange[0]));
	
			let turns = 10; // 转10圈	
			let toAngle = turns * 360 + randAngle;

			self.isDraw = true;
			self.btnClose.enabled = false;
			self.btnDraw.enabled = false;
			egret.Tween.get(self.wheel).set({rotation:self.wheel.rotation %= 360})			
			.to({rotation:toAngle - 720}, 4000, egret.Ease.sineIn)
			.to({rotation:toAngle}, 2000, egret.Ease.sineOut)
			.call(() => {
				self.isDraw = false;
				self.btnClose.enabled = true;
				self.btnDraw.enabled = true;

				self.txtBonus.text = `恭喜抽到：+${item.gifts.gold || 0}金币`;
				self.c2.setSelectedIndex(1);
			}).wait(1300).call(() => {
				self.c2.setSelectedIndex(0);
			});
		}

		public initData(data:any){
			let self = this;
			self.wheel.rotation = 0;
			utils.Singleton.get(AdMgr).showBannerAd("Banner转盘");
			
			self.btnDraw.enabled = true;
			self.c1.setSelectedIndex(0);
		}

		private onBtnClose(e){
			let self = this;
			if(self.isDraw)
				return;
			self.hide();
			egret.Tween.removeTweens(self.wheel);
		}
	}
}
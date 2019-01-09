/**
 * 转盘抽奖界面
 */
module guess {
	export class DrawWindow extends BaseWindow{		
		private wheel:fairygui.GComponent;
		private btnDraw:fairygui.GButton;
		private btnClose:fairygui.GButton;

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
			let self = this;	
			self.btnDraw = self.contentPane.getChild("btnDraw").asButton;
			self.btnDraw.addClickListener(self.onBtnDrawClick, self);
			self.btnClose = self.contentPane.getChild("btnClose").asButton;
			self.btnClose.addClickListener(self.onBtnClose, self);
			self.wheel = self.contentPane.getChild("wheel").asCom;
		}

		private onBtnDrawClick(e:fairygui.ItemEvent){
			let self = this;
			if(self.isDraw)
				return;

			// TODO console.log("观看广告抽奖~");

			// 模拟观看成功
			let item = utils.Singleton.get(GameMgr).draw();
			console.log(`恭喜，抽到：${item.gifts.money ? '红包' : '金币'} x${item.gifts.money || item.gifts.gold}`);

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
			.to({rotation:toAngle}, 3000, egret.Ease.sineOut)
			.call(() => {
				self.isDraw = false;
				self.btnClose.enabled = true;
				self.btnDraw.enabled = true;
			});
		}

		public initData(data:any){
			let self = this;
			self.wheel.rotation = 0;			
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
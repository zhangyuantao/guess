module guess {
	export class GameMgr implements utils.ISingleton{
		public data:IGameData;
		public testMgr:TestMgr;

		public onCreate(){
			let self = this;
			self.testMgr = new TestMgr();
		}
        
		public onDestroy(){
			let self = this;
			self.testMgr.dispose();
			self.testMgr = null;
		}

		public initData(userData?:any){
			let self = this;			
			self.data = <IGameData>{};
			if(platform.isRunInWX()){	
				self.data.gold = parseInt(wx.getStorageSync("gold") || 60);
				self.data.reachLevel = parseInt(wx.getStorageSync("reachLevel") || 0);
				self.data.money = parseInt(wx.getStorageSync("money") || 0);
				//self.data.toDayWatchAdCount = info["toDayWatchAdCount"] || 0;		
			}
			else{
				self.data.gold = 60;
				self.data.reachLevel = 0;
				self.data.money = 0;
				//self.data.toDayWatchAdCount = 0;			
			}
		}

		public startPlay(lv?:number){
			let self = this;
			lv = lv || self.getMaxOpenLevel();
			if(!self.checkStage(lv))
				return;
			self.testMgr.setCurTest(lv);
		}

		public checkStage(lv:number){
			let self = this;
			if(lv < 1 || lv > 200)
				return false;
			
			return self.canStartLevel(lv);
		}

		public nextTest(){
			let self = this;
			let curLv = self.testMgr.curTest.level;
			self.testMgr.setCurTest(curLv + 1);
		}

		// 是否第一次达到
		public isFirstPassLevel(lv:number){
			let self = this;
			return self.data.reachLevel < lv;
		}

		// 是否可以开始某关
		public canStartLevel(lv:number){
			let self = this;			
			return lv <= self.data.reachLevel + 1;
		}

		public getMaxOpenLevel(){
			let self = this;
			let tmp = self.data.reachLevel + 1;
			tmp = Math.max(Math.min(200, tmp), 0);
			return tmp;
		}

		public modifyGold(count:number){
			let self = this;
			count = count || 0;
			if(count == 0)	return;
			self.data.gold += count;
			platform.isRunInWX() && wx.setStorageSync("gold", self.data.gold);

			utils.EventDispatcher.getInstance().dispatchEvent("goldChanged");
		}	

		public costGold(count:number){
			let self = this;
			if(count <= 0)
				return;			
			if(self.data.gold < count)
				return;
			
			self.modifyGold(-count);
		}

		public checkGoldEnough(count:number){
			let self = this;
			return self.data.gold >= count;
		}

		public modifyMoney(count:number){
			// let self = this;
			// count = count || 0;
			// if(count == 0)	return;
			// self.data.money += count;
			// platform.isRunInWX() && wx.setStorageSync("money", self.data.money);
		}

		// 转盘抽奖
		public draw():ILotteryItemInfo{
			let self = this;

			// TODO 判断每日抽奖上限

			return self.drawOnce();
		}

		// 抽一次
		private drawOnce():ILotteryItemInfo{
			let items = GameCfg.getCfg().LotteryCfg;
			let totalWeight = 0;
			for(let i = 0; i < items.length; i++)
				totalWeight += items[i].weight;
			let rand = Math.random() * totalWeight;

			let result;
			for(let i = 0; i < items.length; i++){
				let info = items[i];
				if(info.weight <= 0)
					continue;
				if(rand <= info.weight){
					result = info;
					break;
				}
				rand -= info.weight;
			}

			return result;
		}

		public drawTest(testCount:number){
			let self = this;
			let results = <any>{};
			for(let i = 0; i < testCount; i++){
				let tmp = self.drawOnce();
				if(results[tmp.idx]) results[tmp.idx]++;
				else results[tmp.idx] = 1;
			}
			
			console.log(`抽奖${testCount}次的结果如下:`);
			for(let i = 0; i < GameCfg.getCfg().LotteryCfg.length; i++){
				if(results[i] )
					console.log(`奖品${i}:${results[i] || 0}次`);
			}
		}
	}
}
module guess {
	export class GameMgr implements utils.ISingleton{
		public data:IGameData;
		public testMgr:TestMgr;

		public onCreate(){
			let self = this;
			self.data = <IGameData>{};
			self.data.gold = 0;
			self.data.reachLevel = 1;
			self.data.passLevels = [];
			self.data.money = 0;
			self.data.toDayWatchAdCount = 0;
			self.testMgr = new TestMgr();
		}
        
		public onDestroy(){
			let self = this;
			self.testMgr.dispose();
			self.testMgr = null;
		}

		public startPlay(lv?:number){
			let self = this;
			lv = lv || self.getReachMaxLevel();
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
			
			// 存储达到的最高关卡
			if(self.isFirstPassLevel(curLv))
				self.data.passLevels.push(curLv);

			self.testMgr.setCurTest(curLv + 1);
		}

		// 是否第一次达到
		public isFirstPassLevel(lv:number){
			let self = this;
			return self.data.passLevels.indexOf(lv) == -1;
		}

		// 是否可以开始某关
		public canStartLevel(lv:number){
			let self = this;
			if(lv == 1)
				return true;
			
			// 上一关必须通过
			return self.data.passLevels.indexOf(lv - 1) != -1;
		}

		public getReachMaxLevel(){
			let self = this;
			let curMaxLv = self.data.passLevels[self.data.passLevels.length - 1] || 0;
			return curMaxLv + 1;
		}

		public modifyGold(count:number){
			let self = this;
			count = count || 0;
			self.data.gold += count;
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
			let self = this;
			count = count || 0;
			self.data.money += count;
			utils.EventDispatcher.getInstance().dispatchEvent("moneyChanged");
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
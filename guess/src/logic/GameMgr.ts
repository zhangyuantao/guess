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

		public addGold(count:number){
			let self = this;
			if(count <= 0)
				return;
			self.data.gold += count;
		}
	}
}
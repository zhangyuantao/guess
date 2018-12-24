module guess {
	export class GameMgr implements utils.ISingleton{
		public data:IGameData;
		public testMgr:TestMgr;

		public onCreate(){
			let self = this;
			self.data = <IGameData>{};			
			self.testMgr = new TestMgr();
		}
        
		public onDestroy(){
			let self = this;
			self.testMgr.dispose();
			self.testMgr = null;
		}

		public startPlay(lv?:number){
			let self = this;
			lv = lv || self.getCurLevel();
			if(!self.checkStage(lv))
				return;
			self.testMgr.setCurTest(lv);
		}

		public checkStage(lv:number){
			if(lv < 1 || lv > 200)
				return false;
			return true;
		}

		public nextTest(){
			let self = this;
			self.data.curLevel = self.testMgr.curTest.level + 1;
			self.testMgr.setCurTest(self.data.curLevel);
		}

		public getCurLevel(){
			return this.data.curLevel || 1;
		}
	}
}
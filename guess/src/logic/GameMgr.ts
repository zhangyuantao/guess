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

		public startPlay(){
			let self = this;
			self.testMgr.setCurTest(self.data.curLevel || 1);
		}

		public nextTest(){
			let self = this;
			self.data.curLevel = self.testMgr.curTest.level + 1;
			self.testMgr.setCurTest(self.data.curLevel);
		}
	}
}
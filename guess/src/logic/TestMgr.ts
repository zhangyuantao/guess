module guess {
	/**
	 * 答题管理
	 */
	export class TestMgr {
		public curTest:ITestInfo;

		public constructor(){

		}

		public dispose(){

		}

		public getTestInfo(lv:number){
			let self = this;
			return GameCfg.getTestInfo(lv);
		}

		public checkAnswer(answer:string){
			let self = this;
			if(!self.curTest)
				return false;			
			return answer === self.curTest.answer;
		}		
	}
}
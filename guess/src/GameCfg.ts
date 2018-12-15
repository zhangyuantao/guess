module guess {
	export class GameCfg {
		public static cfg:IGameCfg = null;
		public static testCfg:ITestCfg = null;

		public static getCfg():IGameCfg{
			if(!GameCfg.cfg)			
				GameCfg.cfg = RES.getRes('leapConfig_json');
			return GameCfg.cfg;
		}

		public static getTestCfg():ITestCfg{
			if(!GameCfg.testCfg)
				GameCfg.testCfg = RES.getRes('testConfig_json');
			return GameCfg.testCfg;
		}
	
		public static getITestInfo(lv:number):ITestInfo{
			return GameCfg.getTestCfg().testLib[lv] || null;
		}
	}
}
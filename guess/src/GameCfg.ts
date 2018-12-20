module guess {
	export class GameCfg {
		public static cfg:IGameCfg = null;
		public static testCfg:ITestInfo[] = null;

		public static getCfg():IGameCfg{
			if(!GameCfg.cfg)			
				GameCfg.cfg = RES.getRes('leapConfig_json');
			return GameCfg.cfg;
		}

		public static getTestCfg():ITestInfo[]{
			if(!GameCfg.testCfg)
				GameCfg.testCfg = RES.getRes('testConfig_json');
			return GameCfg.testCfg;
		}
	
		public static getTestInfo(lv:number):ITestInfo{
			return GameCfg.getTestCfg()[lv - 1] || null;
		}
	}
}
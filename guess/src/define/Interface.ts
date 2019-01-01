module guess {	
	// 游戏配置结构	 
	export interface IGameCfg{
		OfficialWeChat:string;				// 官方微信
		TestRewardGold:number;				// 答题奖励金币
		InviteExtraGold:number;				// 邀请额外奖励金币
		UnlockAnswerCost:number;			// 解锁答案花费金币
		ShareRewardGold:number;				// 分享奖励金币
		CashNeedMoney:number;				// 红包提现需求
		SignMoneyRewardRange:number[];		// 签到红包奖励
		FavoriteTipLevel:number;			// 添加到我的小程序提示关卡
		ShowBannerLevel:number;				// 底部广告解锁关卡
		LevelsOfStage:number;				// 每一段位需要多少关卡
		LevelsOfSubstage:number;			// 每一小段位需要多少关卡
		StageNames:string[];				// 段位名
		DayDrawLotteryMax:number;			// 每日抽奖次数上限
	}

	export interface ITestInfo{
		level:number;
		money:number,
		tipCount:number,
		tips:string[];
		answer:string;
		option:string;
	}
	
	export interface IGameData{
		gold:number;
		money:number;
		reachLevel:number;
		passLevels:number[];
		toDayWatchAdCount:number;
	}
}
module guess {
	export class AdMgr implements utils.ISingleton{
		onCreate(){

		}

        onDestroy(){
		}

		public watchAd(success:Function, err:Function){
			let self = this;			
			if(!self.adEnable){
				err("广告不可用！");
				return;
			}

			success();
		}

		public get adEnable(){
			return false;
		}
	}
}
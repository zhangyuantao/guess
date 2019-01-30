module guess {
    export class Http{
        private static instance:Http;
        public static getInstance(){
            if(!Http.instance)
                Http.instance = new Http();
            return Http.instance;
        }

        /***********GET************/

        public get(thisObj:any, url:string, onComplete?:Function, onProgress?:Function, onError?:Function){
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(url, egret.HttpMethod.GET);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            if(onComplete)
                request.once(egret.Event.COMPLETE, onComplete, thisObj);
            if(onError)
                request.once(egret.IOErrorEvent.IO_ERROR, onError, thisObj);
            if(onProgress)
                request.once(egret.ProgressEvent.PROGRESS, onProgress, thisObj);
        }

        /***********POST************/

        public post(thisObj:any, url:string, data?:any, onComplete?:Function, onProgress?:Function, onError?:Function){
            let request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            //设置为 POST 请求
            request.open(url, egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.setRequestHeader("Access-Control-Allow-Origin", "*");
            request.send(data);
            if(onComplete)
                request.once(egret.Event.COMPLETE, onComplete, thisObj);
            if(onError)
                request.once(egret.IOErrorEvent.IO_ERROR, onError, thisObj);
            if(onProgress)
                request.once(egret.ProgressEvent.PROGRESS, onProgress, thisObj);
        }
    }
}
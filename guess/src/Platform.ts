/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    openDataContext:any;
    isRunInWX():boolean;
    getUserInfo(): Promise<any>;
    login(): Promise<any>;
    getSetting():Promise<any>;
    getSystemInfo():Promise<any>;
    getUserCloudStorage(keyArr:string[]):Promise<any>;
    // //被动转发
    // showShareMenu(): Promise<any>;
    // // 被动转发回调监听
    // onShareAppMessage(cb);
    // //主动分享的按钮事件
    // shareAppMessage(any):Promise<any>;
    // //微信好友圈
    // createGameClubButton():Promise<any>;
    // //微信广告
    // createBannerAd():Promise<any>;
    // //小程序二维码
    // post():Promise<any>;

}

class DebugPlatform implements Platform {
    openDataContext:any;
    
    isRunInWX(){
        return false;
    }

    async getUserInfo() {
        return { nickName: "username" }
    }

    async login() {

    }

    async getSetting(){
        let setting = {};
        setting["authSetting"] = {};
        return setting;
    }

    async getSystemInfo(){
        return null;
    }

    async getUserCloudStorage(keyArr:string[]):Promise<any>{
        return null;
    }
    
    // //被动分享
    // async showShareMenu() {

    // }

    // //打开主动分享
    // async shareAppMessage(any) {
        
    // }
    // //游戏圈
    // async createGameClubButton() {

    // } 
    // //广告
    // async createBannerAd() {

    // }
    // //小程序码
    // async post() {
        
    // }
}


if (!window.platform) {
    window.platform = new DebugPlatform();
}

declare let platform: Platform;

declare interface Window {
    platform: Platform
}






/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */

class WxgamePlatform {

    name = 'wxgame'

    isRunInWX(){
       return true;
    }

    getSystemInfo(){
        return new Promise((resolve, reject) => {
            wx.getSystemInfo({
               success: res => {
                  resolve(res);
               },
               fail: res => {
                  reject(res);
               },
               complete: res => {
                  reject(res);
               },
            })
        }); 
    }

    getSetting(){
        return new Promise((resolve, reject) => {
          wx.getSetting({
                success: res => {
                    resolve(res);
                },
                fail: res => {
                    reject(res);
                },
                complete: res => {
                    reject(res);
                },
            })
        });
    } 

    login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    resolve(res)
                }
            })
        })
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({
                withCredentials: true,
                success: function (res) {
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    resolve(userInfo);
                }
            })
        })
    }

    // 微量换量平台，获取跳转的小程序
    wladGetAds(num, cb){
      wx.wladGetAds(num, (info) => {
        //console.log(info);
        cb(info);
      });
    }

    layaAdChange(cb){
      //初始化流量共享组件显示
      AdvOTImage.start();
      AdvOTImage.change(cb);
    }

    layaAdToMiniProgram(){
      AdvOTImage.navigateToMiniProgram();
    }

    // banner
    createBannerAd(info){
      let bannerAd = wx.createBannerAd(info);
      bannerAd.show();
      return bannerAd;
    }

  createVideoAd(adUnitId) {
    let videoAd = wx.createRewardedVideoAd({
      adUnitId: adUnitId
    });
    return videoAd;
  }

  isRuniOS(){
    let sysInfo = wx.getSystemInfoSync();
    let isRuniOS = sysInfo.system.indexOf('iOS') != -1;
    console.log("isRuniOS:", isRuniOS);
    return isRuniOS;
  }

    openDataContext = new WxgameOpenDataContext();
}

class WxgameOpenDataContext {

    createDisplayObject(type, width, height) {
        const bitmapdata = new egret.BitmapData(sharedCanvas);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        const bitmap = new egret.Bitmap(texture);
        bitmap.width = width;
        bitmap.height = height;

        if (egret.Capabilities.renderMode == "webgl") {
            const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
            const context = renderContext.context;
            ////需要用到最新的微信版本
            ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
            ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
            if (!context.wxBindCanvasTexture) {
                egret.startTick((timeStarmp) => {
                    egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
                    bitmapdata.webGLTexture = null;
                    return false;
                }, this);
            }
        }
        return bitmap;
    }


    postMessage(data) {
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(data);
    }
}


window.platform = new WxgamePlatform();
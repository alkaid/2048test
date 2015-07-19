/**
 * Created by huangyi03 on 2014/10/9.
 */

var GC = GC || {};

//GC.winSize = cc.size(520, 650);
//
//GC.h = GC.winSize.height;
//
//GC.w = GC.winSize.width;
//
//GC.w_2 = GC.w / 2;
//
//GC.h_2 = GC.h / 2;

//GC.gap = 16;

GC.size = 4;

GC.startTiles = 2;

GC.score=100;

//GC.winValue = 2048;
GC.winValue = 16;

GC.GAME_STATE = {
    PLAY: 1,
    OVER: 2
};

GC.KEY_MAP = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
};


GC.init=function(designW,designH){
    GC.designW=designW;
    GC.designH=designH;
    //GC.w=cc.director.getVisibleSize().width<designW?cc.director.getVisibleSize().width:designW;
    GC.w=cc.director.getVisibleSize().width;
    GC.h=cc.director.getVisibleSize().height;
    GC.w_2=GC.w/2;
    GC.h_2=GC.h/2;
    GC.winSize = cc.size(GC.w, GC.h);
    GC.centerX=cc.director.getVisibleSize().width/2;
    GC.centerY=cc.director.getVisibleSize().height/2;
    GC.wscale=GC.w/GC.designW;
    GC.gap=0*GC.wscale;
    GC.gridPadding=10*GC.wscale;
    var gridMargin=10*2*GC.wscale;
    //GC.tileWidth=105*GC.wscale;
    GC.tileWidth=(GC.w-gridMargin-(GC.size+1)*GC.gap-GC.gridPadding*2)/GC.size;
    GC.gridWidth = GC.w - gridMargin;
    GC.tileStartX=GC.centerX-GC.gridWidth/2+GC.gridPadding;
    GC.gridMarginBottom=10;
    GC.tileStartY=GC.gridMarginBottom+GC.gridWidth-GC.gridPadding;
}

GC.spriteTileRepeat = function(sprite){
    if(cc.sys.isNative){
        sprite.getTexture().setTexParameters(gl.LINEAR,gl.LINEAR,gl.REPEAT,gl.REPEAT);
    }else{
        var param = {} // 主要 用到的是这个，水平重复平铺，垂直重复平铺
        param.minFilter = gl.LINEAR
        param.magFilter = gl.LINEAR
        param.wrapS = gl.REPEAT
        param.wrapT = gl.REPEAT
        sprite.getTexture().setTexParameters(param);
    }
}
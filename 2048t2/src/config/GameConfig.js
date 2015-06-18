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

GC.winValue = 2048;

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
    GC.w=cc.director.getVisibleSize().width<designW?cc.director.getVisibleSize().width:designW;
    GC.h=cc.director.getVisibleSize().height;
    GC.w_2=GC.w/2;
    GC.h_2=GC.h/2;
    GC.winSize = cc.size(GC.w, GC.h);
    GC.centerX=cc.director.getVisibleSize().width/2;
    GC.centerY=cc.director.getVisibleSize().height/2;
    GC.wscale=GC.w/GC.designW;
    GC.gap=16*GC.wscale;
    GC.gridMargin=10*2*GC.wscale;
    GC.tileWidth=105*GC.wscale;
    //GC.tileWidth=(GC.w-GC.gridMargin-(GC.size+1)*GC.gap)/GC.size;
}

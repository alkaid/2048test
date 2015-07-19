/**
 * Created by alkaid on 2014/10/9.
 */

var WelcomeLayer = cc.Layer.extend({

    ctor : function(){
        this._super();

        this.addCache();
        this.initBackground();
    },

    addCache : function(){

        //将plist添加到缓存
        cc.spriteFrameCache.addSpriteFrames(res.source_plist);
        cc.spriteFrameCache.addSpriteFrames(res.nums_plist);
    },

    initBackground: function () {
        //整体背景
        var bg = cc.Sprite.create("res/source/welcome_bg.jpg");
        bg.attr({
            x:  GC.centerX,
            y:  GC.centerY
        });
        bg.setScale(1.3);
        this.addChild(bg);

        //top背景
        var topbg=cc.Sprite.create("#welcome_title.png");
        topbg.attr({
            x:GC.centerX,
            y:GC.h
        });
        topbg.setAnchorPoint(0.5,1);
        this.addChild(topbg);

        //menu背景
        //menuBg = new cc.Sprite("#menu.png");
        //menuBg.attr({
        //    x: GC.centerX,
        //    y: GC.h-60.5
        //});
        //this.addChild(menuBg);

        var btnStart = new cc.MenuItemImage("#btn_start.png","#btn_start.png",this.onStartGame, this);

        //var btnStartNormal = cc.Sprite.create("#btn_start.png");
        //var btnStart = cc.MenuItemSprite.create(btnStartNormal, btnStartNormal, btnStartNormal, this.onStartGame, this);
        btnStart.attr({
            x: GC.centerX,
            y: 120+btnStart.getContentSize().height/2
        });
        var menu = cc.Menu.create(btnStart);
        menu.attr({
            x:0,y:0
        });
        this.addChild(menu);
    },

    onStartGame:function (pSender) {
        console.log('onStartGame');
        var scene = new GamePlayScene();
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },
});

var WelcomeScene  = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new WelcomeLayer();
        this.addChild(layer);

    }
});
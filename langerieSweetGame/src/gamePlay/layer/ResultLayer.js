/**
 * Created by alkaid on 2014/10/9.
 */

var ResultLayer = cc.Layer.extend({

    ctor : function(){
        this._super();
        this.initBackground();
        this.bindEvent();
    },

    bindEvent: function(){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
            }
        }, this);
    },

    initBackground: function () {
        //整体背景
        var bg =  new cc.Sprite(res.welcome_bg);
        bg.attr({
            x:  GC.centerX,
            y:  GC.centerY
        });
        bg.setScale(1.3);
        this.addChild(bg);

        ///top背景
        var topbg=new cc.Sprite("#top.png");
        topbg.attr({
            x:GC.centerX,
            y:GC.h
        });
        topbg.setAnchorPoint(0.5,1);
        this.addChild(topbg);

        //dialog
        var dialog=new cc.Sprite("#result_dg.png");
        dialog.attr({
            x:GC.centerX,
            y:GC.h-topbg.getContentSize().height-dialog.getContentSize().height/2-60*GC.wscale
        });
        this.addChild(dialog);

        //socre
        var scorebg=new cc.Sprite("#result_score_bg.png");
        scorebg.attr({
            x:GC.centerX,
            y:dialog.getPositionY()-dialog.getContentSize().height/2+205*GC.wscale+scorebg.getContentSize().height/2
        });
        this.addChild(scorebg);

        var lbScore = new ccui.TextBMFont();
        lbScore.setFntFile(res.fnt_numbers);
        lbScore.attr({
            x: scorebg.getPositionX(),
            y: scorebg.getPositionY()-14*GC.wscale,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            text: "1000",
            color: cc.color(10, 10, 10)
        });
        this.addChild(lbScore);
        lbScore.string = GC.score.toString();

        //var btnStartNormal = new cc.Sprite("#btn_start.png");
        //var btnStart = cc.MenuItemSprite(btnStartNormal, btnStartNormal, btnStartNormal, this.onStartGame, this);
        //btnStart.attr({
        //    x: GC.centerX,
        //    y: 120+btnStartNormal.getContentSize().height/2
        //});

        var btnGetPrize = new cc.MenuItemImage("#btn_get_prize.png","#btn_get_prize.png",this.onGetPrize, this);
        btnGetPrize.attr({
            x: GC.centerX-btnGetPrize.getContentSize().width/2,
            y: scorebg.getPositionY()-scorebg.getContentSize().height/2-btnGetPrize.getContentSize().height/2-40*GC.wscale
        });

        var btnShare = new cc.MenuItemImage("#btn_result_share.png","#btn_result_share.png",this.onShareResult, this);
        btnShare.attr({
            x: btnGetPrize.getPositionX()+btnGetPrize.getContentSize().width/2+btnShare.getContentSize().width/2+20,
            y: btnGetPrize.getPositionY()
        });


        var menu = cc.Menu.create(btnGetPrize,btnShare);
        menu.attr({
            x:0,y:0
        });
        this.addChild(menu);
    },

    onStartGame:function (pSender) {
        cc.audioEngine.playEffect(res.audio_UI_Click);
        var scene = new GamePlayScene();
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    },

    onGetPrize:function (pSender) {
        console.log("onGetPrize");
        cc.audioEngine.playEffect(res.audio_UI_Click);
    },

    onShareResult:function (pSender) {
        console.log("onShareResult");
        cc.audioEngine.playEffect(res.audio_UI_Click);
        this.removeFromParent();
    }
});

var ResultScene  = cc.Scene.extend({
    onEnter:function () {
        this._super();

        var layer = new ResultLayer();
        this.addChild(layer);

        cc.audioEngine.playEffect(res.audio_star);
        cc.audioEngine.playEffect(res.audio_star);
        cc.audioEngine.playEffect(res.audio_star);
    }
});
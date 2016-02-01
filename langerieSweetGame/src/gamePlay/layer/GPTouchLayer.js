/**
 * Created by huangyi03 on 2014/10/10.
 */

var GPTouchLayer = cc.Layer.extend({

    ctor: function () {

        this._super();

        this.size = GC.size;

        this.startTiles = GC.startTiles;

        //this.gridX = 10;
        //this.gridY = GC.h - 140;

        this.best = 0;

        this.initBatchNode();

        this.initRetry();

        this.initScore();

        //this.initGame();

        this.initGuide();

        //this.bindEvent();

    },

    initGuide: function(){
        var self=this;
        //初始化新手指引
        this.guideLayer=new cc.LayerColor(cc.color(0, 0, 0,150));
        this.guideLayer.attr({
            x: 0,
            y: 0
        });
        this.addChild(this.guideLayer);
        var guideTip1 = new cc.Sprite("#guide_tip1.png");
        var tipLayer=new cc.LayerColor(cc.color(0, 0, 0,80));
        tipLayer.attr({
            x: 0,
            y: GC.h-40*GC.wscale-guideTip1.getContentSize().height,
            width:GC.w,
            height:20*GC.wscale+guideTip1.getContentSize().height
        });
        guideTip1.attr({
            x: GC.centerX,
            y: tipLayer.getContentSize().height/2,
        });
        tipLayer.addChild(guideTip1);
        this.guideLayer.addChild(tipLayer);
        var guideTable = new cc.Sprite("#guide_table.png");
        guideTable.attr({
            x: GC.centerX,
            y: GC.gridBg.getPositionY()+GC.gridWidth/4
        });
        this.guideLayer.addChild(guideTable);
        var num1= new cc.Sprite("#2.png");
        var num2= new cc.Sprite("#2.png");
        var num3= new cc.Sprite("#4.png");
        num1.attr({
            x:guideTable.getContentSize().width/8,
            y:guideTable.getContentSize().height*5/8,
            scale:0.8
        });
        num2.attr({
            x:guideTable.getContentSize().width*5/8+8*GC.wscale,
            y:guideTable.getContentSize().height*5/8,
            scale:0.8
        });
        num3.attr({
            x:guideTable.getContentSize().width*5/8+8*GC.wscale,
            y:guideTable.getContentSize().height*5/8,
            scale:0.8,
            visible:false
        });
        guideTable.addChild(num1);
        guideTable.addChild(num2);
        guideTable.addChild(num3);
        var guideFingure= new cc.Sprite("#guide_fingure.png");
        guideFingure.attr({
            x: GC.centerX-guideTable.getContentSize().width/2,
            y: guideTable.getPositionY()-guideTable.getContentSize().height/2+10*GC.wscale
        });
        this.guideLayer.addChild(guideFingure);
        var actionMove = cc.moveTo(1, cc.p(guideFingure.getPositionX()+200*GC.wscale, guideFingure.getPositionY()));
        var seqAction = cc.sequence(cc.delayTime(0.4),actionMove, cc.callFunc(function () {
            var actionTo = cc.moveTo(0.5, num2.getPosition());
            num1.stopAllActions();
            num1.runAction(cc.sequence(actionTo, cc.callFunc(function () {
                num1.setVisible(false);
                num2.setVisible(false);
                num3.setVisible(true);
                var actionZoomIn, actionZoomOut;
                actionZoomIn = cc.scaleTo(0.1, 1.0, 1.0);
                actionZoomOut = cc.scaleTo(0.1, 0.8, 0.8);
                num3.runAction(cc.sequence(actionZoomIn, actionZoomOut,cc.delayTime(0.5),cc.callFunc(function () {
                    num3.setScale(0.8);
                    num3.setVisible(false);
                    num1.setPositionX(guideTable.getContentSize().width/8);
                    num1.setVisible(true);
                    num2.setVisible(true);
                    guideFingure.setPositionX(GC.centerX-guideTable.getContentSize().width/2);
                })));

            })));

        }),cc.delayTime(1.5));
        var repAct=cc.repeatForever(seqAction);
        guideFingure.runAction(repAct);
        //初始化开始游戏按钮
        this.btnGoOn = new cc.Sprite("#btn_go_on.png");
        this.btnGoOn.attr({
            x: GC.centerX,
            y: this.btnGoOn.getContentSize().height/2
        });
        this.guideLayer.addChild(this.btnGoOn);
        //点击开始游戏按钮
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget(),
                    locationInNode = target.convertToNodeSpace(touch.getLocation()),
                    s = target.getContentSize(),
                    rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                cc.audioEngine.playEffect(res.audio_UI_Click);
                //移除新手指引
                self.removeChild(self.guideLayer);
                //开始游戏
                self.initGame();
                self.bindEvent();
            }
        }, this.btnGoOn);
    },

    initGame: function () {

        this.state = GC.GAME_STATE.PLAY;

        this.won = false;

        this.score = 0;

        this.lastMoveTime = 0; //记录上次移动时间防止移动过快

        this.grid = new Grid(this.size);

        this.lbScore.string = this.score.toString();


        //重置Tile
        TileSprite.tiles = [];

        this.addStartTiles();
    },
    //通过BatchNode减少渲染个数, 优化性能
    initBatchNode: function () {

        var texNums = cc.textureCache.addImage(res.nums_png);
        this.texNumsBatch = new cc.SpriteBatchNode(texNums);
        this.addChild(this.texNumsBatch);
    },
    initRetry: function () {
        this.btnRetry = new cc.Sprite("#resetBtn_over.png");
        this.btnRetry.attr({
            x: GC.w - 60,
            y: GC.h - 104,
            visible:false
        });
        this.addChild(this.btnRetry);
    },
    initScore: function () {
        this.lbScore = new ccui.TextBMFont();
        this.lbScore.setFntFile(res.fnt_numbers);
        this.lbScore.attr({
            x: GC.scorebar.getPositionX()+5,
            y: GC.scorebar.getPositionY()-5,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            text: this.score,
            color: cc.color(10, 10, 10)
        });
        this.addChild(this.lbScore);

        this.lbAdd = new ccui.TextBMFont();
        this.lbAdd.setFntFile(res.fnt_numbers);
        this.lbAdd.attr({
            x: this.lbScore.getPositionX(),
            y: this.lbScore.getPositionY()-2,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            color: cc.color(10, 10, 10),
            visible: false
        });
        this.addChild(this.lbAdd);

        this.lbBest = new ccui.TextBMFont();
        this.lbBest.setFntFile(res.fnt_numbers);
        this.lbBest.attr({
            x: GC.w - 58*GC.wscale  ,
            y: GC.h - 52,
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            string: this.best
        });
        this.lbBest.setVisible(false);
        this.addChild(this.lbBest);

    },
    addStartTiles: function () {
        for (var i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    },
    addRandomTile: function () {
        cc.audioEngine.playEffect(res.audio_appear2);
        var value, tile;
        if (this.grid.cellsAvailable()) {
            value = Math.random() * 0.9 ? 2 : 4;
            tile = new Tile(this.grid.randomAvailableCell(), value);
            this.grid.insertTile(tile);
            this.createTileSprite(tile);
        }
    },
    createTileSprite: function (tile) {
        var tileSp = TileSprite.getOrCreateTile(tile.value);
        tileSp.location.x = tile.x;
        tileSp.location.y = tile.y;
        //(tileWidth + gap) * x + gap + tileWidth / 2+ GC.centerX-gridWidth/2
        //tileSp.x = this.gridX + tile.x * (tileSp.width + GC.gap) + GC.gap + tileSp.width / 2;
        //tileSp.y = this.gridY - tile.y * (tileSp.height + GC.gap) - GC.gap - tileSp.height / 2;
        tileSp.x = tile.x * (tileSp.width + GC.gap) + GC.gap + tileSp.width / 2  +GC.tileStartX;
        tileSp.y = GC.tileStartY - tile.y * (tileSp.height + GC.gap) - GC.gap - tileSp.height / 2;
        tileSp.setValue(tile.value);
        tileSp.visible = false;
        this.texNumsBatch.addChild(tileSp);

//        setTimeout(function () {
//            tileSp.visible = true;
//            tileSp.playScale(false);
//        }, 100);

        this.scheduleOnce(function(){
            tileSp.visible = true;
            tileSp.playScale(false);
        },0.1);
    },
    mergeTileSprite: function (tile) {
        var self = this,
            tileFrom = this.getTileSprite(tile.mergedFrom[0].x, tile.mergedFrom[0].y),
            tileTo = this.getTileSprite(tile.x, tile.y);

        if (tileFrom && tileTo) {
            tileFrom.location.x = -1;
            tileFrom.location.y = -1;
            tileFrom.playMove(tileTo.x, tileTo.y, function () {
                tileFrom.destroy();
                self.texNumsBatch.removeChild(tileFrom);
                tileTo.setValue(tile.value);
                cc.audioEngine.playEffect(res.audio_appear1);
                tileTo.playScale(true);
            });

        }
    },
    moveTileSprite: function (tile) {
        var tileFrom = this.getTileSprite(tile.previousPosition.x, tile.previousPosition.y);

        if (tileFrom) {
            tileFrom.location.x = tile.x;
            tileFrom.location.y = tile.y;
            tileFrom.playMove(tile.x * (tileFrom.width + GC.gap) + GC.gap + tileFrom.width / 2 +GC.tileStartX,
                    GC.tileStartY - tile.y * (tileFrom.height + GC.gap) - GC.gap - tileFrom.height / 2);
        }
    },
    getTileSprite: function (x, y) {
        var selChild,
            children = this.texNumsBatch.getChildren();
        for (var i in children) {
            selChild = children[i];
            if (selChild.location.x === x && y === selChild.location.y) {
                return selChild;
            }
        }
        return null;
    },
    bindEvent: function () {
        var self = this,
            touchStartX, touchStartY;

        //document.addEventListener("keydown", function (event) {
        //    var modifiers = event.altKey || event.ctrlKey ||
        //            event.metaKey || event.shiftKey,
        //        direction = GC.KEY_MAP[event.which];
        //
        //    if (!modifiers) {
        //        if (direction !== undefined) {
        //            event.preventDefault();
        //            self.move(direction);
        //        }
        //    }
        //
        //});

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                var direction = GC.KEY_MAP[key];
                if (direction !== undefined) {
                    self.move(direction);
                }
            }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                touchStartX = pos.x;
                touchStartY = pos.y;
                return true;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                var pos = touch.getLocation(),
                    touchEndX = pos.x,
                    touchEndY = pos.y,
                    dx = touchEndX - touchStartX,
                    absDx = Math.abs(dx),
                    dy = touchEndY - touchStartY,
                    absDy = Math.abs(dy);

                if (Math.max(absDx, absDy) > 10) {
                    self.move(absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 0 : 2));
                }
            }
        }, this);

        //点击重试按钮
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget(),
                    locationInNode = target.convertToNodeSpace(touch.getLocation()),
                    s = target.getContentSize(),
                    rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {
                self.retestGame();
            }
        }, this.btnRetry);


    },
    move: function (direction) {

        var self = this,
            cell, tile, score,
            vector, traversals, moved;

        if (this.state === GC.GAME_STATE.OVER || (+new Date - this.lastMoveTime) < 150)
            return;

        vector = this.getVector(direction);
        traversals = this.buildTraversals(vector);
        score = 0;
        moved = false;
        this.lastMoveTime = +new Date;

        // Save the current tile positions and remove merger information
        this.prepareTiles();

        cc.audioEngine.playEffect(res.audio_slide);

        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach(function (x) {
            traversals.y.forEach(function (y) {
                cell = { x: x, y: y };
                tile = self.grid.cellContent(cell);

                if (tile) {
                    var positions = self.findFarthestPosition(cell, vector);
                    var next = self.grid.cellContent(positions.next);

                    // Only one merger per row traversal?
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        var merged = new Tile(positions.next, tile.value * 2);
                        merged.mergedFrom = [tile, next];
                        self.mergeTileSprite(merged);

                        self.grid.insertTile(merged);
                        self.grid.removeTile(tile);

                        // Converge the two tiles' positions
                        tile.updatePosition(positions.next);

                        // Update the score
                        self.score += merged.value;

                        score += merged.value;

                        // The mighty 2048 tile
                        if (merged.value === GC.winValue) {
                            self.won = true;
                            self.gameOver();
                        }
                    } else {
                        self.moveTile(tile, positions.farthest);
                    }

                    if (!self.positionsEqual(cell, tile)) {
                        moved = true; // The tile moved from its original cell!
                    }
                }
            });
        });

        if (moved) {
            this.addRandomTile();

            if (!this.movesAvailable()) {
                this.gameOver();
            }
            if (score > 0) {
                this.updateScore(score);
            }
        }
    },
    getVector: function (direction) {
        // Vectors representing tile movement
        var map = {
            0: { x: 0, y: -1 }, // Up
            1: { x: 1, y: 0 },  // Right
            2: { x: 0, y: 1 },  // Down
            3: { x: -1, y: 0 }   // Left
        };

        return map[direction];
    },
    buildTraversals: function (vector) {
        var traversals = { x: [], y: [] };

        for (var pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    },
    prepareTiles: function () {
        this.grid.eachCell(function (x, y, tile) {
            if (tile) {
                tile.mergedFrom = null;
                tile.savePosition();
            }
        });
    },
    findFarthestPosition: function (cell, vector) {
        var previous;

        // Progress towards the vector direction until an obstacle is found
        do {
            previous = cell;
            cell = { x: previous.x + vector.x, y: previous.y + vector.y };
        } while (this.grid.withinBounds(cell) &&
            this.grid.cellAvailable(cell));

        return {
            farthest: previous,
            next: cell // Used to check if a merge is required
        };
    },
    moveTile: function (tile, cell) {
        this.grid.cells[tile.x][tile.y] = null;
        this.grid.cells[cell.x][cell.y] = tile;
        tile.updatePosition(cell);
        this.moveTileSprite(tile);
    },
    positionsEqual: function (first, second) {
        return first.x === second.x && first.y === second.y;
    },
    movesAvailable: function () {
        return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    },
    tileMatchesAvailable: function () {
        var self = this,
            tile;

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                tile = this.grid.cellContent({ x: x, y: y });

                if (tile) {
                    for (var direction = 0; direction < 4; direction++) {
                        var vector = self.getVector(direction);
                        var cell = { x: x + vector.x, y: y + vector.y };

                        var other = self.grid.cellContent(cell);

                        if (other && other.value === tile.value) {
                            return true; // These two tiles can be merged
                        }
                    }
                }
            }
        }

        return false;
    },
    updateScore: function (score) {
        var self = this,
            actionMove, seqAction;
        //加分效果
        actionMove = cc.moveTo(0.3, cc.p(this.lbScore.getPositionX(), this.lbScore.getPositionY()-10));
        seqAction = cc.sequence(actionMove, cc.callFunc(function () {
            self.lbAdd.visible = false;
        }));

        this.lbAdd.visible = true;
        this.lbAdd.string = "+" + score;
        self.lbAdd.y = this.lbScore.getPositionY()-60;
        self.lbAdd.opacity = 255;
        this.lbAdd.stopAllActions();
        this.lbAdd.runAction(seqAction);

        if (this.score > this.best) {
            this.best = this.score;
            this.lbBest.string = this.best.toString();
        }
        this.lbScore.string = this.score.toString();
    },
    retestGame: function () {
        this.texNumsBatch.removeAllChildren();
        if (this.resultWin) {
            this.removeChild(this.resultWin);
            this.resultWin = null;
        }
        if (this.lbResult) {
            this.removeChild(this.lbResult);
            this.lbResult = null;
        }
        this.initGame();
    },
    gameOver: function () {
        GC.score=this.score;
        this.state = GC.GAME_STATE.PAUSE;

        this.resultWin = new cc.Scale9Sprite("background.png");
        this.resultWin.attr({
            x: GC.w_2,
            y: GC.h_2 - 65,
            width: GC.w,
            height: GC.w,
            opacity: 76
        });
        this.addChild(this.resultWin);
        if(this.won){
            cc.audioEngine.playEffect(res.audio_starappear);
            //var scene = new ResultScene();
            //cc.director.runScene(new cc.TransitionFade(1.2, scene));
            var resultLayer=new ResultLayer();
            this.addChild(resultLayer);
        }else{
            this.state = GC.GAME_STATE.OVER;
            cc.audioEngine.playEffect(res.audio_lost);
            this.lbResult = new cc.Sprite(this.won ? "#result_success.png" : "#result_failed.png");
            this.lbResult.attr({
                x: GC.w_2,
                y: GC.h_2 - 65
            });
            this.addChild(this.lbResult);
        }
    }
});


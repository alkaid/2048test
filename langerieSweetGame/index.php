<!DOCTYPE html>
<html manifest="IGNORE.manifest">
<head>
    <meta charset="utf-8">
    <title>甜心SHOP</title>
    <link rel="icon" type="image/GIF" href="res/favicon.ico"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="full-screen" content="yes"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>

    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />

    <style>
        body, canvas, div {
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -khtml-user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
    </style>
</head>
<body style="padding:0; margin: 0; background: #000;">
<canvas id="gameCanvas" width="800" height="450"></canvas>
<?php
    $user=$_POST['user'];
    if($user) {
        echo '
        <script src="framework/cocos2d-js-v3.6-cust-release.js"></script>
        <script src="main.js?v=1.0"></script>
        <script type="text/javascript">
            alert('.$user.');
            var alkaidWxUserinfo='.$user.';
        </script>
        ';
    }else{
        console.log('user is null!');
        echo '
        <script type="text/javascript">
            console.log("用户信息验证失败");
            alert("用户信息验证失败");
        </script>
        ';
    }
?>
</body>
</html>
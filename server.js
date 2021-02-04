//Nodeの設定
const express = require('express')
const session = require('express-session');
const request = require('request');
const dateformat = require('dateformat');

//セッションを利用するための変数
const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 86400000 },
  resave: false,
  saveUninitialized: true,
}


const bodyParser = require('body-parser');
const fs = require('fs');


//express関数を利用してappというインスタンスを作成
const app = express();
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets'));


//セッションを利用することを宣言
app.use(session(sess));


//「家事TODO」のGASのURL
const GAS_URL = "https://script.google.com/macros/s/AKfycbxJHBHcQzTUdY619hDgNRV5ZCGUxaHrDDQwkwXfNI6A6JCDS0U/exec";


//ルートが開かれた場合の処理
//このURLにアクセスしてね
app.get('/', function (req, res) {
  //リダイレクトするための処理　302 Found
　//特定のHTTPリクエストに対するウェブサーバからのレスポンスを示す3桁のコード。ユーザーがロードしようとしたページやリソースが一時的に別の場所に移されており、移動先への302リダイレクトが実行されると発生。
  res.writeHead(302, {
    'Location': '/login'
  });
  res.end(); 
})


//mainが開かれた場合の処理　※ URLとレンダリングを指示して出るものは違う
app.get('/main', function (req, res) {
  //not演算子はその返ってきた値を逆にする効果があり
  //ここでは、いきなりmainが叩かれた場合の処理
  if ( !req.session.name ){
    res.writeHead(302, {
      'Location': '/login'
    });
    res.end(); 
  } else {
    
    /*
    const promiseObj = new Promise((引数) => {処理内容});
    const promiseObj = new Promise(function(引数){
    　処理内容
    })
　　*/

    //家事マスター取得　
    const p1 = new Promise((resolve) => {
      let options = {
        url: 'https://script.google.com/macros/s/AKfycbxJHBHcQzTUdY619hDgNRV5ZCGUxaHrDDQwkwXfNI6A6JCDS0U/exec?action=housework',
        method: 'GET',
        json: true
      }    
      
      request(options, function (error, response, body) {
        console.log(body);
        //次のthen　
        resolve(body);
      });
    });
　　　
    //今日のデイリー取得　
    const p2 = new Promise((resolve) => {
      let yyyymmdd = dateformat(new Date() , "yyyymmdd");
      let options = {                                                                                                                   
        url: 'https://script.google.com/macros/s/AKfycbxJHBHcQzTUdY619hDgNRV5ZCGUxaHrDDQwkwXfNI6A6JCDS0U/exec?action=dailyData&yyyymmdd=' + yyyymmdd,
        method: 'GET',
        json: true
      }    
      
      request(options, function (error, response, body) {
        console.log(body);
        //呼び出されると、成功したというゴール
        resolve(body);
      });
    });
    //[p1、p2]両方の成功をもって成功できるようにしている！
    //どちらかの成功でも、thenが呼ばれない。
    Promise.all([p1, p2]).then(results => {
      console.log(results);
      res.render(
        'main.html',
　　　　//HTMLに表示させるため、それぞれのキーをセット
        {
          email: req.session.mail,
          name: req.session.name,
          houseworkList: results[0],
          dairyList: results[1],
          dailyList: JSON.stringify(results[1])
        }
      );
    });
  }
});

//NODEからGASへ
app.post('/insertDaily', function (req, res) {
  let yyyymmdd = dateformat(new Date() , "yyyymmdd");
  console.log(req.session.mail);
  let options = {                                                                                                           
    url: 'https://script.google.com/macros/s/AKfycbxJHBHcQzTUdY619hDgNRV5ZCGUxaHrDDQwkwXfNI6A6JCDS0U/exec?action=insertDaily&yyyymmdd=' + yyyymmdd ,
    followAllRedirects: true,
    json: {
      email: req.session.mail, 
      kajiID: req.body.kajiID,
      weight: req.body.weight,
      others: req.body.others
    },
    headers: {
      'Content-type': 'application/json'	
    }
  }    
  //ボタン押したときに、情報を渡す！！
　//Nodeリクエスト送信
　//登録する！
　//レンダリングではない。returnのところ

  request.post( options, function(e, r, b) {
    console.log(b);
    res.json(b); //このbは、GASからの戻り値
    　　//jsonのオブジェクトとして、responseBodyに返している。
    　　//main.htmlのdone　の　data = responseBodyが入ってくる
  });
});

app.get('/entry', function (req, res) {
  res.render('entry.html', {err:""});  
});

app.get('/login', function (req, res) {
  //先にセッションをクリアしてから、レンダリングする
  req.session.name = "";
  res.render('login.html', {err:""});  
});


app.post('/loginSend', function (req, res) {
  //console.log(req.body);
 
  //GAS側のdoGetの処理に、existのパラメータと、/loginで入力されたアイパスを送る 
  let em = req.body.mail;      
  let pa = req.body.password;
  let url = `${GAS_URL}?action=exist&email=${em}&pw=${pa}`;
  
  request.get( url, function(e, r, b) {
    
    if (e) { //reqestGetが呼ばれなかった場合(通信エラー)
      console.log('Error: ' + e.message);
      return;
    }

    
    //アイパス一致すれば、Main画面をレンダリングする。(existData)　　　
　　 let result = JSON.parse(b);
    //console.log(result);
    if (result["結果"] === "OK"){
      req.session.mail = result["user_id"];
      req.session.name = result["user_name"];
      res.writeHead(302, {
      //リダイレクトする理由は。リロードされた時に、メイン画面を呼び出す処理。
      //レンダリングする、という処理を書いてしまうと、同じ処理を2こかく
      //→　責任明確化している。同じ記載をすると、どちらがバグっているかわからない。
      //入り口を1つにする。
      //一つのURLには1つの機能。
        'Location': '/main'
      });
      res.end();
    } else {
      res.render('login.html',{err: '何かが違います'});
    } 
  });
});



app.listen(8001, ()=> {
  console.log('http://localhost:8001/login')
});


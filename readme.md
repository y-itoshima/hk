# "シェアカジ" 　〜家事の実績を見える化して、「有り難う！」を増やす仕組み〜<br>  

<!-- # Short Description -->

「あれ、さっきクイックルワイパーやったよ？」<br>  
と、家族間で意思の疎通が取れていなく、不要な家事を行うこともあります。<br>  

また、仕事で帰りが遅くなると、同居者やパートナーがどれだけ家事をしてくれたか、<br>  
気づくことができず、感謝の言葉をかける機会も減ってしまいます。<br>  

"もっと人生を良くしたい"と思っても、いきなり、急に人生を変えることは難しいです。<br>  

まずは、一番身近な家庭を変えることから。<br>  
家族や同居者に感謝ができれば、少しづつ人生が好転していくと信じています。<br>  

対応した家事を見える化、家事に投じた時間を日時で可視化し、<br>  
家事を行った時には、家族に通知も飛びます。<br>  

「有り難う」が増えることを願って。<br>  

# Advantages<br>  

単なるTODOリストとは異なり、家族(同居者)単位で、<br>  
デイリーの家事をシェアすることができます。<br>  

# Installation<br>  


% vagrant init centos7<br>  
% git clone https://y-itoshima@github.com/y-itoshima/hk.git<br>  
% vagrant up<br>  
% vagrant ssh<br>  

(Vagrant接続後)<br>  
$ sudo yum update curl nss nss-util nspr<br>  
-> 実行結果として”y”<br>  
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash<br>  

(ここで一度bashを読み直して、nvmのパスをbashに読み込ませせる)<br>  
$ exit<br>  

(一度、ターミナルに入り直す)<br>  
% vagrant ssh<br>  
$ nvm install stable<br>  
$ cd /<br>  
$ cd vagrant<br>  
$ sudo firewall-cmd --zone=public --add-port=8001/tcp --permanent<br>  
$ sudo firewall-cmd --zone=public --add-service=http --permanent<br>  
$ sudo firewall-cmd --zone=public --add-service=https --permanent<br>  
$ sudo firewall-cmd --reload<br>  
$ cd ..<br>  
$ cd vagrant<br>  
$ vi Vagrantfile  <br>  
->以下のように編集<br>  

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "centos7"
  config.vm.network :forwarded_port, guest: 8001, host: 8001
end
```

$ exit<br>  

% vagrant reload<br> 　
% vagrant ssh<br> 　

(Vagrant接続後)<br> 　
$ sudo firewall-cmd --reload<br> 　
$ sudo firewall-cmd --zone=public --add-port=8001/tcp --permanent<br> 　
$ sudo firewall-cmd --reload<br> 　
$ sudo firewall-cmd --zone=public --add-service=http --permanent<br> 　
$ sudo firewall-cmd --reload<br> 　
$ npm install<br> 　
$ node server.js<br> 　

# Contributors

- https://github.com/y-itoshima

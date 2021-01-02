# "シェアカジ" 　〜家事の実績を見える化して、「有り難う！」を増やす仕組み〜

<!-- # Short Description -->

「あれ、さっきクイックルワイパーやったよ？」
と、家族間で意思の疎通が取れていなく、不要な家事を行うこともあります。

また、仕事で帰りが遅くなると、同居者やパートナーがどれだけ家事をしてくれたか、
気づくことができず、感謝の言葉をかける機会も減ってしまいます。

"もっと人生を良くしたい"と思っても、いきなり、急に人生を変えることは難しいです。

まずは、一番身近な家庭を変えることから。
家族や同居者に感謝ができれば、少しづつ人生が好転していくと信じています。

対応した家事を見える化、家事に投じた時間を日時で可視化し、
家事を行った時には、家族に通知も飛びます。

「有り難う」が増えることを願って。

# Advantages

単なるTODOリストとは異なり、家族(同居者)単位で、
デイリーの家事をシェアすることができます。

# Installation


% vagrant init centos7
% git clone https://y-itoshima@github.com/y-itoshima/hk.git
% vagrant up
% vagrant ssh

(Vagrant接続後)
$ sudo yum update curl nss nss-util nspr
-> 実行結果として”y”
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

(ここで一度bashを読み直して、nvmのパスをbashに読み込ませせる)
$ exit

(一度、ターミナルに入り直す)
% vagrant ssh
$ nvm install stable
$ cd /
$ cd vagrant
$ sudo firewall-cmd --zone=public --add-port=8001/tcp --permanent
$ sudo firewall-cmd --zone=public --add-service=http --permanent
$ sudo firewall-cmd --zone=public --add-service=https --permanent
$ sudo firewall-cmd --reload
$ cd ..
$ cd vagrant
$ vi Vagrantfile  ->以下のように編集

# -*- mode: ruby -*-
# vi: set ft=ruby :
```
Vagrant.configure("2") do |config|
  config.vm.box = "centos7"
  config.vm.network :forwarded_port, guest: 8001, host: 8001
end
```

$ exit

% vagrant reload
% vagrant ssh

(Vagrant接続後)
$ sudo firewall-cmd --reload
$ sudo firewall-cmd --zone=public --add-port=8001/tcp --permanent
$ sudo firewall-cmd --reload
$ sudo firewall-cmd --zone=public --add-service=http --permanent
$ sudo firewall-cmd --reload
$ npm install
$ node server.js

# Minimal Example

![Minimal Example](resources/file-0.png)

# Contributors

- https://github.com/y-itoshima

<!-- CREATED_BY_LEADYOU_README_GENERATOR -->

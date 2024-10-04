<div align="center">

# 🐉 Project Kylin

> ワンクリックで出来上がり、Scratch 難読化ツール。

[🇺🇸](./README.md) | [🇨🇳](./README_zh-CN.md) | [🇯🇵](./README_ja-JP.md)

</div>

Kylin は Scratch (Turbowarp) に使える、プロジェクトを難読化するツールであります。プロジェクトを _暗号化_ することで、プロジェクトの窃取または改造を防ぐことができます。

プロジェクトを外部サイトに発表する時にオススメします。

## 特性

- 標準難読化。変数、リストまたはブロックの名前を難読化し、隠せます。
- 事前コンパイル。terser でプロジェクトを最小化された Javascript に変換し、回復不可能状態になります (10% くらいの性能が損失されます)。この難読化メソッドは、上級拡張機能 (例えば、`lpp`) との互換性がありません。
- プロジェクト署名。プロジェクトにウォーターマークを付けて、追跡できます。

## インストール手順

プロジェクトを開けてから、`カスタム拡張機能` に飛び、`https://furryr.github.io/kylin-extension/kylin.js` から拡張機能をインストールします。サンドボックスなしで実行してください。

もしプロジェクトが既に難読化されているなら、拡張機能でメタデータを確認できます。されていない場合は、難読化設定を調整し、プロジェクトを難読化できます 。設定が終わったら `難読化` をクリックすると、難読化されたプロジェクトが自動的にエディターにロードされます。

**`難読化`をクリックしてからプロジェクトを回復することができませんので、よく考えたら実行してください。**

## プロジェクトを紛失してしまいました。回復する方法はありますか？

**プロジェクトを難読化する前に先ず、一度セーブしてください。**

Packager とは違い、プロジェクトを難読化すると、回復することが不可能になります。プロジェクトを紛失した時は、開発者に問い合わせず、自分で方法を考えてください。しないと迷惑行為になれる恐れがあります。開発者もお助けになりません。

## 言語サポート

利用できる言語：

- 英語 (アメリカ)
- 日本語 (日本)
- 簡体中国語 (中国)

## ライセンス及び著作権に関する声明

AGPL-3.0-only です。Turbowarp コンパイルに基づいています。原作者は FurryR で、VeroFess に触発されています。`Kylin` という名は、私の友達の一人、`@F_Qilin` (https://x.com/F_Qilin)、または CyanKylin が由来です。
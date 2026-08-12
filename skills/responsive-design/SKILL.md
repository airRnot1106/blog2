---
name: responsive-design
description: レスポンシブCSSの判断基準と規約。ピクセルパーフェクトを目標にしない考え方、固定サイズ回避、Intrinsic → コンテナクエリ → メディアクエリのエスカレーション順序、vw/vh禁止とsvi/dvi/lvi等の使い分け、クエリのレンジ構文とcontainer-nameのdashed-ident必須化、calc()によるブレイクポイント根拠の明示（クエリ条件内でvar()禁止）、clamp()による流動サイジングの計算式、grid-auto-fill/fit・grid-switcher（sign()トリック）・subgridを使ったレイアウトパターン、zoom()を最終手段とするフォールバックを含む。src/components配下やページのレイアウトでレスポンシブなサイジング・折り返し・ブレイクポイントを実装するとき、vw/vh/固定px幅/デバイスカテゴリ命名(.sp-only等)を使おうとしているとき、またはメディアクエリとコンテナクエリのどちらを使うか判断するときに使用する。
---

# Responsive design

このプロジェクトの `oxlint` はビューポート単位の禁止までは検知しないため、このスキルの規約は自己適用で守る。

## マインドセット：ピクセルパーフェクトを目標にしない

現代の Web は無数の変数（ビューポートサイズ、デバイス解像度、ユーザーのズーム、システムのフォントサイズ設定、アクセス手段）の上に成り立っており、デザインカンプは一つの環境のスナップショットにすぎない。CSS は「命令書」ではなく「提案書」として書く。すべてを細かく指定せず、ブラウザに十分な情報を渡してレイアウト計算を委ねる（イントリンシック・デザイン、グラフィックデザイナー Jen Simmons 氏が提唱）。目指すのは特定サイズでの満点ではなく、あらゆる環境での合格点＝デザインの意図パーフェクト。

`.sp-only` / `.pc-only` のようなクラス名や `sp` / `tablet` / `pc` を連想させる変数名・命名は禁止。2000 以上のデバイスサイズが存在する現在、スマートフォン・タブレット・デスクトップという分類では現実を捉えきれない。

## エスカレーション順序

上位で解決できるなら下位の手法は使わない。すべての要素がレスポンシブである必要はなく、最初に「そもそもレスポンシブにすべきか」を判断する。

| 優先度 | 手法                 | 使うケース                                                                                                                                                                                                       |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0      | Static（何もしない） | タグ・バッジ・アイコン（`1em`で十分）・装飾ボーダーなど、本質的に固定サイズの小要素。`clamp()`やクエリを当てるのは過剰                                                                                           |
| 1      | Intrinsic            | `auto` / `fit-content` / `min-content` / `max-content`、`flex-wrap: wrap`、`grid-template-columns: repeat(auto-fill/auto-fit, minmax(...))`、`clamp()` / `min()` / `max()`。クエリを一切使わず要素自体が適応する |
| 2      | コンテナクエリ       | コンポーネントがサイドバー・モーダル・カード内など複数コンテキストに配置され、ビューポートではなく配置先の幅で切り替えたい場合                                                                                   |
| 3      | メディアクエリ       | ページ全体のマクロレイアウト（2カラム↔1カラム）、ビューポート固定要素（モーダル・トースト）、常に画面幅100%が保証されるブロック（ヒーローヘッダー等）                                                            |

`@layer pages`（ページレイアウト）はメディアクエリ優先、`@layer components`（コンポーネント）はコンテナクエリ優先。メディアクエリはオワコンではなく、マクロレイアウトには依然として必須。

## ビューポート単位：`vw` / `vh` は使用禁止

接頭辞なしの `vw` / `vh` は large viewport 基準に倒れ、モバイルブラウザのツールバー表示中に見切れや過大な高さを起こす。論理方向の単位に置き換える。

- 横方向: `svi`（最小・安全側、原則こちら） / `dvi`（UIの出入りに追従） / `lvi`（UIが引っ込んだ最大）
- 縦方向: `svb`（原則こちら） / `dvb`（スクロールでレイアウトシフトしうるため避ける） / `lvb`（`position: fixed`の背景など常に画面いっぱいにしたい場合）

`svi` を優先するのは、後述の `cqi` が基準コンテナ不在時に small viewport 単位へフォールバックする仕様と足並みを揃えるため。

`height: 100svh;` ではなく `min-height: 100svh;` を使う（コンテンツがビューポートより高くなった場合のオーバーフローを避ける）。

ビューポート単位（`svi`/`dvi`/`lvi`/`svb`/`dvb`/`lvb`）はメディアクエリ・ページ全体のレイアウトと対で使う。コンポーネント単体のサイズをビューポート単位だけで決めない。コンポーネントが複数コンテキストに再配置されうるなら `cqi` 系（コンテナクエリと対）を使う。`cqb` / `cqw` / `cqmin` / `cqmax` は `container-type: size` が必要で実用上ほぼ使えないため使わない。

`svi` 系を直接使うと Chrome 系ブラウザのズームが効かなくなる既知の問題がある。プロジェクト全体でビューポート単位ベースの流動値を多用するなら、都度生値を書かず `tan(atan2())` を使った変換ユーティリティ（[gist](https://gist.github.com/tak-dcxi/8672786635ea2c08a96359ad1fec833a)）の導入を検討する。

Chrome 145 以降、`:root` に `scrollbar-gutter: stable` が適用されている環境では `vw` 系がスクロールバー分を含まずに計算されるようになった。このプロジェクトは `kiso.css`（`src/app/globals.css` で `@import`）でその指定がされているため該当するが、Safari / Firefox では従来どおり横スクロールが発生しうる。`vw` は前述のとおり全面禁止なので実害はないが、`inline-size: 100vw` のような書き方自体が多くの場合不要か別手段で置き換え可能である点は変わらない。

## クエリの構文ルール

**レンジ構文を使う。`min-width` / `max-width` のプレフィックス構文は禁止。**

```css
/* 正 */
@media (width >= calc(720 / 16 * 1rem)) { ... }
@container --card (inline-size >= calc(420 / 16 * 1rem)) { ... }

/* 禁止 */
@media (min-width: calc(720 / 16 * 1rem)) { ... }
```

**コンテナクエリでは `width` ではなく `inline-size` を使う**（論理方向前提のため）。

**`container-name` は必須。名前は dashed ident（`--`始まり）にする。**

```css
/* 正 */
:scope { container: --cards / inline-size; }
@container --cards (inline-size >= calc(420 / 16 * 1rem)) { ... }

/* 禁止：無名 → ネスト時にどのコンテナを参照するか不明 */
:scope { container-type: inline-size; }
```

`container-type` 単体では指定しない。必ず `container` ショートハンドで dashed ident の名前を付ける。`:scope` 以外で `container-type` を指定する要素には `.***-container` のような具体的なクラス名を必須とする（`.container` のような無名の汎用クラスは作らない）。

dashed ident を強制する理由：近年の CSS では `anchor-name` / `animation-timeline` などユーザー定義の名前を明確に区別するために `--` を強制する流れがある。「そのプロパティでは `--` が必須か」を個別に覚える必要が減り、将来 CSS 標準側のキーワードが増えても衝突リスクが下がり、自分が定義した名前だと即座に判別できる。

### コンテナクエリの落とし穴

- **自己参照不可**：`container-type` を指定した要素自身に、その要素基準の `@container` は適用されない（無限ループ回避のため）。コンテナ指定は親要素、`@container` は子要素で使う。
- **暗黙の `contain: inline-size` によるサイズ崩壊**：`width: fit-content` など子コンテンツに依存する幅指定と両立しない。外部表示形式が `inline` の要素、`flex-grow`/`flex-basis` 未指定の flex アイテム、`auto` や intrinsic な grid アイテムに `container-type` を持たせない。
- **`subgrid` と併用不可**（サイズ封じ込めが影響するため）。grid 親要素をコンテナとし、subgrid 側のブレイクポイントには `calc()` を使う。
- **`padding` / `border` を `container-type` 指定要素に置かない**：内部レイアウト関連プロパティが `cqi` やクエリ閾値の計算をずらす。コンテナ要素は純粋なサイズ参照先にし、レイアウトは子要素で行う。
- **`<picture>` の `<source media>` はコンテナクエリに対応していない**：画像ソース切り替えはビューポート基準の `media` に限定する。
- **`container-type: size` は原則使わない**：コンテナの高さが確約されている場合のみ有効化され、`min-block-size` では動作しない。
- **`html` / `body` に `container-type` を指定しない**：Chrome・Firefox・Safari とも現在は修正済みだが、旧仕様（暗黙的に `contain: layout` を適用し `position: fixed` を破壊する）が残る古い環境向けの予防線として避ける。コンテナクエリ提唱者の Miriam Suzanne 氏自身もアンチパターンだと述べている。
- **デザイナーとのコミュニケーションコストが増える可能性**：コンテナクエリはコンポーネント自身がブレイクポイントを持つため、ビューポート基準で会話してきたデザイナーとの意思疎通に追加の説明コストがかかりうる。

## `calc()` でブレイクポイントの根拠を明示し、クエリ条件内の `var()` は禁止する

閾値は、たまたま決めた数値ではなく、そのレイアウトが成立するために必要な幅として表現する。カラム最小幅×カラム数＋gap×隙間数、のように意味のある式に分解する。

```css
/* 禁止：クエリ条件の中で var() を参照している */
._card {
  @container --article-cards (inline-size >= calc(var(--_column-width) * var(--_column-count) + var(--_column-gap) * (var(--_column-count) - 1))) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* 正：クエリ条件はリテラル値で書く */
._card {
  @container --article-cards (inline-size >= calc(160 / 16 * 1rem * 3 + 24 / 16 * 1rem * 2)) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

`var()` はプロパティ値の置換に使うものであり、クエリ条件の構文要素としては使えない（AI がしばしばこの誤りを出力するので、レビュー時は `@media` / `@container` の条件式に `var()` が紛れ込んでいないかを最初に確認する）。一方、プロパティ値の中（`grid-template-columns: repeat(var(--_column-count), ...)` など）で `var()` を使うのは問題ない。

px→rem の単位変換にも `calc()` を使う：`@media (width >= calc(640 / 16 * 1rem))`。ブレイクポイントの単位を `rem` にするのは、フォントを拡大したユーザーは実質的な利用可能スペースが減るため。

根拠のない数値をただ `calc()` で包む（`calc(48rem)`）、一度しか使わない巨大な式を無コメントで書く、intrinsic なレイアウトで解決できる問題を無理に `calc()` で解決しようとする、はいずれも避ける。

## 固定サイズを避ける

- `width` の固定値ではなく `max-inline-size` を使う。
- `height` の固定値ではなく `min-block-size` または `aspect-ratio` を使う。
- 固定サイズが要るのは `border` / `box-shadow` / アイコンのような細かな装飾要素に限る（アイコンは `rem`/`em` を検討。`font-size` の拡縮に連動してほしくない `border` は `px` のままでよい）。
- 固定値がどうしても必要な場合は `min(100%, 値)` でオーバーフローを防ぐ。

```css
/* NG: 親要素が800pxより小さくなるとオーバーフローしレイアウトが崩れる */
.main-column {
  width: 800px;
}

/* OK: 最大800pxまで広がるが、それより狭ければ親要素の幅に合わせて縮む */
.main-column {
  width: min(800px, 100%);
}
/* または */
.main-column {
  max-width: 800px;
}
```

`min-width` を指定する場合も、親要素がその値を下回ったときのオーバーフローに備えて `min()` と組み合わせる：`min-width: min(320px, 100%);`。

## グリッドレイアウトのパターン

### 自動折り返し：`auto-fill` / `auto-fit` + `minmax(min(値, 100%), 1fr)`

```css
.grid {
  display: block grid;
  grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  gap: 1.5rem;
}
```

最低20remを確保しつつ、余った幅があれば広げ、収まらなくなれば折り返すグリッドになる。`minmax(20rem, 1fr)` だけだとコンテナが20rem未満でもオーバーフローするアンチパターンになるので、必ず `min()` と組み合わせる。ブレイクポイントに依存せずコンテンツ幅に合わせた折り返しができ、gridコンテナがどこに配置されるか気にしなくてよい。

### 最大カラム数を制限したい場合

「柔軟に増減してよいが N カラムまで」という制約は、カスタムプロパティと `calc()` で理想幅を算出し、最小幅との `max()` を取ってから `min()` でコンテナ幅を超えないようにする。

```css
.grid-auto-fill {
  --_gap: var(--grid-auto-fill-gap, 1.5rem);
  --_column-max-count: var(--grid-auto-fill-column-max-count, 4);
  --_column-min-width: var(--grid-auto-fill-column-min-width, 20rem);

  /* コンテナ幅からgap合計を引いたものをmax-count等分する */
  --_column-width-calculated: calc(
    (100% - var(--_gap) * (var(--_column-max-count) - 1)) / var(--_column-max-count)
  );

  /* 理想幅と最小幅を比較し大きい方を採用。ただしコンテナ全体幅は超えない */
  --_column-width: min(100%, max(var(--_column-min-width), var(--_column-width-calculated)));

  display: block grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--_column-width), 1fr));
  gap: var(--_gap);
}
```

### N カラムから 1 カラムへ直接切り替える（`grid-switcher`）

`auto-fit` は各カラムの最小幅を下回ると自然に列数を減らすが、2カラムなど中間状態を経由せず「Nカラム → 1カラム」に直接ジャンプさせたい場合は `sign()` トリックを使う。

```css
.grid-switcher {
  --_gap: var(--switcher-gap, 0px);
  --_column-count: var(--switcher-column-count, 3); /* 理想カラム数 */
  --_column-min-width: var(--switcher-column-min-width, 20rem); /* 各列の最小幅 */

  /* --_column-count 列が --_column-min-width を維持できる最小コンテナ幅 */
  --_breakpoint: calc(
    var(--_column-min-width) * var(--_column-count) + (var(--_gap) * (var(--_column-count) - 1))
  );

  /* ブレイクポイント以上での理想カラム幅 */
  --_column-width: calc((100% / var(--_column-count)) - var(--_gap) * (var(--_column-count) - 1));

  display: block grid;
  /*
   * sign(100% - var(--_breakpoint)) はコンテナ幅がブレイクポイントを
   * 上回れば1、下回れば-1を返す。* -100% することでブレイクポイント
   * 以上では-100%、未満では100%になる。
   * max(--_column-width, -100%) は --_column-width が、
   * max(--_column-width, 100%) は 100% が選ばれる。
   * 結果：広い画面ではカラム幅は --_column-width〜1frで伸縮（Nカラム）、
   * 狭い画面では100%〜1frで伸縮（1カラムに強制切替）。
   */
  grid-template-columns: repeat(
    auto-fit,
    minmax(max(var(--_column-width), sign(100% - var(--_breakpoint)) * -100%), 1fr)
  );
  gap: var(--_gap);
}
```

### `subgrid` + intrinsic サイジングでカラム幅を揃える（ニュースリスト等の例）

日付は改行しない（不変・intrinsic幅）、カテゴリは長すぎると窮屈になるため最大幅を設ける（可変・上限あり）、タイトルは残りの幅をすべて使う（可変）、のように、行内の要素ごとに可変/不変を最初に切り分けてから、`grid-template-columns` を intrinsic サイジングキーワードで組み立て、各行 `<li>` は `subgrid` で列を揃える。

```css
ul {
  display: block grid;
  /* 1列目: コンテンツに応じた最小幅（日付）
   * 2列目: 最大10remまでの可変幅（カテゴリ）
   * 3列目: 残りの利用可能な幅をすべて使用（タイトル） */
  grid-template-columns: max-content fit-content(10rem) minmax(0, 1fr);
  padding-inline: 1.5rem;

  & > * {
    grid-column: 1 / -1;
  }
}

li {
  display: block grid;
  grid-template-columns: subgrid;
  column-gap: 1.5rem;
  align-items: baseline;
  padding-block: 1rlh;
}
```

## 流動的なサイジング：`clamp()` の組み立て方

`clamp(min-value, intercept + slope × relative-unit, max-value)` の形で、ブレイクポイントなしに最小値と最大値の間を補間する。ページレベルの流動値にはビューポート単位（`svi`等）、コンポーネントレベルには `cqi` を使う。

1. `slope = (max-size - min-size) / (max-reference - min-reference)`
2. `intercept = min-size - slope * min-reference`
3. 組み立て：

```css
font-size: clamp(14 / 16 * 1rem, 0.00455 * 100svi + 12.18 / 16 * 1rem, 18 / 16 * 1rem);
```

CSS カスタムプロパティで完結させる場合：

```css
--_slope: calc(
  (var(--_max-size) - var(--_min-size)) / (var(--_max-reference) - var(--_min-reference))
);
--_intercept: calc(var(--_min-size) - var(--_slope) * var(--_min-reference));

font-size: clamp(
  var(--_min-size) / 16 * 1rem,
  var(--_slope) * 100svi + var(--_intercept) / 16 * 1rem,
  var(--_max-size) / 16 * 1rem
);
```

ビューポート単位・`svi`/`dvi`/`lvi` 単体をフォントサイズにそのまま使わない（ユーザーのフォントサイズ設定を無視することになる）。preferred 値は必ず「`rem` の固定部分＋相対単位」の合計にする。

## `zoom` は最後の保険

想定される最小幅を下回ってもレイアウトの組み替え・列数削減・折り返しでは破綻を避けきれないコンポーネントに限り、`progress()` と組み合わせて使う。プログレッシブ・エンハンスメントとして扱い、`progress()` が効かない環境でも読める・操作できる状態を保つこと。「デザインを絶対維持するため」の乱用は禁止。上限は `1`（拡大には使わない）。適用対象はコンポーネントルートに限定し、クエリコンテナが保証される文脈でのみ使う。文字サイズそのものをビューポート単位で縮める代替として使ってはいけない。

```css
:scope {
  container: --article-cards / inline-size;
}

@container --article-cards (inline-size < calc(200 / 16 * 1rem)) {
  ._card {
    zoom: min(progress(100cqi, 0px, calc(200 / 16 * 1rem)), 1);
  }
}
```

判断順序：まず Intrinsic → 次に `@container` でのレイアウト変更 → それでも破綻する場合のみ `zoom` を追加。

## 参考資料

- スライド: [俺流レスポンシブコーディング2025](https://speakerdeck.com/tak_dcxi/an-liu-resuponsibukodeingu-2025)
- ルールセット全文: [CSS Responsive Rules (gist)](https://gist.github.com/tak-dcxi/acd985cd8b7486a807f1c240731cc7e0)
- ビューポート単位の変換ユーティリティ・Stylelint設定: [gist](https://gist.github.com/tak-dcxi/8672786635ea2c08a96359ad1fec833a)

---
name: component-implementation
description: このプロジェクトにおける新規UIコンポーネント実装の規約（Panda CSS + Base UI、src/components/**）。インタラクティブなルート要素とレイアウト要素の分離、styled()の使い方、internal/publicカスタムプロパティパターン、プロパティの記述順序、oxlintでは検出できないa11y検証手順を扱う。src/components/配下でコンポーネントを新規作成・変更するとき、特にvariantや複数の内部パーツ、公開スタイルAPIを持つコンポーネントを扱うときに使用する。
---

# Component implementation

`src/components/` 配下のコンポーネントに関する規約。型チェックは `oxlint` の `typeAware` / `typeCheck` オプション経由で実行されるため、別途 `tsc` を走らせるステップは存在しない。

## まずここを読む

最初に `src/components/button/_base/button.tsx` と `button.stories.tsx` を読むこと。この文書は方針を述べるものであり、この2ファイルにはこの文書が明文化していない規約が体現されている。たとえばファイル配置（`src/components/<name>/_base/<name>.tsx`）、prop型のエクスポート形式、ストーリーのフォーマットなど。

この2ファイルが明示的に述べていないこと一つ：**`styled()` を使うだけでは `'use client'` は不要。** `styled()` コンポーネントはサーバーコンポーネント内でも正しくレンダリングされる。`button.tsx` にこのディレクティブが付いているのは `useTransition` を呼んでいるからである。コンポーネント自体がクライアント専用の React 機能（state、effect、transition、イベントハンドラ）を必要とする場合にのみ `'use client'` を追加する。

## 構造

インタラクティブなルート要素と、レイアウトを担当する要素を分離する。`<button>` のようなルートは色・ボーダー・角丸・カーソル・トランジション、そして自身の状態（hover、focus、disabled）を持つ。子要素は `padding`・`gap`・整列、および grid や flex によるスタッキングを担当する。

この短い原則だけでは判断できない2つの境界線：

- **`display` はルートに置き、それ以外のレイアウト系プロパティは置かない。** 背景やボーダーを描画するルートは自身のボックスを確立する必要がある（`inline-flex`、`inline-grid` など）。そうしないとフォントメトリクスの上に描画されてしまい、paddingを持つ子要素がはみ出す。ルートに置いてはいけないプロパティ群は `margin`、`position` / `inset`、`width` / `height`、`flex` / `grid-area` / `justify-self` / `align-self`。これらは外部関連（externally related）なプロパティであり、このコンポーネントを配置する側に属する。タップターゲット確保のための `min-height` のような本質的な最小値は例外として正当。
- **自身がスロットしたコンテンツへのスタイリングは許可されるが、他のコンポーネントの内部を直接参照することは許可されない。** このコンポーネントがレイアウトするコンテンツに対する素の要素セレクタ（たとえば呼び出し側が渡したアイコンがボックスをリサイズしないようにするための `'& > svg': { width: '100%', height: '100%' }`）は許容される手法である。他のコンポーネントのクラス名や `data-*` フックを対象にするのは許容されない。

参考: https://gist.github.com/tak-dcxi/7aa206f63944877b361fb232126919f3 （「外部関連型レイアウト」と「別コンポーネントのセレクタが含まれていないか確認する」の節）。外部関連という分離の背景にある考え方が書かれている。上記の箇条書きが実務上の要点であり、ここでの内容はこのgistを取得しなくても成立する。

## `:hover` は `@media (any-hover: hover)` の中に限定する

タッチデバイスでは実際のポインタが存在しないため、タップが擬似的に `:hover` を発火させ、指を離した後もhoverスタイルが解除されずに残ることがある。ホバー由来のスタイル（`--_hover-bg` の適用など）は必ず `@media (any-hover: hover)` の中に置き、ホバー可能なポインタが存在する環境だけに適用する：

```ts
'@media (any-hover: hover)': {
  '&:hover:not(:disabled)': {
    backgroundColor: 'var(--_hover-bg)',
  },
},
```

プロパティの記述順序上は、疑似クラス（グループ10、常に最後）と同じ位置に置く。`@media` でラップされていても並び順は変わらない。

## スタイリング：`sva()` + `createStyleContext()` ではなく `styled()` を直接使う

自己完結した単一ファイルのコンポーネントでは、Panda の `styled` ファクトリとそれぞれのレシピで各パーツを定義する：

```ts
import { styled } from '<path-to>/styled-system/jsx';

const Root = styled(SomePrimitive, { base: {...}, variants: {...} });
const Layout = styled('div', { base: {...}, variants: {...} });
```

`createStyleContext(sva(...))` は slot recipe と React context を組み合わせ、複数のファイルや利用側にまたがって slot スタイルを共有する仕組み。単一ファイルのコンポーネントにはそれは不要。

## スタイルAPIとしてのカスタムプロパティ

2種類のカスタムプロパティがあり、両者を混在させない：

- **Public**（`--component-name--property`。プロパティ名の前にダブルダッシュを置く。`--component-name-property` ではない）。これらのみが利用側が `style` を通じて設定できるもの。
- **Internal**（`--_property`、先頭にアンダースコア一つ）。これらは解決済みの値を保持する。

internal プロパティがオーバーライドを解決し、実際のCSSプロパティはinternalプロパティを読む：

```ts
base: {
  '--_bg': 'var(--button--bg, token(colors.text))', // publicなオーバーライド、なければデフォルト
  backgroundColor: 'var(--_bg)',                     // 解決済みの値のみを読む
}
```

フォールバックチェーンを実プロパティ側に書いてはいけない（`backgroundColor: 'var(--button--bg, var(--_bg))'`）。解決済みの色を必要とする他のすべての宣言（hover、focusのoutline、`color-mix` など）が同じ二重フォールバックを繰り返すことになる。`--_*` へ一度だけ解決し、以降はどこでも単一の `var(--_*)` で消費する。

`token(category.name)` は `var()` のフォールバック内や `color-mix()` 内でも解決される。生の `var(--category-name)` 形式ではなくこちらを使う。生の形式ではPandaのビルド時トークン存在チェックがスキップされる。

`token()` の裸のトークン省略形（`token(colors.text)` の代わりに `'text'` のような形式）はカスタムプロパティに代入した場合には解決されない。Panda標準のユーティリティプロパティ上でのみ解決される。`@pandacss/no-unsafe-token-fn-usage` はカスタムプロパティ上の `token()` を不要なものとして報告するが、そこでの警告は誤検知。`panda cssgen` の出力を確認してから対応すること。

逆に、`width` / `height` のようにPanda標準のユーティリティプロパティで、かつそのプロパティの値スケールにトークンカテゴリ（`sizes`など）が直接含まれている場合は、`token(sizes.4)` のように包まず裸のショートハンド（`width: '4'`）を書く。`token()` はカスタムプロパティへの代入・`var()` フォールバック内・`color-mix()` 内という、裸のショートハンドが解決されない場所のためのものであり、それ以外での使用は不要な記述になる。`@pandacss/no-unsafe-token-fn-usage` はこのプロジェクトでは誤検知対策のため全体で `'off'` にしてある（`oxlint.config.ts`）ため、この種の不要な `token()` は静的解析では検出されない。自分でレビューすること。

このレビューは目視だけに頼らず、`panda debug <path> --outdir <tmp-dir>` を実行して機械的に確認する。不要な `token()` はビルド時には解決されるため見た目上は動くが、生成されるクラス名にその生の文字列がそのまま埋め込まれてしまう（例: `gap: 'token(spacing.2)'` は `.gap_token\(spacing\.2\)` というクラス名になる。本来は `.gap_2` のはずだった）。出力先の `.css` に対して `grep "token(" <file>` を実行し、残った行を1つずつ確認する。`var(--x, token(...))` のフォールバック内や `color-mix(...)` の中にある行は正しい（そこでしか裸のショートハンドが解決されないため）。それ以外の行（ユーティリティプロパティに直接 `token()` が渡っているもの）は裸のショートハンドへ書き換える。コンポーネント実装を終える前に一度この手順を通すこと。

公開APIの型は狭く定義する。`style` に任意の `CSSProperties` を許容させるのではなく、ドキュメント化されたカスタムプロパティのみを列挙するオブジェクト型として定義する：

```ts
style?: {
  '--component-name--bg'?: string;
  '--component-name--radius'?: string;
  // ...公開する意図のあるものだけ
};
```

利用側にも例が必要。`token()` はPandaのスタイルオブジェクトの中でしか存在しないため、ストーリーや親コンポーネントが `style` 経由でpublicプロパティを渡す場所では使えない。そこでは `styled-system/tokens` から `token` をインポートし、`token.var()` を呼ぶ：

```tsx
import { token } from '<path-to>/styled-system/tokens';

<Badge style={{ '--badge--bg': token.var('colors.overlay') }}>New</Badge>;
```

`token.var('colors.overlay')` は文字列 `var(--colors-overlay)` を返し、実在するトークンのunion型に対して型チェックされる。手書きの `'var(--colors-overlay)'` は型チェックされない。これが両側で生の形式を禁止している理由。

ショートハンド値が使えるかどうかを仮定する前に、`panda.config.ts` にそのトークンカテゴリが存在するか確認すること。このプロジェクトには `radii` や `fontWeights` のスケールが存在しないため、それらは生の値（`0.375rem`）かネイティブCSSキーワード（`bold`、`normal`）が必要になる。

## プロパティの記述順序（アルファベット順ではない）

すべてのスタイルオブジェクト内（`base`、各variant、そしてカスタムプロパティの代入自体）で、以下のグループ順にプロパティを並べる。

1. カスタムプロパティ（`--_*`）、先頭にまとめる
2. 親からの配置（`position`、`inset`、`grid-area`、`z-index`）
3. displayとレイアウト（`display`、`grid-template-*`、`place-items`、`align-items`、`justify-content`、`gap`）
4. ボックスモデル。spacingより先にsize（`width` / `height` / `min-*` / `max-*`、その後に `padding` / `margin`）
5. ボーダーと角丸（`border`、`border-radius`、`outline`）
6. 背景と色（`background-color`、`color`）
7. タイポグラフィ（`font`、`font-size`、`font-weight`）
8. その他の見た目（`cursor`、`opacity`）
9. トランジションとアニメーション
10. 疑似クラスとネストされたセレクタ、常に最後

`--_*` の代入にも同じ順序が適用される：`--_border-color`（グループ5）は `--_bg`（グループ6）より前に来る。

## oxlintだけでなくa11yテストを実行して検証する

`oxlint` と `oxfmt` はレンダリングもアクセシビリティもカバーしない。Storybookのテストスクリプトはカバーする：

```
pnpm test:storybook <name-fragment>      # 例: pnpm test:storybook badge
```

この呼び出しについて2点：

- **フィルタは素のまま渡す。`-- <path>` の形では渡さない。** `--` を付けるとpnpmがセパレータをそのまま転送してしまい、vitestが位置引数のフィルタを無視するため、対象コンポーネントだけでなくスイート全体が実行されてしまう。正しくフィルタされた実行では `Test Files  2 passed (2)`（light projectとdark projectでそれぞれ1ストーリーファイル）、テスト数は `ストーリー数 × 2` になる。
- **`vitest run --project=<name>` ではなくスクリプト名で呼び出す。** storybookのprojectはテーマごとに分かれている（`storybook-light` / `storybook-dark`）ため、直書きしたproject名は陳腐化し `No projects matched the filter` で失敗する。

プロジェクト全体には他のコンポーネントの既知の失敗が含まれている場合があるため、フィルタなしの実行で非ゼロの失敗数が出ても、それが必ずしも自分の変更によるリグレッションとは限らない。失敗しているテスト名を読み、自分のファイルが含まれていないか確認すること。自分のコンポーネントに絞り込むと、実行は完全にグリーンになる。

`oxlint` は成功時には何も出力しない。出力が空であることは、対象ファイルにマッチしなかったことではなく成功を意味する。確実に確認したい場合は終了コードを見る（`oxlint <path>; echo $?`）。

一つのコンポーネントが片方のテーマでは通り、もう片方では落ちることがあるため、両方のtheme projectが実行される。`@storybook/addon-a11y` は `.storybook/preview.tsx` で `parameters.a11y.test: 'error'` として組み込まれているため、axeの違反があれば実行が失敗する。

このテストが検出する、静的チェックでは検出できない不具合は**状態変化時のアクセシブルネーム喪失**である。たとえばレイアウトサイズを保ったままスピナーを表示するために `visibility: hidden` でコンテンツを隠すと、それはアクセシビリティツリーから除去されるため、見た目は正しいままスクリーンリーダーユーザーに対してはコントロールの名前が失われる。代わりに `opacity: 0` を使う。これは視覚的にコンテンツを隠しつつレイアウトサイズを保ち、アクセシビリティツリーには残す。一時的な状態はコントロールの `aria-busy` で明示的に伝える。

## ストーリー

ストーリーはCSF3ではなくStorybookのCSF Next（factory）フォーマットを使う。`export default meta` / `satisfies Meta<typeof X>` を書くのではなく、このプロジェクトの `preview` をインポートしてそこから組み立てる：

```tsx
import preview from '<path-to>/.storybook/preview';
import { Badge } from './badge';

const meta = preview.meta({ component: Badge, args: { children: 'Badge' } });

export const Solid = meta.story({ args: { variant: 'solid' } });
```

形は `src/components/button/_base/button.stories.tsx` からコピーすること。

コンポーネントがinteractive、pending、disabledのいずれかの状態を持つ場合は、それらを実際に動かす `play` 関数を書く：クリックし、state属性をアサートし、副作用が起きた／起きなかったことをアサートする。`args` を設定するだけのストーリーは上記どちらの不具合も検出しない。

あるレイヤーが視覚的には隠れているがアクセシビリティツリーには残っていることをアサートするには、`expect(el).toBeVisible()` を避ける。jest-domは `opacity: 0` を非表示とみなすため、正しい実装に対してもこのアサーションは失敗する。2つのプロパティを別々にアサートする：

```ts
const style = getComputedStyle(iconLayer);
expect(style.visibility).toBe('visible');
expect(style.opacity).toBe('0');
```

# 更新紀錄

## V4.1 → V4.2
重點：效能優化、程式架構拆分、重複載入修正。
- **效能優化**
  - Scroll Spy 改用 `IntersectionObserver`，取代 `scroll` 事件 + `offsetTop` 計算，減少 Layout Thrashing，提升流暢度。
  - 浮動動畫加上 `will-change: transform`，瀏覽器會將動畫圖層獨立為 Compositor Layer，降低主執行緒負擔。
  - 滾動判斷改用 `requestAnimationFrame` 並設定 `passive: true`，避免捲動時卡頓。
- **多語維護**
  - 抽離翻譯字串到 `js/i18n-data.js`，方便維護與擴充。
- **程式載入優化**
  - 移除 `index.html` 中重複的 `main.js` `<script>` 載入，避免執行兩次。

## V4.2 → V4.3
重點：文字/SEO 完整化、多語 meta 同步、字體與排版基礎化。
- **文字與 SEO**
  - `<title>` 統一為「ForeSense Tech｜AI 製程優化與品質監控」；新增 `<meta name="description">` 並套用到 OG/Twitter。
  - 補齊卡片欄位：`og:title/description/type/url/image/site_name/locale`、`twitter:card/title/description/image`。
  - 新增 `hreflang`：`zh-Hant`、`en`，利於搜尋引擎判斷語系。
- **多語對應 SEO 同步**
  - `translate()` 時同步更新 `<html lang>`、`title/description`、OG/Twitter 文字，保持語言一致。
  - `metaCopy` 集中管理語系標題與描述，未來擴充可直接增加。
- **字體與排版**
  - `css/style.css` 加入字體 tokens（`--font-primary/body/heading`），設定系統 fallback。
  - 調整正文字距/行高：`letter-spacing: 0.02em`、`line-height: 1.65`，提升可讀性。
  - 新增共用類別：`.heading-1`、`.heading-2`、`.body-text`、`.caption` 統一字重與行距。

## V4.3 → V4.4
重點：字元編碼修正、導覽列優化、版面可讀性、無障礙/動效。
- **字元編碼修復**：`index.html` 的 `<title>`/meta 文案改為正確 UTF-8 中文，`js/main.js` 的翻譯字典與 console 訊息同步修正。
- **導覽列優化**：縮小 Logo 尺寸與 `#header-push` 高度，捲動時新增 `nav-scrolled` 背景/陰影，保留隱藏/顯示邏輯。
- **可讀性提升**：新增 `.copy-max` 限制文字欄寬並套用到主要段落，讓行寬與留白更舒適。
- **無障礙與動效**：加入 Skip Link（跳到主要內容）；支援 `prefers-reduced-motion`（動畫降速/停用）並在手機或降速時關閉粒子背景，維持平滑滾動偏移調整。

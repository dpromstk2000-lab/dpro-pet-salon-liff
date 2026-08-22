/* DPRO GUIDE CENTER CONTENT / PET SALON
 * Version: PETSALON-GUIDE-CENTER-V1.0 / PHASE 5
 * Derived from PET_SALON_CONTENT_PACKAGE_V1.0.json.
 */
(()=>{
  "use strict";
  window.DPRO_GUIDE_CENTER_CONTENT = Object.freeze({
  "standardVersion": "DPRO-TUTORIAL-STANDARD-V1.0",
  "productId": "PETSALON",
  "productName": "DPRO PET SALON LINE",
  "guideVersion": "PETSALON-TUTORIAL-V1.0",
  "updatedAt": "2026-08-22",
  "formalPath": "guide-center.html",
  "quickArticleIds": [
    "P0-02",
    "P0-04",
    "P0-06",
    "P0-07",
    "P0-08",
    "P2-07"
  ],
  "sections": [
    {
      "id": "start",
      "title": "はじめての方へ",
      "order": 1,
      "article_ids": [
        "P0-01",
        "P0-02",
        "P0-03"
      ]
    },
    {
      "id": "daily",
      "title": "毎日の業務",
      "order": 2,
      "article_ids": [
        "P0-04",
        "P0-05",
        "P0-06",
        "P0-07",
        "P1-01",
        "P0-08",
        "P0-09",
        "P0-10",
        "P0-11"
      ]
    },
    {
      "id": "chart",
      "title": "ペットカルテ",
      "order": 3,
      "article_ids": [
        "P1-02",
        "P1-03",
        "P1-04",
        "P1-05"
      ]
    },
    {
      "id": "qr",
      "title": "店頭QR受付",
      "order": 4,
      "article_ids": [
        "P1-06",
        "P1-07",
        "P1-08"
      ]
    },
    {
      "id": "hotel",
      "title": "ペットホテル",
      "order": 5,
      "article_ids": [
        "P1-09",
        "P1-10",
        "P2-05",
        "P2-06"
      ]
    },
    {
      "id": "settings",
      "title": "店舗設定",
      "order": 6,
      "article_ids": [
        "P2-01",
        "P2-02",
        "P2-03",
        "P2-04"
      ]
    },
    {
      "id": "customer",
      "title": "お客様側画面",
      "order": 7,
      "article_ids": [
        "P1-11",
        "P1-14",
        "P1-15",
        "P1-12",
        "P1-16",
        "P1-17",
        "P1-13"
      ]
    },
    {
      "id": "trouble",
      "title": "困ったとき",
      "order": 8,
      "article_ids": [
        "P2-07"
      ]
    }
  ],
  "articles": [
    {
      "id": "P0-01",
      "section": "start",
      "priority": "P0",
      "title": "はじめに",
      "keywords": [
        "はじめて",
        "開始",
        "操作ガイド"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.page",
      "what_you_can_do": "PET SALONの日常業務で最初に見る場所と、困った時の調べ方を確認できます。",
      "when_to_use": "契約後に初めて管理画面を使う時。",
      "steps": [
        "共通オーナーログインで管理画面を開きます。",
        "まず「最初の10分ガイド」を実行します。",
        "日常は「今日の管理」から始めます。",
        "分からない機能は「？ 操作ガイド」から検索します。"
      ],
      "completion": "毎日の開始地点と、ガイドの開き方が分かれば完了です。",
      "cautions": [
        "実顧客情報を練習用に入力しません。"
      ],
      "related": [
        "P0-02",
        "P0-04"
      ]
    },
    {
      "id": "P0-02",
      "section": "start",
      "priority": "P0",
      "title": "最初の10分ガイド",
      "keywords": [
        "10分",
        "初回",
        "チュートリアル"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.page",
      "what_you_can_do": "ログイン、今日の管理、電話受付、顧客検索、施術進捗、次回予約、LINE案内の位置を短時間で確認できます。",
      "when_to_use": "初回利用時、または基本操作をもう一度確認したい時。",
      "steps": [
        "「10分ガイドを始める」を押します。",
        "画面の案内に沿って7つの基本業務を確認します。",
        "操作データを登録せず、場所と流れを覚えます。",
        "最後に「完了」を押します。"
      ],
      "completion": "「最初の10分は完了です」と表示されれば完了です。",
      "cautions": [
        "ガイドは予約・送信・削除・進捗変更を自動実行しません。"
      ],
      "related": [
        "P0-03",
        "P0-04"
      ]
    },
    {
      "id": "P0-03",
      "section": "start",
      "priority": "P0",
      "title": "ログイン・ログアウト",
      "keywords": [
        "ログイン",
        "ログアウト",
        "認証"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "existing-id:#dproAuthSessionBar",
      "what_you_can_do": "DPRO共通オーナー認証で管理画面へ入り、必要な時にログアウトできます。",
      "when_to_use": "管理画面を開く時、共有PCから離れる時、認証が切れた時。",
      "steps": [
        "保護された管理画面を開くと、未ログイン時は共通ログイン画面へ移動します。",
        "ログイン後、元の管理画面へ戻ります。",
        "右下の「DPRO認証中」を確認します。",
        "終了時は同じ表示内の「ログアウト」を使います。"
      ],
      "completion": "「DPRO認証中」が表示され、管理画面が使えればログイン完了です。",
      "cautions": [
        "旧管理コード欄を使う手順は案内しません。"
      ],
      "related": [
        "P2-07",
        "FAQ-01"
      ]
    },
    {
      "id": "P0-04",
      "section": "daily",
      "priority": "P0",
      "title": "今日の管理を見る",
      "keywords": [
        "今日",
        "ダッシュボード",
        "本日の予約"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.nav.today",
      "what_you_can_do": "今日の施術進捗、未対応、新着予約希望、確定予約、LINE案内、次営業日予約をまとめて確認できます。",
      "when_to_use": "営業開始時、予約や対応状況をまとめて確認したい時。",
      "steps": [
        "「今日の管理」を開きます。",
        "「今日やること」で未対応を確認します。",
        "「新着予約希望・確認待ち」と「本日の確定予約」を確認します。",
        "「今日の施術進捗」で来店後の状況を確認します。"
      ],
      "completion": "今日対応すべき内容が把握できれば完了です。",
      "cautions": [
        "件数0はエラーではありません。"
      ],
      "related": [
        "P0-05",
        "P0-08",
        "P0-10"
      ]
    },
    {
      "id": "P0-05",
      "section": "daily",
      "priority": "P0",
      "title": "新着予約希望を確認する",
      "keywords": [
        "新着予約",
        "予約希望",
        "確定"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.today.pending",
      "what_you_can_do": "お客様から入った予約希望を確認し、内容に問題がなければ店舗側で確定処理へ進めます。",
      "when_to_use": "新しい予約希望が入った時。",
      "steps": [
        "「今日の管理」を開きます。",
        "「新着予約希望・確認待ち」を確認します。",
        "希望日時・ペット・メニュー等を確認します。",
        "店舗運用に従って予約確定を行います。"
      ],
      "completion": "予約希望が店舗側の確定済み運用へ移れば完了です。",
      "cautions": [
        "予約確定は業務データを変更する操作です。内容を確認してから実行します。"
      ],
      "related": [
        "P0-04",
        "P1-01",
        "FAQ-04"
      ]
    },
    {
      "id": "P0-06",
      "section": "daily",
      "priority": "P0",
      "title": "電話・店頭予約を登録する",
      "keywords": [
        "電話受付",
        "店頭予約",
        "手入力"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.manual.form",
      "what_you_can_do": "電話や店頭で受けた予約をLINE予約と同じ管理に登録できます。",
      "when_to_use": "電話予約、店頭での次回予約を受けた時。",
      "steps": [
        "「電話受付」を開きます。",
        "飼い主・ペット・日時・メニュー等を入力します。",
        "「登録前確認」で内容を確認します。",
        "内容が正しい時だけ登録します。"
      ],
      "completion": "登録後、予約一覧で確認できれば完了です。",
      "cautions": [
        "重複や日時間違いを防ぐため、登録前確認を必ず見ます。"
      ],
      "related": [
        "P0-07",
        "P1-01",
        "FAQ-05"
      ]
    },
    {
      "id": "P0-07",
      "section": "daily",
      "priority": "P0",
      "title": "顧客・ペットを探す",
      "keywords": [
        "顧客検索",
        "ペット検索",
        "電話番号",
        "犬種"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.customer.search",
      "what_you_can_do": "電話番号・飼い主名・LINE名・ペット名・犬種から登録済み情報を探せます。",
      "when_to_use": "予約がないお客様を探す時、電話対応中に過去情報を確認したい時。",
      "steps": [
        "「顧客検索」を開きます。",
        "分かる情報を入力します。",
        "検索結果から飼い主とペットを確認します。",
        "必要な予約・ホテル受付へ進みます。"
      ],
      "completion": "対象の飼い主・ペットが確認できれば完了です。",
      "cautions": [
        "検索結果が出ない場合は電話番号表記や名前を確認します。"
      ],
      "related": [
        "P0-06",
        "P0-09",
        "FAQ-03"
      ]
    },
    {
      "id": "P1-01",
      "section": "daily",
      "priority": "P1",
      "title": "日別予約を見る",
      "keywords": [
        "日別予約",
        "日付",
        "予約状況"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.nav.day",
      "what_you_can_do": "日付を選んでその日の予約状況を確認できます。",
      "when_to_use": "明日以降の予約確認や特定日の確認をしたい時。",
      "steps": [
        "「日別予約」を開きます。",
        "確認したい日付を選びます。",
        "表示された予約を確認します。"
      ],
      "completion": "対象日の予約状況が確認できれば完了です。",
      "cautions": [
        "予約変更を行う場合は内容を確認して別の該当操作へ進みます。"
      ],
      "related": [
        "P0-04",
        "P0-06"
      ]
    },
    {
      "id": "P0-08",
      "section": "daily",
      "priority": "P0",
      "title": "施術進捗4ステップ",
      "keywords": [
        "受付する",
        "施術開始",
        "お迎え可能",
        "お渡し完了"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.today.workflow",
      "what_you_can_do": "来店からお渡しまでの進み具合を4つの基本操作で管理できます。",
      "when_to_use": "お客様が来店した時、施術開始時、仕上がり時、お渡し時。",
      "steps": [
        "予約カードを確認します。",
        "来店時に「受付する」。",
        "施術を始める時に「施術開始」。",
        "お迎えを依頼できる状態で「お迎え可能」。",
        "お渡しが終わったら「お渡し完了」。"
      ],
      "completion": "予約カードの状態が実際の進捗と一致すれば完了です。",
      "cautions": [
        "各ボタンは業務データを更新します。実際の状態と合う時だけ押します。"
      ],
      "related": [
        "P0-09",
        "P1-02",
        "FAQ-06"
      ]
    },
    {
      "id": "P0-09",
      "section": "daily",
      "priority": "P0",
      "title": "ペットカルテを開く",
      "keywords": [
        "カルテ",
        "施術カルテ",
        "pet record"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.today.workflow",
      "what_you_can_do": "今日の予約カードから対象ペットの施術カルテへ進めます。",
      "when_to_use": "施術内容、写真、ワクチン、過去記録を確認・記録したい時。",
      "steps": [
        "「今日の施術進捗」で対象ペットを確認します。",
        "予約カードの「施術カルテを開く」を押します。",
        "ペット名を確認してカルテ画面を使います。"
      ],
      "completion": "対象ペットの「ペット別施術カルテ」が開けば完了です。",
      "cautions": [
        "予約がない日はカルテ入口が表示されない場合があります。"
      ],
      "related": [
        "P1-02",
        "P1-03",
        "P1-04",
        "P1-05"
      ]
    },
    {
      "id": "P0-10",
      "section": "daily",
      "priority": "P0",
      "title": "LINE案内を確認する",
      "keywords": [
        "LINE案内",
        "お礼",
        "次回予約",
        "休眠"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.nav.line",
      "what_you_can_do": "次回予約・お礼・休眠対策などのフォロー対象と文面を確認できます。",
      "when_to_use": "施術後やフォロー連絡を行う時。",
      "steps": [
        "「LINE案内」を開きます。",
        "対象の案内を確認します。",
        "必要な文面をコピーします。",
        "実際のLINE送信後、店舗運用に従って送信済み管理を行います。"
      ],
      "completion": "必要な案内文面を確認できれば完了です。",
      "cautions": [
        "ガイドや画面が勝手にLINE送信するものではありません。送信先を確認します。"
      ],
      "related": [
        "P0-11",
        "FAQ-08"
      ]
    },
    {
      "id": "P0-11",
      "section": "daily",
      "priority": "P0",
      "title": "次回予約希望を処理する",
      "keywords": [
        "次回予約",
        "予約希望を管理",
        "再来店"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.rebook.entry",
      "what_you_can_do": "前回内容を使った次回予約希望を確認し、連絡・本予約登録・確定まで管理できます。",
      "when_to_use": "お客様から次回予約希望が入った時。",
      "steps": [
        "「予約希望を管理」を開きます。",
        "確認待ちの内容と希望日時を確認します。",
        "お客様へ連絡後「連絡済み」として管理します。",
        "既存の電話・店頭予約画面で本予約を登録します。",
        "最後に次回予約希望を「確定済み」として管理します。"
      ],
      "completion": "本予約登録と次回予約希望の状態管理が完了すれば終了です。",
      "cautions": [
        "次回予約希望を「確定済み」にするだけで本予約が自動作成されるとは扱いません。"
      ],
      "related": [
        "P0-06",
        "P1-13",
        "FAQ-09"
      ]
    },
    {
      "id": "P1-02",
      "section": "chart",
      "priority": "P1",
      "title": "ペットカルテを記録する",
      "keywords": [
        "施術内容",
        "カルテ保存",
        "担当スタッフ"
      ],
      "audience": [
        "owner"
      ],
      "page": "pet-record.html",
      "target": "petsalon.record.today",
      "what_you_can_do": "施術内容をペットごと・来店ごとに記録できます。",
      "when_to_use": "施術中または施術終了時。",
      "steps": [
        "対象ペットのカルテを開きます。",
        "「本日のカルテ」で施術内容を確認・入力します。",
        "必要な注意事項を確認します。",
        "内容を確認して保存します。"
      ],
      "completion": "保存後、本日のカルテとして確認できれば完了です。",
      "cautions": [
        "別のペットを開いていないか、保存前にペット名を確認します。"
      ],
      "related": [
        "P1-03",
        "P1-04",
        "P1-05"
      ]
    },
    {
      "id": "P1-03",
      "section": "chart",
      "priority": "P1",
      "title": "施術写真を管理する",
      "keywords": [
        "写真",
        "施術前",
        "施術後",
        "アップロード"
      ],
      "audience": [
        "owner"
      ],
      "page": "pet-record.html",
      "target": "petsalon.record.photos",
      "what_you_can_do": "ペットの施術写真をカルテと関連付けて管理できます。",
      "when_to_use": "施術前後の記録写真を残す時。",
      "steps": [
        "対象ペットのカルテを開きます。",
        "「施術写真」タブを開きます。",
        "登録する写真と対象を確認します。",
        "必要な写真を登録し、一覧で確認します。"
      ],
      "completion": "写真が対象ペットのカルテで確認できれば完了です。",
      "cautions": [
        "実顧客写真はマニュアル素材へ転用しません。"
      ],
      "related": [
        "P1-02",
        "P1-05"
      ]
    },
    {
      "id": "P1-04",
      "section": "chart",
      "priority": "P1",
      "title": "ワクチン情報を確認する",
      "keywords": [
        "ワクチン",
        "証明書",
        "期限切れ"
      ],
      "audience": [
        "owner"
      ],
      "page": "pet-record.html",
      "target": "petsalon.record.vaccine",
      "what_you_can_do": "ワクチン証明・確認状態・期限切れ等をペットごとに確認できます。",
      "when_to_use": "施術前の確認や証明書情報を記録する時。",
      "steps": [
        "対象ペットのカルテを開きます。",
        "「ワクチン」タブを開きます。",
        "確認済み・未確認・期限切れ等の状態を確認します。",
        "必要な証明情報を店舗運用に従って登録します。"
      ],
      "completion": "必要なワクチン状態が確認できれば完了です。",
      "cautions": [
        "医療判断ではなく、店舗運用上の確認情報として扱います。"
      ],
      "related": [
        "P1-02",
        "P1-05"
      ]
    },
    {
      "id": "P1-05",
      "section": "chart",
      "priority": "P1",
      "title": "過去カルテを見る",
      "keywords": [
        "過去カルテ",
        "履歴",
        "前回"
      ],
      "audience": [
        "owner"
      ],
      "page": "pet-record.html",
      "target": "petsalon.record.history",
      "what_you_can_do": "過去の施術内容や関連記録を確認できます。",
      "when_to_use": "前回の仕上がりや注意事項を確認したい時。",
      "steps": [
        "対象ペットのカルテを開きます。",
        "「過去カルテ」タブを開きます。",
        "日付と内容を確認します。"
      ],
      "completion": "必要な過去情報が確認できれば完了です。",
      "cautions": [
        "古い記録を現在の状態と混同しないよう日付を確認します。"
      ],
      "related": [
        "P1-02",
        "P0-11"
      ]
    },
    {
      "id": "P1-06",
      "section": "qr",
      "priority": "P1",
      "title": "店頭QR受付を使う",
      "keywords": [
        "QR受付",
        "来店受付",
        "受付専用iPad"
      ],
      "audience": [
        "owner"
      ],
      "page": "reception.html",
      "target": "petsalon.reception.qr",
      "what_you_can_do": "店頭QRからお客様自身で本日の予約を確認し、来店受付できます。",
      "when_to_use": "受付の混雑を減らしたい時、QR受付を運用する時。",
      "steps": [
        "受付専用画面を開きます。",
        "QR受付がONか確認します。",
        "店頭にQRを掲示します。",
        "お客様の受付後、本日の店頭受付と施術進捗への反映を確認します。"
      ],
      "completion": "受付済みとして確認できれば完了です。",
      "cautions": [
        "公開QRはお客様用です。管理画面URLを掲示しません。"
      ],
      "related": [
        "P1-07",
        "P1-08",
        "P1-17"
      ]
    },
    {
      "id": "P1-07",
      "section": "qr",
      "priority": "P1",
      "title": "QRを印刷する",
      "keywords": [
        "QR印刷",
        "受付URL",
        "掲示"
      ],
      "audience": [
        "owner"
      ],
      "page": "reception.html",
      "target": "petsalon.reception.print-qr",
      "what_you_can_do": "店頭掲示用の来店受付QRを印刷できます。",
      "when_to_use": "初回設置時、QRを紛失・汚損した時。",
      "steps": [
        "受付専用画面を開きます。",
        "「QRを印刷」を押します。",
        "印刷プレビューでQRが欠けていないか確認します。",
        "店頭で読み取りやすい位置に掲示します。"
      ],
      "completion": "スマホで公開受付画面が開くことを確認できれば完了です。",
      "cautions": [
        "QRには公開受付URLを使います。"
      ],
      "related": [
        "P1-06",
        "FAQ-11"
      ]
    },
    {
      "id": "P1-08",
      "section": "qr",
      "priority": "P1",
      "title": "受付履歴を見る",
      "keywords": [
        "受付履歴",
        "QR履歴",
        "来店"
      ],
      "audience": [
        "owner"
      ],
      "page": "reception.html",
      "target": "petsalon.reception.today-board",
      "what_you_can_do": "本日や過去の来店受付状況を確認できます。",
      "when_to_use": "誰が受付済みか、過去受付を確認したい時。",
      "steps": [
        "受付専用画面を開きます。",
        "本日の受付一覧を確認します。",
        "過去を確認する時は「受付履歴」を開き、日付を選びます。"
      ],
      "completion": "対象の受付記録が確認できれば完了です。",
      "cautions": [
        "本日の受付操作はJSTの当日に固定されています。"
      ],
      "related": [
        "P1-06"
      ]
    },
    {
      "id": "P1-09",
      "section": "hotel",
      "priority": "P1",
      "title": "ペットホテル申込を確認する",
      "keywords": [
        "ホテル申込",
        "仮申込",
        "確認"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.nav.hotel",
      "what_you_can_do": "お客様から入ったホテル申込を確認し、店舗側の対応へ進めます。",
      "when_to_use": "ホテル申込が入った時。",
      "steps": [
        "「ホテル申込」を開きます。",
        "宿泊日・ペット・確認事項を確認します。",
        "定員や運用条件を確認します。",
        "店舗からお客様へ連絡し、確定内容を案内します。"
      ],
      "completion": "店舗側で申込内容と対応方針が確認できれば完了です。",
      "cautions": [
        "お客様の送信時点は仮申込です。"
      ],
      "related": [
        "P1-10",
        "P2-05",
        "FAQ-12"
      ]
    },
    {
      "id": "P1-10",
      "section": "hotel",
      "priority": "P1",
      "title": "本日お預かり・お迎え・宿泊中を見る",
      "keywords": [
        "お預かり",
        "お迎え",
        "宿泊中"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner-ipad.html",
      "target": "petsalon.ipad.hotel-staying",
      "what_you_can_do": "当日のチェックイン予定、チェックアウト予定、宿泊中のペットを現場で確認できます。",
      "when_to_use": "ホテル利用がある日の営業中。",
      "steps": [
        "現場用iPad画面を開きます。",
        "「本日お預かり」「本日お迎え」を確認します。",
        "「宿泊中の子」で現在の預かり状況を確認します。"
      ],
      "completion": "本日のホテル対応対象が把握できれば完了です。",
      "cautions": [
        "サロン予約とホテル預かりを取り違えないよう各欄を確認します。"
      ],
      "related": [
        "P1-09",
        "P2-05"
      ]
    },
    {
      "id": "P2-05",
      "section": "hotel",
      "priority": "P2",
      "title": "ホテル基本設定",
      "keywords": [
        "ホテル設定",
        "定員",
        "営業モード"
      ],
      "audience": [
        "owner"
      ],
      "page": "hotel-settings.html",
      "target": "petsalon.hotel-settings.basic",
      "what_you_can_do": "最大預かり頭数、定休日の宿泊継続、チェックイン/アウト、受け渡し時間を設定できます。",
      "when_to_use": "ホテル運用ルールを初期設定・変更する時。",
      "steps": [
        "ホテル営業設定を開きます。",
        "1日最大預かり頭数を確認します。",
        "ホテル営業モードを選びます。",
        "定休日の宿泊・IN・OUT可否と受け渡し時間を確認します。",
        "内容を確認して保存します。"
      ],
      "completion": "予約画面へ意図した運用が反映されれば完了です。",
      "cautions": [
        "設定変更は今後の受付可否に影響します。"
      ],
      "related": [
        "P2-06",
        "P1-09"
      ]
    },
    {
      "id": "P2-06",
      "section": "hotel",
      "priority": "P2",
      "title": "ホテル特別日を設定する",
      "keywords": [
        "特別日",
        "年末年始",
        "ホテル休業"
      ],
      "audience": [
        "owner"
      ],
      "page": "hotel-settings.html",
      "target": "petsalon.hotel-settings.special",
      "what_you_can_do": "年末年始や臨時対応など、特定日だけホテル基本設定を上書きできます。",
      "when_to_use": "通常ルールと違う日を設定する時。",
      "steps": [
        "日付を選びます。",
        "宿泊・チェックイン・チェックアウトの可否を必要な項目だけ設定します。",
        "必要なら受け渡し時間と理由を入力します。",
        "保存後「今後の特別日設定」で確認します。"
      ],
      "completion": "対象日が一覧に表示されれば完了です。",
      "cautions": [
        "空欄の項目は基本設定を継承する設計です。"
      ],
      "related": [
        "P2-05"
      ]
    },
    {
      "id": "P2-01",
      "section": "settings",
      "priority": "P2",
      "title": "店舗基本設定",
      "keywords": [
        "店舗名",
        "営業時間",
        "定休日"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.settings.basic",
      "what_you_can_do": "店舗名・営業時間・定休日を変更できます。",
      "when_to_use": "導入時、営業時間や定休日が変わった時。",
      "steps": [
        "「店舗設定」を開きます。",
        "「基本設定」を選びます。",
        "店舗名・営業時間・定休日を確認します。",
        "変更内容を保存します。"
      ],
      "completion": "保存完了表示と公開側への反映を確認できれば完了です。",
      "cautions": [
        "営業時間変更は予約受付にも影響します。"
      ],
      "related": [
        "P2-02",
        "P2-04"
      ]
    },
    {
      "id": "P2-02",
      "section": "settings",
      "priority": "P2",
      "title": "予約ルール",
      "keywords": [
        "予約上限",
        "予約枠",
        "多頭予約"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.settings.rules",
      "what_you_can_do": "1日の予約上限、同時受付数、予約枠、多頭予約等を調整できます。",
      "when_to_use": "予約の受け方を変更する時。",
      "steps": [
        "「店舗設定」→「予約ルール」を開きます。",
        "現在の上限・枠を確認します。",
        "必要な項目だけ変更します。",
        "保存後、予約画面の受付状態を確認します。"
      ],
      "completion": "意図した予約ルールが公開予約画面へ反映されれば完了です。",
      "cautions": [
        "受付枠を小さくし過ぎると予約できる時間が減ります。"
      ],
      "related": [
        "P2-01",
        "P2-03"
      ]
    },
    {
      "id": "P2-03",
      "section": "settings",
      "priority": "P2",
      "title": "メニュー・料金",
      "keywords": [
        "メニュー",
        "料金",
        "編集"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.settings.menus",
      "what_you_can_do": "予約画面に出すメニュー名・料金等を編集できます。",
      "when_to_use": "料金改定、メニュー追加・停止時。",
      "steps": [
        "「店舗設定」→「メニュー・料金」を開きます。",
        "編集したい行だけ開きます。",
        "名称・料金・受付状態等を確認します。",
        "保存後、公開予約画面で確認します。"
      ],
      "completion": "公開予約画面に正しいメニュー・料金が表示されれば完了です。",
      "cautions": [
        "既存予約に対する扱いは店舗運用を確認してから変更します。"
      ],
      "related": [
        "P2-02"
      ]
    },
    {
      "id": "P2-04",
      "section": "settings",
      "priority": "P2",
      "title": "臨時休業日",
      "keywords": [
        "臨時休業",
        "年末年始",
        "休み"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "petsalon.owner.settings.closed",
      "what_you_can_do": "年末年始や急な休みを予約フォームへ反映できます。",
      "when_to_use": "通常定休日以外を休業にする時。",
      "steps": [
        "「店舗設定」→「臨時休業日」を開きます。",
        "対象日を登録します。",
        "必要に応じて営業日に戻す操作を使います。",
        "公開予約画面で対象日を確認します。"
      ],
      "completion": "対象日に予約受付されない状態を確認できれば完了です。",
      "cautions": [
        "ホテル営業は別設定の場合があります。ホテル利用がある店舗はホテル設定も確認します。"
      ],
      "related": [
        "P2-01",
        "P2-06"
      ]
    },
    {
      "id": "P2-07",
      "section": "trouble",
      "priority": "P2",
      "title": "認証切れ・再ログイン",
      "keywords": [
        "認証切れ",
        "セッション",
        "再ログイン"
      ],
      "audience": [
        "owner"
      ],
      "page": "owner.html",
      "target": "existing-id:#dproAuthSessionBar",
      "what_you_can_do": "認証セッションが切れた時に共通ログインから入り直せます。",
      "when_to_use": "管理画面がログイン画面へ戻った時、認証エラーが出た時。",
      "steps": [
        "表示中の作業内容を確認します。",
        "共通オーナーログイン画面で再度ログインします。",
        "元のPET SALON管理画面へ戻ったことを確認します。",
        "同じ店舗の画面であることを確認して操作を再開します。"
      ],
      "completion": "「DPRO認証中」と表示されれば再ログイン完了です。",
      "cautions": [
        "何度も繰り返す場合はDPROサポート確認対象です。"
      ],
      "related": [
        "FAQ-01"
      ]
    },
    {
      "id": "P1-11",
      "section": "customer",
      "priority": "P1",
      "title": "お客様のLINEメニューを理解する",
      "keywords": [
        "LINEメニュー",
        "予約する",
        "会員証"
      ],
      "audience": [
        "owner"
      ],
      "page": "menu.html",
      "target": "petsalon.public.menu",
      "what_you_can_do": "お客様がLINEから開く予約・会員証・変更キャンセル・ホテル・相談の入口を確認できます。",
      "when_to_use": "お客様から「どこを押すの？」と聞かれた時。",
      "steps": [
        "お客様用LINEメニューの構成を確認します。",
        "「予約する」「会員証を見る」「予約変更・キャンセル」「ペットホテル申込」の役割を確認します。",
        "スタッフ用/管理用URLはお客様メニューに出さないことを確認します。"
      ],
      "completion": "お客様へ案内する入口を説明できれば完了です。",
      "cautions": [
        "管理画面URLをお客様へ送らないでください。"
      ],
      "related": [
        "P1-14",
        "P1-15",
        "P1-12"
      ]
    },
    {
      "id": "P1-12",
      "section": "customer",
      "priority": "P1",
      "title": "お客様の予約変更・キャンセル希望を理解する",
      "keywords": [
        "変更",
        "キャンセル",
        "希望受付"
      ],
      "audience": [
        "owner"
      ],
      "page": "manage.html",
      "target": "petsalon.public.manage.lookup",
      "what_you_can_do": "お客様が現在予約を確認し、変更希望またはキャンセル希望を送る流れを理解できます。",
      "when_to_use": "お客様から変更・キャンセル方法を聞かれた時。",
      "steps": [
        "お客様はLINE内では本人確認、通常ブラウザでは電話番号で予約を確認します。",
        "対象予約を選びます。",
        "変更希望またはキャンセル希望を送ります。",
        "店舗側で希望を確認し、必要な対応を行います。"
      ],
      "completion": "「希望受付」であり店舗確認が必要だと説明できれば完了です。",
      "cautions": [
        "お客様の送信だけで店舗側予約が自動確定・自動取消になると案内しません。"
      ],
      "related": [
        "FAQ-13",
        "P0-04"
      ]
    },
    {
      "id": "P1-13",
      "section": "customer",
      "priority": "P1",
      "title": "お客様の次回予約希望画面を理解する",
      "keywords": [
        "次回予約希望",
        "前回と同じ",
        "最大3件"
      ],
      "audience": [
        "owner"
      ],
      "page": "repeat-booking.html",
      "target": "petsalon.public.rebook.request",
      "what_you_can_do": "お客様が前回施術内容を見ながら次回予約希望を送る流れを理解できます。",
      "when_to_use": "次回予約の案内をする時。",
      "steps": [
        "電話番号で登録ペットを確認します。",
        "予約するペットを選びます。",
        "「前回と同じ内容」または「内容を変更する」を選びます。",
        "希望日時を最大3件入力して送ります。",
        "店舗側は「次回予約希望管理」で処理します。"
      ],
      "completion": "お客様画面と店舗管理画面のつながりを説明できれば完了です。",
      "cautions": [
        "送信時点では予約確定ではありません。"
      ],
      "related": [
        "P0-11",
        "FAQ-09"
      ]
    },
    {
      "id": "P1-14",
      "section": "customer",
      "priority": "P1",
      "title": "お客様の予約画面を理解する",
      "keywords": [
        "予約フォーム",
        "多頭予約",
        "希望日時"
      ],
      "audience": [
        "owner"
      ],
      "page": "index.html",
      "target": "petsalon.public.booking.pets",
      "what_you_can_do": "飼い主情報、希望日時、最大3頭のペットとメニューをまとめて予約希望として送る流れを理解できます。",
      "when_to_use": "予約画面の使い方をお客様へ案内する時。",
      "steps": [
        "飼い主情報を確認します。",
        "希望日時を選びます。",
        "ペットごとにメニューを選びます。",
        "送信前確認を見て予約希望を送ります。"
      ],
      "completion": "お客様の予約希望入力の順番を説明できれば完了です。",
      "cautions": [
        "予約希望と店舗確定を区別して説明します。"
      ],
      "related": [
        "P1-11",
        "P1-15"
      ]
    },
    {
      "id": "P1-15",
      "section": "customer",
      "priority": "P1",
      "title": "お客様のペット会員証を理解する",
      "keywords": [
        "会員証",
        "ペット写真",
        "現在予約"
      ],
      "audience": [
        "owner"
      ],
      "page": "member.html",
      "target": "petsalon.public.member.card",
      "what_you_can_do": "複数ペットの会員証、現在予約、ホテル申込、前回内容、次回行動をお客様が確認する画面を理解できます。",
      "when_to_use": "会員証や登録情報について問い合わせを受けた時。",
      "steps": [
        "LINE公式メニューから「会員証を見る」を開きます。",
        "対象ペットを切り替えます。",
        "現在予約・ホテル申込・次の行動を確認します。"
      ],
      "completion": "会員証から確認できる範囲を説明できれば完了です。",
      "cautions": [
        "本番ではLINE本人確認を基本とします。"
      ],
      "related": [
        "P1-11",
        "P1-14"
      ]
    },
    {
      "id": "P1-16",
      "section": "customer",
      "priority": "P1",
      "title": "お客様のホテル申込画面を理解する",
      "keywords": [
        "ホテル申込",
        "宿泊日時",
        "緊急連絡先"
      ],
      "audience": [
        "owner"
      ],
      "page": "hotel.html",
      "target": "petsalon.public.hotel.stay",
      "what_you_can_do": "飼い主情報、宿泊日時、対象ペット、緊急連絡先等を送る流れを理解できます。",
      "when_to_use": "ホテル申込方法を案内する時。",
      "steps": [
        "飼い主情報を確認します。",
        "宿泊日時を入力します。",
        "対象ペットと宿泊時の確認事項を入力します。",
        "緊急連絡先等を確認し、送信前確認から申込を送ります。"
      ],
      "completion": "ホテルが仮申込であることを含めて説明できれば完了です。",
      "cautions": [
        "店舗確認後に確定します。"
      ],
      "related": [
        "P1-09",
        "FAQ-12"
      ]
    },
    {
      "id": "P1-17",
      "section": "customer",
      "priority": "P1",
      "title": "お客様のQR来店受付を理解する",
      "keywords": [
        "来店受付",
        "電話番号",
        "QR"
      ],
      "audience": [
        "owner"
      ],
      "page": "checkin.html",
      "target": "petsalon.public.checkin.lookup",
      "what_you_can_do": "お客様が店頭QRから電話番号で本日の予約を照合し、受付する流れを理解できます。",
      "when_to_use": "店頭でQR受付を案内する時。",
      "steps": [
        "QRから公開受付画面を開きます。",
        "予約時の電話番号を入力し、同意欄を確認します。",
        "本日の対象予約を選び「来店受付をする」を押します。"
      ],
      "completion": "受付後、店舗側の受付一覧/施術進捗に反映される流れを説明できれば完了です。",
      "cautions": [
        "QR受付が停止中の場合は店舗スタッフへ案内する表示になります。"
      ],
      "related": [
        "P1-06",
        "P1-08"
      ]
    }
  ],
  "faq": [
    {
      "id": "FAQ-01",
      "category": "ログイン",
      "question": "ログインできない",
      "first_check": "保護されたPET SALON管理画面を開いた時に、DPRO共通オーナーログイン画面へ移動するか確認します。",
      "steps": [
        "正しい店舗用の共通オーナーログインでログインします。",
        "ログイン後にPET SALON管理画面へ戻るか確認します。",
        "右下に「DPRO認証中」が表示されるか確認します。"
      ],
      "unresolved": "繰り返しログイン画面へ戻る場合は、画面を何度も操作せずDPROサポートへ連絡します。",
      "related": [
        "P0-03",
        "P2-07"
      ]
    },
    {
      "id": "FAQ-02",
      "category": "予約",
      "question": "今日の予約がない・見つからない",
      "first_check": "「今日の管理」の日付と「本日の確定予約」「新着予約希望」を確認します。",
      "steps": [
        "確定前の予約希望ではないか確認します。",
        "別日なら「日別予約」で日付を確認します。",
        "電話・店頭予約が未登録なら「電話受付」から登録します。"
      ],
      "unresolved": "正しい日付・電話番号でも見つからない場合は、登録状況をDPROサポートと確認します。",
      "related": [
        "P0-04",
        "P1-01",
        "P0-06"
      ]
    },
    {
      "id": "FAQ-03",
      "category": "顧客",
      "question": "顧客・ペットが見つからない",
      "first_check": "電話番号、飼い主名、ペット名の入力違いがないか確認します。",
      "steps": [
        "「顧客検索」を開きます。",
        "電話番号だけ、名前だけ等、条件を減らして検索します。",
        "別表記の名前や犬種でも確認します。"
      ],
      "unresolved": "登録済みのはずなのに見つからない場合はDPROサポートへ確認します。",
      "related": [
        "P0-07"
      ]
    },
    {
      "id": "FAQ-04",
      "category": "予約",
      "question": "新着予約希望はどこで確定する？",
      "first_check": "「今日の管理」の「新着予約希望・確認待ち」を確認します。",
      "steps": [
        "予約希望の内容を確認します。",
        "店舗で受けられる内容か確認します。",
        "画面の予約確定操作を、内容確認後に実行します。"
      ],
      "unresolved": "確定操作が表示されない場合は予約状態を確認し、解決しなければDPROサポートへ連絡します。",
      "related": [
        "P0-05"
      ]
    },
    {
      "id": "FAQ-05",
      "category": "予約",
      "question": "電話予約はどこから登録する？",
      "first_check": "オーナー管理画面上部の「電話受付」を確認します。",
      "steps": [
        "「電話受付」を開きます。",
        "必要事項を入力します。",
        "「登録前確認」を見ます。",
        "内容が正しい時だけ登録します。"
      ],
      "unresolved": "登録できない場合は日時・必須項目・予約上限を確認します。",
      "related": [
        "P0-06",
        "P2-02"
      ]
    },
    {
      "id": "FAQ-06",
      "category": "施術",
      "question": "施術進捗の4ボタンは何？",
      "first_check": "「今日の施術進捗」の予約カードを確認します。",
      "steps": [
        "来店時は「受付する」。",
        "施術開始時は「施術開始」。",
        "お迎え可能になったら「お迎え可能」。",
        "お渡し後は「お渡し完了」。"
      ],
      "unresolved": "実際の状態と違う更新をした場合は、追加操作を重ねずDPROサポートへ相談します。",
      "related": [
        "P0-08"
      ]
    },
    {
      "id": "FAQ-07",
      "category": "カルテ",
      "question": "カルテはどこから開く？",
      "first_check": "「今日の施術進捗」に対象ペットの予約カードがあるか確認します。",
      "steps": [
        "対象ペットの予約カードを確認します。",
        "「施術カルテを開く」を押します。"
      ],
      "unresolved": "予約カードがない日は入口が出ない場合があります。対象ペット・日付を確認します。",
      "related": [
        "P0-09",
        "P1-02"
      ]
    },
    {
      "id": "FAQ-08",
      "category": "LINE",
      "question": "LINE案内はどこ？",
      "first_check": "上部の「LINE案内」タブを確認します。",
      "steps": [
        "「LINE案内」を開きます。",
        "対象のフォローを確認します。",
        "必要な文面は「文面テンプレ」でも確認します。"
      ],
      "unresolved": "対象が表示されない場合は、その日に送る案内がない可能性もあります。",
      "related": [
        "P0-10"
      ]
    },
    {
      "id": "FAQ-09",
      "category": "次回予約",
      "question": "次回予約希望はどこで確認する？",
      "first_check": "「今日の管理」の「次回来店・前回と同じ内容で予約希望」欄を確認します。",
      "steps": [
        "「予約希望を管理」を開きます。",
        "確認待ちを確認します。",
        "連絡 → 本予約登録 → 確定済みの順で処理します。"
      ],
      "unresolved": "申込があるはずなのに出ない場合は、検索条件や状態を確認します。",
      "related": [
        "P0-11",
        "P1-13"
      ]
    },
    {
      "id": "FAQ-10",
      "category": "QR受付",
      "question": "QR受付を停止・再開したい",
      "first_check": "受付専用iPadの「店頭QR受付」を確認します。",
      "steps": [
        "受付専用画面を開きます。",
        "QR受付の設定状態を確認します。",
        "「設定確認中」/QR受付切替の操作で意図したON/OFFへ変更します。"
      ],
      "unresolved": "公開受付画面の状態も合わせて確認します。",
      "related": [
        "P1-06"
      ]
    },
    {
      "id": "FAQ-11",
      "category": "QR受付",
      "question": "QRを再印刷したい",
      "first_check": "受付専用iPadの「店頭QR受付」欄を確認します。",
      "steps": [
        "「QRを印刷」を押します。",
        "印刷後、スマホで読み取り確認します。"
      ],
      "unresolved": "読み取れない場合は、印刷倍率・QR欠け・掲示状態を確認します。",
      "related": [
        "P1-07"
      ]
    },
    {
      "id": "FAQ-12",
      "category": "ホテル",
      "question": "ホテルは申込時点で確定？",
      "first_check": "お客様画面ではホテルは仮申込として送信されます。",
      "steps": [
        "店舗側で申込内容・定員・日程を確認します。",
        "LINEまたは電話でお客様へ確定内容を連絡します。"
      ],
      "unresolved": "判断に迷う場合は店舗のホテル運用ルールを確認します。",
      "related": [
        "P1-09",
        "P1-16",
        "P2-05"
      ]
    },
    {
      "id": "FAQ-13",
      "category": "予約変更",
      "question": "変更・キャンセル希望を受けた後は？",
      "first_check": "お客様の送信は「希望受付」であり、店舗側確認が必要です。",
      "steps": [
        "対象予約と希望内容を確認します。",
        "店舗側で実際の予約変更・キャンセル対応を行います。",
        "必要な連絡をお客様へ返します。"
      ],
      "unresolved": "希望受付だけを見て対応完了と判断しないでください。",
      "related": [
        "P1-12"
      ]
    },
    {
      "id": "FAQ-14",
      "category": "表示",
      "question": "マニュアルと画面が違う",
      "first_check": "マニュアルのProduct / Guide Version / Updated Dateと、現在使っているシステムを確認します。",
      "steps": [
        "Online Guideで同じ記事を確認します。",
        "ブラウザを再読み込みして表示を確認します。",
        "それでも大きく違う場合は画面名と該当箇所を控えます。"
      ],
      "unresolved": "DPROサポートへ「画面名」と「どこが違うか」を伝えます。実顧客個人情報を含むスクリーンショットは必要最小限にします。",
      "related": [
        "P0-01"
      ]
    }
  ],
  "print": {
    "paper": "A4_PORTRAIT",
    "source_of_truth": "PET_SALON_CONTENT_PACKAGE_V1.0.json",
    "proposed_sections": [
      {
        "order": 1,
        "title": "表紙",
        "source": [
          "product_name",
          "guide_version",
          "updated_at",
          "online_guide_qr"
        ]
      },
      {
        "order": 2,
        "title": "このマニュアルの使い方",
        "source": [
          "P0-01",
          "P0-03"
        ]
      },
      {
        "order": 3,
        "title": "最初の10分",
        "source": [
          "P0-02",
          "first10 tutorial chapter summaries"
        ]
      },
      {
        "order": 4,
        "title": "毎日の業務",
        "source": [
          "P0-04",
          "P0-05",
          "P0-06",
          "P0-07",
          "P0-08",
          "P0-09",
          "P0-10",
          "P0-11",
          "P1-01"
        ]
      },
      {
        "order": 5,
        "title": "ペットカルテ",
        "source": [
          "P1-02",
          "P1-03",
          "P1-04",
          "P1-05"
        ]
      },
      {
        "order": 6,
        "title": "QR受付・ペットホテル",
        "source": [
          "P1-06",
          "P1-07",
          "P1-08",
          "P1-09",
          "P1-10",
          "P2-05",
          "P2-06"
        ]
      },
      {
        "order": 7,
        "title": "店舗設定",
        "source": [
          "P2-01",
          "P2-02",
          "P2-03",
          "P2-04"
        ]
      },
      {
        "order": 8,
        "title": "お客様側画面",
        "source": [
          "P1-11",
          "P1-14",
          "P1-15",
          "P1-12",
          "P1-16",
          "P1-17",
          "P1-13"
        ]
      },
      {
        "order": 9,
        "title": "困ったとき",
        "source": [
          "FAQ-01",
          "FAQ-02",
          "FAQ-03",
          "FAQ-04",
          "FAQ-05",
          "FAQ-06",
          "FAQ-07",
          "FAQ-08",
          "FAQ-09",
          "FAQ-10",
          "FAQ-11",
          "FAQ-12",
          "FAQ-13",
          "FAQ-14"
        ]
      },
      {
        "order": 10,
        "title": "Online Guide・版情報",
        "source": [
          "online_guide_qr",
          "guide_version",
          "updated_at"
        ]
      }
    ],
    "screenshot_policy": {
      "use_real_ui": true,
      "demo_or_fictitious_data_only": true,
      "no_real_customer_pii": true,
      "annotation": "number/callout, not coordinate dependency for runtime",
      "required_screens": [
        "common owner login",
        "owner.html today",
        "owner.html manual",
        "owner.html customer search",
        "owner/owner-ipad workflow",
        "pet-record.html",
        "rebook-admin.html",
        "owner.html LINE",
        "owner.html settings index"
      ]
    },
    "qr_url": "https://dpromstk2000-lab.github.io/dpro-pet-salon-liff/guide-center.html?shop_code=pet_salon_demo"
  },
  "roleNote": "No independent staff.html/staff role was confirmed in the audited current repository; V1 owner guide does not invent one."
});
})();

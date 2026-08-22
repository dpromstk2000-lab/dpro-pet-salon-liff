/* DPRO TUTORIAL CONTENT / PET SALON
 * Version: PETSALON-TUTORIAL-V1.0 / PHASE 4 R2 no-overlap
 * Generated from PET_SALON_CONTENT_PACKAGE_V1.0.json.
 */
(() => {
  "use strict";
  window.DPRO_TUTORIAL_CONTENT = Object.freeze({
  "productId": "PETSALON",
  "productName": "DPRO PET SALON LINE",
  "guideVersion": "PETSALON-TUTORIAL-V1.0",
  "tutorial": {
    "id": "petsalon-first-10-minutes-owner",
    "guide_version": "PETSALON-TUTORIAL-V1.0",
    "audience": [
      "owner"
    ],
    "start_page": "owner.html",
    "cross_page": false,
    "estimated_minutes": 10,
    "chapters": [
      "01_LOGIN",
      "02_TODAY",
      "03_MANUAL_BOOKING",
      "04_CUSTOMER_SEARCH",
      "05_TREATMENT_FLOW",
      "06_REBOOK",
      "07_LINE"
    ],
    "start_condition": {
      "authenticated": true,
      "system": "PETSALON",
      "page": "owner.html"
    },
    "finish_condition": "ft10-15-complete acknowledged",
    "steps": [
      {
        "id": "ft10-01-login",
        "chapter": "01_LOGIN",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "existing-id:#dproAuthSessionBar",
        "title": "ログインできました",
        "body": "この管理画面はDPRO共通オーナーログインで開きます。画面右下に「DPRO認証中」と表示されていればログイン済みです。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-02-today-nav",
        "chapter": "02_TODAY",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.nav.today",
        "title": "最初は「今日の管理」",
        "body": "毎日の開始地点は「今日の管理」です。予約・施術・未対応の連絡を、まずここで確認します。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-03-workflow",
        "chapter": "02_TODAY",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.today.workflow",
        "title": "今日の施術進捗",
        "body": "来店後の進み具合はこの欄で確認します。「受付する → 施術開始 → お迎え可能 → お渡し完了」の順です。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-04-tasks",
        "chapter": "02_TODAY",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.today.tasks",
        "title": "未対応を先に確認",
        "body": "「今日やること」には、予約希望・変更/キャンセル希望・ホテル申込・LINE送信待ちなどの未対応がまとまります。件数が0でも正常です。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-05-manual-nav",
        "chapter": "03_MANUAL_BOOKING",
        "type": "ACTION",
        "page": "owner.html",
        "target": "petsalon.owner.nav.manual",
        "title": "電話・店頭予約は「電話受付」",
        "body": "電話や店頭で予約を受けた時は「電話受付」を開きます。今は場所の確認だけなので、予約は登録しません。",
        "advance": "TARGET_CLICK",
        "allowed_action": "UI_TAB_NAVIGATION_ONLY",
        "mutation": "UI_ONLY",
        "completion": "tab_manual_active"
      },
      {
        "id": "ft10-06-manual-form",
        "chapter": "03_MANUAL_BOOKING",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.manual.form",
        "title": "入力して、登録前に確認",
        "body": "ここで電話・店頭予約を入力します。右側の「登録前確認」で内容を確認してから登録する流れです。ガイド中は送信しません。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-07-customer-nav",
        "chapter": "04_CUSTOMER_SEARCH",
        "type": "ACTION",
        "page": "owner.html",
        "target": "petsalon.owner.nav.customer-search",
        "title": "お客様を探す時は「顧客検索」",
        "body": "電話番号だけでなく、飼い主名・LINE名・ペット名・犬種でも探せます。「顧客検索」を開いてください。",
        "advance": "TARGET_CLICK",
        "allowed_action": "UI_TAB_NAVIGATION_ONLY",
        "mutation": "UI_ONLY",
        "completion": "tab_customerSearch_active"
      },
      {
        "id": "ft10-08-customer-search",
        "chapter": "04_CUSTOMER_SEARCH",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.customer.search",
        "title": "顧客・ペットをまとめて検索",
        "body": "予約が入っていない日でも、ここから登録済みの飼い主・ペットを探せます。実際のお客様情報を練習用に入力する必要はありません。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-09-back-today",
        "chapter": "05_TREATMENT_FLOW",
        "type": "ACTION",
        "page": "owner.html",
        "target": "petsalon.owner.nav.today",
        "title": "施術の流れへ戻ります",
        "body": "「今日の管理」に戻り、現場で使う4つの進捗とカルテの入口を確認します。",
        "advance": "TARGET_CLICK",
        "allowed_action": "UI_TAB_NAVIGATION_ONLY",
        "mutation": "UI_ONLY",
        "completion": "tab_dashboard_active"
      },
      {
        "id": "ft10-10-four-actions",
        "chapter": "05_TREATMENT_FLOW",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.today.workflow",
        "title": "進捗は4つだけ覚える",
        "body": "基本操作は「受付する」「施術開始」「お迎え可能」「お渡し完了」の4つです。ガイドはこれらのボタンを自動では押しません。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-11-chart-entry",
        "chapter": "05_TREATMENT_FLOW",
        "type": "INFO",
        "page": "owner.html",
        "target": "petsalon.owner.today.workflow",
        "title": "カルテも同じ予約カードから",
        "body": "予約カードに表示される「施術カルテを開く」から、そのペットのカルテへ進めます。予約がない日はボタンが出なくても問題ありません。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-12-rebook",
        "chapter": "06_REBOOK",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.rebook.entry",
        "title": "次回予約希望の管理場所",
        "body": "お客様が「前回と同じ内容」などで次回予約希望を送った場合は、ここから「予約希望を管理」を開きます。確認待ち → 連絡済み → 本予約登録 → 確定済みの順で処理します。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-13-line-nav",
        "chapter": "07_LINE",
        "type": "ACTION",
        "page": "owner.html",
        "target": "petsalon.owner.nav.line",
        "title": "最後にLINE案内",
        "body": "次回予約・お礼・休眠対策などのフォローは「LINE案内」で確認します。開いてください。",
        "advance": "TARGET_CLICK",
        "allowed_action": "UI_TAB_NAVIGATION_ONLY",
        "mutation": "UI_ONLY",
        "completion": "tab_followups_active"
      },
      {
        "id": "ft10-14-line-list",
        "chapter": "07_LINE",
        "type": "FOCUS",
        "page": "owner.html",
        "target": "petsalon.owner.line.list",
        "title": "送る内容を確認する場所",
        "body": "LINE案内では、コピー済み・送信済みの管理ができます。文面そのものは「文面テンプレ」からも確認できます。ガイドがLINEを送信することはありません。",
        "advance": "NEXT_BUTTON",
        "mutation": "NONE",
        "completion": "card_seen"
      },
      {
        "id": "ft10-15-complete",
        "chapter": "COMPLETE",
        "type": "INFO",
        "page": "owner.html",
        "target": "petsalon.owner.page",
        "title": "最初の10分は完了です",
        "body": "毎日は「今日の管理」から始めれば大丈夫です。QR受付・ホテル・写真・ワクチン・店舗設定は「？ 操作ガイド」から必要な時に確認できます。",
        "advance": "COMPLETE_BUTTON",
        "mutation": "NONE",
        "completion": "tutorial_complete"
      }
    ],
    "safety": {
      "auto_business_mutation": false,
      "auto_form_submit": false,
      "auto_action_button_click": false,
      "allowed_user_actions_during_tour": [
        "owner tab navigation"
      ],
      "empty_state_is_valid": true,
      "real_customer_data_required": false,
      "demo_prepare_required": false
    }
  },
  "bindings": [
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.page",
      "existing_locator": "body",
      "phase4_action": "ADD_TO_ROOT",
      "kind": "page"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.today",
      "existing_locator": ".tab[data-tab=\"dashboard\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.manual",
      "existing_locator": ".tab[data-tab=\"manual\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.customer-search",
      "existing_locator": ".tab[data-tab=\"customerSearch\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.day",
      "existing_locator": ".tab[data-tab=\"day\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.hotel",
      "existing_locator": ".tab[data-tab=\"hotel\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.line",
      "existing_locator": ".tab[data-tab=\"followups\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.templates",
      "existing_locator": ".tab[data-tab=\"templates\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.nav.settings",
      "existing_locator": ".tab[data-tab=\"settings\"]",
      "phase4_action": "ADD",
      "kind": "nav"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.today.workflow",
      "existing_locator": "#nextWorkflowCard",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.today.tasks",
      "existing_locator": "#todayTasksBox",
      "phase4_action": "ADD_TO_NEAREST_CARD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.today.pending",
      "existing_locator": "#pendingReservations",
      "phase4_action": "ADD_TO_NEAREST_CARD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.today.confirmed",
      "existing_locator": "#todayReservations",
      "phase4_action": "ADD_TO_NEAREST_CARD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.today.line",
      "existing_locator": "#pendingFollowups",
      "phase4_action": "ADD_TO_NEAREST_CARD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.line.list",
      "existing_locator": "#tab-followups .card",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.manual.form",
      "existing_locator": "#tab-manual .grid.sidebar",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.customer.search",
      "existing_locator": "#tab-customerSearch .card",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.rebook.entry",
      "existing_locator": "#step7RebookEntry",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.rebook.manage",
      "existing_locator": "#step7RebookAdminLink",
      "phase4_action": "ADD",
      "kind": "navigation"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.settings.index",
      "existing_locator": ".settings-index",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.settings.basic",
      "existing_locator": "#settings-panel-basic",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.settings.rules",
      "existing_locator": "#settings-panel-rules",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.settings.hotel",
      "existing_locator": "#settings-panel-hotel",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.settings.menus",
      "existing_locator": "#settings-panel-menus",
      "phase4_action": "ADD",
      "kind": "container"
    },
    {
      "page": "owner.html",
      "guide_id": "petsalon.owner.settings.closed",
      "existing_locator": "#settings-panel-closed",
      "phase4_action": "ADD",
      "kind": "container"
    }
  ],
  "runtime": {
    "tutorial_engine": {
      "business_mutation_policy": "NEVER_AUTO_EXECUTE",
      "allowed_automatic_behaviors": [
        "focus target",
        "scrollIntoView",
        "overlay placement",
        "progress persistence",
        "center fallback notice"
      ],
      "allowed_user_actions_for_ACTION_steps": [
        "owner navigation tab click",
        "explicit page navigation link click"
      ],
      "forbidden_automatic_behaviors": [
        "form submit",
        "reservation create/update/delete",
        "workflow status update",
        "LINE send",
        "QR toggle",
        "settings save",
        "demo_prepare",
        "demo_cleanup",
        "file upload"
      ],
      "target_missing": {
        "default": "SKIP_WITH_NOTICE",
        "first10_required_nav": "FALLBACK_CENTER_AND_CONTINUE",
        "log_for_QA": true
      },
      "empty_state": "VALID_AND_CONTINUE",
      "page_navigation": {
        "first10": "NO_CROSS_PAGE",
        "feature_guides": "USER_INITIATED_ONLY",
        "state_keys": [
          "tutorial_session_id",
          "journey_id",
          "step_index",
          "guide_version"
        ],
        "transport": "sessionStorage preferred; query params only opaque tutorial_resume token if required"
      }
    },
    "progress": {
      "storage": "localStorage adapter V1.0",
      "key_template": "dpro_tutorial_progress:PETSALON:{facility}:owner",
      "welcome_key_template": "dpro_tutorial_welcome:PETSALON:{facility}:owner",
      "fields": [
        "tutorial_id",
        "guide_version",
        "status",
        "last_step_id",
        "started_at",
        "completed_at",
        "skipped_at"
      ],
      "states": [
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
        "SKIPPED"
      ],
      "multi_device_sync": "NOT_IN_V1",
      "db_api_change_required": false
    },
    "welcome": {
      "title": "はじめての方へ",
      "body": "最初に必要な操作を約10分で確認できます。予約や送信を勝手に実行することはありません。",
      "primary": "10分ガイドを始める",
      "secondary": "あとで見る",
      "link": "操作ガイドを開く",
      "repeat": "Guide Centerからいつでも再実行",
      "show": "authenticated owner + current guide_version not completed and welcome not dismissed"
    },
    "responsive": {
      "desktop": "target-adjacent card with auto flip",
      "tablet": "target-adjacent; bottom fallback when target small",
      "mobile": "bottom sheet + target auto-scroll",
      "keyboard": [
        "Esc closes",
        "Tab focus trapped in dialog controls",
        "Enter activates focused tutorial control"
      ],
      "reduced_motion": true
    }
  }
});
})();

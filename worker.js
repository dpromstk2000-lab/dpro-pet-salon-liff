// ============================================================
// DPRO PET SALON LINE
// STEP PETSALON-BRUSHUP-5-R1
// Additive Extension Worker (safe sidecar API)
// Version: PETSALON-BRUSHUP-5-R1-JST-DEMO-WORKER-20260721
//
// This Worker DOES NOT replace the existing dpro-pet-salon-api Worker.
// It handles pet charts, before/after photos, vaccinations, workflow and check-in APIs.
// Existing reservation, member, hotel and pet-photo APIs remain on the
// legacy Worker until the final integration step.
// ============================================================

const WORKER_VERSION = "PETSALON-BRUSHUP-5-R1-JST-DEMO-WORKER-20260721";
const DEFAULT_LEGACY_WORKER_BASE_URL = "https://dpro-pet-salon-api.dpromstk2000.workers.dev";
const DEMO_MARKER = "DPRO_STEP5_R1_DEMO";
const DEMO_PHONE = "09050050501";
const DEMO_OWNER_NAME = "STEP5確認用";
const DEMO_PET_NAME = "カルテ確認犬";
const DEMO_IMAGE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zcx8AAAAASUVORK5CYII=";
const SERVICE_NAME = "DPRO PET SALON NEXT EXTENSION API";
const DEFAULT_SHOP_CODE = "pet_salon_demo";
const RECORD_PHOTO_BUCKET = "petsalon-record-photos";
const DEFAULT_PHOTO_LIMIT = 500000;
const HARD_PHOTO_LIMIT = 524288;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const WORKFLOW_STATUSES = new Set([
  "requested", "confirmed", "checked_in", "counseling", "waiting",
  "grooming", "final_check", "pickup_ready", "handed_over",
  "cancelled", "no_show"
]);
const SIMPLE4_STATUSES = new Set(["checked_in", "grooming", "pickup_ready", "handed_over"]);
const PHOTO_TYPES = new Set(["before", "after", "chart", "certificate", "other"]);
const VACCINATION_TYPES = new Set(["rabies", "combination", "other"]);
const VERIFICATION_STATUSES = new Set(["unconfirmed", "confirmed", "expired", "not_required"]);
const NOTIFICATION_TYPES = new Set([
  "reservation_confirmed", "checkin_received", "delay_notice",
  "pickup_ready", "visit_thanks", "next_recommend", "custom"
]);
const STAFF_ROLES = new Set(["owner", "manager", "groomer", "assistant", "reception"]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store"
};

class AppError extends Error {
  constructor(status, message, detail = null) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.detail = detail;
  }
}

export default {
  async fetch(request, env, ctx) {
    const startedAt = Date.now();

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
      const url = new URL(request.url);
      const path = normalizePath(url.pathname);
      const method = request.method.toUpperCase();

      if (method === "GET" && (path === "/" || path === "/api/health")) {
        return json(await handleHealth(env, url, startedAt));
      }

      if (method === "GET" && path === "/api/admin/system-check") {
        return json(await handleSystemCheck(env, url, startedAt));
      }

      if (method === "GET" && path === "/api/admin/extension-settings") {
        return json(await adminGetExtensionSettings(env, url));
      }
      if (method === "POST" && path === "/api/admin/extension-settings/update") {
        return json(await adminUpdateExtensionSettings(env, await readJson(request)));
      }

      if (method === "GET" && path === "/api/admin/today-board") {
        return json(await adminTodayBoard(env, url));
      }

      if (method === "GET" && path === "/api/admin/demo/pet-chart/status") {
        return json(await adminPetChartDemoStatus(env, url));
      }
      if (method === "POST" && path === "/api/admin/demo/pet-chart/prepare") {
        return json(await adminPreparePetChartDemo(env, await readJson(request)));
      }
      if (method === "POST" && path === "/api/admin/demo/pet-chart/cleanup") {
        return json(await adminCleanupPetChartDemo(env, await readJson(request)));
      }

      if (method === "GET" && path === "/api/admin/pet-chart") {
        return json(await adminGetPetChart(env, url));
      }

      if (method === "GET" && path === "/api/admin/pet-records") {
        return json(await adminGetPetRecords(env, url));
      }
      if (method === "POST" && path === "/api/admin/pet-records/save") {
        return json(await adminSavePetRecord(env, await readJson(request)));
      }
      if (method === "POST" && path === "/api/admin/pet-records/copy-last") {
        return json(await adminCopyLastPetRecord(env, await readJson(request)));
      }
      if (method === "POST" && path === "/api/admin/pet-record-photos/upload") {
        return json(await adminUploadRecordPhoto(env, await readJson(request)));
      }
      if (method === "POST" && path === "/api/admin/pet-record-photos/delete") {
        return json(await adminDeleteRecordPhoto(env, await readJson(request)));
      }

      if (method === "GET" && path === "/api/admin/vaccinations") {
        return json(await adminGetVaccinations(env, url));
      }
      if (method === "POST" && path === "/api/admin/vaccinations/save") {
        return json(await adminSaveVaccination(env, await readJson(request)));
      }
      if (method === "POST" && path === "/api/admin/vaccinations/delete") {
        return json(await adminDeleteVaccination(env, await readJson(request)));
      }

      if (method === "POST" && path === "/api/admin/reservations/update-workflow") {
        return json(await adminUpdateWorkflow(env, await readJson(request)));
      }

      if (method === "POST" && path === "/api/admin/notifications/prepare") {
        return json(await adminPrepareNotification(env, await readJson(request)));
      }

      if (method === "GET" && path === "/api/admin/staff") {
        return json(await adminGetStaff(env, url));
      }
      if (method === "POST" && path === "/api/admin/staff/save") {
        return json(await adminSaveStaff(env, await readJson(request)));
      }

      if (method === "GET" && path === "/api/public/checkin-candidates") {
        return json(await publicCheckinCandidates(env, url));
      }
      if (method === "POST" && path === "/api/public/checkin") {
        return json(await publicCheckin(env, await readJson(request)));
      }

      return json({
        ok: false,
        error: "not_found",
        message: "APIが見つかりません。",
        path,
        method,
        worker_version: WORKER_VERSION
      }, 404);
    } catch (error) {
      const status = error instanceof AppError ? error.status : 500;
      return json({
        ok: false,
        error: error.message || "Internal Server Error",
        detail: error instanceof AppError ? error.detail : null,
        worker_version: WORKER_VERSION
      }, status);
    }
  }
};

// ============================================================
// Health / system check
// ============================================================

async function handleHealth(env, url, startedAt) {
  const shopCode = getShopCodeFromUrl(url, env);
  const configured = Boolean(clean(env.SUPABASE_URL) && getSupabaseKey(env));
  let databaseOk = false;
  let extensionSettings = null;
  let databaseError = null;

  if (configured) {
    try {
      extensionSettings = await ensureExtensionSettings(env, shopCode);
      databaseOk = true;
    } catch (error) {
      databaseError = error.message;
    }
  }

  return {
    ok: true,
    service: SERVICE_NAME,
    worker_version: WORKER_VERSION,
    shop_code: shopCode,
    mode: "sidecar_extension",
    legacy_worker_unchanged: true,
    supabase_configured: configured,
    database_ok: databaseOk,
    database_error: databaseError,
    extension_settings: extensionSettings ? sanitizeExtensionSettings(extensionSettings) : null,
    record_photo_bucket: RECORD_PHOTO_BUCKET,
    hard_photo_limit_bytes: HARD_PHOTO_LIMIT,
    time: new Date().toISOString(),
    jst_date: todayJst(),
    elapsed_ms: Date.now() - startedAt
  };
}

async function handleSystemCheck(env, url, startedAt) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const checks = [];

  checks.push(checkItem("supabase_url", Boolean(clean(env.SUPABASE_URL)), "SUPABASE_URL"));
  checks.push(checkItem("service_role_key", Boolean(getSupabaseKey(env)), "SUPABASE_SERVICE_ROLE_KEY"));
  checks.push(checkItem("phone_normalize", normalizePhone("＋８１ ９０－１２３４－５６７８") === "09012345678", "+81・全角・記号対応"));
  checks.push(checkItem("workflow_mapping", legacyStatusForWorkflow("pickup_ready") === "visited", "pickup_ready → visited"));
  const jstDate = todayJst();
  checks.push(checkItem("jst_date", /^\d{4}-\d{2}-\d{2}$/.test(jstDate), jstDate));
  checks.push(checkItem("demo_pet_chart_api", Boolean(legacyWorkerBase(env)), legacyWorkerBase(env)));

  const tableNames = [
    "petsalon_extension_settings",
    "petsalon_staff",
    "petsalon_pet_records",
    "petsalon_record_photos",
    "petsalon_vaccinations",
    "petsalon_checkins",
    "petsalon_workflow_events",
    "petsalon_notification_logs",
    "petsalon_import_logs"
  ];

  for (const table of tableNames) {
    try {
      await sbSelect(env, table, [sel("*"), "limit=1"]);
      checks.push(checkItem(`table_${table}`, true, table));
    } catch (error) {
      checks.push(checkItem(`table_${table}`, false, `${table}: ${error.message}`));
    }
  }

  try {
    const bucket = await sbStorageGetBucket(env, RECORD_PHOTO_BUCKET);
    checks.push(checkItem("record_photo_bucket", Boolean(bucket && bucket.id), RECORD_PHOTO_BUCKET));
  } catch (error) {
    checks.push(checkItem("record_photo_bucket", false, `${RECORD_PHOTO_BUCKET}: ${error.message}`));
  }

  try {
    const settings = await ensureExtensionSettings(env, shopCode);
    checks.push(checkItem("extension_settings", Boolean(settings), settings.workflow_mode));
  } catch (error) {
    checks.push(checkItem("extension_settings", false, error.message));
  }

  try {
    const legacySettings = await getLegacySettings(env, shopCode);
    checks.push(checkItem("legacy_shop_settings", Boolean(legacySettings), legacySettings?.shop_name || shopCode));
  } catch (error) {
    checks.push(checkItem("legacy_shop_settings", false, error.message));
  }

  const failed = checks.filter(item => !item.ok);
  return {
    ok: failed.length === 0,
    service: SERVICE_NAME,
    worker_version: WORKER_VERSION,
    shop_code: shopCode,
    passed: checks.length - failed.length,
    failed: failed.length,
    total: checks.length,
    items: checks,
    time: new Date().toISOString(),
    elapsed_ms: Date.now() - startedAt
  };
}

function checkItem(key, ok, detail) {
  return { key, ok: Boolean(ok), detail: String(detail || "") };
}

// ============================================================
// Extension settings
// ============================================================

async function adminGetExtensionSettings(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const settings = await ensureExtensionSettings(env, shopCode);
  return { ok: true, shop_code: shopCode, settings: sanitizeExtensionSettings(settings) };
}

async function adminUpdateExtensionSettings(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const current = await ensureExtensionSettings(env, shopCode);
  const payload = {
    workflow_mode: enumValue(body.workflow_mode, ["simple4", "detailed10"], current.workflow_mode || "simple4"),
    pet_record_enabled: boolValue(body.pet_record_enabled, current.pet_record_enabled),
    before_after_photo_enabled: boolValue(body.before_after_photo_enabled, current.before_after_photo_enabled),
    vaccination_enabled: boolValue(body.vaccination_enabled, current.vaccination_enabled),
    qr_checkin_enabled: boolValue(body.qr_checkin_enabled, current.qr_checkin_enabled),
    staff_assignment_enabled: boolValue(body.staff_assignment_enabled, current.staff_assignment_enabled),
    csv_import_enabled: boolValue(body.csv_import_enabled, current.csv_import_enabled),
    notification_mode: enumValue(body.notification_mode, ["copy", "messaging_api"], current.notification_mode || "copy"),
    max_record_photo_bytes: clampInt(body.max_record_photo_bytes, 100000, HARD_PHOTO_LIMIT, Number(current.max_record_photo_bytes || DEFAULT_PHOTO_LIMIT))
  };

  const rows = await sbUpdate(env, "petsalon_extension_settings", [eq("shop_code", shopCode)], payload);
  await writeAuditQuietly(env, shopCode, "extension_settings_updated", "owner", payload);
  return { ok: true, shop_code: shopCode, settings: sanitizeExtensionSettings(rows[0] || { ...current, ...payload }) };
}

async function ensureExtensionSettings(env, shopCode) {
  const rows = await sbSelect(env, "petsalon_extension_settings", [
    sel("*"), eq("shop_code", shopCode), "limit=1"
  ]);
  if (rows.length) return rows[0];

  const inserted = await sbInsert(env, "petsalon_extension_settings", {
    shop_code: shopCode,
    workflow_mode: "simple4",
    pet_record_enabled: true,
    before_after_photo_enabled: true,
    vaccination_enabled: true,
    qr_checkin_enabled: false,
    staff_assignment_enabled: false,
    csv_import_enabled: false,
    notification_mode: "copy",
    max_record_photo_bytes: DEFAULT_PHOTO_LIMIT
  });
  return inserted[0];
}

function sanitizeExtensionSettings(row) {
  return {
    shop_code: row.shop_code,
    workflow_mode: row.workflow_mode || "simple4",
    pet_record_enabled: row.pet_record_enabled !== false,
    before_after_photo_enabled: row.before_after_photo_enabled !== false,
    vaccination_enabled: row.vaccination_enabled !== false,
    qr_checkin_enabled: row.qr_checkin_enabled === true,
    staff_assignment_enabled: row.staff_assignment_enabled === true,
    csv_import_enabled: row.csv_import_enabled === true,
    notification_mode: row.notification_mode || "copy",
    max_record_photo_bytes: Number(row.max_record_photo_bytes || DEFAULT_PHOTO_LIMIT),
    updated_at: row.updated_at || null
  };
}

// ============================================================
// Today board
// ============================================================

async function adminTodayBoard(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const date = clean(url.searchParams.get("date")) || todayJst();
  assertYmd(date, "date");

  const reservations = await sbSelect(env, "pet_salon_reservations", [
    sel("*"),
    eq("shop_code", shopCode),
    eq("reservation_date", date),
    "order=reservation_time.asc,created_at.asc",
    "limit=300"
  ]);

  const customerIds = unique(reservations.map(row => row.customer_id).filter(Boolean));
  const petIds = unique(reservations.map(row => row.pet_id).filter(Boolean));
  const reservationIds = unique(reservations.map(row => String(row.id)).filter(Boolean));

  const [customers, pets, checkins, vaccinations, petRecords] = await Promise.all([
    customerIds.length ? sbSelect(env, "pet_salon_customers", [sel("*"), eq("shop_code", shopCode), inFilter("id", customerIds)]) : [],
    petIds.length ? sbSelect(env, "pet_salon_pets", [sel("*"), eq("shop_code", shopCode), inFilter("id", petIds)]) : [],
    reservationIds.length ? sbSelect(env, "petsalon_checkins", [sel("*"), eq("shop_code", shopCode), inFilter("reservation_id", reservationIds)]) : [],
    petIds.length ? sbSelect(env, "petsalon_vaccinations", [sel("*"), eq("shop_code", shopCode), inFilter("pet_id", petIds), "order=expires_on.desc.nullslast"]) : [],
    reservationIds.length ? sbSelect(env, "petsalon_pet_records", [sel("*"), eq("shop_code", shopCode), inFilter("reservation_id", reservationIds), "order=created_at.desc", "limit=500"]) : []
  ]);

  const staffIds = unique(petRecords.map(row => row.staff_id).filter(Boolean));
  const staffRows = staffIds.length ? await sbSelect(env, "petsalon_staff", [
    sel("*"), eq("shop_code", shopCode), inFilter("id", staffIds)
  ]) : [];

  const customerMap = mapBy(customers, "id");
  const petMap = mapBy(pets, "id");
  const checkinMap = mapBy(checkins, "reservation_id");
  const vaccinationMap = groupBy(vaccinations, "pet_id");
  const staffMap = mapBy(staffRows, "id");
  const recordMap = new Map();
  for (const record of petRecords) {
    const key = String(record.reservation_id || "");
    if (key && !recordMap.has(key)) recordMap.set(key, record);
  }

  const rows = reservations.map(reservation => {
    const pet = petMap.get(reservation.pet_id) || null;
    const customer = customerMap.get(reservation.customer_id) || null;
    const checkin = checkinMap.get(String(reservation.id)) || null;
    const petVaccinations = vaccinationMap.get(String(reservation.pet_id)) || [];
    const vaccinationSummary = summarizeVaccinations(petVaccinations);
    const petRecord = recordMap.get(String(reservation.id)) || null;
    const staff = petRecord?.staff_id ? (staffMap.get(String(petRecord.staff_id)) || null) : null;

    return {
      reservation,
      customer: sanitizeCustomer(customer),
      pet: sanitizePet(pet),
      workflow_status: checkin?.workflow_status || workflowFromLegacyStatus(reservation.status),
      checkin,
      pet_record: petRecord,
      staff,
      vaccination_summary: vaccinationSummary,
      alerts: buildTodayAlerts(pet, vaccinationSummary)
    };
  });

  const counts = {};
  for (const status of WORKFLOW_STATUSES) counts[status] = 0;
  for (const row of rows) counts[row.workflow_status] = (counts[row.workflow_status] || 0) + 1;

  return {
    ok: true,
    shop_code: shopCode,
    date,
    operation_buttons: [
      { status: "checked_in", label: "受付する" },
      { status: "grooming", label: "施術開始" },
      { status: "pickup_ready", label: "お迎え可能" },
      { status: "handed_over", label: "お渡し完了" }
    ],
    counts,
    reservations: rows
  };
}

function buildTodayAlerts(pet, vaccinationSummary) {
  const alerts = [];
  if (!pet) return alerts;
  if (clean(pet.health_notes)) alerts.push({ type: "health", label: "健康上の注意", text: clean(pet.health_notes) });
  if (clean(pet.dislike_notes)) alerts.push({ type: "behavior", label: "苦手・注意", text: clean(pet.dislike_notes) });
  if (vaccinationSummary.has_expired) alerts.push({ type: "vaccination", label: "ワクチン期限切れ", text: "証明書・接種状況を確認してください。" });
  if (vaccinationSummary.unconfirmed_count > 0) alerts.push({ type: "vaccination", label: "ワクチン未確認", text: "接種証明を確認してください。" });
  return alerts;
}


// ============================================================
// STEP5-R1 demo data / JST verification
// ============================================================

async function adminPetChartDemoStatus(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  await assertDemoShop(env, shopCode);
  const date = clean(url.searchParams.get("date")) || todayJst();
  assertYmd(date, "date");
  const reservation = await findDemoReservation(env, shopCode, date);
  if (!reservation) return { ok: true, shop_code: shopCode, date, prepared: false, marker: DEMO_MARKER };
  const pet = reservation.pet_id ? await findOne(env, "pet_salon_pets", [eq("shop_code", shopCode), eq("id", reservation.pet_id)]) : null;
  const customer = reservation.customer_id ? await findOne(env, "pet_salon_customers", [eq("shop_code", shopCode), eq("id", reservation.customer_id)]) : null;
  const record = await findOne(env, "petsalon_pet_records", [eq("shop_code", shopCode), eq("reservation_id", String(reservation.id))]);
  const photos = record ? await sbSelect(env, "petsalon_record_photos", [sel("*"), eq("shop_code", shopCode), eq("pet_record_id", record.id)]) : [];
  const vaccinations = pet ? (await sbSelect(env, "petsalon_vaccinations", [sel("*"), eq("shop_code", shopCode), eq("pet_id", String(pet.id))])).filter(row => clean(row.note).includes(DEMO_MARKER)) : [];
  return {
    ok: true, shop_code: shopCode, date, prepared: true, marker: DEMO_MARKER,
    reservation, pet: sanitizePet(pet), customer: sanitizeCustomer(customer), record,
    photo_count: photos.length, vaccination_count: vaccinations.length,
    direct_query: buildDemoDirectQuery(reservation, date)
  };
}

async function adminPreparePetChartDemo(env, body) {
  const { shopCode, adminCode } = await requireAdminFromBody(env, body);
  await assertDemoShop(env, shopCode);
  const date = clean(body.date) || todayJst();
  assertYmd(date, "date");

  let reservation = await findDemoReservation(env, shopCode, date);
  let legacyResult = null;
  if (!reservation) {
    const serviceCode = await chooseLegacyServiceCode(env, shopCode);
    const reservationTime = await chooseLegacyReservationTime(env, shopCode, date);
    legacyResult = await legacyJson(env, "/api/admin/reservations/manual-create", {
      method: "POST",
      body: {
        shop_code: shopCode,
        admin_code: adminCode,
        reception_type: "store",
        owner_name: DEMO_OWNER_NAME,
        owner_kana: "ステップゴカクニンヨウ",
        phone: DEMO_PHONE,
        pet_id: "",
        pet_name: DEMO_PET_NAME,
        breed: "トイプードル",
        age_label: "3歳",
        weight: "4.2",
        sex: "female",
        reservation_date: date,
        reservation_time: reservationTime,
        service_code: serviceCode,
        request_note: `${DEMO_MARKER}\nカルテ・施術写真・ワクチン確認専用のデモ予約です。`
      }
    });
    for (let attempt = 0; attempt < 5 && !reservation; attempt++) {
      if (attempt) await sleep(250);
      reservation = await findDemoReservation(env, shopCode, date);
    }
  }
  if (!reservation) throw new AppError(502, "デモ予約を作成しましたが、予約情報を確認できませんでした。", legacyResult);

  const pet = await assertLegacyPet(env, shopCode, clean(reservation.pet_id));
  const customerId = clean(reservation.customer_id || pet.customer_id);
  const staffRows = await sbSelect(env, "petsalon_staff", [sel("*"), eq("shop_code", shopCode), eq("is_active", true), "order=sort_order.asc", "limit=1"]);
  const staffId = staffRows[0]?.id || null;

  let record = await findOne(env, "petsalon_pet_records", [eq("shop_code", shopCode), eq("reservation_id", String(reservation.id))]);
  const recordResult = await adminSavePetRecord(env, {
    shop_code: shopCode, admin_code: adminCode,
    record_id: record?.id || undefined,
    pet_id: String(pet.id), customer_id: customerId, reservation_id: String(reservation.id),
    staff_id: staffId, record_date: date,
    menu_done: "シャンプー＋カット（STEP5確認）",
    option_names: ["炭酸泉", "歯磨き"], shampoo_name: "低刺激デモシャンプー",
    clipper_length: "6mm", cut_style: "顔は丸く、足はふんわり。STEP5-R1確認用カルテです。",
    weight_kg: 4.2, skin_condition: "良好", ear_condition: "異常なし", nail_condition: "爪切り済み",
    matting_level: "light", behavior_note: "前足は少し苦手ですが、声かけで落ち着きます。",
    internal_note: DEMO_MARKER, owner_message: "本日も落ち着いて施術できました。",
    next_recommend_date: addDaysYmd(date, 42), next_recommend_reason: "毛玉予防のため6週間後がおすすめ",
    created_by: "system"
  });
  record = recordResult.record;

  let photos = await sbSelect(env, "petsalon_record_photos", [sel("*"), eq("shop_code", shopCode), eq("pet_record_id", record.id)]);
  if (!photos.some(row => clean(row.caption).includes(DEMO_MARKER))) {
    await adminUploadRecordPhoto(env, {
      shop_code: shopCode, admin_code: adminCode, pet_record_id: record.id, pet_id: String(pet.id),
      photo_type: "chart", photo_data_url: DEMO_IMAGE_DATA_URL,
      caption: `${DEMO_MARKER} 自動保存確認画像`, owner_share_allowed: false, created_by: "system"
    });
    photos = await sbSelect(env, "petsalon_record_photos", [sel("*"), eq("shop_code", shopCode), eq("pet_record_id", record.id)]);
  }

  let vaccination = (await sbSelect(env, "petsalon_vaccinations", [sel("*"), eq("shop_code", shopCode), eq("pet_id", String(pet.id))]))
    .find(row => clean(row.note).includes(DEMO_MARKER));
  if (!vaccination) {
    const vaccineResult = await adminSaveVaccination(env, {
      shop_code: shopCode, admin_code: adminCode, pet_id: String(pet.id), customer_id: customerId,
      vaccination_type: "combination", vaccination_name: "混合ワクチン（STEP5確認）",
      vaccinated_on: addDaysYmd(date, -30), expires_on: addDaysYmd(date, 335), verification_status: "confirmed",
      certificate_data_url: DEMO_IMAGE_DATA_URL, verified_by: "system",
      note: `${DEMO_MARKER} 証明書画像の保存確認`
    });
    vaccination = vaccineResult.vaccination;
  }

  await sbInsert(env, "petsalon_import_logs", {
    shop_code: shopCode, import_type: "records", source_filename: DEMO_MARKER,
    source_hash: String(reservation.id), dry_run: false, total_rows: 3, success_rows: 3,
    skipped_rows: 0, error_rows: 0,
    result_summary: { date, reservation_id: String(reservation.id), customer_id: customerId, pet_id: String(pet.id), record_id: record.id, vaccination_id: vaccination?.id || null },
    created_by: "system"
  });

  return {
    ok: true, shop_code: shopCode, date, prepared: true, marker: DEMO_MARKER,
    reservation, pet: sanitizePet(pet), record,
    photo_count: photos.length, vaccination_count: vaccination ? 1 : 0,
    direct_query: buildDemoDirectQuery(reservation, date),
    jst_date: todayJst()
  };
}

async function adminCleanupPetChartDemo(env, body) {
  const { shopCode, adminCode } = await requireAdminFromBody(env, body);
  await assertDemoShop(env, shopCode);
  const date = clean(body.date) || "";
  if (date) assertYmd(date, "date");
  const reservations = await findAllDemoReservations(env, shopCode, date || null);
  const report = { reservations: 0, pets: 0, customers: 0, records: 0, photos: 0, vaccinations: 0, warnings: [] };

  for (const reservation of reservations) {
    const reservationId = String(reservation.id);
    const petId = clean(reservation.pet_id);
    const customerId = clean(reservation.customer_id);
    const records = await sbSelect(env, "petsalon_pet_records", [sel("*"), eq("shop_code", shopCode), eq("reservation_id", reservationId)]);
    const recordIds = records.map(row => row.id);
    const photos = recordIds.length ? await sbSelect(env, "petsalon_record_photos", [sel("*"), eq("shop_code", shopCode), inFilter("pet_record_id", recordIds)]) : [];
    for (const photo of photos) await sbStorageDeleteQuietly(env, photo.storage_bucket || RECORD_PHOTO_BUCKET, photo.storage_path);
    if (recordIds.length) {
      const deletedPhotos = await sbDelete(env, "petsalon_record_photos", [eq("shop_code", shopCode), inFilter("pet_record_id", recordIds)]);
      report.photos += deletedPhotos.length;
    }
    const vaccineRows = petId ? (await sbSelect(env, "petsalon_vaccinations", [sel("*"), eq("shop_code", shopCode), eq("pet_id", petId)])).filter(row => clean(row.note).includes(DEMO_MARKER)) : [];
    for (const vaccine of vaccineRows) {
      await sbStorageDeleteQuietly(env, vaccine.certificate_storage_bucket || RECORD_PHOTO_BUCKET, vaccine.certificate_storage_path);
      await sbDelete(env, "petsalon_vaccinations", [eq("shop_code", shopCode), eq("id", vaccine.id)]);
      report.vaccinations++;
    }
    await sbDelete(env, "petsalon_notification_logs", [eq("shop_code", shopCode), eq("reservation_id", reservationId)]);
    await sbDelete(env, "petsalon_workflow_events", [eq("shop_code", shopCode), eq("reservation_id", reservationId)]);
    await sbDelete(env, "petsalon_checkins", [eq("shop_code", shopCode), eq("reservation_id", reservationId)]);
    if (recordIds.length) {
      const deletedRecords = await sbDelete(env, "petsalon_pet_records", [eq("shop_code", shopCode), inFilter("id", recordIds)]);
      report.records += deletedRecords.length;
    }

    try {
      const deletedReservations = await sbDelete(env, "pet_salon_reservations", [eq("shop_code", shopCode), eq("id", reservationId)]);
      report.reservations += deletedReservations.length || 1;
    } catch (error) {
      report.warnings.push(`予約${reservationId}は削除できなかったためキャンセルへ変更しました。`);
      try {
        await legacyJson(env, "/api/admin/reservations/update-status", { method: "POST", body: { shop_code: shopCode, admin_code: adminCode, reservation_id: reservationId, status: "cancelled" } });
      } catch (legacyError) {
        report.warnings.push(`予約${reservationId}のキャンセルにも失敗しました：${legacyError.message}`);
      }
    }

    if (petId) {
      const otherReservations = await sbSelect(env, "pet_salon_reservations", [sel("id"), eq("shop_code", shopCode), eq("pet_id", petId), "limit=1"]);
      if (!otherReservations.length) {
        try { const deleted = await sbDelete(env, "pet_salon_pets", [eq("shop_code", shopCode), eq("id", petId)]); report.pets += deleted.length || 1; }
        catch (error) { report.warnings.push(`デモペット${petId}は関連データがあるため残しました。`); }
      }
    }
    if (customerId) {
      const otherPets = await sbSelect(env, "pet_salon_pets", [sel("id"), eq("shop_code", shopCode), eq("customer_id", customerId), "limit=1"]);
      if (!otherPets.length) {
        try { const deleted = await sbDelete(env, "pet_salon_customers", [eq("shop_code", shopCode), eq("id", customerId)]); report.customers += deleted.length || 1; }
        catch (error) { report.warnings.push(`デモ飼い主${customerId}は関連データがあるため残しました。`); }
      }
    }
  }
  await sbDelete(env, "petsalon_import_logs", [eq("shop_code", shopCode), eq("source_filename", DEMO_MARKER)]);
  return { ok: true, shop_code: shopCode, cleaned: true, marker: DEMO_MARKER, report, jst_date: todayJst() };
}

async function assertDemoShop(env, shopCode) {
  const settings = await getLegacySettings(env, shopCode);
  if (shopCode !== DEFAULT_SHOP_CODE && settings.demo_mode !== true && settings.is_demo !== true) {
    throw new AppError(403, "デモ確認データはデモ店舗でのみ作成できます。");
  }
  return settings;
}

async function findDemoReservation(env, shopCode, date) {
  const rows = await findAllDemoReservations(env, shopCode, date);
  return rows[0] || null;
}

async function findAllDemoReservations(env, shopCode, date = null) {
  const parts = [sel("*"), eq("shop_code", shopCode)];
  if (date) parts.push(eq("reservation_date", date));
  parts.push("order=created_at.desc", "limit=500");
  const rows = await sbSelect(env, "pet_salon_reservations", parts);
  return rows.filter(row => clean(row.request_note).includes(DEMO_MARKER));
}

async function chooseLegacyServiceCode(env, shopCode) {
  try {
    const data = await legacyJson(env, "/api/public/services", { query: { shop_code: shopCode, category: "salon" } });
    const rows = Array.isArray(data.services) ? data.services : [];
    const active = rows.find(row => row.is_active !== false && clean(row.service_code || row.code));
    if (active) return clean(active.service_code || active.code);
  } catch (_) {}
  return "shampoo_cut";
}

async function chooseLegacyReservationTime(env, shopCode, date) {
  try {
    const data = await legacyJson(env, "/api/public/available-times", { query: { shop_code: shopCode, date } });
    const candidates = data.available_times || data.times || data.slots || [];
    for (const item of candidates) {
      if (typeof item === "string" && /^\d{2}:\d{2}/.test(item)) return item.slice(0, 5);
      if (item && item.available !== false && /^\d{2}:\d{2}/.test(clean(item.time || item.start_time))) return clean(item.time || item.start_time).slice(0, 5);
    }
  } catch (_) {}
  return "15:30";
}

function legacyWorkerBase(env) {
  return clean(env.LEGACY_WORKER_BASE_URL || DEFAULT_LEGACY_WORKER_BASE_URL).replace(/\/$/, "");
}

async function legacyJson(env, path, options = {}) {
  const url = new URL(`${legacyWorkerBase(env)}${path}`);
  for (const [key, value] of Object.entries(options.query || {})) if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  const response = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new AppError(response.status >= 500 ? 502 : response.status, data.error || data.message || `既存Worker連携に失敗しました（${response.status}）`, data);
  return data;
}

function buildDemoDirectQuery(reservation, date) {
  const params = new URLSearchParams({
    pet_id: String(reservation.pet_id || ""), reservation_id: String(reservation.id || ""),
    record_date: date, from: "owner", demo: "1", step5_demo: "1"
  });
  return params.toString();
}

function addDaysYmd(ymd, days) {
  const date = new Date(`${ymd}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ============================================================
// Full pet chart for owner / iPad screens
// ============================================================

async function adminGetPetChart(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.pet_record_enabled, "ペット別カルテ");

  const petId = clean(url.searchParams.get("pet_id"));
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  const pet = await assertLegacyPet(env, shopCode, petId);

  let customer = null;
  if (clean(pet.customer_id)) {
    const customers = await sbSelect(env, "pet_salon_customers", [
      sel("*"), eq("shop_code", shopCode), eq("id", pet.customer_id), "limit=1"
    ]);
    customer = customers[0] || null;
  }

  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 50);
  const records = await sbSelect(env, "petsalon_pet_records", [
    sel("*"), eq("shop_code", shopCode), eq("pet_id", petId),
    "order=record_date.desc,created_at.desc", `limit=${limit}`
  ]);
  const recordIds = records.map(row => row.id);
  const photos = recordIds.length ? await sbSelect(env, "petsalon_record_photos", [
    sel("*"), eq("shop_code", shopCode), inFilter("pet_record_id", recordIds),
    "order=sort_order.asc,created_at.asc"
  ]) : [];
  const photoMap = groupBy(photos, "pet_record_id");
  const signedRecords = [];
  for (const record of records) {
    const signedPhotos = [];
    for (const photo of photoMap.get(String(record.id)) || []) {
      signedPhotos.push(await photoWithSignedUrl(env, photo, 900));
    }
    signedRecords.push({ ...record, photos: signedPhotos });
  }

  const vaccinationRows = settings.vaccination_enabled ? await sbSelect(env, "petsalon_vaccinations", [
    sel("*"), eq("shop_code", shopCode), eq("pet_id", petId),
    "order=expires_on.desc.nullslast,vaccinated_on.desc.nullslast,created_at.desc"
  ]) : [];
  const vaccinations = [];
  for (const row of vaccinationRows) {
    let certificateSignedUrl = null;
    if (clean(row.certificate_storage_path)) {
      try {
        certificateSignedUrl = await sbStorageCreateSignedUrl(
          env,
          row.certificate_storage_bucket || RECORD_PHOTO_BUCKET,
          row.certificate_storage_path,
          900
        );
      } catch (_) {
        certificateSignedUrl = null;
      }
    }
    vaccinations.push({ ...row, certificate_signed_url: certificateSignedUrl });
  }

  const staff = await sbSelect(env, "petsalon_staff", [
    sel("*"), eq("shop_code", shopCode), eq("is_active", true), "order=sort_order.asc,staff_name.asc"
  ]);

  return {
    ok: true,
    shop_code: shopCode,
    pet,
    customer,
    staff,
    records: signedRecords,
    vaccinations,
    vaccination_summary: summarizeVaccinations(vaccinationRows),
    extension_settings: sanitizeExtensionSettings(settings)
  };
}

// ============================================================
// Pet records / photos
// ============================================================

async function adminGetPetRecords(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.pet_record_enabled, "ペット別カルテ");

  const petId = clean(url.searchParams.get("pet_id"));
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  await assertLegacyPet(env, shopCode, petId);

  const limit = clampInt(url.searchParams.get("limit"), 1, 100, 20);
  const offset = clampInt(url.searchParams.get("offset"), 0, 100000, 0);
  const records = await sbSelect(env, "petsalon_pet_records", [
    sel("*"), eq("shop_code", shopCode), eq("pet_id", petId),
    "order=record_date.desc,created_at.desc", `limit=${limit}`, `offset=${offset}`
  ]);

  const recordIds = records.map(row => row.id);
  const photos = recordIds.length ? await sbSelect(env, "petsalon_record_photos", [
    sel("*"), eq("shop_code", shopCode), inFilter("pet_record_id", recordIds), "order=sort_order.asc,created_at.asc"
  ]) : [];
  const photoMap = groupBy(photos, "pet_record_id");

  const items = [];
  for (const record of records) {
    const recordPhotos = photoMap.get(String(record.id)) || [];
    const signedPhotos = [];
    for (const photo of recordPhotos) {
      signedPhotos.push(await photoWithSignedUrl(env, photo, 900));
    }
    items.push({ ...record, photos: signedPhotos });
  }

  return { ok: true, shop_code: shopCode, pet_id: petId, limit, offset, records: items };
}

async function adminSavePetRecord(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.pet_record_enabled, "ペット別カルテ");

  const petId = clean(body.pet_id);
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  const pet = await assertLegacyPet(env, shopCode, petId);
  const customerId = clean(body.customer_id || pet.customer_id);
  const recordDate = clean(body.record_date) || todayJst();
  assertYmd(recordDate, "record_date");

  let staffId = clean(body.staff_id) || null;
  if (staffId) await assertStaff(env, shopCode, staffId);

  const payload = {
    shop_code: shopCode,
    customer_id: customerId,
    pet_id: petId,
    reservation_id: clean(body.reservation_id),
    visit_id: clean(body.visit_id),
    staff_id: staffId,
    record_date: recordDate,
    menu_done: clean(body.menu_done),
    option_names: arrayOfStrings(body.option_names, 30),
    shampoo_name: clean(body.shampoo_name),
    clipper_length: clean(body.clipper_length),
    cut_style: clean(body.cut_style),
    weight_kg: nullableNumber(body.weight_kg, 0, 999.99),
    skin_condition: clean(body.skin_condition),
    ear_condition: clean(body.ear_condition),
    nail_condition: clean(body.nail_condition),
    matting_level: enumValue(body.matting_level, ["none", "light", "medium", "heavy"], "none"),
    behavior_note: clean(body.behavior_note),
    internal_note: clean(body.internal_note),
    owner_message: clean(body.owner_message),
    next_recommend_date: nullableYmd(body.next_recommend_date, "next_recommend_date"),
    next_recommend_reason: clean(body.next_recommend_reason),
    copied_from_record_id: clean(body.copied_from_record_id) || null,
    created_by: clean(body.created_by) || "owner"
  };

  const recordId = clean(body.record_id || body.id);
  let row;
  if (recordId) {
    const existing = await assertPetRecord(env, shopCode, recordId);
    if (String(existing.pet_id) !== String(petId)) throw new AppError(409, "カルテとペットが一致しません。");
    delete payload.shop_code;
    delete payload.pet_id;
    delete payload.created_by;
    const rows = await sbUpdate(env, "petsalon_pet_records", [eq("shop_code", shopCode), eq("id", recordId)], payload);
    row = rows[0];
  } else {
    const rows = await sbInsert(env, "petsalon_pet_records", payload);
    row = rows[0];
  }

  await writeAuditQuietly(env, shopCode, recordId ? "pet_record_updated" : "pet_record_created", "owner", {
    pet_id: petId,
    record_id: row?.id || recordId,
    reservation_id: payload.reservation_id
  });

  return { ok: true, shop_code: shopCode, pet_id: petId, record: row };
}

async function adminCopyLastPetRecord(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.pet_record_enabled, "ペット別カルテ");

  const petId = clean(body.pet_id);
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  const pet = await assertLegacyPet(env, shopCode, petId);

  const rows = await sbSelect(env, "petsalon_pet_records", [
    sel("*"), eq("shop_code", shopCode), eq("pet_id", petId),
    "order=record_date.desc,created_at.desc", "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "複製できる前回カルテがありません。");

  const source = rows[0];
  const insertPayload = {
    shop_code: shopCode,
    customer_id: clean(body.customer_id || pet.customer_id || source.customer_id),
    pet_id: petId,
    reservation_id: clean(body.reservation_id),
    visit_id: clean(body.visit_id),
    staff_id: clean(body.staff_id) || source.staff_id || null,
    record_date: clean(body.record_date) || todayJst(),
    menu_done: source.menu_done || "",
    option_names: Array.isArray(source.option_names) ? source.option_names : [],
    shampoo_name: source.shampoo_name || "",
    clipper_length: source.clipper_length || "",
    cut_style: source.cut_style || "",
    weight_kg: source.weight_kg,
    skin_condition: "",
    ear_condition: "",
    nail_condition: "",
    matting_level: "none",
    behavior_note: source.behavior_note || "",
    internal_note: "",
    owner_message: "",
    next_recommend_date: null,
    next_recommend_reason: "",
    copied_from_record_id: source.id,
    created_by: "owner"
  };
  assertYmd(insertPayload.record_date, "record_date");

  const inserted = await sbInsert(env, "petsalon_pet_records", insertPayload);
  await writeAuditQuietly(env, shopCode, "pet_record_copied", "owner", {
    pet_id: petId,
    source_record_id: source.id,
    new_record_id: inserted[0]?.id || null
  });

  return { ok: true, shop_code: shopCode, pet_id: petId, copied_from: source.id, record: inserted[0] };
}

async function adminUploadRecordPhoto(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.before_after_photo_enabled, "施術前後写真");

  const recordId = clean(body.pet_record_id || body.record_id);
  const petId = clean(body.pet_id);
  const photoType = clean(body.photo_type || "chart");
  if (!recordId) throw new AppError(400, "pet_record_id が必要です。");
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  if (!PHOTO_TYPES.has(photoType)) throw new AppError(400, "photo_type が不正です。");

  const record = await assertPetRecord(env, shopCode, recordId);
  if (String(record.pet_id) !== String(petId)) throw new AppError(409, "カルテとペットが一致しません。");

  const maxBytes = Math.min(Number(settings.max_record_photo_bytes || DEFAULT_PHOTO_LIMIT), HARD_PHOTO_LIMIT);
  const image = parseImageDataUrl(body.photo_data_url || body.image_data_url, maxBytes);
  const ext = extensionForMime(image.mimeType);
  const storagePath = `${safePathSegment(shopCode)}/${safePathSegment(petId)}/${safePathSegment(recordId)}/${Date.now()}-${randomId()}.${ext}`;

  await sbStorageUpload(env, RECORD_PHOTO_BUCKET, storagePath, image.bytes, image.mimeType);

  try {
    const rows = await sbInsert(env, "petsalon_record_photos", {
      shop_code: shopCode,
      pet_record_id: recordId,
      pet_id: petId,
      photo_type: photoType,
      storage_bucket: RECORD_PHOTO_BUCKET,
      storage_path: storagePath,
      mime_type: image.mimeType,
      size_bytes: image.bytes.byteLength,
      width_px: nullableInt(body.width_px, 1, 10000),
      height_px: nullableInt(body.height_px, 1, 10000),
      owner_share_allowed: body.owner_share_allowed === true,
      sort_order: clampInt(body.sort_order, 0, 10000, 100),
      caption: clean(body.caption),
      created_by: clean(body.created_by) || "owner"
    });
    const photo = await photoWithSignedUrl(env, rows[0], 900);
    await writeAuditQuietly(env, shopCode, "pet_record_photo_uploaded", "owner", {
      pet_id: petId, record_id: recordId, photo_id: rows[0]?.id, photo_type: photoType, size_bytes: image.bytes.byteLength
    });
    return { ok: true, shop_code: shopCode, photo };
  } catch (error) {
    await sbStorageDeleteQuietly(env, RECORD_PHOTO_BUCKET, storagePath);
    throw error;
  }
}

async function adminDeleteRecordPhoto(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const photoId = clean(body.photo_id || body.id);
  if (!photoId) throw new AppError(400, "photo_id が必要です。");

  const rows = await sbSelect(env, "petsalon_record_photos", [
    sel("*"), eq("shop_code", shopCode), eq("id", photoId), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "写真が見つかりません。");
  const photo = rows[0];

  await sbStorageDeleteQuietly(env, photo.storage_bucket || RECORD_PHOTO_BUCKET, photo.storage_path);
  await sbDelete(env, "petsalon_record_photos", [eq("shop_code", shopCode), eq("id", photoId)]);
  await writeAuditQuietly(env, shopCode, "pet_record_photo_deleted", "owner", {
    photo_id: photoId, pet_record_id: photo.pet_record_id, pet_id: photo.pet_id
  });
  return { ok: true, shop_code: shopCode, deleted_photo_id: photoId };
}

async function photoWithSignedUrl(env, photo, expiresIn = 900) {
  if (!photo) return null;
  let signedUrl = null;
  try {
    signedUrl = await sbStorageCreateSignedUrl(env, photo.storage_bucket || RECORD_PHOTO_BUCKET, photo.storage_path, expiresIn);
  } catch (_) {
    signedUrl = null;
  }
  return { ...photo, signed_url: signedUrl, signed_url_expires_in: signedUrl ? expiresIn : null };
}

// ============================================================
// Vaccinations
// ============================================================

async function adminGetVaccinations(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.vaccination_enabled, "ワクチン管理");

  const petId = clean(url.searchParams.get("pet_id"));
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  await assertLegacyPet(env, shopCode, petId);

  const rows = await sbSelect(env, "petsalon_vaccinations", [
    sel("*"), eq("shop_code", shopCode), eq("pet_id", petId),
    "order=expires_on.desc.nullslast,vaccinated_on.desc.nullslast,created_at.desc"
  ]);

  const vaccinations = [];
  for (const row of rows) {
    let certificateSignedUrl = null;
    if (clean(row.certificate_storage_path)) {
      try {
        certificateSignedUrl = await sbStorageCreateSignedUrl(
          env,
          row.certificate_storage_bucket || RECORD_PHOTO_BUCKET,
          row.certificate_storage_path,
          900
        );
      } catch (_) {
        certificateSignedUrl = null;
      }
    }
    vaccinations.push({ ...row, certificate_signed_url: certificateSignedUrl });
  }

  return { ok: true, shop_code: shopCode, pet_id: petId, summary: summarizeVaccinations(rows), vaccinations };
}

async function adminSaveVaccination(env, body) {
  const { shopCode, adminCode } = await requireAdminFromBody(env, body);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.vaccination_enabled, "ワクチン管理");

  const petId = clean(body.pet_id);
  if (!petId) throw new AppError(400, "pet_id が必要です。");
  const pet = await assertLegacyPet(env, shopCode, petId);

  const vaccinationType = clean(body.vaccination_type);
  if (!VACCINATION_TYPES.has(vaccinationType)) throw new AppError(400, "vaccination_type が不正です。");
  const verificationStatus = enumValue(body.verification_status, [...VERIFICATION_STATUSES], "unconfirmed");

  let certificatePath = clean(body.certificate_storage_path);
  let certificateBucket = clean(body.certificate_storage_bucket) || RECORD_PHOTO_BUCKET;

  if (body.certificate_data_url) {
    const maxBytes = Math.min(Number(settings.max_record_photo_bytes || DEFAULT_PHOTO_LIMIT), HARD_PHOTO_LIMIT);
    const image = parseImageDataUrl(body.certificate_data_url, maxBytes);
    const ext = extensionForMime(image.mimeType);
    certificatePath = `${safePathSegment(shopCode)}/${safePathSegment(petId)}/certificates/${Date.now()}-${randomId()}.${ext}`;
    certificateBucket = RECORD_PHOTO_BUCKET;
    await sbStorageUpload(env, certificateBucket, certificatePath, image.bytes, image.mimeType);
  }

  const payload = {
    shop_code: shopCode,
    customer_id: clean(body.customer_id || pet.customer_id),
    pet_id: petId,
    vaccination_type: vaccinationType,
    vaccination_name: clean(body.vaccination_name),
    vaccinated_on: nullableYmd(body.vaccinated_on, "vaccinated_on"),
    expires_on: nullableYmd(body.expires_on, "expires_on"),
    verification_status: verificationStatus,
    certificate_storage_bucket: certificateBucket,
    certificate_storage_path: certificatePath,
    verified_by: verificationStatus === "confirmed" ? clean(body.verified_by || adminCode || "owner") : clean(body.verified_by),
    verified_at: verificationStatus === "confirmed" ? new Date().toISOString() : null,
    note: clean(body.note)
  };

  const vaccinationId = clean(body.vaccination_id || body.id);
  let row;
  try {
    if (vaccinationId) {
      const existing = await sbSelect(env, "petsalon_vaccinations", [
        sel("*"), eq("shop_code", shopCode), eq("id", vaccinationId), "limit=1"
      ]);
      if (!existing.length) throw new AppError(404, "ワクチン記録が見つかりません。");
      if (String(existing[0].pet_id) !== String(petId)) throw new AppError(409, "ワクチン記録とペットが一致しません。");
      const previousCertificate = clean(existing[0].certificate_storage_path);
      delete payload.shop_code;
      delete payload.pet_id;
      const rows = await sbUpdate(env, "petsalon_vaccinations", [eq("shop_code", shopCode), eq("id", vaccinationId)], payload);
      row = rows[0];
      if (body.certificate_data_url && previousCertificate && previousCertificate !== certificatePath) {
        await sbStorageDeleteQuietly(env, existing[0].certificate_storage_bucket || RECORD_PHOTO_BUCKET, previousCertificate);
      }
    } else {
      const rows = await sbInsert(env, "petsalon_vaccinations", payload);
      row = rows[0];
    }
  } catch (error) {
    if (body.certificate_data_url && certificatePath) {
      await sbStorageDeleteQuietly(env, certificateBucket, certificatePath);
    }
    throw error;
  }

  await writeAuditQuietly(env, shopCode, vaccinationId ? "vaccination_updated" : "vaccination_created", "owner", {
    pet_id: petId, vaccination_id: row?.id || vaccinationId, vaccination_type: vaccinationType, verification_status: verificationStatus
  });

  return { ok: true, shop_code: shopCode, pet_id: petId, vaccination: row };
}


async function adminDeleteVaccination(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const settings = await ensureExtensionSettings(env, shopCode);
  assertFeature(settings.vaccination_enabled, "ワクチン管理");

  const vaccinationId = clean(body.vaccination_id || body.id);
  if (!vaccinationId) throw new AppError(400, "vaccination_id が必要です。");
  const rows = await sbSelect(env, "petsalon_vaccinations", [
    sel("*"), eq("shop_code", shopCode), eq("id", vaccinationId), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "ワクチン記録が見つかりません。");
  const vaccination = rows[0];

  if (clean(vaccination.certificate_storage_path)) {
    await sbStorageDeleteQuietly(
      env,
      vaccination.certificate_storage_bucket || RECORD_PHOTO_BUCKET,
      vaccination.certificate_storage_path
    );
  }
  await sbDelete(env, "petsalon_vaccinations", [eq("shop_code", shopCode), eq("id", vaccinationId)]);
  await writeAuditQuietly(env, shopCode, "vaccination_deleted", "owner", {
    pet_id: vaccination.pet_id,
    vaccination_id: vaccinationId,
    vaccination_type: vaccination.vaccination_type
  });
  return { ok: true, shop_code: shopCode, deleted_vaccination_id: vaccinationId };
}

function summarizeVaccinations(rows) {
  const today = todayJst();
  let unconfirmedCount = 0;
  let expiredCount = 0;
  let confirmedCount = 0;
  const latestByType = {};

  for (const row of rows || []) {
    const computedExpired = row.expires_on && String(row.expires_on) < today;
    const status = computedExpired && row.verification_status !== "not_required" ? "expired" : row.verification_status;
    if (status === "unconfirmed") unconfirmedCount++;
    if (status === "expired") expiredCount++;
    if (status === "confirmed") confirmedCount++;
    if (!latestByType[row.vaccination_type]) latestByType[row.vaccination_type] = { ...row, effective_status: status };
  }

  return {
    confirmed_count: confirmedCount,
    unconfirmed_count: unconfirmedCount,
    expired_count: expiredCount,
    has_expired: expiredCount > 0,
    latest_by_type: latestByType
  };
}

// ============================================================
// Workflow / notifications
// ============================================================

async function adminUpdateWorkflow(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const reservationId = clean(body.reservation_id);
  const targetStatus = clean(body.workflow_status || body.status);
  if (!reservationId) throw new AppError(400, "reservation_id が必要です。");
  if (!WORKFLOW_STATUSES.has(targetStatus)) throw new AppError(400, "workflow_status が不正です。");

  return await applyWorkflow(env, {
    shopCode,
    reservationId,
    targetStatus,
    operationSource: enumValue(body.operation_source, ["owner", "ipad", "staff", "qr", "system"], "owner"),
    operatedBy: clean(body.operated_by || "owner"),
    note: clean(body.note),
    checkinChannel: enumValue(body.checkin_channel, ["qr", "owner", "ipad", "phone", "line"], "owner"),
    enforceSimpleMode: true
  });
}

async function applyWorkflow(env, input) {
  const extensionSettings = await ensureExtensionSettings(env, input.shopCode);
  if (input.enforceSimpleMode && extensionSettings.workflow_mode === "simple4" && !SIMPLE4_STATUSES.has(input.targetStatus) && !["cancelled", "no_show"].includes(input.targetStatus)) {
    throw new AppError(400, "この店舗は4ボタン簡単モードです。詳細状態は詳細モードで利用してください。");
  }

  const reservation = await assertLegacyReservation(env, input.shopCode, input.reservationId);
  const existingRows = await sbSelect(env, "petsalon_checkins", [
    sel("*"), eq("shop_code", input.shopCode), eq("reservation_id", input.reservationId), "limit=1"
  ]);
  const existing = existingRows[0] || null;
  const fromStatus = existing?.workflow_status || workflowFromLegacyStatus(reservation.status);
  assertWorkflowTransition(fromStatus, input.targetStatus);

  const now = new Date().toISOString();
  const checkinPayload = {
    shop_code: input.shopCode,
    reservation_id: input.reservationId,
    customer_id: clean(reservation.customer_id),
    pet_id: clean(reservation.pet_id),
    checkin_channel: input.checkinChannel,
    workflow_status: input.targetStatus,
    checked_in_at: existing?.checked_in_at || now,
    pickup_ready_at: input.targetStatus === "pickup_ready" ? now : (existing?.pickup_ready_at || null),
    handed_over_at: input.targetStatus === "handed_over" ? now : (existing?.handed_over_at || null),
    note: input.note
  };

  const checkinRows = await sbUpsert(env, "petsalon_checkins", checkinPayload, "shop_code,reservation_id");
  const legacyStatus = legacyStatusForWorkflow(input.targetStatus);

  await sbUpdate(env, "pet_salon_reservations", [
    eq("shop_code", input.shopCode), eq("id", input.reservationId)
  ], { status: legacyStatus });

  const eventRows = await sbInsert(env, "petsalon_workflow_events", {
    shop_code: input.shopCode,
    reservation_id: input.reservationId,
    customer_id: clean(reservation.customer_id),
    pet_id: clean(reservation.pet_id),
    from_status: fromStatus,
    to_status: input.targetStatus,
    legacy_reservation_status: legacyStatus,
    operation_source: input.operationSource,
    operated_by: input.operatedBy,
    note: input.note
  });

  let preparedNotification = null;
  if (input.targetStatus === "pickup_ready") {
    preparedNotification = await prepareNotificationInternal(env, {
      shopCode: input.shopCode,
      reservation,
      notificationType: "pickup_ready",
      customMessage: ""
    });
  }

  await writeAuditQuietly(env, input.shopCode, "workflow_updated", input.operationSource, {
    reservation_id: input.reservationId,
    from_status: fromStatus,
    to_status: input.targetStatus,
    legacy_status: legacyStatus
  });

  return {
    ok: true,
    shop_code: input.shopCode,
    reservation_id: input.reservationId,
    previous_workflow_status: fromStatus,
    workflow_status: input.targetStatus,
    legacy_reservation_status: legacyStatus,
    checkin: checkinRows[0] || checkinPayload,
    event: eventRows[0] || null,
    prepared_notification: preparedNotification
  };
}

function assertWorkflowTransition(fromStatus, toStatus) {
  if (fromStatus === toStatus) return;
  const allowed = {
    requested: ["confirmed", "checked_in", "cancelled", "no_show"],
    confirmed: ["checked_in", "cancelled", "no_show"],
    checked_in: ["counseling", "waiting", "grooming", "cancelled"],
    counseling: ["waiting", "grooming", "cancelled"],
    waiting: ["grooming", "cancelled"],
    grooming: ["final_check", "pickup_ready", "cancelled"],
    final_check: ["pickup_ready", "grooming"],
    pickup_ready: ["handed_over", "grooming"],
    handed_over: [],
    cancelled: [],
    no_show: []
  };
  if (!(allowed[fromStatus] || []).includes(toStatus)) {
    throw new AppError(409, `進捗を ${fromStatus} から ${toStatus} へ変更できません。`, {
      from_status: fromStatus,
      to_status: toStatus,
      allowed: allowed[fromStatus] || []
    });
  }
}

function legacyStatusForWorkflow(status) {
  if (status === "requested") return "requested";
  if (status === "confirmed") return "confirmed";
  if (["checked_in", "counseling", "waiting", "grooming", "final_check", "pickup_ready"].includes(status)) return "visited";
  if (status === "handed_over") return "completed";
  if (status === "cancelled") return "cancelled";
  if (status === "no_show") return "no_show";
  return "confirmed";
}

function workflowFromLegacyStatus(status) {
  const value = clean(status);
  if (value === "requested") return "requested";
  if (value === "confirmed") return "confirmed";
  if (value === "visited") return "checked_in";
  if (value === "completed") return "handed_over";
  if (value === "cancelled") return "cancelled";
  if (value === "no_show") return "no_show";
  return "confirmed";
}

async function adminPrepareNotification(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const reservationId = clean(body.reservation_id);
  if (!reservationId) throw new AppError(400, "reservation_id が必要です。");
  const notificationType = clean(body.notification_type || "custom");
  if (!NOTIFICATION_TYPES.has(notificationType)) throw new AppError(400, "notification_type が不正です。");
  const reservation = await assertLegacyReservation(env, shopCode, reservationId);
  const notification = await prepareNotificationInternal(env, {
    shopCode,
    reservation,
    notificationType,
    customMessage: clean(body.message_body),
    idempotencyKey: clean(body.idempotency_key) || null
  });
  return { ok: true, shop_code: shopCode, notification };
}

async function prepareNotificationInternal(env, input) {
  const extensionSettings = await ensureExtensionSettings(env, input.shopCode);
  const customer = input.reservation.customer_id ? await findOne(env, "pet_salon_customers", [
    eq("shop_code", input.shopCode), eq("id", input.reservation.customer_id)
  ]) : null;
  const pet = input.reservation.pet_id ? await findOne(env, "pet_salon_pets", [
    eq("shop_code", input.shopCode), eq("id", input.reservation.pet_id)
  ]) : null;

  const messageBody = input.customMessage || buildNotificationMessage(input.notificationType, customer, pet, input.reservation);
  const idempotencyKey = input.idempotencyKey || `${input.notificationType}:${input.reservation.id}:${todayJst()}`;

  const existing = await sbSelect(env, "petsalon_notification_logs", [
    sel("*"), eq("shop_code", input.shopCode), eq("idempotency_key", idempotencyKey), "limit=1"
  ]);
  if (existing.length) return existing[0];

  const rows = await sbInsert(env, "petsalon_notification_logs", {
    shop_code: input.shopCode,
    customer_id: clean(input.reservation.customer_id),
    pet_id: clean(input.reservation.pet_id),
    reservation_id: String(input.reservation.id),
    notification_type: input.notificationType,
    delivery_mode: extensionSettings.notification_mode || "copy",
    recipient_line_user_id: clean(customer?.line_user_id),
    message_body: messageBody,
    delivery_status: "prepared",
    idempotency_key: idempotencyKey,
    error_message: ""
  });
  return rows[0];
}

function buildNotificationMessage(type, customer, pet, reservation) {
  const ownerName = displayName(customer?.owner_name || customer?.name || "飼い主様");
  const petName = displayPetName(pet?.pet_name || reservation?.pet_name || "ペット");
  const shopName = "ペットサロン";
  if (type === "pickup_ready") return `${ownerName}\n${petName}の施術が完了し、お迎えいただける状態になりました。\nお気をつけてお越しください。\n${shopName}`;
  if (type === "checkin_received") return `${ownerName}\n${petName}の受付が完了しました。\n${shopName}`;
  if (type === "delay_notice") return `${ownerName}\n施術状況により、お迎え可能時刻が予定より遅れる可能性があります。詳細は店舗からご案内します。\n${shopName}`;
  if (type === "visit_thanks") return `${ownerName}\n本日は${petName}のご来店ありがとうございました。\n${shopName}`;
  if (type === "next_recommend") return `${ownerName}\n${petName}の次回お手入れ時期が近づいています。ご都合のよい日をご相談ください。\n${shopName}`;
  if (type === "reservation_confirmed") return `${ownerName}\n${petName}のご予約を確認しました。\n${reservation?.reservation_date || ""} ${hm(reservation?.reservation_time || "")}\n${shopName}`;
  return `${ownerName}\n${petName}について店舗からご案内があります。\n${shopName}`;
}

// ============================================================
// Staff
// ============================================================

async function adminGetStaff(env, url) {
  const { shopCode } = await requireAdminFromUrl(env, url);
  const rows = await sbSelect(env, "petsalon_staff", [
    sel("*"), eq("shop_code", shopCode), "order=is_active.desc,sort_order.asc,staff_name.asc"
  ]);
  return { ok: true, shop_code: shopCode, staff: rows };
}

async function adminSaveStaff(env, body) {
  const { shopCode } = await requireAdminFromBody(env, body);
  const staffCode = clean(body.staff_code);
  const staffName = clean(body.staff_name);
  if (!staffCode) throw new AppError(400, "staff_code が必要です。");
  if (!staffName) throw new AppError(400, "staff_name が必要です。");
  const roleCode = clean(body.role_code || "groomer");
  if (!STAFF_ROLES.has(roleCode)) throw new AppError(400, "role_code が不正です。");

  const payload = {
    shop_code: shopCode,
    staff_code: staffCode,
    staff_name: staffName,
    display_name: clean(body.display_name),
    role_code: roleCode,
    can_take_reservations: body.can_take_reservations !== false,
    can_handle_large_dog: body.can_handle_large_dog === true,
    is_active: body.is_active !== false,
    sort_order: clampInt(body.sort_order, 0, 10000, 100),
    note: clean(body.note)
  };

  const staffId = clean(body.staff_id || body.id);
  let row;
  if (staffId) {
    await assertStaff(env, shopCode, staffId);
    delete payload.shop_code;
    const rows = await sbUpdate(env, "petsalon_staff", [eq("shop_code", shopCode), eq("id", staffId)], payload);
    row = rows[0];
  } else {
    const existing = await sbSelect(env, "petsalon_staff", [
      sel("*"), eq("shop_code", shopCode), eq("staff_code", staffCode), "limit=1"
    ]);
    if (existing.length) {
      const rows = await sbUpdate(env, "petsalon_staff", [eq("shop_code", shopCode), eq("id", existing[0].id)], payload);
      row = rows[0];
    } else {
      const rows = await sbInsert(env, "petsalon_staff", payload);
      row = rows[0];
    }
  }

  await writeAuditQuietly(env, shopCode, "staff_saved", "owner", { staff_id: row?.id || staffId, staff_code: staffCode });
  return { ok: true, shop_code: shopCode, staff: row };
}

// ============================================================
// Public QR check-in
// ============================================================

async function publicCheckinCandidates(env, url) {
  const shopCode = getShopCodeFromUrl(url, env);
  const extensionSettings = await ensureExtensionSettings(env, shopCode);
  assertFeature(extensionSettings.qr_checkin_enabled, "QR受付");

  const phone = clean(url.searchParams.get("phone"));
  const lineUserId = clean(url.searchParams.get("line_user_id"));
  const date = clean(url.searchParams.get("date")) || todayJst();
  assertYmd(date, "date");
  if (!phone && !lineUserId) throw new AppError(400, "phone または line_user_id が必要です。");

  const customers = await findPublicCustomers(env, shopCode, { phone, lineUserId });
  if (!customers.length) return { ok: true, shop_code: shopCode, found: false, date, candidates: [] };
  const customerIds = customers.map(row => row.id);

  const reservations = await sbSelect(env, "pet_salon_reservations", [
    sel("*"), eq("shop_code", shopCode), inFilter("customer_id", customerIds),
    eq("reservation_date", date), inFilter("status", ["requested", "confirmed", "visited"]),
    "order=reservation_time.asc", "limit=50"
  ]);

  const petIds = unique(reservations.map(row => row.pet_id).filter(Boolean));
  const pets = petIds.length ? await sbSelect(env, "pet_salon_pets", [sel("*"), eq("shop_code", shopCode), inFilter("id", petIds)]) : [];
  const petMap = mapBy(pets, "id");

  const reservationIds = reservations.map(row => String(row.id));
  const checkins = reservationIds.length ? await sbSelect(env, "petsalon_checkins", [
    sel("*"), eq("shop_code", shopCode), inFilter("reservation_id", reservationIds)
  ]) : [];
  const checkinMap = mapBy(checkins, "reservation_id");

  const candidates = reservations.map(reservation => ({
    reservation_id: reservation.id,
    reservation_date: reservation.reservation_date,
    reservation_time: hm(reservation.reservation_time),
    service_name: reservation.service_name || reservation.menu_name || reservation.service_code || "予約メニュー",
    pet: sanitizePet(petMap.get(reservation.pet_id) || null),
    workflow_status: checkinMap.get(String(reservation.id))?.workflow_status || workflowFromLegacyStatus(reservation.status),
    can_checkin: !["grooming", "final_check", "pickup_ready", "handed_over", "cancelled", "no_show"].includes(checkinMap.get(String(reservation.id))?.workflow_status || workflowFromLegacyStatus(reservation.status))
  }));

  return { ok: true, shop_code: shopCode, found: candidates.length > 0, date, candidates };
}

async function publicCheckin(env, body) {
  const shopCode = clean(body.shop_code || env.SHOP_CODE || DEFAULT_SHOP_CODE);
  const extensionSettings = await ensureExtensionSettings(env, shopCode);
  assertFeature(extensionSettings.qr_checkin_enabled, "QR受付");

  const reservationId = clean(body.reservation_id);
  const phone = clean(body.phone);
  const lineUserId = clean(body.line_user_id);
  if (!reservationId) throw new AppError(400, "reservation_id が必要です。");
  if (!phone && !lineUserId) throw new AppError(400, "phone または line_user_id が必要です。");

  const reservation = await assertLegacyReservation(env, shopCode, reservationId);
  const customers = await findPublicCustomers(env, shopCode, { phone, lineUserId });
  if (!customers.some(row => String(row.id) === String(reservation.customer_id))) {
    throw new AppError(403, "予約と飼い主情報を確認できませんでした。");
  }
  if (String(reservation.reservation_date) !== todayJst()) {
    throw new AppError(409, "QR受付は本日の予約だけ利用できます。");
  }

  return await applyWorkflow(env, {
    shopCode,
    reservationId,
    targetStatus: "checked_in",
    operationSource: "qr",
    operatedBy: lineUserId ? "line_user" : "phone_verified",
    note: clean(body.note),
    checkinChannel: "qr",
    enforceSimpleMode: false
  });
}

async function findPublicCustomers(env, shopCode, input) {
  const map = new Map();
  if (input.lineUserId) {
    const rows = await sbSelect(env, "pet_salon_customers", [
      sel("*"), eq("shop_code", shopCode), eq("line_user_id", input.lineUserId), "order=created_at.desc", "limit=50"
    ]);
    for (const row of rows) map.set(String(row.id), row);
  }
  if (input.phone) {
    const rows = await sbSelect(env, "pet_salon_customers", [
      sel("*"), eq("shop_code", shopCode), "order=created_at.desc", "limit=1000"
    ]);
    const normalized = normalizePhone(input.phone);
    for (const row of rows) {
      if (normalizePhone(row.phone) === normalized) map.set(String(row.id), row);
    }
  }
  return [...map.values()];
}

// ============================================================
// Authentication / legacy assertions
// ============================================================

async function requireAdminFromUrl(env, url) {
  const shopCode = getShopCodeFromUrl(url, env);
  const adminCode = clean(url.searchParams.get("admin_code") || url.searchParams.get("code"));
  await assertAdmin(env, shopCode, adminCode);
  return { shopCode, adminCode };
}

async function requireAdminFromBody(env, body) {
  const shopCode = clean(body.shop_code || env.SHOP_CODE || DEFAULT_SHOP_CODE);
  const adminCode = clean(body.admin_code || body.code);
  await assertAdmin(env, shopCode, adminCode);
  return { shopCode, adminCode };
}

async function assertAdmin(env, shopCode, suppliedCode) {
  const settings = await getLegacySettings(env, shopCode);
  const expectedCode = clean(settings?.admin_code || env.ADMIN_CODE || env.DEMO_ADMIN_CODE || "");
  if (!expectedCode) throw new AppError(500, "店舗管理コードが設定されていません。");
  if (!suppliedCode || !timingSafeEqualText(suppliedCode, expectedCode)) {
    throw new AppError(401, "管理コードが違います。");
  }
  return settings;
}

async function getLegacySettings(env, shopCode) {
  const rows = await sbSelect(env, "pet_salon_settings", [
    sel("*"), eq("shop_code", shopCode), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "店舗設定が見つかりません。");
  return rows[0];
}

async function assertLegacyReservation(env, shopCode, reservationId) {
  const rows = await sbSelect(env, "pet_salon_reservations", [
    sel("*"), eq("shop_code", shopCode), eq("id", reservationId), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "予約が見つかりません。");
  return rows[0];
}

async function assertLegacyPet(env, shopCode, petId) {
  const rows = await sbSelect(env, "pet_salon_pets", [
    sel("*"), eq("shop_code", shopCode), eq("id", petId), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "ペット情報が見つかりません。");
  return rows[0];
}

async function assertPetRecord(env, shopCode, recordId) {
  const rows = await sbSelect(env, "petsalon_pet_records", [
    sel("*"), eq("shop_code", shopCode), eq("id", recordId), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "ペットカルテが見つかりません。");
  return rows[0];
}

async function assertStaff(env, shopCode, staffId) {
  const rows = await sbSelect(env, "petsalon_staff", [
    sel("*"), eq("shop_code", shopCode), eq("id", staffId), "limit=1"
  ]);
  if (!rows.length) throw new AppError(404, "スタッフが見つかりません。");
  return rows[0];
}

function assertFeature(enabled, featureName) {
  if (!enabled) throw new AppError(403, `${featureName}は店舗設定で無効になっています。`);
}

// ============================================================
// Supabase REST / Storage helpers
// ============================================================

async function sbSelect(env, table, queryParts = []) {
  return await sbRequest(env, table, { method: "GET", query: joinQuery(queryParts) });
}

async function sbInsert(env, table, body) {
  return await sbRequest(env, table, { method: "POST", body, prefer: "return=representation" });
}

async function sbUpsert(env, table, body, onConflict) {
  return await sbRequest(env, table, {
    method: "POST",
    query: `on_conflict=${encodeURIComponent(onConflict)}`,
    body,
    prefer: "resolution=merge-duplicates,return=representation"
  });
}

async function sbUpdate(env, table, queryParts, body) {
  return await sbRequest(env, table, { method: "PATCH", query: joinQuery(queryParts), body, prefer: "return=representation" });
}

async function sbDelete(env, table, queryParts) {
  return await sbRequest(env, table, { method: "DELETE", query: joinQuery(queryParts), prefer: "return=representation" });
}

async function sbRequest(env, table, options = {}) {
  const supabaseUrl = clean(env.SUPABASE_URL).replace(/\/$/, "");
  const serviceKey = getSupabaseKey(env);
  if (!supabaseUrl || !serviceKey) throw new AppError(500, "Supabase環境変数が設定されていません。");

  let url = `${supabaseUrl}/rest/v1/${encodeURIComponent(table)}`;
  if (options.query) url += `?${options.query}`;

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Accept: "application/json"
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.prefer) headers.Prefer = options.prefer;

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch (_) { data = text; }
  }

  if (!response.ok) {
    const message = data?.message || data?.error_description || data?.hint || (typeof data === "string" ? data : `Supabase error ${response.status}`);
    throw new AppError(response.status >= 500 ? 502 : response.status, message, {
      table,
      code: data?.code || null,
      details: data?.details || null,
      hint: data?.hint || null
    });
  }
  return Array.isArray(data) ? data : (data ? [data] : []);
}

async function sbStorageGetBucket(env, bucket) {
  const { url, key } = storageConfig(env);
  const response = await fetch(`${url}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
    method: "GET",
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new AppError(response.status >= 500 ? 502 : response.status, data.message || "写真保存先を確認できませんでした。");
  return data;
}

async function sbStorageUpload(env, bucket, path, bytes, mimeType) {
  const { url, key } = storageConfig(env);
  const response = await fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": mimeType,
      "x-upsert": "false"
    },
    body: bytes
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new AppError(response.status >= 500 ? 502 : response.status, `写真保存に失敗しました。${detail ? ` ${detail}` : ""}`);
  }
}

async function sbStorageDeleteQuietly(env, bucket, path) {
  if (!path) return;
  try {
    const { url, key } = storageConfig(env);
    await fetch(`${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeStoragePath(path)}`, {
      method: "DELETE",
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
  } catch (_) {
    // Metadata deletion must not be blocked by a stale storage object.
  }
}

async function sbStorageCreateSignedUrl(env, bucket, path, expiresIn = 900) {
  const { url, key } = storageConfig(env);
  const response = await fetch(`${url}/storage/v1/object/sign/${encodeURIComponent(bucket)}/${encodeStoragePath(path)}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ expiresIn })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new AppError(response.status >= 500 ? 502 : response.status, data.message || "署名付き写真URLを作成できませんでした。");
  const signed = data.signedURL || data.signedUrl || data.signed_url;
  if (!signed) return null;
  return signed.startsWith("http") ? signed : `${url}/storage/v1${signed.startsWith("/") ? "" : "/"}${signed}`;
}

function storageConfig(env) {
  const url = clean(env.SUPABASE_URL).replace(/\/$/, "");
  const key = getSupabaseKey(env);
  if (!url || !key) throw new AppError(500, "Supabase Storage環境変数が設定されていません。");
  return { url, key };
}

function getSupabaseKey(env) {
  return clean(env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY || env.SUPABASE_KEY);
}

async function findOne(env, table, filters) {
  const rows = await sbSelect(env, table, [sel("*"), ...filters, "limit=1"]);
  return rows[0] || null;
}

async function writeAuditQuietly(env, shopCode, action, actor, detail) {
  try {
    await sbInsert(env, "pet_salon_audit_logs", { shop_code: shopCode, action, actor, detail });
  } catch (_) {
    // Audit table differences must not stop the primary operation.
  }
}

// ============================================================
// Query helpers
// ============================================================

function sel(value) { return `select=${encodeURIComponent(value)}`; }
function eq(column, value) { return `${encodeURIComponent(column)}=eq.${encodeURIComponent(String(value))}`; }
function inFilter(column, values) {
  const cleanValues = unique((values || []).filter(value => value !== null && value !== undefined && value !== ""));
  const encoded = cleanValues.map(value => `"${String(value).replace(/"/g, '\\"')}"`).join(",");
  return `${encodeURIComponent(column)}=in.(${encodeURIComponent(encoded)})`;
}
function joinQuery(parts) { return (parts || []).filter(Boolean).join("&"); }
function encodeStoragePath(path) { return String(path).split("/").map(encodeURIComponent).join("/"); }

// ============================================================
// General helpers
// ============================================================

async function readJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new AppError(415, "Content-Type は application/json が必要です。");
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid");
    return body;
  } catch (_) {
    throw new AppError(400, "JSON本文を読み取れませんでした。");
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
  });
}

function normalizePath(path) {
  const value = String(path || "/").replace(/\/{2,}/g, "/");
  if (value.length > 1 && value.endsWith("/")) return value.slice(0, -1);
  return value || "/";
}

function getShopCodeFromUrl(url, env) {
  return clean(url.searchParams.get("shop_code") || env.SHOP_CODE || DEFAULT_SHOP_CODE);
}

function clean(value) { return String(value ?? "").trim(); }
function hm(value) { return clean(value).slice(0, 5); }
function unique(values) { return [...new Set((values || []).map(value => String(value)))]; }
function mapBy(rows, key) { return new Map((rows || []).map(row => [String(row?.[key]), row])); }
function groupBy(rows, key) {
  const map = new Map();
  for (const row of rows || []) {
    const value = String(row?.[key]);
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(row);
  }
  return map;
}

function boolValue(value, fallback) {
  if (value === true || value === false) return value;
  if (value === "true" || value === "1" || value === 1) return true;
  if (value === "false" || value === "0" || value === 0) return false;
  return fallback === true;
}

function enumValue(value, allowed, fallback) {
  const candidate = clean(value);
  return allowed.includes(candidate) ? candidate : fallback;
}

function clampInt(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

function nullableInt(value, min, max) {
  if (value === null || value === undefined || clean(value) === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new AppError(400, "整数値が不正です。");
  return Math.max(min, Math.min(max, Math.trunc(number)));
}

function nullableNumber(value, min, max) {
  if (value === null || value === undefined || clean(value) === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new AppError(400, "数値が不正です。");
  return number;
}

function arrayOfStrings(value, maxItems = 30) {
  const array = Array.isArray(value) ? value : (clean(value) ? [value] : []);
  return array.slice(0, maxItems).map(clean).filter(Boolean);
}

function nullableYmd(value, label) {
  if (value === null || value === undefined || clean(value) === "") return null;
  const ymd = clean(value);
  assertYmd(ymd, label);
  return ymd;
}

function assertYmd(value, label = "date") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean(value))) throw new AppError(400, `${label} は YYYY-MM-DD 形式で指定してください。`);
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new AppError(400, `${label} が不正です。`);
}

function normalizePhone(value) {
  let text = String(value ?? "").normalize("NFKC").replace(/[^0-9+]/g, "");
  if (text.startsWith("+81")) text = `0${text.slice(3)}`;
  else if (text.startsWith("81") && text.length >= 11) text = `0${text.slice(2)}`;
  return text.replace(/\D/g, "");
}

function timingSafeEqualText(a, b) {
  const left = new TextEncoder().encode(String(a));
  const right = new TextEncoder().encode(String(b));
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index++) diff |= left[index] ^ right[index];
  return diff === 0;
}

function parseImageDataUrl(value, maxBytes) {
  const dataUrl = clean(value);
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/i.exec(dataUrl);
  if (!match) throw new AppError(400, "画像はJPEG・PNG・WebPのdata URLで送信してください。");
  const mimeType = match[1].toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) throw new AppError(400, "対応していない画像形式です。");
  let bytes;
  try {
    const binary = atob(match[2].replace(/\s/g, ""));
    bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  } catch (_) {
    throw new AppError(400, "画像データを読み取れませんでした。");
  }
  if (!bytes.byteLength) throw new AppError(400, "画像データが空です。");
  if (bytes.byteLength > maxBytes) throw new AppError(413, `画像サイズは${Math.floor(maxBytes / 1024)}KB以下にしてください。`, { size_bytes: bytes.byteLength, max_bytes: maxBytes });
  return { mimeType, bytes };
}

function extensionForMime(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

function safePathSegment(value) {
  return clean(value).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 120) || "unknown";
}

function randomId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function todayJst() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
}

function sanitizeCustomer(customer) {
  if (!customer) return null;
  return {
    id: customer.id,
    owner_name: customer.owner_name || customer.name || "",
    owner_kana: customer.owner_kana || "",
    phone: customer.phone || "",
    line_display_name: customer.line_display_name || ""
  };
}

function sanitizePet(pet) {
  if (!pet) return null;
  return {
    id: pet.id,
    customer_id: pet.customer_id,
    pet_name: pet.pet_name || "",
    species: pet.species || "",
    breed: pet.breed || "",
    age_label: pet.age_label || "",
    weight: pet.weight ?? null,
    sex: pet.sex || "",
    photo_url: pet.photo_url || "",
    health_notes: pet.health_notes || "",
    dislike_notes: pet.dislike_notes || "",
    personality_notes: pet.personality_notes || "",
    favorite_style: pet.favorite_style || ""
  };
}

function displayName(value) {
  const text = clean(value);
  return text.endsWith("様") ? text : `${text || "飼い主"}様`;
}

function displayPetName(value) {
  const text = clean(value) || "ペット";
  return text.endsWith("ちゃん") || text.endsWith("くん") || text.endsWith("さん") ? text : `${text}ちゃん`;
}

// Named exports are only for local static/unit tests. Cloudflare uses default.fetch.
export const __test = {
  normalizePhone,
  legacyStatusForWorkflow,
  workflowFromLegacyStatus,
  parseImageDataUrl,
  todayJst,
  assertWorkflowTransition
};

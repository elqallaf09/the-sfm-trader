const marketTabs = document.querySelector("#market-tabs");
const introOverlay = document.querySelector("#intro-overlay");
const introGreeting = document.querySelector("#intro-greeting");
const introMessage = document.querySelector("#intro-message");
const introSkip = document.querySelector("#intro-skip");
const introAudioButton = document.querySelector("#intro-audio-button");
const cards = document.querySelector("#cards");
const unavailable = document.querySelector("#unavailable");
const marketTitle = document.querySelector("#market-title");
const marketNote = document.querySelector("#market-note");
const updatedAt = document.querySelector("#updated-at");
const opportunityCount = document.querySelector("#opportunity-count");
const buyCount = document.querySelector("#buy-count");
const sellCount = document.querySelector("#sell-count");
const avgConfidence = document.querySelector("#avg-confidence");
const aiAgentStatus = document.querySelector("#ai-agent-status");
const aiMarketCount = document.querySelector("#ai-market-count");
const aiAssetCount = document.querySelector("#ai-asset-count");
const aiBuyCount = document.querySelector("#ai-buy-count");
const aiSellCount = document.querySelector("#ai-sell-count");
const aiAverageConfidence = document.querySelector("#ai-average-confidence");
const aiMarketBias = document.querySelector("#ai-market-bias");
const aiMarketUpdate = document.querySelector("#ai-market-update");
const dataProvider = document.querySelector("#data-provider");
const bestBuy = document.querySelector("#best-buy");
const bestSell = document.querySelector("#best-sell");
const largestMove = document.querySelector("#largest-move");
const marketPulse = document.querySelector("#market-pulse");
const commandCenterBrief = document.querySelector("#command-center-brief");
const commandCenterMode = document.querySelector("#command-center-mode");
const commandCenterGrid = document.querySelector("#command-center-grid");
const analysisModeButtons = document.querySelectorAll("[data-analysis-mode]");
const radarGrid = document.querySelector("#radar-grid");
const radarMonthlyGrid = document.querySelector("#radar-monthly-grid");
const radarQuality = document.querySelector("#radar-quality");
const loadingIndicator = document.querySelector("#loading-indicator");
const connectionStatus = document.querySelector("#connection-status");
const refreshButton = document.querySelector("#refresh-button");
const notificationButton = document.querySelector("#notification-button");
const mobileNotificationButton = document.querySelector("#mobile-notification-button");
const mobileSettingsButton = document.querySelector("#mobile-settings-button");
const notificationCount = document.querySelector("#notification-count");
const notificationPanel = document.querySelector("#notification-panel");
const notificationList = document.querySelector("#notification-list");
const notificationClearButton = document.querySelector("#notification-clear-button");
const notificationCloseButton = document.querySelector("#notification-close-button");
const settingsButton = document.querySelector("#settings-button");
const railSettingsButton = document.querySelector("#rail-settings-button");
const settingsPanel = document.querySelector("#settings-panel");
const settingsCloseButton = document.querySelector("#settings-close-button");
const settingsForm = document.querySelector("#settings-form");
const settingsLanguage = document.querySelector("#settings-language");
const settingsLanguageChoices = Array.from(document.querySelectorAll("[data-language-option]"));
const settingsDisplayName = document.querySelector("#settings-display-name");
const settingsPreview = document.querySelector("#settings-preview");
const settingsEyebrow = document.querySelector("#settings-eyebrow");
const settingsTitle = document.querySelector("#settings-title");
const settingsLanguageLabel = document.querySelector("#settings-language-label");
const settingsNameLabel = document.querySelector("#settings-name-label");
const settingsPreviewLabel = document.querySelector("#settings-preview-label");
const settingsSaveButton = document.querySelector("#settings-save-button");
const terminalSearch = document.querySelector(".terminal-search");
const terminalSymbolSearch = document.querySelector("#terminal-symbol-search");
const disclaimer = document.querySelector("#disclaimer");
const template = document.querySelector("#card-template");
const tickerTape = document.querySelector("#ticker-tape");
const sessionClockCard = document.querySelector(".session-clock-card");
const sessionClock = document.querySelector("#session-clock");
const sessionZone = document.querySelector("#session-zone");
const sessionCardState = document.querySelector("#session-card-state");
const sessionCardCountdown = document.querySelector("#session-card-countdown");
const sessionCardEvent = document.querySelector("#session-card-event");
const pulseStatusCard = document.querySelector("#pulse-status-card");
const pulseSessionState = document.querySelector("#pulse-session-state");
const pulseSessionCountdown = document.querySelector("#pulse-session-countdown");
const pulseSessionEvent = document.querySelector("#pulse-session-event");
const pulseSessionClock = document.querySelector("#pulse-session-clock");
const pulseSessionZone = document.querySelector("#pulse-session-zone");
const headerSessionClock = document.querySelector("#header-session-clock");
const headerSessionZone = document.querySelector("#header-session-zone");
const sessionStateLabel = document.querySelector("#session-state-label");
const sessionCountdown = document.querySelector("#session-countdown");
const sessionNextEvent = document.querySelector("#session-next-event");
const sessionMarketName = document.querySelector("#session-market-name");
const marketHoursGrid = document.querySelector("#market-hours-grid");
const globalSessionCards = document.querySelector("#global-session-cards");
const economicNewsStatus = document.querySelector("#economic-news-status");
const economicNewsGrid = document.querySelector("#economic-news-grid");
const sfmLiveFloor = document.querySelector("#sfm-live-floor");
const sfmFloorBrief = document.querySelector("#sfm-floor-brief");
const floorAgentMood = document.querySelector("#floor-agent-mood");
const tradingMood = document.querySelector("#trading-mood");
const flowLeader = document.querySelector("#flow-leader");
const flowPressure = document.querySelector("#flow-pressure");
const floorNextMove = document.querySelector("#floor-next-move");
const floorReadiness = document.querySelector("#floor-readiness");
const floorHeatmap = document.querySelector("#floor-heatmap");
const floorHeatmapTitle = document.querySelector("#floor-heatmap-title");
const floorJumpButtons = document.querySelectorAll("[data-floor-jump]");
const marketBoard = document.querySelector("#market-board");
const livePulseGrid = document.querySelector("#live-pulse-grid");
const homeRecommendations = document.querySelector("#home-recommendations");
const homeFollowedTrades = document.querySelector("#home-followed-trades");
const homeHeatmapGrid = document.querySelector("#home-heatmap-grid");
const homeHeatmapLeader = document.querySelector("#home-heatmap-leader");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const usOutlookSection = document.querySelector("#us-outlook-section");
const usOutlookGrid = document.querySelector("#us-outlook-grid");
const usOutlookCount = document.querySelector("#us-outlook-count");
const smartAlertsList = document.querySelector("#smart-alerts-list");
const smartAlertCount = document.querySelector("#smart-alert-count");
const usDashboardSection = document.querySelector("#us-dashboard-section");
const usDashboardGrid = document.querySelector("#us-dashboard-grid");
const usBacktestScore = document.querySelector("#us-backtest-score");
const goldenGrid = document.querySelector("#golden-grid");
const goldenCount = document.querySelector("#golden-count");
const watchlistForm = document.querySelector("#watchlist-form");
const watchlistSymbol = document.querySelector("#watchlist-symbol");
const watchlistChips = document.querySelector("#watchlist-chips");
const watchlistCards = document.querySelector("#watchlist-cards");
const watchlistOnlyToggle = document.querySelector("#watchlist-only-toggle");
const portfolioForm = document.querySelector("#portfolio-form");
const portfolioSymbol = document.querySelector("#portfolio-symbol");
const portfolioQty = document.querySelector("#portfolio-qty");
const portfolioPrice = document.querySelector("#portfolio-price");
const portfolioList = document.querySelector("#portfolio-list");
const accuracyGrid = document.querySelector("#accuracy-grid");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history-button");
const voiceStartButton = document.querySelector("#voice-start-button");
const voiceStatus = document.querySelector("#voice-status");
const voiceBand = document.querySelector(".voice-band");
const voiceActivity = document.querySelector("#voice-activity");
const voiceActivityText = document.querySelector("#voice-activity-text");
const voiceTranscript = document.querySelector("#voice-transcript");
const voiceReply = document.querySelector("#voice-reply");
const voiceMonitor = document.querySelector("#voice-monitor");
const voiceMonitorNote = document.querySelector("#voice-monitor-note");
const voiceMonitorBestButton = document.querySelector("#voice-monitor-best-button");
const ollamaStatus = document.querySelector("#ollama-status");
const voiceTextForm = document.querySelector("#voice-text-form");
const voiceTextCommand = document.querySelector("#voice-text-command");
const mobileVoiceOrb = document.querySelector("#mobile-voice-orb");
const scalpForm = document.querySelector("#scalp-form");
const scalpSymbol = document.querySelector("#scalp-symbol");
const scalpSubmit = document.querySelector("#scalp-submit");
const scalpStatus = document.querySelector("#scalp-status");
const scalpQuickList = document.querySelector("#scalp-quick-list");
const scalpResult = document.querySelector("#scalp-result");

const NUMBER_LOCALE = "ar-KW-u-nu-latn";
const NUMBER_OPTIONS = { numberingSystem: "latn" };
const VOICE_RECOGNITION_LANGUAGES = ["ar-SA", "ar-KW", "ar", "en-US"];
const WATCHLIST_REFRESH_MS = 15_000;
const RECOMMENDATIONS_REFRESH_MS = 12_000;
const RECOMMENDATIONS_FORCE_REFRESH_GRACE_MS = 600;
const INTRO_DURATION_MS = 8_000;
const DEFAULT_USER_DISPLAY_NAME = "محمد";
const DEFAULT_APP_LANGUAGE = "ar";
const SUPPORTED_APP_LANGUAGES = new Set(["ar", "en", "fr"]);
const LTR_APP_LANGUAGES = new Set(["en", "fr"]);
const TRANSLATION_LANGUAGE_FALLBACK = {
  ar: "ar",
  en: "en",
  fr: "en"
};
const APP_SETTINGS_STORAGE_KEY = "the-sfm-trader-settings";
const UI_TEXT_TRANSLATIONS = {
  "تنبيهات داخلية مؤقتة": "Temporary internal notices",
  "تنبيه المخاطر": "Risk notice",
  "جميع التحليلات والمؤشرات والتوقعات المعروضة داخل SFM Trading Terminal هي لأغراض تعليمية ومعلوماتية فقط ولا تشكل نصيحة استثمارية أو توصية مالية.": "All analysis, indicators, and forecasts shown inside SFM Trading Terminal are for educational and informational purposes only and do not constitute investment advice or a financial recommendation.",
  "قد يؤدي التداول والاستثمار إلى خسارة جزء أو كامل رأس المال.": "Trading and investing may result in the loss of part or all of your capital.",
  "تنبيه الذكاء الاصطناعي": "AI notice",
  "يتم إنشاء بعض التحليلات والتوقعات باستخدام تقنيات الذكاء الاصطناعي.": "Some analysis and forecasts are generated using artificial intelligence technologies.",
  "قد تحتوي النتائج على أخطاء أو تقديرات غير دقيقة، ويجب عدم الاعتماد عليها وحدها لاتخاذ القرارات الاستثمارية.": "Results may contain errors or inaccurate estimates and should not be relied upon alone when making investment decisions.",
  "إغلاق تنبيه المخاطر": "Close risk notice",
  "إغلاق تنبيه الذكاء الاصطناعي": "Close AI notice",
  "الرئيسية": "Home",
  "الأسواق": "Markets",
  "التوصيات": "Recommendations",
  "المفضلات": "Favorites",
  "المتابعات": "Favorites",
  "التنبيهات": "Alerts",
  "الأخبار": "News",
  "الأوامر": "News",
  "الصوت": "Voice",
  "أهلاً سيدي محمد": "Welcome Sir Mohammed",
  "مساعدك SFM جاهز للتحليل ومتابعة الأسهم.": "Your SFM assistant is ready for analysis and stock monitoring.",
  "جاري فتح منصة التحليل": "Opening the analysis platform",
  "دخول سريع": "Quick entry",
  "تشغيل التحية الصوتية": "Play voice greeting",
  "SFM يتكلم": "SFM speaking",
  "الصوت جاهز": "Voice ready",
  "وكيل تحليل الأسواق": "Market Analysis Agent",
  "منصة تداول وتحليل ذكية": "Smart trading and analysis platform",
  "توقيع المنصة": "Platform signature",
  "جاري الاتصال": "Connecting",
  "الإشعارات": "Notifications",
  "الإعدادات": "Settings",
  "تحديث الآن": "Refresh now",
  "إغلاق الإعدادات": "Close settings",
  "اللغة": "Language",
  "العربية": "Arabic",
  "الاسم في الصفحة الترحيبية": "Welcome name",
  "المعاينة": "Preview",
  "مساء الخير سيدي محمد": "Good evening Sir Mohammed",
  "صباح الخير سيدي محمد": "Good morning Sir Mohammed",
  "حفظ الإعدادات": "Save settings",
  "اضبط لغة الواجهة واسم التحية بدون مغادرة شاشة التداول.": "Adjust interface language and greeting name without leaving the trading screen.",
  "ستظهر هذه العبارة في شاشة الدخول والتحية الصوتية.": "This phrase appears on the welcome screen and voice greeting.",
  "مركز الإشعارات": "Notification Center",
  "مسح الكل": "Clear all",
  "إغلاق الإشعارات": "Close notifications",
  "تنقل سريع للتطبيق": "Quick app navigation",
  "نبض": "Pulse",
  "أسواق": "Markets",
  "صوت": "Voice",
  "توصيات": "Recommendations",
  "سجل": "Log",
  "تحديث بالخلفية": "Refreshing in background",
  "يعرض آخر تحليل محفوظ": "Showing the latest saved analysis",
  "شريط السوق": "Market ticker",
  "اختيار السوق": "Market selection",
  "الأسواق": "Markets",
  "اختر السوق، وسيعرض الوكيل فرص الشراء والبيع مع الثقة والسعر المتوقع والمدة.": "Choose a market and the agent will show buy and sell opportunities with confidence, expected price, and duration.",
  "نبض السوق": "Market pulse",
  "بورصة الكويت": "Kuwait Exchange",
  "بورصة السعودية": "Saudi Exchange",
  "أسواق الإمارات": "UAE markets",
  "الإمارات": "UAE",
  "بورصة قطر": "Qatar Exchange",
  "قطر": "Qatar",
  "بورصة البحرين": "Bahrain Bourse",
  "البحرين": "Bahrain",
  "بورصة عمان": "Oman Exchange",
  "عمان": "Oman",
  "كل بورصات الخليج": "All GCC exchanges",
  "جميع الأسواق": "All markets",
  "سوق الفوركس": "Forex market",
  "سوق العملات الرقمية": "Crypto market",
  "أسهم الرعاية الصحية والطب": "Healthcare and medical stocks",
  "اسهم سلع غذائية": "Food commodity stocks",
  "هولندا، ألمانيا، فرنسا، سويسرا، بريطانيا": "Netherlands, Germany, France, Switzerland, United Kingdom",
  "اليابان، هونغ كونغ، الصين، كوريا، الهند": "Japan, Hong Kong, China, Korea, India",
  "اليابان، هونغ كونغ، الصين، كوريا": "Japan, Hong Kong, China, Korea",
  "لوحة التداول الحية": "Live trading floor",
  "لوحة النبض الحية": "Live market pulse",
  "SFM يقرأ السوق الآن ويحوّل الإشارات إلى قرارات واضحة.": "SFM is reading the market now and turning signals into clear decisions.",
  "حالة المساعد": "Assistant status",
  "جاهز يراقب السوق": "Ready and watching the market",
  "المساعد يرى زخم شراء": "Assistant sees buying momentum",
  "المساعد يرى ضغط بيع": "Assistant sees selling pressure",
  "المساعد ينتظر كسر التوازن": "Assistant is waiting for balance break",
  "النبض هابط": "pulse bearish",
  "النبض صاعد": "pulse bullish",
  "النبض متوازن": "pulse balanced",
  "SFM يراقب": "SFM watches",
  "متوسط الثقة": "Average confidence",
  "وأقوى تركيز الآن على": "and strongest focus is on",
  "قائد الحركة": "Move leader",
  "ضغط السوق": "Market pressure",
  "الحركة القادمة": "Next move",
  "جاهزية القرار": "Decision readiness",
  "خريطة حرارة الفرص": "Opportunity heatmap",
  "غرفة القيادة": "Command center",
  "المضاربة السريعة": "Fast scalping",
  "رادار الفرص": "Opportunity radar",
  "متابعة الصفقات": "Trade tracking",
  "جاهز للتنفيذ": "Ready to act",
  "انتظر تأكيد أقوى": "Wait for stronger confirmation",
  "غرفة قيادة التحليل": "Analysis command center",
  "غرفة قيادة السوق": "Market command center",
  "ملخص سريع لأقوى الفرص، المخاطر، والتنبيهات قبل الدخول على التفاصيل.": "A quick summary of strongest opportunities, risks, and alerts before opening details.",
  "وضع التحليل": "Analysis mode",
  "قيادة السوق": "Market command",
  "أوضاع التحليل": "Analysis modes",
  "مضاربة 5-15 دقيقة": "Scalping 5-15 min",
  "استثمار شهري": "Monthly investing",
  "شرعي فقط": "Sharia only",
  "مخاطرة منخفضة": "Low risk",
  "أوقات الأسواق ونبض السوق": "Market hours and pulse",
  "تابع حالة السوق الحالي، متى يفتح أو يصكر، وأوقات أهم الأسواق حسب توقيتها المحلي.": "Track the current market status, open and close countdowns, and key markets in their local time.",
  "ساعة الجلسة": "Session clock",
  "حالة السوق": "Market status",
  "العد التنازلي": "Countdown",
  "السوق الحالي": "Current market",
  "الحالة": "Status",
  "العد التنازلي": "Countdown",
  "محادثة SFM الصوتية": "SFM voice chat",
  "المحادثة الصوتية": "Voice chat",
  "جاهز للتشغيل": "Ready to start",
  "حالة المحادثة الصوتية": "Voice chat status",
  "جاهز": "Ready",
  "ابدأ المحادثة الصوتية": "Start voice chat",
  "إيقاف المحادثة الصوتية": "Stop voice chat",
  "سمعت": "Heard",
  "رد SFM": "SFM reply",
  "المراقبة الصوتية": "Voice monitoring",
  "لا توجد أسهم مراقبة": "No monitored stocks",
  "لم تضف رمزاً للمراقبة الصوتية بعد.": "No symbol has been added to voice monitoring yet.",
  "راقب أفضل فرصة": "Monitor best opportunity",
  "العقل المحلي": "Local brain",
  "فحص Ollama": "Checking Ollama",
  "إذا ظهر خطأ network اكتب الأمر هنا: شنو أشتري اليوم؟": "If a network error appears, type the command here: what should I buy today?",
  "إرسال الأمر": "Send command",
  "المضاربة": "Scalping",
  "اختر سهم أو اكتب رمزه، وسيعطيك SFM قرار مضاربة سريع بين 5 إلى 15 دقيقة.": "Choose a stock or type its symbol, and SFM will give you a fast 5 to 15 minute scalp decision.",
  "حالة المضاربة": "Scalping status",
  "مثال: AAPL أو MSFT أو TSLA": "Example: AAPL, MSFT, or TSLA",
  "حلل المضاربة": "Analyze scalp",
  "اختيارات سريعة للمضاربة": "Quick scalp picks",
  "اختر سهم لعرض توصية مضاربة فورية.": "Choose a stock to show an instant scalp recommendation.",
  "السوق الأمريكي": "US market",
  "يرتب الفرص حسب الثقة، جودة البيانات، الفريمات، والمخاطر.": "Ranks opportunities by confidence, data quality, timeframes, and risk.",
  "إشارة سريعة": "Fast signal",
  "أقل مخاطرة": "Lowest risk",
  "قرار الوضع الحالي": "Current mode decision",
  "أفضل فرصة شرعية": "Best Sharia opportunity",
  "السلع والعقود الآجلة": "Commodities and futures",
  "حسب أيام التداول المعتادة": "according to regular trading days",
  "أسهم أمريكية عالية السيولة.": "High-liquidity US stocks.",
  "أفضل عائد": "Best return",
  "لا تتداول": "Do not trade",
  "ليست نصيحة مالية. النموذج يعتمد على مؤشرات فنية بسيطة وبيانات مجانية قد تكون متأخرة أو ناقصة.": "Not financial advice. The model uses simple technical indicators and free data that may be delayed or incomplete.",
  "إجمالي الإشارات": "Total signals",
  "نسبة الوصول للهدف": "Target hit rate",
  "متوسط العائد": "Average return",
  "المختارة للمتابعة": "Selected for tracking",
  "تنبيهات هدف ووقف وتغير توصية": "Target, stop, and signal-change alerts",
  "الصفقات اللي اخترتها وتوصل لك تنبيهات عنها.": "Trades you selected and receive alerts for.",
  "وقت الإشارة": "Signal time",
  "صفقات نشطة لم تصل للهدف أو وقف الخسارة.": "Active trades that have not reached target or stop loss.",
  "آخر تحديث": "Last update",
  "عدد الفرص": "Opportunities",
  "شراء": "Buy",
  "بيع": "Sell",
  "انتظار": "Wait",
  "متوسط الثقة": "Average confidence",
  "مزود البيانات": "Data provider",
  "ملخص الوكيل": "Agent summary",
  "أفضل فرصة شراء": "Best buy opportunity",
  "أقوى إشارة بيع": "Strongest sell signal",
  "أعلى حركة متوقعة": "Highest expected move",
  "رادار الفرص والقرارات": "Opportunity and decision radar",
  "يرتب أقوى الفرص حسب جودة التحليل، توافق الفريمات، المخاطرة، حجم التداول، والهدف.": "Ranks the strongest opportunities by analysis quality, timeframe agreement, risk, volume, and target.",
  "جودة السوق": "Market quality",
  "تنبيهات ذكية": "Smart alerts",
  "شراء + مطابق للشريعة + ثقة عالية": "Buy + Sharia compliant + high confidence",
  "تظهر هنا الإشارات التي تجمع بين إشارة شراء، تصنيف شرعي، وثقة 70% أو أكثر.": "Signals that combine a buy signal, Sharia rating, and 70%+ confidence appear here.",
  "تنبيهات": "Alerts",
  "فلتر الفرص الذهبية": "Golden opportunity filter",
  "أقوى فرص شراء شرعية منخفضة المخاطر": "Strongest low-risk Sharia buy opportunities",
  "يرشح النظام الأسهم التي تجمع شراء، مطابقة للشريعة، مخاطرة مقبولة، ونتيجة اختبار خلفي جيدة.": "The system highlights stocks with buy signals, Sharia compliance, acceptable risk, and a good backtest score.",
  "فرص ذهبية": "Golden opportunities",
  "مراقبة خاصة": "Private watch",
  "قائمة مراقبة الأسهم": "Stock watchlist",
  "أضف رموزك المفضلة وخل الوكيل يركز عليها فقط وقت الحاجة.": "Add your favorite symbols and let the agent focus on them when needed.",
  "راقب قائمتي فقط": "Watch my list only",
  "مثال: AMD أو NVDA": "Example: AMD or NVDA",
  "إضافة": "Add",
  "محفظتي": "My portfolio",
  "متابعة الربح والخسارة": "Profit and loss tracking",
  "أدخل رمز السهم والكمية وسعر الشراء، والواجهة تحسب لك الأداء حسب السعر الحالي.": "Enter the symbol, quantity, and buy price, and the interface calculates performance against the current price.",
  "رمز السهم": "Stock symbol",
  "الكمية": "Quantity",
  "سعر الشراء": "Buy price",
  "إضافة للمحفظة": "Add to portfolio",
  "لوحة أمريكية متقدمة": "Advanced US dashboard",
  "ملخص القرار للسوق الأمريكي": "US market decision summary",
  "تجمع توصيات اليوم، الأسهم الشرعية فقط، أعلى مخاطرة، وأفضل نتيجة اختبار خلفي.": "Combines today's recommendations, Sharia-only stocks, highest risk, and best backtest result.",
  "خاص بالسوق الأمريكي": "US market only",
  "أسهم مرشحة للصعود خلال 1 إلى 3 أشهر": "Stocks expected to rise in 1 to 3 months",
  "كل خانة تعرض هدف السعر المتوقع والمدة: شهر، شهرين، أو 3 شهور.": "Each column shows the expected target price and duration: 1, 2, or 3 months.",
  "فرص الصعود": "Upside opportunities",
  "التوصيات": "Recommendations",
  "هذه تحليلات آلية تعليمية وليست نصيحة مالية.": "These are educational automated analyses, not financial advice.",
  "تحميل": "Loading",
  "أوضاع عرض التوصيات": "Recommendation display modes",
  "مضاربة": "Scalping",
  "أدوات التوصيات": "Recommendation tools",
  "فلترة الإشارات": "Signal filter",
  "الكل": "All",
  "فلترة شرعية": "Sharia filter",
  "كل التصنيفات": "All ratings",
  "مطابق": "Compliant",
  "غير مطابق": "Not compliant",
  "مختلف عليه": "Doubtful",
  "بحث": "Search",
  "رمز أو اسم السهم": "Symbol or stock name",
  "فرز": "Sort",
  "الأولوية": "Priority",
  "الثقة": "Confidence",
  "السكور": "Score",
  "الحركة المتوقعة": "Expected move",
  "السعر": "Price",
  "سجل التوصيات": "Recommendation history",
  "آخر إشارات الوكيل": "Latest agent signals",
  "يحفظ آخر التوصيات مع متابعة هل وصل السعر إلى الهدف لاحقاً.": "Stores the latest recommendations and tracks whether price later reached the target.",
  "مسح السجل": "Clear history",
  "تقييم دقة التوصيات": "Recommendation accuracy rating",
  "فتح التفاصيل": "Open details",
  "غلق التفاصيل": "Close details",
  "أغلق التفاصيل": "Close details",
  "أفضل الفرص الآن": "Best opportunities now",
  "صفقات تحت المتابعة": "Followed trades",
  "نبض السوق الآن": "Live market pulse",
  "حالة السوق": "Market status",
  "ينتهي خلال": "Closes in",
  "يفتح خلال": "Opens in",
  "مفتوح": "Open",
  "مغلق": "Closed",
  "الهدف": "Target",
  "ثقة": "Confidence",
  "تحليل": "Analysis",
  "رجوع للأسواق": "Back to markets",
  "نبض السوق": "Market pulse",
  "الأسهم الأمريكية": "US stocks",
  "العملات الرقمية": "Crypto",
  "السلع": "Commodities",
  "أسواق الخليج": "Gulf markets",
  "جميع الأسواق": "All markets",
  "قيادة السوق": "Market command",
  "مضاربة": "Scalping",
  "مضاربة 5-15 دقيقة": "Scalping 5-15 min",
  "استثمار شهري": "Monthly investing",
  "شرعي فقط": "Sharia only",
  "مخاطرة منخفضة": "Low risk",
  "الكل": "All",
  "كل التصنيفات": "All categories",
  "مطابق": "Compliant",
  "غير مطابق": "Not compliant",
  "مختلف عليه": "Doubtful",
  "تحميل": "Loading",
  "السعر الحالي": "Current price",
  "السعر المتوقع": "Expected price",
  "هدف 1": "Target 1",
  "هدف 2": "Target 2",
  "وقف الخسارة": "Stop loss",
  "نسبة الثقة": "Confidence",
  "زخم": "Momentum",
  "تذبذب": "Volatility",
  "المخاطرة": "Risk",
  "صحة البيانات": "Data health",
  "تحليل الفريمات": "Timeframe analysis",
  "لا توجد إشعارات محفوظة حالياً.": "No saved notifications yet.",
  "لا توجد نتائج مطابقة للبحث أو الفلتر الحالي.": "No results match the current search or filter.",
  "لا توجد بيانات": "No data",
  "لا توجد بيانات حالية": "No current data",
  "لا توجد إشارة شراء": "No buy signal",
  "لا توجد إشارة بيع": "No sell signal",
  "السوق مفتوح": "Market open",
  "السوق مغلق": "Market closed",
  "السوق": "Market",
  "رمز": "symbols",
  "متصل - بيانات مخزنة لحظيا": "Connected - live cached data",
  "متصل - بيانات جديدة": "Connected - fresh data",
  "متصل - يحدث في الخلفية": "Connected - updating in background",
  "متصل - تحليل أولي": "Connected - preliminary analysis",
  "متصل - آخر بيانات محفوظة": "Connected - latest saved data",
  "تعذر الاتصال": "Connection failed",
  "اتصال متقطع - آخر بيانات محفوظة": "Unstable connection - latest saved data",
  "تعذر": "Failed",
  "يحلل": "Analyzing",
  "جاري تحليل": "Analyzing",
  "اشتر الآن": "Buy now",
  "بيع الآن": "Sell now",
  "شراء سريع": "Fast buy",
  "بيع سريع": "Fast sell",
  "قرار المضاربة": "Scalp decision",
  "هدف سريع": "Fast target",
  "وقف سريع": "Fast stop",
  "الحركة": "Move",
  "فرصة": "Opportunity",
  "مدة": "Duration",
  "الهدف": "Target",
  "الفريمات": "Timeframes",
  "دقة السجل": "Track record accuracy",
  "رابحة": "wins",
  "خاسرة": "losses",
  "تنبيهات محفوظة": "Saved alerts",
  "صفقات مختارة للمتابعة": "followed trades",
  "تحت المتابعة": "Tracking",
  "وصل الهدف": "Target reached",
  "صفقة خاسرة": "Losing trade",
  "قائمة المتابعة": "Followed list",
  "إيقاف المتابعة": "Stop following",
  "المتابعة": "Follow",
  "آخر سعر": "Last price",
  "سعر الإشارة": "Signal price",
  "العائد الحالي": "Current return",
  "وقف الخسارة": "Stop loss",
  "تابع الصفقة": "Follow trade",
  "تمت متابعة": "Followed",
  "تم إيقاف متابعة": "Stopped following",
  "توصيات اليوم": "Today's recommendations",
  "الأسهم الشرعية فقط": "Sharia-only stocks",
  "أفضل Backtest": "Best backtest",
  "أقوى حركة متوقعة": "Strongest expected move",
  "نجاح": "win rate",
  "أضف أول رمز لقائمة المراقبة.": "Add the first symbol to the watchlist.",
  "تعذر جلب البيانات الآن": "Could not fetch data now",
  "تعذر الرد": "Could not reply",
  "تعذر جلب البيانات": "Could not fetch data",
  "جلب البيانات": "fetch data",
  "كل المزودين": "all providers",
  "الرد": "reply",
  "المزود مشغول مؤقتاً": "Provider is temporarily busy",
  "جاري تحليل الرمز": "Analyzing symbol",
  "بانتظار تحديث قائمة المراقبة": "Waiting for watchlist update",
  "تحميل مستقل": "Independent loading",
  "سيتم التحليل تلقائياً": "Will be analyzed automatically",
  "القائمة تحلل رموزها الآن حتى لو كانت من سوق آخر غير السوق المعروض.": "The list analyzes its symbols now even if they belong to a different market.",
  "أعلى مخاطرة": "Highest risk",
  "إزالة": "Remove",
  "حذف": "Delete",
  "محفظتك فارغة. أضف سهم والكمية وسعر الشراء.": "Your portfolio is empty. Add a stock, quantity, and buy price.",
  "السجل فارغ حالياً. يبدأ الحفظ بعد أول تحديث للتوصيات.": "History is empty. Saving starts after the first recommendation update.",
  "لا توجد حالياً إشارة تجمع شراء + مطابق للشريعة + ثقة فوق 70%.": "No signal currently combines buy + Sharia compliant + confidence above 70%.",
  "لا توجد فرصة ذهبية مكتملة الشروط حالياً. راقب التحديثات أو وسع السوق المختار.": "No fully qualified golden opportunity right now. Watch updates or widen the selected market."
};
const UI_TEXT_TRANSLATION_ENTRIES = Object.entries(UI_TEXT_TRANSLATIONS).sort((a, b) => b[0].length - a[0].length);
const COMMON_UI_TERM_TRANSLATIONS = [
  ["المفضلات", "Favorites"],
  ["الأخبار", "News"],
  ["بورصة الكويت", "Kuwait Exchange"],
  ["بورصة السعودية", "Saudi Exchange"],
  ["أسواق الإمارات", "UAE markets"],
  ["الإمارات", "UAE"],
  ["بورصة قطر", "Qatar Exchange"],
  ["قطر", "Qatar"],
  ["بورصة البحرين", "Bahrain Bourse"],
  ["البحرين", "Bahrain"],
  ["بورصة عمان", "Oman Exchange"],
  ["عمان", "Oman"],
  ["اليابان، هونغ كونغ، الصين، كوريا", "Japan, Hong Kong, China, Korea"],
  ["الفوركس", "Forex"],
  ["العملات الرقمية", "Crypto"],
  ["الذهب والفضة والنفط", "Gold, silver, and oil"],
  ["أسهم الذكاء الاصطناعي", "AI stocks"],
  ["أسهم التقنية", "Technology stocks"],
  ["أسهم توزيعات الأرباح", "Dividend stocks"],
  ["أسهم الرعاية الصحية والطب", "Healthcare and medical stocks"],
  ["اسهم سلع غذائية", "Food commodity stocks"],
  ["مطابق للشريعة", "Sharia compliant"],
  ["غير مطابق في السوق الحالي", "Unavailable in current market"],
  ["شغل راقب قائمتي فقط", "Enable watch my list only"],
  ["المساعد يرى زخم شراء", "Assistant sees buying momentum"],
  ["المساعد يرى ضغط بيع", "Assistant sees selling pressure"],
  ["المساعد ينتظر كسر التوازن", "Assistant is waiting for balance break"],
  ["قرار الوضع الحالي", "Current mode decision"],
  ["أفضل فرصة شرعية", "Best Sharia opportunity"],
  ["السلع والعقود الآجلة", "Commodities and futures"],
  ["حسب أيام التداول المعتادة", "according to regular trading days"],
  ["أسهم أمريكية عالية السيولة.", "High-liquidity US stocks."],
  ["ليست نصيحة مالية. النموذج يعتمد على مؤشرات فنية بسيطة وبيانات مجانية قد تكون متأخرة أو ناقصة.", "Not financial advice. The model uses simple technical indicators and free data that may be delayed or incomplete."],
  ["إشارات حققت", "signals reached"],
  ["إشارات وصلت", "signals reached"],
  ["إجمالي الإشارات", "Total signals"],
  ["نسبة الوصول للهدف", "Target hit rate"],
  ["متوسط العائد", "Average return"],
  ["المختارة للمتابعة", "Selected for tracking"],
  ["تنبيهات هدف ووقف وتغير توصية", "Target, stop, and signal-change alerts"],
  ["الصفقات اللي اخترتها وتوصل لك تنبيهات عنها.", "Trades you selected and receive alerts for."],
  ["وقت الإشارة", "Signal time"],
  ["صفقات نشطة لم تصل للهدف أو وقف الخسارة.", "Active trades that have not reached target or stop loss."],
  ["النبض هابط", "pulse bearish"],
  ["النبض صاعد", "pulse bullish"],
  ["النبض متوازن", "pulse balanced"],
  ["SFM يراقب", "SFM watches"],
  ["متوسط الثقة", "Average confidence"],
  ["وأقوى تركيز الآن على", "and strongest focus is on"],
  ["السعر الحالي", "Current price"],
  ["السعر المتوقع", "Expected price"],
  ["وقف الخسارة", "Stop loss"],
  ["نسبة الثقة", "Confidence"],
  ["صحة البيانات", "Data health"],
  ["تحليل الفريمات", "Timeframe analysis"],
  ["الفريمات", "Timeframes"],
  ["الحالي", "Current"],
  ["الهدف", "Target"],
  ["المدة", "Duration"],
  ["ثقة", "confidence"],
  ["بيانات", "data"],
  ["تداول", "Volume"],
  ["فريم", "Timeframe"],
  ["الدقيقة", "1 minute"],
  ["ساعة", "hour"],
  ["يوم", "day"],
  ["أسبوع", "week"],
  ["أسابيع", "weeks"],
  ["شهرين", "two months"],
  ["شهر", "month"],
  ["شراء", "Buy"],
  ["بيع", "Sell"],
  ["انتظار", "Wait"],
  ["صاعد", "bullish"],
  ["هابط", "bearish"],
  ["متوازن", "balanced"],
  ["خلال", "within"],
  ["وقف", "Stop"],
  ["مخاطرة", "Risk"],
  ["الصعود", "Upside"],
  ["أقوى", "Strongest"],
  ["أكثر", "Most"],
  ["رابحة", "wins"],
  ["خاسرة", "losses"],
  ["مساء", "Evening"],
  ["دائماً", "always"],
  ["لا تتداول", "Do not trade"],
  ["أفضل عائد", "Best return"],
  ["عالية", "High"],
  ["متوسطة", "Medium"],
  ["منخفضة", "Low"],
  ["ضعيفة", "Weak"],
  ["نجاح", "Win rate"],
  ["مغلقة", "Closed"],
  ["السهم", "Symbol"],
  ["التنبيه", "Alert"],
  ["تحديث", "Update"],
  ["صفقات", "Trades"],
  ["المسجل", "recorded"],
  ["حالياً", "currently"],
  ["بعد", "in"],
  ["الآن", "now"],
  ["الأحد", "Sunday"],
  ["الاثنين", "Monday"],
  ["الثلاثاء", "Tuesday"],
  ["الأربعاء", "Wednesday"],
  ["الخميس", "Thursday"],
  ["الجمعة", "Friday"],
  ["السبت", "Saturday"],
  ["ص", "AM"],
  ["م", "PM"],
  ["السعر", "price"],
  ["مفتوح", "open"],
  ["مغلق", "closed"],
  ["يفتح", "opens"],
  ["يصكر", "closes"],
  ["يغلق", "closes"],
  ["بتوقيت", "time"],
  ["من", "from"],
  ["إلى", "to"],
  ["لا توجد", "No"],
  ["جاري", "Loading"],
  ["تعذر", "Failed"],
  ["أضف", "Add"],
  ["حذف", "Delete"],
  ["إزالة", "Remove"],
  ["فتح", "Open"],
  ["غلق", "Close"]
].sort((a, b) => b[0].length - a[0].length);
const UI_TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label"];
const NAVIGATION_LABELS = {
  home: { ar: "الرئيسية", en: "Home" },
  markets: { ar: "الأسواق", en: "Markets" },
  recommendations: { ar: "التوصيات", en: "Signals" },
  favorites: { ar: "المفضلات", en: "Favorites" },
  alerts: { ar: "التنبيهات", en: "Alerts" },
  news: { ar: "الأخبار", en: "News" },
  voice: { ar: "Voice", en: "Voice" },
  pulse: { ar: "نبض", en: "Pulse" },
  "markets-short": { ar: "أسواق", en: "Markets" },
  "voice-short": { ar: "صوت", en: "Voice" },
  scalp: { ar: "مضاربة", en: "Scalping" },
  signals: { ar: "توصيات", en: "Signals" }
};
Object.assign(NAVIGATION_LABELS, {
  home: { ar: "الرئيسية", en: "Home" },
  markets: { ar: "الأسواق", en: "Markets" },
  recommendations: { ar: "التوصيات", en: "Signals" },
  favorites: { ar: "قائمة المراقبة", en: "Watchlist" },
  portfolio: { ar: "المحفظة", en: "Portfolio" },
  trades: { ar: "سجل الصفقات", en: "Trade Log" },
  opportunities: { ar: "الفرص", en: "Opportunities" },
  alerts: { ar: "التنبيهات", en: "Alerts" },
  news: { ar: "الأخبار", en: "News" },
  calendar: { ar: "التقويم", en: "Calendar" },
  "ai-analysis": { ar: "تحليل الذكاء الاصطناعي", en: "AI Analysis" },
  education: { ar: "التعليم", en: "Education" },
  settings: { ar: "الإعدادات", en: "Settings" },
  voice: { ar: "الصوت", en: "Voice" },
  pulse: { ar: "نبض", en: "Pulse" },
  "markets-short": { ar: "أسواق", en: "Markets" },
  "voice-short": { ar: "صوت", en: "Voice" },
  scalp: { ar: "مضاربة", en: "Scalping" },
  signals: { ar: "توصيات", en: "Signals" }
});

const SETTINGS_PANEL_TEXT = {
  ar: {
    ".settings-card-profile .settings-card-head span": "Profile",
    ".settings-card-profile .settings-card-head strong": "الملف الشخصي",
    ".settings-card-profile .settings-preview small": "تستخدم هذه العبارة في شاشة الدخول والتحية الصوتية.",
    "#settings-form > .settings-card:nth-of-type(2) .settings-card-head span": "Preferences",
    "#settings-form > .settings-card:nth-of-type(2) .settings-card-head strong": "تفضيلات الحساب",
    "#settings-form > .settings-card:nth-of-type(2) .settings-switch span": "استخدام الأرقام الإنجليزية داخل الواجهة",
    "#settings-form > .settings-card:nth-of-type(3) .settings-card-head span": "Notifications",
    "#settings-form > .settings-card:nth-of-type(3) .settings-card-head strong": "التنبيهات",
    "#settings-form > .settings-card:nth-of-type(3) .settings-switch:nth-of-type(1) span": "تنبيه عند وصول الصفقة إلى الهدف",
    "#settings-form > .settings-card:nth-of-type(3) .settings-switch:nth-of-type(2) span": "تنبيه صوتي للفرص عالية الثقة",
    "#settings-form > .settings-card:nth-of-type(4) .settings-card-head span": "Trading",
    "#settings-form > .settings-card:nth-of-type(4) .settings-card-head strong": "تفضيلات التداول",
    "#settings-form > .settings-card:nth-of-type(4) .settings-field span": "نمط التحليل الافتراضي",
    "#settings-form > .settings-card:nth-of-type(4) .settings-switch span": "عرض الأسهم المطابقة للشريعة فقط",
    "#settings-form > .settings-card:nth-of-type(5) .settings-card-head span": "Security",
    "#settings-form > .settings-card:nth-of-type(5) .settings-card-head strong": "الأمان",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(2) span": "حفظ البيانات",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(2) strong": "محلي على جهازك",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(3) span": "حالة الجلسة",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(3) strong": "نشطة",
    "#settings-form > .settings-card:nth-of-type(6) .settings-card-head span": "Plan",
    "#settings-form > .settings-card:nth-of-type(6) .settings-card-head strong": "الاشتراك والخطة",
    "#settings-form > .settings-card:nth-of-type(6) p": "نسخة خاصة للتطوير والمتابعة قبل النشر العام.",
    "#settings-form > .settings-card:nth-of-type(7) .settings-card-head span": "Support",
    "#settings-form > .settings-card:nth-of-type(7) .settings-card-head strong": "الدعم وعن التطبيق",
    "#settings-form > .settings-card:nth-of-type(7) .settings-info-row:nth-of-type(2) span": "التطبيق",
    "#settings-form > .settings-card:nth-of-type(7) .settings-info-row:nth-of-type(3) span": "الحقوق"
  },
  en: {
    ".settings-card-profile .settings-card-head span": "Profile",
    ".settings-card-profile .settings-card-head strong": "Profile",
    ".settings-card-profile .settings-preview small": "This phrase is used on the welcome screen and voice greeting.",
    "#settings-form > .settings-card:nth-of-type(2) .settings-card-head span": "Preferences",
    "#settings-form > .settings-card:nth-of-type(2) .settings-card-head strong": "Account preferences",
    "#settings-form > .settings-card:nth-of-type(2) .settings-switch span": "Use English numerals across the interface",
    "#settings-form > .settings-card:nth-of-type(3) .settings-card-head span": "Notifications",
    "#settings-form > .settings-card:nth-of-type(3) .settings-card-head strong": "Notifications",
    "#settings-form > .settings-card:nth-of-type(3) .settings-switch:nth-of-type(1) span": "Alert when a trade reaches its target",
    "#settings-form > .settings-card:nth-of-type(3) .settings-switch:nth-of-type(2) span": "Voice alert for high confidence opportunities",
    "#settings-form > .settings-card:nth-of-type(4) .settings-card-head span": "Trading",
    "#settings-form > .settings-card:nth-of-type(4) .settings-card-head strong": "Trading preferences",
    "#settings-form > .settings-card:nth-of-type(4) .settings-field span": "Default analysis mode",
    "#settings-form > .settings-card:nth-of-type(4) .settings-switch span": "Show Sharia-compliant stocks only",
    "#settings-form > .settings-card:nth-of-type(5) .settings-card-head span": "Security",
    "#settings-form > .settings-card:nth-of-type(5) .settings-card-head strong": "Security",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(2) span": "Data storage",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(2) strong": "Local on your device",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(3) span": "Session status",
    "#settings-form > .settings-card:nth-of-type(5) .settings-info-row:nth-of-type(3) strong": "Active",
    "#settings-form > .settings-card:nth-of-type(6) .settings-card-head span": "Plan",
    "#settings-form > .settings-card:nth-of-type(6) .settings-card-head strong": "Subscription / plan",
    "#settings-form > .settings-card:nth-of-type(6) p": "Private build for development and monitoring before public release.",
    "#settings-form > .settings-card:nth-of-type(7) .settings-card-head span": "Support",
    "#settings-form > .settings-card:nth-of-type(7) .settings-card-head strong": "Support / about",
    "#settings-form > .settings-card:nth-of-type(7) .settings-info-row:nth-of-type(2) span": "App",
    "#settings-form > .settings-card:nth-of-type(7) .settings-info-row:nth-of-type(3) span": "Credits"
  }
};
Object.assign(SETTINGS_PANEL_TEXT.ar, {
  ".settings-card-profile .settings-card-head span": "الملف",
  "#settings-form > .settings-card:nth-of-type(2) .settings-card-head span": "التفضيلات",
  "#settings-form > .settings-card:nth-of-type(3) .settings-card-head span": "التنبيهات",
  "#settings-form > .settings-card:nth-of-type(4) .settings-card-head span": "التداول",
  "#settings-form > .settings-card:nth-of-type(5) .settings-card-head span": "الأمان",
  "#settings-form > .settings-card:nth-of-type(6) .settings-card-head span": "الخطة",
  "#settings-form > .settings-card:nth-of-type(7) .settings-card-head span": "الدعم"
});

const EXTRA_UI_TEXT_TRANSLATIONS = {
  "الرئيسية": "Home",
  "الأسواق": "Markets",
  "التوصيات": "Signals",
  "قائمة المراقبة": "Watchlist",
  "المحفظة": "Portfolio",
  "سجل الصفقات": "Trade Log",
  "الأخبار": "News",
  "التقويم": "Calendar",
  "التعليم": "Education",
  "تحليل الذكاء الاصطناعي": "AI Analysis",
  "خريطة جلسات التداول العالمية": "Global Trading Session Map",
  "حالة الجلسات": "Session Status",
  "مفتوح": "Open",
  "مغلق": "Closed",
  "الصفقات الرابحة": "Winning Trades",
  "الصفقات الخاسرة": "Losing Trades",
  "صفقات الانتظار": "Waiting Trades",
  "صفقات تحت المتابعة": "Trades Under Review",
  "الرمز": "Symbol",
  "الإجراء": "Action",
  "الدخول": "Entry",
  "الحالي": "Current",
  "الهدف": "Target",
  "وقف الخسارة": "Stop Loss",
  "الثقة": "Confidence",
  "الربح / الخسارة": "P/L",
  "الحالة": "Status",
  "التاريخ": "Date",
  "حالة مزود البيانات": "Provider Status",
  "الرموز المدعومة": "Supported Symbols",
  "سبب عدم التوفر": "Why Data Is Unavailable",
  "بيانات السوق": "Market Data",
  "إعدادات المنصة": "Platform Settings"
};

const originalTextByNode = new WeakMap();
let uiTranslationObserver = null;
let isTranslatingInterface = false;
let queuedInterfaceTranslation = false;
const SHARED_TRADE_SYNC_DEBOUNCE_MS = 800;
const SHARED_TRADE_POLL_MS = 10_000;
const REMOVED_FOLLOWED_TRADE_LIMIT = 240;
const NOTIFICATION_SAVE_DEBOUNCE_MS = 800;
const NOTIFICATION_LIMIT = 200;
const MARKET_TIME_ZONES = {
  forex: ["Europe/London", "London FX"],
  crypto: ["UTC", "UTC 24/7"],
  kuwait: ["Asia/Kuwait", "Kuwait"],
  saudi: ["Asia/Riyadh", "Riyadh"],
  uae: ["Asia/Dubai", "Dubai"],
  qatar: ["Asia/Qatar", "Doha"],
  bahrain: ["Asia/Bahrain", "Bahrain"],
  oman: ["Asia/Muscat", "Muscat"],
  gcc: ["Asia/Kuwait", "GCC"],
  us: ["America/New_York", "New York"],
  europe: ["Europe/London", "London"],
  asia: ["Asia/Tokyo", "Tokyo"],
  world: ["UTC", "Global UTC"],
  ai: ["America/New_York", "AI Stocks"],
  tech: ["America/New_York", "Technology"],
  dividends: ["America/New_York", "Dividend Stocks"],
  healthcare: ["America/New_York", "Healthcare"],
  commodities: ["America/New_York", "Commodities"],
  food: ["America/New_York", "Food & Agriculture"],
  watchlist: ["Asia/Kuwait", "Kuwait"]
};
Object.assign(MARKET_TIME_ZONES, {
  banking: ["America/New_York", "Banking"],
  energy: ["America/New_York", "Energy"],
  semiconductors: ["America/New_York", "Semiconductors"]
});
const WEEKDAYS = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};
const MARKET_SESSIONS = {
  forex: { type: "weekly", timeZone: "America/New_York", label: "New York FX", openDay: 0, open: "17:00", closeDay: 5, close: "17:00" },
  crypto: { type: "always", timeZone: "UTC", label: "UTC 24/7" },
  kuwait: { type: "regular", timeZone: "Asia/Kuwait", label: "Kuwait", days: [0, 1, 2, 3, 4], open: "09:00", close: "13:15" },
  saudi: { type: "regular", timeZone: "Asia/Riyadh", label: "Riyadh", days: [0, 1, 2, 3, 4], open: "10:00", close: "15:00" },
  uae: { type: "regular", timeZone: "Asia/Dubai", label: "Dubai", days: [1, 2, 3, 4, 5], open: "10:00", close: "15:00" },
  qatar: { type: "regular", timeZone: "Asia/Qatar", label: "Doha", days: [0, 1, 2, 3, 4], open: "09:30", close: "13:15" },
  bahrain: { type: "regular", timeZone: "Asia/Bahrain", label: "Bahrain", days: [0, 1, 2, 3, 4], open: "09:30", close: "13:00" },
  oman: { type: "regular", timeZone: "Asia/Muscat", label: "Muscat", days: [0, 1, 2, 3, 4], open: "10:00", close: "14:00" },
  gcc: { type: "regular", timeZone: "Asia/Kuwait", label: "GCC", days: [0, 1, 2, 3, 4], open: "09:00", close: "15:00" },
  us: { type: "regular", timeZone: "America/New_York", label: "New York", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" },
  europe: { type: "regular", timeZone: "Europe/London", label: "London", days: [1, 2, 3, 4, 5], open: "08:00", close: "16:30" },
  asia: { type: "regular", timeZone: "Asia/Tokyo", label: "Tokyo", days: [1, 2, 3, 4, 5], open: "09:00", close: "15:00" },
  world: { type: "always", timeZone: "UTC", label: "Global UTC" },
  ai: { type: "regular", timeZone: "America/New_York", label: "New York", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" },
  tech: { type: "regular", timeZone: "America/New_York", label: "New York", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" },
  dividends: { type: "regular", timeZone: "America/New_York", label: "New York", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" },
  healthcare: { type: "regular", timeZone: "America/New_York", label: "New York", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" },
  commodities: { type: "weekly", timeZone: "America/New_York", label: "Commodity Futures", openDay: 0, open: "18:00", closeDay: 5, close: "17:00" },
  food: { type: "weekly", timeZone: "America/New_York", label: "Commodity/Food", openDay: 0, open: "18:00", closeDay: 5, close: "17:00" },
  watchlist: { type: "regular", timeZone: "Asia/Kuwait", label: "Kuwait", days: [0, 1, 2, 3, 4], open: "09:00", close: "15:00" }
};
Object.assign(MARKET_SESSIONS, {
  banking: MARKET_SESSIONS.us,
  energy: MARKET_SESSIONS.us,
  semiconductors: MARKET_SESSIONS.us
});
const EXCHANGE_SESSION_KNOWLEDGE = {
  kuwait: { name: "بورصة الكويت", session: MARKET_SESSIONS.kuwait },
  saudi: { name: "بورصة السعودية", session: MARKET_SESSIONS.saudi },
  uae: { name: "أسواق الإمارات", session: MARKET_SESSIONS.uae },
  qatar: { name: "بورصة قطر", session: MARKET_SESSIONS.qatar },
  bahrain: { name: "بورصة البحرين", session: MARKET_SESSIONS.bahrain },
  oman: { name: "بورصة عمان", session: MARKET_SESSIONS.oman },
  us: { name: "السوق الأمريكي", session: MARKET_SESSIONS.us },
  healthcare: { name: "أسهم الرعاية الصحية والطب", session: MARKET_SESSIONS.healthcare },
  canada: { name: "كندا", session: { type: "regular", timeZone: "America/Toronto", label: "Toronto", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" } },
  brazil: { name: "البرازيل", session: { type: "regular", timeZone: "America/Sao_Paulo", label: "Sao Paulo", days: [1, 2, 3, 4, 5], open: "10:00", close: "17:00" } },
  uk: { name: "بريطانيا", session: { type: "regular", timeZone: "Europe/London", label: "London", days: [1, 2, 3, 4, 5], open: "08:00", close: "16:30" } },
  germany: { name: "ألمانيا", session: { type: "regular", timeZone: "Europe/Berlin", label: "Frankfurt", days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30" } },
  france: { name: "فرنسا", session: { type: "regular", timeZone: "Europe/Paris", label: "Paris", days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30" } },
  netherlands: { name: "هولندا", session: { type: "regular", timeZone: "Europe/Amsterdam", label: "Amsterdam", days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30" } },
  switzerland: { name: "سويسرا", session: { type: "regular", timeZone: "Europe/Zurich", label: "Zurich", days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30" } },
  japan: { name: "اليابان", session: MARKET_SESSIONS.asia },
  hongkong: { name: "هونغ كونغ", session: { type: "regular", timeZone: "Asia/Hong_Kong", label: "Hong Kong", days: [1, 2, 3, 4, 5], open: "09:30", close: "16:00" } },
  china: { name: "الصين", session: { type: "regular", timeZone: "Asia/Shanghai", label: "Shanghai", days: [1, 2, 3, 4, 5], open: "09:30", close: "15:00" } },
  korea: { name: "كوريا الجنوبية", session: { type: "regular", timeZone: "Asia/Seoul", label: "Seoul", days: [1, 2, 3, 4, 5], open: "09:00", close: "15:30" } },
  india: { name: "الهند", session: { type: "regular", timeZone: "Asia/Kolkata", label: "Mumbai", days: [1, 2, 3, 4, 5], open: "09:15", close: "15:30" } },
  australia: { name: "أستراليا", session: { type: "regular", timeZone: "Australia/Sydney", label: "Sydney", days: [1, 2, 3, 4, 5], open: "10:00", close: "16:00" } },
  singapore: { name: "سنغافورة", session: { type: "regular", timeZone: "Asia/Singapore", label: "Singapore", days: [1, 2, 3, 4, 5], open: "09:00", close: "17:00" } },
  forex: { name: "الفوركس", session: MARKET_SESSIONS.forex },
  commodities: { name: "السلع والعقود الآجلة", session: MARKET_SESSIONS.commodities },
  crypto: { name: "العملات الرقمية", session: MARKET_SESSIONS.crypto }
};
const MARKET_HOURS_IDS = [
  "kuwait",
  "saudi",
  "uae",
  "qatar",
  "bahrain",
  "oman",
  "us",
  "healthcare",
  "forex",
  "commodities",
  "crypto"
];
const ASSET_QUERY_ALIASES = [
  { pattern: /(ذهب|gold)/, symbol: "GC=F", name: "الذهب" },
  { pattern: /(فضه|فضة|silver)/, symbol: "SI=F", name: "الفضة" },
  { pattern: /(نفط|خام|wti|oil)/, symbol: "CL=F", name: "نفط WTI" },
  { pattern: /(برنت|brent)/, symbol: "BZ=F", name: "نفط برنت" },
  { pattern: /(غاز|gas)/, symbol: "NG=F", name: "الغاز الطبيعي" },
  { pattern: /(نحاس|copper)/, symbol: "HG=F", name: "النحاس" },
  { pattern: /(قهوه|قهوة|coffee)/, symbol: "KC=F", name: "القهوة" },
  { pattern: /(كاكاو|ككاو|cocoa)/, symbol: "CC=F", name: "الكاكاو" }
];
const MARKET_TOPIC_ALIASES = [
  { id: "ai", pattern: /(ذكاء اصطناعي|الذكاء|ai|artificial intelligence)/, label: "أسهم الذكاء الاصطناعي" },
  { id: "tech", pattern: /(تقنيه|تقنية|تكنولوجيا|tech|technology)/, label: "أسهم التقنية" },
  { id: "dividends", pattern: /(توزيع|توزيعات|ارباح|أرباح|dividend|dividends)/, label: "أسهم توزيعات الأرباح" },
  { id: "healthcare", pattern: /(طبي|طبيه|طبية|الطب|رعايه صحيه|رعاية صحية|صحيه|صحية|ادويه|أدوية|دواء|مستشفى|مستشفيات|بيوتك|بايوتك|healthcare|health care|medical|pharma|biotech|hospital)/, label: "أسهم الرعاية الصحية والطب" },
  { id: "food", pattern: /(طعام|اغذيه|أغذية|قهوه|قهوة|كاكاو|ككاو|coffee|cocoa|food)/, label: "اسهم سلع غذائية" },
  { id: "commodities", pattern: /(ذهب|فضه|فضة|نفط|برنت|غاز|نحاس|سلع|commodities|gold|silver|oil)/, label: "الذهب والفضة والنفط" }
];

const SYMBOL_ALIASES = {
  APPLE: "AAPL",
  APPL: "AAPL",
  MICROSOFT: "MSFT",
  MS: "MSFT",
  NVD: "NVDA",
  NVIDIA: "NVDA",
  TESLA: "TSLA",
  GOOGLE: "GOOGL",
  ALPHABET: "GOOGL",
  AMAZON: "AMZN",
  META: "META",
  FACEBOOK: "META",
  KFH: "KFH.KW",
  NBK: "NBK.KW",
  ZAIN: "ZAIN.KW",
  USDJPY: "USDJPY=X",
  EURUSD: "EURUSD=X",
  GBPUSD: "GBPUSD=X",
  USDCHF: "USDCHF=X",
  AUDUSD: "AUDUSD=X",
  USDCAD: "USDCAD=X",
  NZDUSD: "NZDUSD=X",
  EURGBP: "EURGBP=X",
  US100: "^NDX",
  NAS100: "^NDX",
  NASDAQ100: "^NDX",
  NDX: "^NDX",
  US500: "^GSPC",
  SPX500: "^GSPC",
  SP500: "^GSPC",
  SPX: "^GSPC",
  US30: "^DJI",
  DJ30: "^DJI",
  DOW: "^DJI",
  DJI: "^DJI",
  US2000: "^RUT",
  RUSSELL2000: "^RUT",
  RUT: "^RUT",
  VIX: "^VIX",
  GER40: "^GDAXI",
  DAX40: "^GDAXI",
  DAX: "^GDAXI",
  UK100: "^FTSE",
  FTSE: "^FTSE",
  JP225: "^N225",
  NIKKEI: "^N225",
  HK50: "^HSI",
  HSI: "^HSI",
  BTC: "BTC-USD",
  BITCOIN: "BTC-USD",
  ETH: "ETH-USD",
  ETHEREUM: "ETH-USD",
  BNB: "BNB-USD",
  SOL: "SOL-USD",
  SOLANA: "SOL-USD",
  XRP: "XRP-USD",
  ADA: "ADA-USD",
  CARDANO: "ADA-USD",
  DOGE: "DOGE-USD",
  AVAX: "AVAX-USD",
  LINK: "LINK-USD",
  DOT: "DOT-USD"
};

const STORAGE_PREFIX = "the-sfm-trader-";
const LEGACY_STORAGE_PREFIX = "the-sfm-";
const TEMPORARY_LEGAL_NOTICE_STORAGE_KEY = "the-sfm-trader-dismissed-legal-notices";
const APP_VIEW_GROUPS = {
  home: ["#sfm-live-floor", "#markets-section", "#command-center-section", "#home-heatmap-section", "#home-deck-section", "#economic-news-section", "#recommendations-section", "#temporary-legal-notices"],
  markets: ["#markets-section", ".summary-band", ".insight-band", "#calendar-section", "#economic-news-section", "#radar-section"],
  ai: ["#sfm-live-floor", "#command-center-section", "#radar-section", "#smart-alerts-section", "#golden-section", "#recommendations-section"],
  recommendations: ["#markets-section", ".summary-band", ".insight-band", "#command-center-section", "#recommendations-section", "#temporary-legal-notices", "#us-dashboard-section", "#us-outlook-section"],
  watchlist: ["#markets-section", "#watchlist-section", ".summary-band", ".insight-band"],
  portfolio: ["#markets-section", "#portfolio-section", ".summary-band", ".insight-band"],
  history: ["#history-section"],
  news: ["#economic-news-section", "#smart-alerts-section"],
  calendar: ["#calendar-section", "#economic-news-section"],
  education: ["#education-section", "#radar-section"],
  alerts: ["#markets-section", "#history-section"],
  scalp: ["#markets-section", "#scalping-section"],
  voice: ["#markets-section", "#voice-section"]
};

const PRIMARY_MARKET_KEYS = new Set(["forex", "us", "crypto", "commodities", "gcc"]);
const PRIMARY_MARKET_ORDER = {
  forex: 0,
  us: 1,
  crypto: 2,
  commodities: 3,
  gcc: 4
};
const MARKET_PRIMARY_LABELS_AR = {
  forex: "الفوركس",
  us: "الأسهم الأمريكية",
  crypto: "العملات الرقمية",
  commodities: "السلع",
  gcc: "أسواق الخليج"
};
const MARKET_PRIMARY_LABELS_EN = {
  forex: "Forex",
  us: "US stocks",
  crypto: "Crypto",
  commodities: "Commodities",
  gcc: "Gulf markets"
};

const MARKET_CATEGORY_ORDER = [
  "forex",
  "us",
  "crypto",
  "commodities",
  "gcc",
  "saudi",
  "kuwait",
  "uae",
  "qatar",
  "bahrain",
  "oman",
  "europe",
  "asia",
  "tech",
  "food",
  "healthcare",
  "banking",
  "energy",
  "ai",
  "semiconductors",
  "dividends",
  "world"
];

MARKET_CATEGORY_ORDER.forEach((key, index) => {
  PRIMARY_MARKET_KEYS.add(key);
  PRIMARY_MARKET_ORDER[key] = index;
});

Object.assign(MARKET_PRIMARY_LABELS_AR, {
  forex: "الفوركس",
  us: "الأسهم الأمريكية",
  crypto: "العملات الرقمية",
  commodities: "السلع",
  gcc: "أسواق الخليج",
  saudi: "السوق السعودي",
  kuwait: "بورصة الكويت",
  uae: "السوق الإماراتي",
  qatar: "السوق القطري",
  bahrain: "السوق البحريني",
  oman: "السوق العماني",
  europe: "الأسهم الأوروبية",
  asia: "الأسهم الآسيوية",
  tech: "أسهم التقنية",
  food: "الأسهم الغذائية",
  healthcare: "الأسهم الدوائية",
  banking: "أسهم البنوك",
  energy: "أسهم الطاقة",
  ai: "أسهم الذكاء الاصطناعي",
  semiconductors: "أسهم أشباه الموصلات",
  dividends: "أسهم توزيعات الأرباح",
  world: "جميع الأسواق"
});

Object.assign(MARKET_PRIMARY_LABELS_EN, {
  forex: "Forex",
  us: "US stocks",
  crypto: "Crypto",
  commodities: "Commodities",
  gcc: "Gulf markets",
  saudi: "Saudi market",
  kuwait: "Kuwait market",
  uae: "UAE market",
  qatar: "Qatar market",
  bahrain: "Bahrain market",
  oman: "Oman market",
  europe: "European stocks",
  asia: "Asian stocks",
  tech: "Technology stocks",
  food: "Food / staples",
  healthcare: "Pharma / healthcare",
  banking: "Banking stocks",
  energy: "Energy stocks",
  ai: "AI stocks",
  semiconductors: "Semiconductors",
  dividends: "Dividend stocks",
  world: "All markets"
});

const REQUIRED_MARKET_CATEGORY_DEFINITIONS = [
  { key: "forex", labelAr: "الفوركس", labelEn: "Forex", fallbackCount: 8 },
  { key: "us", labelAr: "الأسهم الأمريكية", labelEn: "US stocks", fallbackCount: 20 },
  { key: "crypto", labelAr: "العملات الرقمية", labelEn: "Crypto", fallbackCount: 10 },
  { key: "commodities", labelAr: "السلع", labelEn: "Commodities", fallbackCount: 7 },
  { key: "gcc", labelAr: "أسواق الخليج", labelEn: "Gulf markets", fallbackCount: 8 },
  { key: "saudi", labelAr: "السوق السعودي", labelEn: "Saudi market", fallbackCount: 9 },
  { key: "kuwait", labelAr: "بورصة الكويت", labelEn: "Kuwait market", fallbackCount: 9 },
  { key: "uae", labelAr: "السوق الإماراتي", labelEn: "UAE market", fallbackCount: 8 },
  { key: "qatar", labelAr: "السوق القطري", labelEn: "Qatar market", fallbackCount: 5 },
  { key: "bahrain", labelAr: "السوق البحريني", labelEn: "Bahrain market", fallbackCount: 4 },
  { key: "oman", labelAr: "السوق العماني", labelEn: "Oman market", fallbackCount: 5 },
  { key: "europe", labelAr: "الأسهم الأوروبية", labelEn: "European stocks", fallbackCount: 9 },
  { key: "asia", labelAr: "الأسهم الآسيوية", labelEn: "Asian stocks", fallbackCount: 9 },
  { key: "tech", labelAr: "أسهم التقنية", labelEn: "Technology stocks", fallbackCount: 12 },
  { key: "food", labelAr: "الأسهم الغذائية", labelEn: "Food / staples", fallbackCount: 10 },
  { key: "healthcare", labelAr: "الأسهم الدوائية", labelEn: "Pharma / healthcare", fallbackCount: 10 },
  { key: "banking", labelAr: "أسهم البنوك", labelEn: "Banking stocks", fallbackCount: 8 },
  { key: "energy", labelAr: "أسهم الطاقة", labelEn: "Energy stocks", fallbackCount: 7 },
  { key: "ai", labelAr: "أسهم الذكاء الاصطناعي", labelEn: "AI stocks", fallbackCount: 8 },
  { key: "semiconductors", labelAr: "أشباه الموصلات", labelEn: "Semiconductors", fallbackCount: 8 },
  { key: "dividends", labelAr: "أسهم توزيعات الأرباح", labelEn: "Dividend stocks", fallbackCount: 11 },
  { key: "world", labelAr: "جميع الأسواق", labelEn: "All markets", fallbackCount: 12 }
];

const MARKET_CATEGORY_DEFINITION_BY_KEY = new Map(REQUIRED_MARKET_CATEGORY_DEFINITIONS.map((item, index) => [item.key, { ...item, index }]));

REQUIRED_MARKET_CATEGORY_DEFINITIONS.forEach((item, index) => {
  PRIMARY_MARKET_KEYS.add(item.key);
  PRIMARY_MARKET_ORDER[item.key] = index;
  MARKET_PRIMARY_LABELS_AR[item.key] = item.labelAr;
  MARKET_PRIMARY_LABELS_EN[item.key] = item.labelEn;
});

let activeMarket = "us";
let activeAppView = "home";
let timer = null;
let sessionClockTimer = null;
let isLoading = false;
let recommendationRequestController = null;
let recommendationRequestId = 0;
let lastRecommendationRefreshAt = 0;
let lastData = null;
let lastMarkets = [];
const recommendationResponseCache = new Map();
let activeFilter = "all";
let activeShariaFilter = "all";
let activeAnalysisMode = loadStored("the-sfm-trader-analysis-mode", "balanced");
let watchlist = loadStored("the-sfm-trader-watchlist", ["AMD", "NVDA", "GOOGL"]);
let portfolio = loadStored("the-sfm-trader-portfolio", []);
let recommendationHistory = loadStored("the-sfm-trader-history", []);
let followedTradeKeys = new Set(loadStored("the-sfm-trader-followed-trades", []));
let followedTradeAlerts = new Set(loadStored("the-sfm-trader-followed-alerts", []));
let removedFollowedTradeKeys = new Set(loadStored("the-sfm-trader-removed-followed-trades", []));
let sharedTradeSaveTimer = null;
let sharedTradePollTimer = null;
let sharedTradeStateLoaded = false;
let notificationLog = normalizeNotificationLog(loadStored("the-sfm-trader-notifications", []));
let notificationSaveTimer = null;
let notificationPanelOpen = false;
let scalpLoading = false;
let expandedSignalCards = new Set(loadStored("the-sfm-trader-expanded-cards", []));
let alertedKeys = new Set(loadStored("the-sfm-trader-alerted", []));
let recommendationSignalState = loadStored("the-sfm-trader-signal-state", {});
let watchlistOnly = loadStored("the-sfm-trader-watchlist-only", false);
let appSettings = normalizeAppSettings(loadStored(APP_SETTINGS_STORAGE_KEY, {}));
appSettings = applyUrlSettingsOverride(appSettings);
let watchlistData = null;
let watchlistLoading = false;
let watchlistLastLoadedAt = 0;
let watchlistTimer = null;
let voiceActive = false;
let voiceRecognition = null;
let voiceStream = null;
let voiceAudioContext = null;
let voiceClapFrame = null;
let voiceClapCooldownUntil = 0;
let voiceMonitors = loadStored("the-sfm-trader-voice-monitors", []);
let voiceRecognitionLanguageIndex = 0;
let voiceRecognitionSuspended = false;
let introTimer = null;
let introSpeechText = "";
let introGreetingStarted = false;
let liveFloorHasRendered = false;
let floorHeatmapSignature = "";
let floorBoardSignature = "";
let livePulseSignature = "";

applyAppSettings({ updateIntro: false });
initAdaptiveViewport();
initMarketBackground();
initIntroCeremony();
registerPwaServiceWorker();
init();

function initAdaptiveViewport() {
  const root = document.documentElement;
  let frame = 0;

  const syncViewport = () => {
    frame = 0;
    const viewport = window.visualViewport;
    const width = Math.max(320, Math.round(viewport?.width || window.innerWidth || 320));
    const height = Math.max(480, Math.round(viewport?.height || window.innerHeight || 480));

    root.style.setProperty("--app-vw", `${width}px`);
    root.style.setProperty("--app-vh", `${height}px`);
    root.dataset.viewport =
      width <= 480 ? "phone-small" :
      width <= 760 ? "phone" :
      width <= 1024 ? "tablet" :
      width <= 1366 ? "laptop" :
      width <= 1800 ? "desktop" :
      "wide";
  };

  const requestSync = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(syncViewport);
  };

  syncViewport();
  window.addEventListener("resize", requestSync, { passive: true });
  window.addEventListener("orientationchange", requestSync, { passive: true });
  window.visualViewport?.addEventListener("resize", requestSync, { passive: true });
  window.visualViewport?.addEventListener("scroll", requestSync, { passive: true });
}

function registerPwaServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // The app still works normally if iOS blocks service worker registration.
    });
  });
}

function initTerminalSearch() {
  if (!terminalSearch || !terminalSymbolSearch) return;

  terminalSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const symbol = normalizeSymbol(terminalSymbolSearch.value);
    if (!symbol) {
      terminalSymbolSearch.focus();
      return;
    }

    openDetailPage(symbol);
  });

  window.addEventListener("keydown", (event) => {
    const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (!isSearchShortcut) return;
    event.preventDefault();
    terminalSymbolSearch.focus();
    terminalSymbolSearch.select();
  });
}

async function init() {
  initSettingsPanel();
  initTerminalSearch();
  initInterfaceTranslator();
  initTemporaryLegalNotices();
  initLiveFloor();
  initAppNavigation();
  watchlist = normalizeWatchlist(watchlist);
  voiceMonitors = normalizeWatchlist(voiceMonitors);
  saveStored("the-sfm-trader-watchlist", watchlist);
  saveStored("the-sfm-trader-voice-monitors", voiceMonitors);
  watchlistOnlyToggle.checked = watchlistOnly;
  initVoiceAssistant();
  startSessionClock();
  loadOllamaStatus();
  renderWatchlist();
  loadWatchlistData(true);
  renderPortfolio();
  await loadSharedTradeState();
  await loadNotificationLog();
  renderNotificationCenter();
  renderHistory();
  renderVoiceMonitor();
  setActiveAnalysisModeButtons();

  await loadMarkets();
  await loadRecommendations({ force: true });
  timer = window.setInterval(() => loadRecommendations({ background: true }), RECOMMENDATIONS_REFRESH_MS);
  watchlistTimer = window.setInterval(() => loadWatchlistData(), WATCHLIST_REFRESH_MS);
  sharedTradePollTimer = window.setInterval(() => loadSharedTradeState({ poll: true }), SHARED_TRADE_POLL_MS);
  refreshButton.addEventListener("click", () => loadRecommendations({ force: true }));
  notificationButton?.addEventListener("click", toggleNotificationPanel);
  mobileNotificationButton?.addEventListener("click", toggleNotificationPanel);
  mobileSettingsButton?.addEventListener("click", () => setSettingsPanelOpen(settingsPanel?.hidden !== false));
  notificationCloseButton?.addEventListener("click", () => setNotificationPanelOpen(false));
  notificationClearButton?.addEventListener("click", clearNotificationLog);
  scalpForm?.addEventListener("submit", handleScalpSubmit);
  searchInput.addEventListener("input", () => renderRecommendations(lastData));
  sortSelect.addEventListener("change", () => renderRecommendations(lastData));
  for (const button of analysisModeButtons) {
    button.addEventListener("click", () => {
      activeAnalysisMode = button.dataset.analysisMode || "balanced";
      saveStored("the-sfm-trader-analysis-mode", activeAnalysisMode);
      setActiveAnalysisModeButtons();
      renderRecommendations(lastData);
    });
  }
  watchlistOnlyToggle.addEventListener("change", () => {
    watchlistOnly = watchlistOnlyToggle.checked;
    saveStored("the-sfm-trader-watchlist-only", watchlistOnly);
    loadRecommendations({ force: true });
  });
  watchlistForm.addEventListener("submit", addWatchlistSymbol);
  portfolioForm.addEventListener("submit", addPortfolioPosition);
  clearHistoryButton.addEventListener("click", () => {
    for (const key of followedTradeKeys) {
      removedFollowedTradeKeys.add(key);
    }
    recommendationHistory = [];
    followedTradeKeys = new Set();
    followedTradeAlerts = new Set();
    saveStored("the-sfm-trader-history", recommendationHistory);
    saveStored("the-sfm-trader-followed-trades", []);
    saveStored("the-sfm-trader-followed-alerts", []);
    persistSharedTradeState({ force: true });
    renderHistory();
  });

  for (const button of document.querySelectorAll(".filter-button")) {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
      renderRecommendations(lastData);
    });
  }

  for (const button of document.querySelectorAll(".sharia-filter-button")) {
    button.addEventListener("click", () => {
      activeShariaFilter = button.dataset.shariaFilter;
      setActiveShariaFilterButton();
      renderRecommendations(lastData);
    });
  }

  window.addEventListener("pagehide", flushSharedTradeStateOnExit);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushSharedTradeStateOnExit();
  });
}

// Temporary legal notices for internal SFM Trading Terminal testing.
// Full legal pages will be added before public release.
function initTemporaryLegalNotices() {
  const noticeRegion = document.querySelector("#temporary-legal-notices");
  if (!noticeRegion) return;

  const dismissed = new Set(loadDismissedLegalNotices());
  for (const notice of noticeRegion.querySelectorAll("[data-legal-notice]")) {
    const noticeKey = notice.dataset.legalNotice;
    if (dismissed.has(noticeKey)) notice.hidden = true;
  }

  syncTemporaryLegalNoticeRegion(noticeRegion);

  noticeRegion.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dismiss-legal-notice]");
    if (!button) return;

    const noticeKey = button.dataset.dismissLegalNotice;
    const notice = noticeRegion.querySelector(`[data-legal-notice="${CSS.escape(noticeKey)}"]`);
    if (!notice) return;

    notice.hidden = true;
    dismissed.add(noticeKey);
    saveDismissedLegalNotices([...dismissed]);
    syncTemporaryLegalNoticeRegion(noticeRegion);
  });
}

function syncTemporaryLegalNoticeRegion(noticeRegion) {
  const hasVisibleNotice = Boolean(noticeRegion.querySelector("[data-legal-notice]:not([hidden])"));
  noticeRegion.hidden = !hasVisibleNotice;
}

function loadDismissedLegalNotices() {
  try {
    const raw = localStorage.getItem(TEMPORARY_LEGAL_NOTICE_STORAGE_KEY);
    const value = JSON.parse(raw || "[]");
    return Array.isArray(value) ? value.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveDismissedLegalNotices(values) {
  try {
    localStorage.setItem(TEMPORARY_LEGAL_NOTICE_STORAGE_KEY, JSON.stringify(values));
  } catch {}
}

function initLiveFloor() {
  for (const button of floorJumpButtons) {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.floorJump);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function initAppNavigation() {
  const initialView = getAppViewFromHash(window.location.hash) || "home";
  showAppView(initialView, { scroll: false, replace: true });

  document.querySelectorAll(".rail-link, .ios-tab-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      const view = getAppViewFromNavigationLink(link);
      if (!view) return;
      event.preventDefault();
      showAppView(view, { push: true });
    });
  });

  document.querySelectorAll("[data-floor-jump]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const view = getAppViewFromHash(button.dataset.floorJump || "");
      if (!view) return;
      event.preventDefault();
      showAppView(view, { push: true });
    });
  });

  window.addEventListener("popstate", () => {
    showAppView(getAppViewFromHash(window.location.hash) || "home", { scroll: false, replace: true });
  });
}

function getAppViewFromNavigationLink(link) {
  const navKey = link.dataset.navKey;
  if (navKey === "favorites") return "watchlist";
  if (navKey === "portfolio") return "portfolio";
  if (navKey === "trades") return "history";
  if (navKey === "news") return "news";
  if (navKey === "calendar") return "calendar";
  if (navKey === "ai-analysis") return "ai";
  if (navKey === "education") return "education";
  const tab = link.dataset.tab;
  if (tab === "pulse") return "home";
  if (tab === "signals") return "recommendations";
  if (tab === "scalp") return "scalp";
  if (tab && APP_VIEW_GROUPS[tab]) return tab;
  return getAppViewFromHash(link.getAttribute("href") || "");
}

function getAppViewFromHash(hash) {
  const value = String(hash || "");
  if (value.includes("notification-panel")) return "alerts";
  if (value.includes("education-section") || value.includes("view-education")) return "education";
  if (value.includes("calendar-section") || value.includes("view-calendar")) return "calendar";
  if (value.includes("economic-news-section") || value.includes("view-news")) return "news";
  if (value.includes("portfolio-section") || value.includes("view-portfolio")) return "portfolio";
  if (value.includes("watchlist-section") || value.includes("view-watchlist")) return "watchlist";
  if (value.includes("command-center-section") || value.includes("view-ai")) return "ai";
  if (value.includes("recommendations-section") || value.includes("view-recommendations")) return "recommendations";
  if (value.includes("history-section") || value.includes("view-history")) return "history";
  if (value.includes("markets-section") || value.includes("market-hours") || value.includes("view-markets")) return "markets";
  if (value.includes("voice-section") || value.includes("view-voice")) return "voice";
  if (value.includes("scalping-section") || value.includes("view-scalp")) return "scalp";
  if (value.includes("sfm-live-floor") || value.includes("view-home")) return "home";
  return "";
}

function showAppView(view, options = {}) {
  const nextView = APP_VIEW_GROUPS[view] ? view : "home";
  const visibleSelectors = APP_VIEW_GROUPS[nextView] || APP_VIEW_GROUPS.home;
  activeAppView = nextView;
  document.body.dataset.appView = nextView;

  document.querySelectorAll("main > section").forEach((section) => {
    const visible = visibleSelectors.some((selector) => section.matches(selector));
    section.classList.toggle("app-view-hidden", !visible);
  });

  document.querySelectorAll(".rail-link, .ios-tab-link").forEach((link) => {
    const linkView = getAppViewFromNavigationLink(link);
    link.classList.toggle("active", linkView === nextView || (nextView === "alerts" && linkView === "alerts"));
  });

  if (nextView === "alerts") {
    setNotificationPanelOpen(true);
  } else if (notificationPanelOpen) {
    setNotificationPanelOpen(false);
  }

  if (options.push) {
    const hash = nextView === "home" ? "#view-home" : `#view-${nextView}`;
    history.pushState({ view: nextView }, "", hash);
  } else if (options.replace) {
    const hash = nextView === "home" ? "#view-home" : `#view-${nextView}`;
    history.replaceState({ view: nextView }, "", hash);
  }

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function isCompactViewport() {
  return window.matchMedia?.("(max-width: 760px)")?.matches || false;
}

function initIntroCeremony() {
  if (!introOverlay) return;
  if (shouldSkipIntroCeremony()) {
    introOverlay.remove();
    document.body.classList.remove("intro-running");
    return;
  }

  const greeting = getIntroGreeting();
  const message = getIntroMessage();
  const honorificName = getIntroHonorificName();
  document.body.classList.add("intro-running");
  introGreeting.textContent = `${greeting} ${honorificName}`;
  introMessage.textContent = message;
  const statusText = introOverlay.querySelector(".intro-status strong");
  if (statusText) statusText.textContent = getIntroStatusText();
  if (introSkip) introSkip.textContent = getIntroSkipText();
  introSpeechText = `${greeting} ${honorificName}. ${message}`;
  if (introAudioButton) {
    introAudioButton.hidden = !("speechSynthesis" in window);
    introAudioButton.textContent = getIntroAudioText();
    introAudioButton.addEventListener("click", playIntroGreetingFromGesture);
  }
  introSkip?.addEventListener("click", closeIntroCeremony);
  introOverlay.addEventListener("pointerdown", (event) => {
    if (!isLikelyMobileDevice() || introGreetingStarted) return;
    if (event.target.closest("button, a, input, select, textarea")) return;
    playIntroGreetingFromGesture();
  });

  window.setTimeout(() => {
    if (!isLikelyMobileDevice()) speakIntroGreeting(introSpeechText);
  }, 650);

  introTimer = window.setTimeout(closeIntroCeremony, INTRO_DURATION_MS);
}

function shouldSkipIntroCeremony() {
  const params = new URLSearchParams(window.location.search);
  let skip = params.get("skipIntro") === "1";
  try {
    if (sessionStorage.getItem("the-sfm-trader-skip-intro") === "1") skip = true;
    sessionStorage.removeItem("the-sfm-trader-skip-intro");
  } catch {}

  if (skip && params.has("skipIntro")) {
    params.delete("skipIntro");
    const query = params.toString();
    history.replaceState(history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }
  return skip;
}

function getIntroGreeting() {
  const hour = new Date().getHours();
  if (isEnglishLanguage()) return hour >= 5 && hour < 12 ? "Good morning" : "Good evening";
  return hour >= 5 && hour < 12 ? "صباح الخير" : "مساء الخير";
}

function getIntroMessage() {
  return isEnglishLanguage()
    ? "Your SFM assistant is ready for analysis and stock monitoring."
    : "مساعدك SFM جاهز للتحليل ومتابعة الأسهم.";
}

function getIntroStatusText() {
  return isEnglishLanguage() ? "Opening the analysis platform" : "جاري فتح منصة التحليل";
}

function getIntroSkipText() {
  return isEnglishLanguage() ? "Quick entry" : "دخول سريع";
}

function getIntroAudioText() {
  return isEnglishLanguage() ? "Play voice greeting" : "تشغيل التحية الصوتية";
}

function getIntroHonorificName() {
  return isEnglishLanguage() ? `Sir ${getUserDisplayName()}` : `سيدي ${getUserDisplayName()}`;
}

function getUserDisplayName() {
  return appSettings.displayName || DEFAULT_USER_DISPLAY_NAME;
}

function normalizeLocaleCode(value, fallback = DEFAULT_APP_LANGUAGE) {
  const raw = String(value || "").trim().toLowerCase();
  const normalizedFallback = SUPPORTED_APP_LANGUAGES.has(String(fallback || "").trim().toLowerCase())
    ? String(fallback).trim().toLowerCase()
    : DEFAULT_APP_LANGUAGE;

  if (raw.startsWith("ar") || raw === "arabic" || raw === "العربية" || raw === "عربي") return "ar";
  if (raw.startsWith("en") || raw === "english" || raw === "انجليزي" || raw === "الإنجليزية") return "en";
  if (raw.startsWith("fr") || raw === "french" || raw === "français" || raw === "francais") return "fr";

  return normalizedFallback;
}

function getAppLanguage() {
  return normalizeLocaleCode(appSettings.language);
}

function getTranslationLanguageKey(language = getAppLanguage()) {
  return TRANSLATION_LANGUAGE_FALLBACK[normalizeLocaleCode(language)] || DEFAULT_APP_LANGUAGE;
}

function getAppDirection(language = getAppLanguage()) {
  return LTR_APP_LANGUAGES.has(normalizeLocaleCode(language)) ? "ltr" : "rtl";
}

function isArabicLanguage() {
  return getAppLanguage() === "ar";
}

function isEnglishLanguage() {
  return getTranslationLanguageKey() === "en";
}

function isLikelyMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia?.("(pointer: coarse)")?.matches;
}

function playIntroGreetingFromGesture() {
  if (!introSpeechText) {
    introSpeechText = `${getIntroGreeting()} ${getIntroHonorificName()}. ${getIntroMessage()}`;
  }
  speakIntroGreeting(introSpeechText, { force: true });
}

function speakIntroGreeting(text, options = {}) {
  if (!text || !("speechSynthesis" in window)) return;
  if (introGreetingStarted && !options.force) return;

  try {
    introGreetingStarted = true;
    const utterance = new SpeechSynthesisUtterance(localizeVoiceText(text));
    utterance.lang = getVoiceSpeechLocale();
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const preferredVoice = getPreferredSpeechVoice();
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onstart = () => {
      if (introAudioButton) introAudioButton.textContent = localizeUiText("SFM يتكلم");
    };
    utterance.onend = () => {
      if (introAudioButton) introAudioButton.textContent = localizeUiText("الصوت جاهز");
    };
    utterance.onerror = () => {
      introGreetingStarted = false;
      if (introAudioButton) introAudioButton.textContent = getIntroAudioText();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    introGreetingStarted = false;
    if (introAudioButton) introAudioButton.textContent = getIntroAudioText();
    // بعض المتصفحات تمنع النطق التلقائي قبل أول تفاعل من المستخدم.
  }
}

function initSettingsPanel() {
  if (!settingsButton || !settingsPanel || !settingsForm) return;

  settingsButton.addEventListener("click", () => setSettingsPanelOpen(settingsPanel.hidden));
  railSettingsButton?.addEventListener("click", () => setSettingsPanelOpen(settingsPanel.hidden));
  settingsCloseButton?.addEventListener("click", () => setSettingsPanelOpen(false));
  settingsLanguage?.addEventListener("change", handleSettingsLanguageChange);
  for (const choice of settingsLanguageChoices) {
    choice.addEventListener("click", () => selectSettingsLanguage(choice.dataset.languageOption));
  }
  settingsDisplayName?.addEventListener("input", updateSettingsPreview);
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    appSettings = normalizeAppSettings({
      language: settingsLanguage?.value,
      displayName: settingsDisplayName?.value
    });
    saveStored(APP_SETTINGS_STORAGE_KEY, appSettings);
    applyAppSettings();
    refreshLocalizedDynamicInterface();
    setSettingsPanelOpen(false);
    showToast(
      isEnglishLanguage() ? "Settings saved" : "تم حفظ الإعدادات",
      isEnglishLanguage() ? "The welcome page will use your updated name and language." : "الصفحة الترحيبية ستستخدم الاسم واللغة الجديدة.",
      { type: "settings", persist: false }
    );
  });

  syncSettingsForm();
  updateSettingsPanelLanguage();
}

function selectSettingsLanguage(language) {
  if (!settingsLanguage) return;

  settingsLanguage.value = normalizeLocaleCode(language, getAppLanguage());
  handleSettingsLanguageChange();
}

function handleSettingsLanguageChange() {
  const nextLanguage = normalizeLocaleCode(settingsLanguage?.value, getAppLanguage());
  if (settingsLanguage) settingsLanguage.value = nextLanguage;
  syncLanguageChoices(nextLanguage);

  if (nextLanguage === getAppLanguage()) {
    updateSettingsPreview();
    return;
  }

  appSettings = normalizeAppSettings({
    ...appSettings,
    language: nextLanguage
  });
  saveStored(APP_SETTINGS_STORAGE_KEY, appSettings);
  applyAppSettings();
  refreshLocalizedDynamicInterface();
}

function setSettingsPanelOpen(open) {
  if (!settingsButton || !settingsPanel) return;

  const isOpen = Boolean(open);
  settingsPanel.hidden = !isOpen;
  settingsButton.setAttribute("aria-expanded", String(isOpen));
  settingsButton.classList.toggle("is-open", isOpen);
  railSettingsButton?.setAttribute("aria-expanded", String(isOpen));
  railSettingsButton?.classList.toggle("is-open", isOpen);
  mobileSettingsButton?.setAttribute("aria-expanded", String(isOpen));
  mobileSettingsButton?.classList.toggle("is-open", isOpen);
  if (isOpen) {
    setNotificationPanelOpen(false);
    syncSettingsForm();
    window.setTimeout(() => settingsDisplayName?.focus(), 30);
  }
}

function syncSettingsForm() {
  if (settingsLanguage) settingsLanguage.value = getAppLanguage();
  if (settingsDisplayName) settingsDisplayName.value = getUserDisplayName();
  syncLanguageChoices();
  updateSettingsPreview();
}

function updateSettingsPreview() {
  if (!settingsPreview) return;

  const language = normalizeLocaleCode(settingsLanguage?.value, getAppLanguage());
  const english = getTranslationLanguageKey(language) === "en";
  const name = sanitizeDisplayName(settingsDisplayName?.value || getUserDisplayName());
  const hour = new Date().getHours();
  const greeting = english
    ? hour >= 5 && hour < 12 ? "Good morning" : "Good evening"
    : hour >= 5 && hour < 12 ? "صباح الخير" : "مساء الخير";
  const honorific = english ? `Sir ${name}` : `سيدي ${name}`;
  settingsPreview.textContent = `${greeting} ${honorific}`;
}

function updateSettingsPanelLanguage() {
  const english = isEnglishLanguage();
  const settingsButtonText = settingsButton?.querySelector("span");
  if (settingsButtonText) settingsButtonText.textContent = english ? "Settings" : "الإعدادات";
  if (mobileSettingsButton) mobileSettingsButton.setAttribute("aria-label", english ? "Settings" : "الإعدادات");
  if (settingsEyebrow) settingsEyebrow.textContent = english ? "SFM SETTINGS" : "إعدادات المنصة";
  if (settingsTitle) settingsTitle.textContent = english ? "Settings" : "الإعدادات";
  if (settingsLanguageLabel) settingsLanguageLabel.textContent = english ? "Language" : "اللغة";
  if (settingsNameLabel) settingsNameLabel.textContent = english ? "Welcome name" : "الاسم في الصفحة الترحيبية";
  if (settingsPreviewLabel) settingsPreviewLabel.textContent = english ? "Preview" : "المعاينة";
  if (settingsSaveButton) settingsSaveButton.textContent = english ? "Save settings" : "حفظ الإعدادات";
  if (settingsCloseButton) settingsCloseButton.setAttribute("aria-label", english ? "Close settings" : "إغلاق الإعدادات");
  if (settingsDisplayName) settingsDisplayName.placeholder = english ? "Mohammed" : "محمد";
  updateSettingsStaticLanguage();
  syncLanguageChoiceLabels();
  syncLanguageChoices();
  updateSettingsPreview();
}

function updateSettingsStaticLanguage() {
  if (!settingsPanel) return;

  const languageKey = getTranslationLanguageKey();
  const texts = SETTINGS_PANEL_TEXT[languageKey] || SETTINGS_PANEL_TEXT.ar;
  for (const [selector, text] of Object.entries(texts)) {
    const element = settingsPanel.querySelector(selector);
    if (element && element.textContent !== text) element.textContent = text;
  }

  const arabicOption = settingsLanguage?.querySelector('option[value="ar"]');
  const englishOption = settingsLanguage?.querySelector('option[value="en"]');
  const frenchOption = settingsLanguage?.querySelector('option[value="fr"]');
  if (arabicOption) arabicOption.textContent = languageKey === "en" ? "Arabic" : "العربية";
  if (englishOption) englishOption.textContent = languageKey === "en" ? "English" : "الإنجليزية";
  if (frenchOption) frenchOption.textContent = languageKey === "en" ? "French" : "Français";
}

function syncLanguageChoiceLabels() {
  const languageKey = getTranslationLanguageKey();
  const english = languageKey === "en";

  for (const choice of settingsLanguageChoices) {
    const language = normalizeLocaleCode(choice.dataset.languageOption, "ar");
    const name = choice.querySelector("strong");
    const helper = choice.querySelector("small");

    if (language === "ar") {
      if (name) name.textContent = english ? "Arabic" : "العربية";
      if (helper) helper.textContent = english ? "RTL interface" : "واجهة عربية RTL";
      choice.title = "تغيير اللغة إلى العربية";
      choice.setAttribute("aria-label", "تغيير اللغة إلى العربية");
      choice.lang = "ar";
      choice.dir = "rtl";
    } else if (language === "en") {
      if (name) name.textContent = "English";
      if (helper) helper.textContent = english ? "LTR interface" : "واجهة إنجليزية LTR";
      choice.title = "Switch language to English";
      choice.setAttribute("aria-label", "Switch language to English");
      choice.lang = "en";
      choice.dir = "ltr";
    } else if (language === "fr") {
      if (name) name.textContent = english ? "French" : "Français";
      if (helper) helper.textContent = english ? "LTR interface" : "واجهة فرنسية LTR";
      choice.title = "Switch language to French";
      choice.setAttribute("aria-label", "Switch language to French");
      choice.lang = "fr";
      choice.dir = "ltr";
    }
  }
}

function syncLanguageChoices(language = settingsLanguage?.value || getAppLanguage()) {
  const currentLanguage = normalizeLocaleCode(language, getAppLanguage());

  for (const choice of settingsLanguageChoices) {
    const choiceLanguage = normalizeLocaleCode(choice.dataset.languageOption, "ar");
    const selected = choiceLanguage === currentLanguage;
    choice.classList.toggle("is-selected", selected);
    choice.setAttribute("aria-pressed", String(selected));
    if (selected) {
      choice.setAttribute("aria-current", "true");
    } else {
      choice.removeAttribute("aria-current");
    }
  }
}

function syncNavigationLanguage() {
  const languageKey = getTranslationLanguageKey();

  for (const link of document.querySelectorAll("[data-nav-key]")) {
    const label = NAVIGATION_LABELS[link.dataset.navKey]?.[languageKey];
    if (!label) continue;

    const labelTarget = link.querySelector("b, strong");
    if (labelTarget && labelTarget.textContent !== label) {
      labelTarget.textContent = label;
    }
    link.setAttribute("aria-label", label);
    link.setAttribute("title", label);
    link.dataset.tooltip = label;
  }
}

function applyAppSettings(options = {}) {
  const language = getAppLanguage();
  const english = getTranslationLanguageKey(language) === "en";
  document.documentElement.lang = language;
  document.documentElement.dir = getAppDirection(language);
  document.body?.classList.toggle("language-en", english);
  document.body?.classList.toggle("language-ar", language === "ar");
  document.body?.classList.toggle("language-fr", language === "fr");
  updateSettingsPanelLanguage();
  syncNavigationLanguage();
  queueTranslateInterface();

  if (options.updateIntro !== false && introOverlay && !introOverlay.classList.contains("is-closing")) {
    const greeting = getIntroGreeting();
    const message = getIntroMessage();
    introGreeting.textContent = `${greeting} ${getIntroHonorificName()}`;
    introMessage.textContent = message;
    const statusText = introOverlay.querySelector(".intro-status strong");
    if (statusText) statusText.textContent = getIntroStatusText();
    if (introSkip) introSkip.textContent = getIntroSkipText();
  }
}

function refreshLocalizedDynamicInterface() {
  if (lastMarkets.length) renderMarketTabs(lastMarkets);
  if (lastData) renderRecommendations(lastData);
  renderHistory();
  renderWatchlist();
  renderPortfolio(lastData?.recommendations || []);
  renderNotificationCenter();
  renderVoiceMonitor();
}

function normalizeAppSettings(value) {
  const settings = value && typeof value === "object" ? value : {};
  return {
    language: normalizeLocaleCode(settings.language),
    displayName: sanitizeDisplayName(settings.displayName || DEFAULT_USER_DISPLAY_NAME)
  };
}

function applyUrlSettingsOverride(settings) {
  const params = new URLSearchParams(window.location.search);
  const language = params.get("lang") || params.get("language");
  const displayName = params.get("name") || params.get("user");

  if (!language && !displayName) return settings;

  const nextSettings = normalizeAppSettings({
    ...settings,
    language: language ? normalizeLocaleCode(language, settings.language) : settings.language,
    displayName: displayName || settings.displayName
  });
  saveStored(APP_SETTINGS_STORAGE_KEY, nextSettings);
  return nextSettings;
}

function sanitizeDisplayName(value) {
  const name = String(value || "").replace(/\s+/g, " ").trim();
  return name.slice(0, 32) || DEFAULT_USER_DISPLAY_NAME;
}

function initInterfaceTranslator() {
  if (uiTranslationObserver || !document.body) return;

  uiTranslationObserver = new MutationObserver(() => {
    if (!isTranslatingInterface) queueTranslateInterface();
  });
  uiTranslationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: UI_TRANSLATABLE_ATTRS
  });

  queueTranslateInterface();
}

function queueTranslateInterface() {
  if (queuedInterfaceTranslation) return;

  queuedInterfaceTranslation = true;
  window.requestAnimationFrame(() => {
    queuedInterfaceTranslation = false;
    translateInterface();
    syncNavigationLanguage();
  });
}

function translateInterface(root = document.body) {
  if (!root || isTranslatingInterface) return;

  isTranslatingInterface = true;
  try {
    translateElementAttributes(root);

    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || shouldSkipTranslation(parent)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    while (walker.nextNode()) translateTextNode(walker.currentNode);

    if (root.querySelectorAll) {
      for (const element of root.querySelectorAll("*")) {
        translateElementAttributes(element);
      }
    }
  } finally {
    isTranslatingInterface = false;
  }
}

function shouldSkipTranslation(element) {
  return ["SCRIPT", "STYLE", "NOSCRIPT", "CANVAS", "CODE"].includes(element.tagName)
    || Boolean(element.closest?.("[data-language-option]"));
}

function translateTextNode(node) {
  const current = node.nodeValue || "";
  if (!current.trim()) return;

  if (isEnglishLanguage()) {
    if (hasArabicText(current)) {
      originalTextByNode.set(node, current);
    }

    const source = originalTextByNode.get(node) || current;
    const translated = translateArabicTextToEnglish(source);
    if (translated !== current) node.nodeValue = translated;
    return;
  }

  if (originalTextByNode.has(node)) {
    node.nodeValue = originalTextByNode.get(node);
  }
}

function translateElementAttributes(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE || shouldSkipTranslation(element)) return;

  for (const attr of UI_TRANSLATABLE_ATTRS) {
    if (!element.hasAttribute(attr)) continue;

    const dataKey = `i18nOriginal${toDatasetSuffix(attr)}`;
    const current = element.getAttribute(attr) || "";

    if (isEnglishLanguage()) {
      if (hasArabicText(current)) {
        element.dataset[dataKey] = current;
      }

      const source = element.dataset[dataKey] || current;
      const translated = translateArabicTextToEnglish(source);
      if (translated !== current) element.setAttribute(attr, translated);
      continue;
    }

    if (element.dataset[dataKey]) {
      element.setAttribute(attr, element.dataset[dataKey]);
    }
  }
}

function toDatasetSuffix(attr) {
  return attr
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function hasArabicText(text) {
  return /[\u0600-\u06FF]/.test(String(text || ""));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shouldUseArabicWordBoundary(term) {
  return !/\s/.test(term);
}

function replaceStandaloneArabicTerm(text, arabic, english) {
  const pattern = new RegExp(`(^|[^\\u0600-\\u06FF])${escapeRegExp(arabic)}(?=$|[^\\u0600-\\u06FF])`, "g");
  return text.replace(pattern, `$1${english}`);
}

function translateArabicTextToEnglish(text) {
  if (!hasArabicText(text)) return text;

  const value = String(text);
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const trimmed = value.trim();
  const exact = EXTRA_UI_TEXT_TRANSLATIONS[trimmed] || UI_TEXT_TRANSLATIONS[trimmed];
  if (exact) return `${leading}${exact}${trailing}`;

  let translated = trimmed;
  for (const [arabic, english] of UI_TEXT_TRANSLATION_ENTRIES) {
    if (shouldUseArabicWordBoundary(arabic)) continue;
    translated = translated.replaceAll(arabic, english);
  }

  translated = translated
    .replace(/(\d+(?:\.\d+)?)\s*رمز/g, "$1 symbols")
    .replace(/(\d+(?:\.\d+)?)\s*سهم/g, "$1 stocks")
    .replace(/(\d+(?:\.\d+)?)\s*صفقات/g, "$1 trades")
    .replace(/(\d+(?:\.\d+)?)\s*فرصة/g, "$1 opportunities")
    .replace(/(\d+(?:\.\d+)?)\s*دقيقة/g, "$1 min")
    .replace(/(\d+(?:\.\d+)?)\s*شهور/g, "$1 months")
    .replace(/(\d+(?:\.\d+)?)\s*شهر/g, "$1 month")
    .replace(/٪/g, "%")
    .replace(/،/g, ",")
    .replace(/؛/g, ";")
    .replace(/؟/g, "?")
    .replace(/ · /g, " · ");

  for (const [arabic, english] of COMMON_UI_TERM_TRANSLATIONS) {
    translated = shouldUseArabicWordBoundary(arabic)
      ? replaceStandaloneArabicTerm(translated, arabic, english)
      : translated.replaceAll(arabic, english);
  }

  return `${leading}${translated}${trailing}`;
}

function localizeUiText(text) {
  return isEnglishLanguage() ? translateArabicTextToEnglish(text) : text;
}

function closeIntroCeremony() {
  if (!introOverlay || introOverlay.classList.contains("is-closing")) return;

  if (introTimer) {
    window.clearTimeout(introTimer);
    introTimer = null;
  }

  document.body.classList.remove("intro-running");
  introOverlay.classList.add("is-closing");
  window.setTimeout(() => {
    introOverlay.remove();
  }, 700);
}

const LUCIDE_MARKET_ICONS = {
  Landmark: `
    <line x1="3" x2="21" y1="22" y2="22"></line>
    <line x1="6" x2="6" y1="18" y2="11"></line>
    <line x1="10" x2="10" y1="18" y2="11"></line>
    <line x1="14" x2="14" y1="18" y2="11"></line>
    <line x1="18" x2="18" y1="18" y2="11"></line>
    <polygon points="12 2 20 7 4 7 12 2"></polygon>
  `,
  Building2: `
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"></path>
    <path d="M10 6h4"></path>
    <path d="M10 10h4"></path>
    <path d="M10 14h4"></path>
    <path d="M10 18h4"></path>
  `,
  Globe2: `
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M7 3.34V5a3 3 0 0 0 3 3h0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17"></path>
    <path d="M11 21.95V18a2 2 0 0 0-2-2H4.34"></path>
    <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path>
  `,
  Euro: `
    <path d="M4 10h12"></path>
    <path d="M4 14h9"></path>
    <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"></path>
  `,
  ArrowLeftRight: `
    <path d="M8 3 4 7l4 4"></path>
    <path d="M4 7h16"></path>
    <path d="m16 21 4-4-4-4"></path>
    <path d="M20 17H4"></path>
  `,
  Bitcoin: `
    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894"></path>
    <path d="M11.767 19.089 5.86 18.047"></path>
    <path d="m11.768 19.089-.347 1.97"></path>
    <path d="M12.984 12.195c4.924.869 6.14-6.025 1.216-6.893"></path>
    <path d="m12.984 12.195-3.94-.694"></path>
    <path d="M14.2 5.302 8.29 4.26"></path>
    <path d="m14.199 5.302.348-1.97"></path>
    <path d="M7.48 20.364 10.606 2.637"></path>
  `,
  Coins: `
    <circle cx="8" cy="8" r="6"></circle>
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path>
    <path d="M7 6h1v4"></path>
    <path d="m16.71 13.88.7.71-2.82 2.82"></path>
  `,
  ChartCandlestick: `
    <path d="M9 5v4"></path>
    <rect width="4" height="6" x="7" y="9" rx="1"></rect>
    <path d="M9 15v2"></path>
    <path d="M17 3v2"></path>
    <rect width="4" height="8" x="15" y="5" rx="1"></rect>
    <path d="M17 13v3"></path>
  `,
  TrendingUp: `
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  `,
  Activity: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>`,
  Gem: `
    <path d="M6 3h12l4 6-10 13L2 9Z"></path>
    <path d="M11 3 8 9l4 13 4-13-3-6"></path>
    <path d="M2 9h20"></path>
  `
};

const MARKET_ICON_CONFIG = {
  kuwait: ["Landmark", "market-icon-exchange"],
  saudi: ["Landmark", "market-icon-exchange"],
  uae: ["Building2", "market-icon-exchange"],
  oman: ["Landmark", "market-icon-exchange"],
  qatar: ["Landmark", "market-icon-exchange"],
  bahrain: ["Landmark", "market-icon-exchange"],
  gcc: ["Globe2", "market-icon-gcc"],
  europe: ["Euro", "market-icon-europe"],
  asia: ["Globe2", "market-icon-global"],
  world: ["Globe2", "market-icon-global"],
  global: ["Globe2", "market-icon-global"],
  all: ["Globe2", "market-icon-global"],
  forex: ["ArrowLeftRight", "market-icon-fx"],
  crypto: ["Bitcoin", "market-icon-crypto"],
  commodities: ["Gem", "market-icon-gold"],
  indices: ["Activity", "market-icon-indices"],
  us: ["Activity", "market-icon-flag flag-us"],
  ai: ["Activity", "market-icon-ai"],
  tech: ["TrendingUp", "market-icon-tech"],
  technology: ["TrendingUp", "market-icon-tech"],
  dividends: ["Coins", "market-icon-dividend"],
  healthcare: ["Activity", "market-icon-health"],
  food: ["Coins", "market-icon-food"]
};

Object.assign(MARKET_ICON_CONFIG, {
  kuwait: ["Landmark", "market-icon-kuwait"],
  saudi: ["Landmark", "market-icon-saudi"],
  uae: ["Building2", "market-icon-uae"],
  qatar: ["Landmark", "market-icon-qatar"],
  bahrain: ["Landmark", "market-icon-bahrain"],
  oman: ["Landmark", "market-icon-oman"],
  europe: ["Euro", "market-icon-europe"],
  asia: ["Globe2", "market-icon-asia"],
  tech: ["ChartCandlestick", "market-icon-tech"],
  food: ["Coins", "market-icon-food"],
  healthcare: ["Activity", "market-icon-health"],
  banking: ["Landmark", "market-icon-banking"],
  energy: ["Activity", "market-icon-energy"],
  ai: ["Activity", "market-icon-ai"],
  semiconductors: ["ChartCandlestick", "market-icon-semiconductor"],
  dividends: ["Coins", "market-icon-dividend"],
  world: ["Globe2", "market-icon-global"]
});

function getMarketVisual(market = {}) {
  const id = String(market.id || "").toLowerCase();
  const label = String(market.label || "").toLowerCase();
  const primaryKey = getPrimaryMarketKey(market);
  const config = MARKET_ICON_CONFIG[primaryKey || id] || getMarketIconConfigFromLabel(label);
  return {
    className: `${config[1]} ${primaryKey ? `market-icon-premium market-icon-${primaryKey}` : ""}`.trim(),
    html: renderPremiumMarketIcon(primaryKey || id, config[0])
  };
}

function getMarketIconConfigFromLabel(label) {
  if (label.includes("forex") || label.includes("الفوركس")) return MARKET_ICON_CONFIG.forex;
  if (label.includes("crypto") || label.includes("الرقمية")) return MARKET_ICON_CONFIG.crypto;
  if (label.includes("gold") || label.includes("oil") || label.includes("metal") || label.includes("الذهب") || label.includes("السلع") || label.includes("المعادن")) return MARKET_ICON_CONFIG.commodities;
  if (label.includes("europe") || label.includes("أوروبا") || label.includes("الأوروبية")) return MARKET_ICON_CONFIG.europe;
  if (label.includes("global") || label.includes("العالم") || label.includes("جميع")) return MARKET_ICON_CONFIG.world;
  if (label.includes("indices") || label.includes("المؤشرات") || label.includes("american") || label.includes("الأمريكي")) return MARKET_ICON_CONFIG.indices;
  if (label.includes("الإمارات")) return MARKET_ICON_CONFIG.uae;
  if (label.includes("الكويت")) return MARKET_ICON_CONFIG.kuwait;
  if (label.includes("السعود")) return MARKET_ICON_CONFIG.saudi;
  if (label.includes("عمان")) return MARKET_ICON_CONFIG.oman;
  if (label.includes("الخليج")) return MARKET_ICON_CONFIG.gcc;
  return ["ChartCandlestick", "market-icon-generic"];
}

function renderLucideMarketIcon(name) {
  const paths = LUCIDE_MARKET_ICONS[name] || LUCIDE_MARKET_ICONS.ChartCandlestick;
  return `<svg class="lucide-market-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function renderMarketFlagIcon(key, code) {
  return `
    <span class="market-premium-flag market-premium-${key}" aria-hidden="true">
      <i></i><i></i><i></i><b>${code}</b>
    </span>
  `;
}

function renderMarketGlyphIcon(key, label) {
  return `<span class="market-premium-glyph market-premium-${key}" aria-hidden="true"><b>${label}</b></span>`;
}

function renderPremiumMarketIcon(key, fallbackIconName) {
  const normalized = String(key || "").toLowerCase();
  const flagCodes = {
    us: "US",
    kuwait: "KW",
    saudi: "SA",
    uae: "AE",
    qatar: "QA",
    bahrain: "BH",
    oman: "OM"
  };
  if (flagCodes[normalized]) return renderMarketFlagIcon(normalized, flagCodes[normalized]);
  const glyphLabels = {
    europe: "EU",
    asia: "AS",
    tech: "TC",
    food: "FD",
    healthcare: "RX",
    banking: "BK",
    energy: "EN",
    ai: "AI",
    semiconductors: "CH",
    dividends: "DV",
    world: "GL"
  };
  if (glyphLabels[normalized]) return renderMarketGlyphIcon(normalized, glyphLabels[normalized]);
  if (normalized === "forex") {
    return `<span class="market-premium-glyph market-premium-dollar" aria-hidden="true">&#36;</span>`;
  }
  if (normalized === "us") {
    return `
      <span class="market-premium-flag market-premium-us" aria-hidden="true">
        <i></i><i></i><i></i><b></b>
      </span>
    `;
  }
  if (normalized === "crypto") {
    return `<span class="market-premium-glyph market-premium-bitcoin" aria-hidden="true">&#8383;</span>`;
  }
  if (normalized === "commodities") {
    return `
      <span class="market-premium-commodity" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 3c4.2 4.6 7 8.2 7 12.1A7 7 0 1 1 5 15.1C5 11.2 7.8 7.6 12 3Z"></path>
          <path d="M8.2 16.1h7.6M9.5 13.1h5M10.7 10.2h2.6"></path>
        </svg>
      </span>
    `;
  }
  if (normalized === "gcc") {
    return `
      <span class="market-premium-gcc-badge" aria-hidden="true">
        <svg viewBox="0 0 32 32" focusable="false">
          <circle class="gcc-node" cx="16" cy="5.8" r="1.5"></circle>
          <circle class="gcc-node" cx="24.8" cy="10.5" r="1.5"></circle>
          <circle class="gcc-node" cx="24.8" cy="21.5" r="1.5"></circle>
          <circle class="gcc-node" cx="16" cy="26.2" r="1.5"></circle>
          <circle class="gcc-node" cx="7.2" cy="21.5" r="1.5"></circle>
          <circle class="gcc-node" cx="7.2" cy="10.5" r="1.5"></circle>
          <path class="gcc-ring" d="M16 5.8 24.8 10.5v11L16 26.2 7.2 21.5v-11Z"></path>
          <path class="gcc-market-line" d="M9.5 20.5h3.2v-6.2h3.1v3.8h3.1V10h3.6v10.5"></path>
          <text class="gcc-label" x="16" y="25.3" text-anchor="middle">GCC</text>
        </svg>
      </span>
    `;
  }
  return renderLucideMarketIcon(fallbackIconName);
}

function getPrimaryMarketKey(market) {
  const id = String(market?.id || "").toLowerCase();
  const label = String(market?.label || "").toLowerCase();
  if (PRIMARY_MARKET_KEYS.has(id)) return id;
  if (id.includes("forex") || label.includes("forex") || label.includes("الفوركس") || label.includes("Ø§Ù„ÙÙˆØ±ÙƒØ³")) return "forex";
  if (id === "us" || id.includes("american") || label.includes("american") || label.includes("الأمريكي") || label.includes("Ø§Ù„Ø£Ù…Ø±ÙŠÙƒÙŠ")) return "us";
  if (id.includes("crypto") || label.includes("crypto") || label.includes("الرقمية") || label.includes("Ø§Ù„Ø±Ù‚Ù…ÙŠØ©")) return "crypto";
  if (id.includes("commod") || label.includes("gold") || label.includes("oil") || label.includes("السلع") || label.includes("الذهب") || label.includes("Ø§Ù„Ø³Ù„Ø¹")) return "commodities";
  if (id.includes("gulf") || id.includes("gcc") || label.includes("الخليج") || label.includes("Ø§Ù„Ø®Ù„ÙŠØ¬")) return "gcc";
  return "";
}

function getMarketDisplayLabel(market) {
  const primaryKey = getPrimaryMarketKey(market);
  if (!primaryKey) return isEnglishLanguage() ? (market.labelEn || market.label || market.id) : (market.label || market.labelEn || market.id);
  const definition = MARKET_CATEGORY_DEFINITION_BY_KEY.get(primaryKey);
  if (definition) return isEnglishLanguage() ? definition.labelEn : definition.labelAr;
  return isEnglishLanguage() ? MARKET_PRIMARY_LABELS_EN[primaryKey] : MARKET_PRIMARY_LABELS_AR[primaryKey];
}

function getMarketSymbolCount(market) {
  const primaryKey = getPrimaryMarketKey(market);
  const fallback = MARKET_CATEGORY_DEFINITION_BY_KEY.get(primaryKey)?.fallbackCount || 0;
  const count = Number(market?.count ?? market?.symbols?.length ?? fallback);
  return Number.isFinite(count) && count > 0 ? count : fallback;
}

function getMarketCountLabel(market) {
  const count = getMarketSymbolCount(market);
  return isEnglishLanguage() ? `${count} symbols` : `${count} رمز`;
}

function buildCompleteMarketList(markets = []) {
  const byId = new Map();
  for (const market of markets) {
    if (!market?.id) continue;
    byId.set(String(market.id).toLowerCase(), market);
  }

  const required = REQUIRED_MARKET_CATEGORY_DEFINITIONS.map((definition) => {
    const existing = byId.get(definition.key);
    if (existing) return { ...existing, id: definition.key };
    return {
      id: definition.key,
      label: definition.labelAr,
      labelEn: definition.labelEn,
      count: definition.fallbackCount,
      symbols: []
    };
  });

  const extras = markets.filter((market) => {
    const id = String(market?.id || "").toLowerCase();
    return id && !MARKET_CATEGORY_DEFINITION_BY_KEY.has(id);
  });

  return [...required, ...extras];
}

async function loadMarkets() {
  const data = await fetchJson("/api/markets", {
    fallbackMessage: "تعذر تحميل الأسواق. تأكد أن السيرفر يعمل ثم حدث الصفحة."
  });
  lastMarkets = Array.isArray(data.markets) ? data.markets : [];
  renderMarketTabs(lastMarkets);
}

function renderMarketTabs(markets = []) {
  marketTabs.innerHTML = "";

  const orderedMarkets = buildCompleteMarketList(markets).sort((a, b) => getMarketSortIndex(a) - getMarketSortIndex(b));

  for (const market of orderedMarkets) {
    const button = document.createElement("button");
    const primaryKey = getPrimaryMarketKey(market);
    button.className = `market-button ${primaryKey ? "is-primary-market" : "is-secondary-market"}`;
    button.type = "button";
    button.dataset.market = market.id;
    if (primaryKey) button.dataset.primaryMarket = primaryKey;
    const visual = getMarketVisual(market);
    button.innerHTML = `
      <span class="market-button-icon ${visual.className}" aria-hidden="true">${visual.html}</span>
      <span class="market-button-copy">
        <strong>${localizeUiText(getMarketDisplayLabel(market))}</strong>
        <span>${localizeUiText(`${market.count} رمز`)}</span>
      </span>
    `;
    const countNode = button.querySelector(".market-button-copy span");
    if (countNode) countNode.textContent = getMarketCountLabel(market);
    button.addEventListener("click", () => {
      activeMarket = market.id;
      activeShariaFilter = "all";
      setActiveMarketButton();
      setActiveShariaFilterButton();
      loadRecommendations({ force: true, marketChanged: true });
    });
    marketTabs.appendChild(button);
  }

  setActiveMarketButton();
}

function getMarketSortIndex(market) {
  const primaryKey = getPrimaryMarketKey(market);
  if (primaryKey) return PRIMARY_MARKET_ORDER[primaryKey] ?? 9;
  return 20 + String(market?.label || market?.id || "").localeCompare("z");
}

async function loadRecommendations(options = {}) {
  const force = Boolean(options.force);
  const background = Boolean(options.background);
  const skipGrace = Boolean(options.marketChanged || options.skipGrace);
  const now = Date.now();

  if (isLoading && !force) return;
  if (force && !skipGrace && now - lastRecommendationRefreshAt < RECOMMENDATIONS_FORCE_REFRESH_GRACE_MS) return;
  if (background && document.hidden) return;

  const requestId = recommendationRequestId + 1;
  recommendationRequestId = requestId;
  if (force) recommendationRequestController?.abort();
  recommendationRequestController = new AbortController();
  isLoading = true;
  lastRecommendationRefreshAt = now;
  loadingIndicator.textContent = localizeUiText(background ? "تحديث بالخلفية" : "تحديث");

  const endpoint =
    watchlistOnly && watchlist.length
      ? `/api/watchlist?symbols=${encodeURIComponent(watchlist.join(","))}`
      : `/api/recommendations?market=${encodeURIComponent(activeMarket)}`;
  const cachedData = recommendationResponseCache.get(endpoint);

  if (cachedData?.recommendations?.length) {
    lastData = cachedData;
    renderRecommendations(cachedData);
    connectionStatus.textContent = localizeUiText("يعرض آخر تحليل محفوظ");
    loadingIndicator.textContent = localizeUiText("تحديث بالخلفية");
  }

  try {
    const data = await fetchJson(endpoint, {
      retries: 1,
      retryDelayMs: 700,
      signal: recommendationRequestController.signal,
      fallbackMessage: "تعذر الاتصال بالسيرفر. اضغط زر التحديث أو افتح الرابط الجديد للصفحة."
    });

    if (requestId !== recommendationRequestId) return;

    lastData = data;
    recommendationResponseCache.set(endpoint, data);
    updateRecommendationHistory(data.recommendations || []);
    triggerSmartAlertPopup(data.smartAlerts || []);
    renderRecommendations(data);
    connectionStatus.textContent = getConnectionStatusText(data);
  } catch (error) {
    if (error?.name === "AbortError" || requestId !== recommendationRequestId) return;

    const message = getFriendlyFetchError(error, "تعذر الاتصال بالسيرفر. اضغط تحديث أو أعد فتح الصفحة.");
    connectionStatus.textContent = localizeUiText(lastData?.recommendations?.length ? "اتصال متقطع - آخر بيانات محفوظة" : "تعذر الاتصال");

    if (lastData?.recommendations?.length) {
      renderRecommendations(lastData);
    } else {
      cards.innerHTML = `<div class="empty">${escapeHtml(localizeUiText(message))}</div>`;
    }
  } finally {
    if (requestId === recommendationRequestId) {
      loadingIndicator.textContent = localizeUiText("جاهز");
      isLoading = false;
    }
  }
}

function getConnectionStatusText(data) {
  if (data?.refreshing) return localizeUiText("متصل - يحدث في الخلفية");
  if (data?.partial || Number(data?.pendingCount || 0) > 0) return localizeUiText("متصل - تحليل أولي");
  if (data?.cached || data?.stale) return localizeUiText("متصل - آخر بيانات محفوظة");
  return localizeUiText("متصل - بيانات جديدة");
}

function updateAiTradingAgentSummary(data, all = [], buys = [], sells = [], avg = 0) {
  const marketsCount = buildCompleteMarketList(lastMarkets).length || REQUIRED_MARKET_CATEGORY_DEFINITIONS.length;
  const analyzed = Number(data?.analyzedCount || all.length || 0);
  const total = Number(data?.market?.totalSymbols || data?.market?.count || all.length || 0);
  const marketMove = all.length
    ? all.reduce((sum, item) => sum + Number(item.expectedMovePct || 0), 0) / all.length
    : 0;
  const bias =
    buys.length > sells.length && marketMove >= 0 ? "Bullish" :
    sells.length > buys.length && marketMove < 0 ? "Bearish" :
    "Mixed";

  if (aiAgentStatus) aiAgentStatus.textContent = isEnglishLanguage() ? "Active" : "نشط";
  if (aiMarketCount) aiMarketCount.textContent = formatNumber(marketsCount);
  if (aiAssetCount) aiAssetCount.textContent = total ? `${formatNumber(analyzed)}/${formatNumber(total)}` : formatNumber(analyzed);
  if (aiBuyCount) aiBuyCount.textContent = formatNumber(buys.length);
  if (aiSellCount) aiSellCount.textContent = formatNumber(sells.length);
  if (aiAverageConfidence) aiAverageConfidence.textContent = all.length ? `${formatNumber(avg)}%` : "--";
  if (aiMarketBias) {
    aiMarketBias.textContent = isEnglishLanguage()
      ? bias
      : bias === "Bullish" ? "صاعد" : bias === "Bearish" ? "هابط" : "مختلط";
    aiMarketBias.className = bias.toLowerCase();
  }
  if (aiMarketUpdate) {
    const generated = data?.generatedAt ? formatDateTime(data.generatedAt) : "--";
    aiMarketUpdate.textContent = isEnglishLanguage() ? `Last update ${generated}` : `آخر تحديث ${generated}`;
  }
}

function renderRecommendations(data) {
  if (!data) return;

  const all = Array.isArray(data.recommendations) ? data.recommendations : [];
  const recommendations = sortRecommendations(filterRecommendations(all));
  const buys = all.filter((item) => item.action === "buy");
  const sells = all.filter((item) => item.action === "sell");
  const avg = all.length ? Math.round(all.reduce((sum, item) => sum + item.confidence, 0) / all.length) : 0;

  marketTitle.textContent = localizeUiText(data.market.label);
  marketNote.textContent = localizeUiText(data.market.note);
  updatedAt.textContent = formatDateTime(data.generatedAt);
  opportunityCount.textContent = `${all.length} / ${data.market.totalSymbols}`;
  buyCount.textContent = buys.length;
  sellCount.textContent = sells.length;
  avgConfidence.textContent = all.length ? `${avg}%` : "--";
  updateAiTradingAgentSummary(data, all, buys, sells, avg);
  const providerLabel = data.dataProvider?.active || all[0]?.dataProvider || "--";
  dataProvider.textContent = data.partial || Number(data.pendingCount || 0) > 0
    ? `${providerLabel} · ${formatNumber(data.analyzedCount || all.length)}/${formatNumber(data.market.totalSymbols || all.length)}`
    : providerLabel;
  disclaimer.textContent = localizeUiText(data.disclaimer);
  marketPulse.textContent = localizeUiText(getMarketPulse(all));

  setInsight(bestBuy, getTopItem(buys, "confidence"), "لا توجد إشارة شراء");
  setInsight(bestSell, getTopItem(sells, "confidence"), "لا توجد إشارة بيع");
  setInsight(largestMove, getTopItem(all, "move"), "لا توجد بيانات");
  safeRenderPanel("شريط الأسعار", () => updateTicker(all));
  safeRenderPanel("نبض السوق", () => renderLivePulseStrip(data), livePulseGrid);
  safeRenderPanel("رزنامة الأخبار", () => renderEconomicNews(data.economicCalendar), economicNewsGrid);
  safeRenderPanel("لوحة النبض", () => renderTradingAtmosphere(data), floorHeatmap);
  safeRenderPanel("غرفة القيادة", () => renderCommandCenter(data, recommendations), commandCenterGrid);
  safeRenderPanel("أفضل الفرص", () => renderHomeDeck(data, recommendations), homeRecommendations);
  safeRenderPanel("خريطة حرارة الفرص", () => renderHomeHeatmap(data), homeHeatmapGrid);
  safeRenderPanel("رادار الفرص", () => renderOpportunityRadar(data), radarGrid);
  safeRenderPanel("التنبيهات الذكية", () => renderSmartAlerts(data), smartAlertsList);
  safeRenderPanel("لوحة السوق الأمريكي", () => renderUsDashboard(data), usDashboardGrid);
  safeRenderPanel("توقعات السوق الأمريكي", () => renderUsOutlook(data), usOutlookGrid);
  safeRenderPanel("الفرص الذهبية", () => renderGoldenOpportunities(data), goldenGrid);
  safeRenderPanel("المضاربة", () => renderScalpQuickList(data), scalpQuickList);
  if (data.market?.id === "watchlist") {
    watchlistData = data;
    watchlistLastLoadedAt = Date.now();
  }
  safeRenderPanel("قائمة المراقبة", () => renderWatchlist(), watchlistCards);
  safeRenderPanel("المحفظة", () => renderPortfolio(all), portfolioList);
  safeRenderPanel("آخر إشارات الوكيل", () => renderHistory(), historyList);
  safeRenderPanel("متابعة الصفقات", () => checkFollowedTrades(all));
  safeRenderPanel("إشعارات السوق", () => checkSmartMarketNotifications(all));
  safeRenderPanel("المراقبة الصوتية", () => checkVoiceMonitors(all));

  cards.innerHTML = "";

  if (!recommendations.length) {
    cards.innerHTML = renderMarketDataState(data);
  }

  for (const item of recommendations) {
    const card = template.content.firstElementChild.cloneNode(true);
    const actionBadge = card.querySelector(".action-badge");
    const shariaBadge = card.querySelector(".sharia-badge");
    const confidenceFill = card.querySelector(".confidence-fill");
    const visual = getPremiumAssetVisual(item);
    const logo = card.querySelector(".signal-asset-logo");

    card.querySelector(".asset-name").textContent = item.name;
    card.querySelector(".asset-symbol").textContent = `${item.symbol}${item.exchangeName ? ` · ${item.exchangeName}` : ""}`;
    if (logo) {
      logo.className = `asset-logo signal-asset-logo ${visual.className}`;
      logo.innerHTML = visual.html;
    }
    card.dataset.symbol = item.symbol;
    card.setAttribute("role", "link");
    card.tabIndex = 0;
    card.title = "افتح صفحة تفاصيل السهم";
    setupSignalCardToggle(card, item);
    actionBadge.textContent = item.actionLabel;
    actionBadge.classList.add(`action-${item.action}`);
    if (item.shariaStatus === "compliant") {
      shariaBadge.textContent = item.shariaLabel || "مطابق للشريعة";
      shariaBadge.title = item.shariaSource || "تصنيف شرعي قابل للتحديث";
      shariaBadge.classList.add("is-visible");
    }
    card.querySelector(".current-price").textContent = formatMoney(item.currentPrice, item.currency);
    card.querySelector(".expected-price").textContent = formatMoney(item.expectedPrice, item.currency);
    card.querySelector(".target-one").textContent = formatMoney(item.target1 || item.expectedPrice, item.currency);
    card.querySelector(".target-two").textContent = formatMoney(item.target2, item.currency);
    card.querySelector(".stop-loss").textContent = item.stopLoss ? formatMoney(item.stopLoss, item.currency) : "--";
    card.querySelector(".risk-reward").textContent = item.riskReward ? `${formatNumber(item.riskReward, { maximumFractionDigits: 2 })}:1` : "--";
    card.querySelector(".confidence").textContent = `${item.confidence}%`;
    confidenceFill.style.width = `${item.confidence}%`;
    card.querySelector(".duration").textContent = `المدة: ${item.duration}`;
    card.querySelector(".expected-move").textContent = `الحركة: ${formatPercent(item.expectedMovePct)}`;
    card.querySelector(".rsi").textContent = item.indicators?.rsi14 ?? "--";
    card.querySelector(".momentum").textContent = formatPercent(item.indicators?.momentum20 ?? 0);
    card.querySelector(".volatility").textContent = formatPercent(item.indicators?.volatility20 ?? 0);
    card.querySelector(".risk-label").textContent = item.risk?.label || "--";
    card.querySelector(".backtest-label").textContent = item.backtest?.winRate ? `${item.backtest.winRate}%` : item.backtest?.label || "--";
    card.querySelector(".data-health-label").textContent = item.dataHealth?.score ? `${item.dataHealth.score}% ${item.dataHealth.label || ""}`.trim() : "--";
    card.querySelector(".final-score").textContent = `${calculateFinalScore(item).score}%`;
    card.querySelector(".timeframe-grid").innerHTML = renderTimeframePills(item.timeframes || []);

    const reasons = card.querySelector(".reasons");
    reasons.innerHTML = "";
    for (const reason of item.reasons) {
      const li = document.createElement("li");
      li.textContent = reason;
      reasons.appendChild(li);
    }

    cards.appendChild(card);
    if (expandedSignalCards.has(item.symbol)) {
      drawSparkline(card.querySelector(".sparkline"), item.sparkline, item.action);
    }
  }

  attachDetailOpeners(cards);

  if (data.unavailable?.length || !all.length) {
    unavailable.innerHTML = `<strong>رموز لم تتوفر بياناتها:</strong> ${data.unavailable
      .map((item) => `${escapeHtml(item.name)} (${escapeHtml(item.symbol)})`)
      .join("، ")}`;
  } else {
    unavailable.innerHTML = "";
  }
  if (data.unavailable?.length || !all.length) {
    unavailable.innerHTML = renderProviderUnavailableDetails(data);
  }
}

function renderMarketDataState(data = {}) {
  const marketLabel = data.market?.label || "السوق";
  const supported = getSupportedSymbolMetadata(data);
  const provider = data.dataProvider?.active || data.dataProvider?.requested || "--";
  const status = data.partial || Number(data.pendingCount || 0) > 0
    ? "التحليل ما زال قيد الاكتمال"
    : data.unavailable?.length
      ? "مزود البيانات لم يرجع أسعاراً كافية"
      : "لا توجد إشارات مطابقة للفلاتر الحالية";

  return `
    <section class="market-data-state" aria-label="حالة بيانات السوق">
      <div class="market-data-state-head">
        <span>بيانات السوق</span>
        <strong>${escapeHtml(localizeUiText(marketLabel))}</strong>
        <p>${escapeHtml(localizeUiText(getEmptyRecommendationsMessage(data)))}</p>
      </div>
      <div class="market-data-state-grid">
        <article>
          <span>حالة مزود البيانات</span>
          <strong>${escapeHtml(provider)}</strong>
          <p>${escapeHtml(localizeUiText(status))}</p>
        </article>
        <article>
          <span>الرموز المدعومة</span>
          <strong>${formatNumber(supported.length)}</strong>
          <p>${escapeHtml(supported.slice(0, 10).map((item) => item.symbol).join(", ") || "--")}</p>
        </article>
        <article>
          <span>سبب عدم التوفر</span>
          <strong>${formatNumber(data.unavailable?.length || 0)}</strong>
          <p>${escapeHtml(localizeUiText(getUnavailableSummary(data)))}</p>
        </article>
      </div>
      <div class="market-symbol-metadata">
        ${supported.slice(0, 18).map((item) => `
          <span title="${escapeHtml(item.name || item.symbol)}">
            <b>${escapeHtml(item.symbol)}</b>
            <em>${escapeHtml(normalizeDisplayCurrency(item.currency || inferDisplayCurrencyFromSymbol(item.symbol)))}</em>
          </span>
        `).join("")}
      </div>
    </section>
  `;
}

function renderProviderUnavailableDetails(data = {}) {
  const unavailableItems = Array.isArray(data.unavailable) ? data.unavailable : [];
  const supported = getSupportedSymbolMetadata(data);
  const provider = data.dataProvider?.active || data.dataProvider?.requested || "--";
  return `
    <section class="provider-state-panel" aria-label="حالة مزود البيانات">
      <div>
        <strong>حالة مزود البيانات</strong>
        <span>${escapeHtml(provider)} · ${escapeHtml(localizeUiText(data.partial ? "تحليل جزئي" : "مكتمل"))}</span>
      </div>
      <div>
        <strong>الرموز المدعومة</strong>
        <span>${escapeHtml(supported.map((item) => item.symbol).join(", ") || "--")}</span>
      </div>
      <div>
        <strong>سبب عدم التوفر</strong>
        <span>${escapeHtml(localizeUiText(getUnavailableSummary(data)))}</span>
      </div>
      ${unavailableItems.length ? `
        <div class="provider-unavailable-list">
          ${unavailableItems.slice(0, 18).map((item) => `
            <span><b>${escapeHtml(item.symbol)}</b><em>${escapeHtml(localizeUiText(simplifyUnavailableReason(item.reason)))}</em></span>
          `).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function getSupportedSymbolMetadata(data = {}) {
  const supported = data.market?.supportedSymbols;
  if (Array.isArray(supported) && supported.length) return supported;
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
  return recommendations.map((item) => ({
    symbol: item.symbol,
    name: item.name,
    currency: item.currency
  }));
}

function getUnavailableSummary(data = {}) {
  if (data.partial || Number(data.pendingCount || 0) > 0) {
    return `مزود البيانات يعالج ${formatNumber(data.analyzedCount || 0)} من ${formatNumber(data.market?.totalSymbols || 0)} رمز.`;
  }
  const firstReason = data.unavailable?.[0]?.reason;
  if (firstReason) return simplifyUnavailableReason(firstReason);
  if (!data.recommendations?.length) return "لا توجد أسعار كافية أو نتائج مطابقة حالياً. تعرض الصفحة الرموز المدعومة بدون أسعار وهمية.";
  return "كل الرموز المتاحة تم تحليلها.";
}

function safeRenderPanel(label, render, fallbackElement = null) {
  try {
    return render();
  } catch (error) {
    console.error(`[SFM render] ${label}`, error);
    if (fallbackElement) {
      fallbackElement.innerHTML = `<div class="empty">${escapeHtml(localizeUiText(`تعذر عرض ${label} مؤقتاً. البيانات الرئيسية لا تزال متاحة.`))}</div>`;
    }
    return null;
  }
}

function renderScalpQuickList(data) {
  if (!scalpQuickList) return;

  const items = (data?.recommendations || [])
    .filter((item) => item?.symbol)
    .sort((a, b) => calculateFinalScore(b).score - calculateFinalScore(a).score)
    .slice(0, 8);

  if (!items.length) {
    scalpQuickList.innerHTML = "<span class=\"scalp-empty-chip\">تظهر الاختيارات بعد تحميل السوق</span>";
    return;
  }

  scalpQuickList.innerHTML = items.map((item) => `
    <button type="button" data-scalp-symbol="${escapeHtml(item.symbol)}">
      <strong>${escapeHtml(item.symbol)}</strong>
      <span>${escapeHtml(item.actionLabel)} · ${formatNumber(item.confidence)}%</span>
    </button>
  `).join("");

  for (const button of scalpQuickList.querySelectorAll("[data-scalp-symbol]")) {
    button.addEventListener("click", () => {
      scalpSymbol.value = button.dataset.scalpSymbol;
      analyzeScalpSymbol(button.dataset.scalpSymbol);
    });
  }
}

function handleScalpSubmit(event) {
  event.preventDefault();
  analyzeScalpSymbol(scalpSymbol.value);
}

async function analyzeScalpSymbol(rawSymbol) {
  if (!scalpResult || scalpLoading) return;

  const symbol = normalizeSymbol(rawSymbol);
  if (!symbol) {
    scalpResult.innerHTML = "<div class=\"scalp-empty\">اكتب رمز السهم أولاً.</div>";
    return;
  }

  scalpLoading = true;
  if (scalpStatus) scalpStatus.textContent = "يحلل";
  if (scalpSubmit) scalpSubmit.disabled = true;
  scalpResult.innerHTML = `<div class="scalp-empty">جاري تحليل ${escapeHtml(symbol)} لفريم 1m و15m...</div>`;

  try {
    const data = await fetchJson(`/api/asset?symbol=${encodeURIComponent(symbol)}`, {
      retries: 1,
      retryDelayMs: 700,
      fallbackMessage: "تعذر الاتصال بالسيرفر. حدث الصفحة وحاول مرة ثانية، أو استخدم رمز Yahoo كامل مثل NZDUSD=X."
    });

    const item = data.recommendation;
    const scalp = buildScalpDecision(item);
    renderScalpResult(item, scalp);
    if (scalpStatus) scalpStatus.textContent = scalp.statusLabel;
  } catch (error) {
    const message = getFriendlyFetchError(error, "تعذر الاتصال بالسيرفر. حدث الصفحة وحاول مرة ثانية، أو استخدم رمز Yahoo كامل مثل NZDUSD=X.");
    scalpResult.innerHTML = `<div class="scalp-empty">${escapeHtml(message)}</div>`;
    if (scalpStatus) scalpStatus.textContent = "تعذر";
  } finally {
    scalpLoading = false;
    if (scalpSubmit) scalpSubmit.disabled = false;
  }
}

function buildScalpDecision(item) {
  const frames = item?.timeframes || [];
  const oneMinute = frames.find((frame) => frame.id === "1m");
  const fifteenMinute = frames.find((frame) => frame.id === "15m");
  const thirtyMinute = frames.find((frame) => frame.id === "30m");
  const usableFrames = [oneMinute, fifteenMinute].filter(Boolean);
  const price = Number(item?.currentPrice);
  const dataScore = Number(item?.dataHealth?.score ?? item?.analysisQuality?.score ?? 0);
  const hasDataHealth = Number.isFinite(dataScore) && dataScore > 0;

  if (usableFrames.length < 2 || !Number.isFinite(price) || price <= 0) {
    return {
      action: "hold",
      actionText: "انتظر",
      statusLabel: "انتظار",
      confidence: 45,
      duration: "5 إلى 15 دقيقة مراقبة فقط",
      target: null,
      stop: null,
      movePct: 0,
      reasons: ["فريم الدقيقة أو 15 دقيقة غير مكتمل حالياً.", "لا تدخل مضاربة بدون تأكيد الفريمات السريعة."]
    };
  }

  if (hasDataHealth && dataScore < 50) {
    return {
      action: "hold",
      actionText: "انتظر",
      statusLabel: "انتظار",
      confidence: Math.min(50, Math.round(dataScore)),
      duration: "5 إلى 15 دقيقة مراقبة فقط",
      target: null,
      stop: null,
      movePct: 0,
      reasons: [
        `صحة البيانات ${formatNumber(dataScore)}% فقط، وهذا غير كاف للمضاربة.`,
        "لا تدخل مضاربة سريعة إذا كانت البيانات ناقصة أو متأخرة.",
        ...(item?.dataHealth?.notes || []).slice(0, 2)
      ]
    };
  }

  if (item?.timeframeConsensus?.conflict) {
    return {
      action: "hold",
      actionText: "انتظر",
      statusLabel: "انتظار",
      confidence: Math.min(55, Number(item.confidence || 55)),
      duration: "5 إلى 15 دقيقة مراقبة فقط",
      target: null,
      stop: null,
      movePct: 0,
      reasons: [
        "يوجد تضارب بين الفريمات السريعة والطويلة.",
        item.timeframeConsensus.conflict,
        "انتظر شمعة أوضح قبل المضاربة."
      ]
    };
  }

  const fastAgreement = oneMinute.action === fifteenMinute.action && ["buy", "sell"].includes(oneMinute.action);
  const thirtyOpposite =
    thirtyMinute &&
    oneMinute.action !== "hold" &&
    thirtyMinute.action !== "hold" &&
    thirtyMinute.action !== oneMinute.action;
  const confirmationBoost = thirtyMinute?.action === oneMinute.action ? 5 : 0;
  const averageConfidence = Math.round((Number(oneMinute.confidence || 0) + Number(fifteenMinute.confidence || 0)) / 2);
  const confidence = clamp(averageConfidence + confirmationBoost, 45, 92);
  const action = fastAgreement && !thirtyOpposite && confidence >= 58 && (!hasDataHealth || dataScore >= 55) ? oneMinute.action : "hold";
  const movePct = action === "hold" ? 0 : clamp(0.0012 + ((confidence - 55) / 10000), 0.0012, 0.008);
  const stopPct = movePct * 0.68;
  const direction = action === "sell" ? -1 : 1;

  return {
    action,
    actionText: action === "buy" ? "اشتر الآن" : action === "sell" ? "بيع الآن" : "انتظر",
    statusLabel: action === "buy" ? "شراء سريع" : action === "sell" ? "بيع سريع" : "انتظار",
    confidence,
    duration: action === "hold" ? "5 إلى 15 دقيقة مراقبة فقط" : confidence >= 78 ? "5 إلى 10 دقائق" : "10 إلى 15 دقيقة",
    target: action === "hold" ? null : price * (1 + direction * movePct),
    stop: action === "hold" ? null : price * (1 - direction * stopPct),
    movePct: movePct * 100 * direction,
    reasons: [
      `فريم الدقيقة: ${oneMinute.actionLabel} بثقة ${formatNumber(oneMinute.confidence)}%`,
      `فريم 15 دقيقة: ${fifteenMinute.actionLabel} بثقة ${formatNumber(fifteenMinute.confidence)}%`,
      thirtyOpposite ? "فريم 30 دقيقة يعاكس الدقيقتين؛ لا دخول الآن." : thirtyMinute ? `فريم 30 دقيقة: ${thirtyMinute.actionLabel} كفلتر إضافي` : "فريم 30 دقيقة غير متاح كفلتر إضافي",
      action === "hold" ? "الفريمات السريعة أو جودة البيانات غير كافية؛ الأفضل انتظار شمعة أوضح." : "الدخول مشروط بالالتزام بالهدف والوقف السريع."
    ]
  };
}

function renderScalpResult(item, scalp) {
  const actionClass = `scalp-action-${scalp.action}`;
  const current = formatMoney(item.currentPrice, item.currency);
  const target = scalp.target ? formatMoney(scalp.target, item.currency) : "--";
  const stop = scalp.stop ? formatMoney(scalp.stop, item.currency) : "--";

  scalpResult.innerHTML = `
    <article class="scalp-card ${actionClass}">
      <div class="scalp-decision">
        <span>قرار المضاربة</span>
        <strong>${escapeHtml(scalp.actionText)}</strong>
        <em>${formatNumber(scalp.confidence)}% ثقة · ${escapeHtml(scalp.duration)}</em>
      </div>
      <div class="scalp-symbol-block">
        <span>${escapeHtml(item.name || item.symbol)}</span>
        <strong>${escapeHtml(item.symbol)}</strong>
      </div>
      <div class="scalp-metrics">
        <div><span>السعر الحالي</span><strong>${current}</strong></div>
        <div><span>هدف سريع</span><strong>${target}</strong></div>
        <div><span>وقف سريع</span><strong>${stop}</strong></div>
        <div><span>الحركة</span><strong>${formatPercent(scalp.movePct)}</strong></div>
      </div>
      <ul>
        ${scalp.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
      </ul>
      <p>المضاربة سريعة وحساسة؛ إذا تأخر الدخول أو تحرك السعر عكس القرار، انتظر إشارة جديدة.</p>
    </article>
  `;
}

function renderCommandCenter(data, filteredRecommendations = []) {
  if (!commandCenterGrid) return;

  const all = data?.recommendations || [];
  const accuracy = calculateAccuracyStats(recommendationHistory);
  const modeLabel = getAnalysisModeLabel(activeAnalysisMode);
  const modeNote = getAnalysisModeNote(activeAnalysisMode);

  if (commandCenterMode) commandCenterMode.textContent = modeLabel;
  if (commandCenterBrief) {
    commandCenterBrief.textContent = localizeUiText(`${data.market?.label || "السوق"} · ${formatNumber(all.length)} رمز · ${modeNote}`);
  }

  commandCenterGrid.innerHTML = renderTradingCommandDashboard(data, filteredRecommendations, all, accuracy);
  attachDetailOpeners(commandCenterGrid);
}

function renderTradingCommandDashboard(data, filteredRecommendations = [], all = [], accuracy = {}) {
  const ranked = filteredRecommendations.length
    ? filteredRecommendations
    : sortRecommendations(filterRecommendations(all));
  const best = ranked[0] || all[0] || null;
  const stockAlertCount = notificationLog.filter(isStockNotification).length;
  const riskValue = best ? clamp(Math.round(100 - getDataHealthScore(best) * 0.62), 18, 72) : 38;
  const performanceValue = ranked.length
    ? ranked.slice(0, 8).reduce((sum, item) => sum + Number(item.expectedMovePct || 0), 0) / Math.min(8, ranked.length)
    : 1.42;
  const performanceText = accuracy.closed
    ? `+${formatNumber(accuracy.winRate / 60, 2)}%`
    : `${performanceValue >= 0 ? "+" : ""}${formatNumber(performanceValue, 2)}%`;
  const newsText = data?.market?.session?.riskLabel || "Market moving news";
  const bestSymbol = best?.symbol ? escapeHtml(best.symbol) : "";

  return `
    <article class="command-card command-dashboard-card command-ai-scan" ${bestSymbol ? `data-symbol="${bestSymbol}" role="link" tabindex="0"` : ""}>
      <span>AI Scan</span>
      <strong>Market opportunities</strong>
      <div class="command-radar-visual" aria-hidden="true"><i></i><i></i><i></i></div>
      <em>${best ? escapeHtml(best.symbol) : "SFM"}</em>
    </article>
    <article class="command-card command-dashboard-card command-smart-alerts">
      <span>Smart Alerts</span>
      <strong>Active signals</strong>
      <div class="command-number-row"><b>${formatNumber(stockAlertCount || ranked.length || 12)}</b><i aria-hidden="true"></i></div>
      <svg class="command-mini-chart" viewBox="0 0 160 56" aria-hidden="true"><polyline points="0,45 16,38 32,42 48,30 64,33 80,24 96,29 112,20 128,22 144,12 160,9"></polyline></svg>
    </article>
    <article class="command-card command-dashboard-card command-risk-radar">
      <span>Risk Radar</span>
      <strong>Portfolio exposure</strong>
      <div class="command-gauge" style="--risk:${riskValue}%"><b>${riskValue}%</b><em>${riskValue > 58 ? "High" : riskValue > 38 ? "Moderate" : "Calm"}</em></div>
    </article>
    <article class="command-card command-dashboard-card command-performance">
      <span>Performance</span>
      <strong>Today</strong>
      <b class="command-performance-value">${escapeHtml(performanceText)}</b>
      <svg class="command-mini-chart command-mini-chart-large" viewBox="0 0 170 64" aria-hidden="true"><polyline points="0,50 14,48 28,39 42,44 56,35 70,32 84,28 98,31 112,22 126,25 140,17 154,16 170,9"></polyline></svg>
    </article>
    <article class="command-card command-dashboard-card command-news-feed">
      <span>News Feed</span>
      <strong>${escapeHtml(newsText)}</strong>
      <div class="command-globe" aria-hidden="true"></div>
    </article>
  `;
}

function renderCommandOpportunityCard(title, item, tone, note) {
  if (!item) {
    return `
      <article class="command-card command-card-${tone}">
        <span>${escapeHtml(title)}</span>
        <strong>لا توجد فرصة مناسبة</strong>
        <p>${escapeHtml(note)}</p>
      </article>
    `;
  }

  const score = calculateFinalScore(item).score;
  const health = getDataHealthScore(item);
  const fastAgreement = getFastFrameAgreement(item);
  const target = item.target1 || item.expectedPrice;

  return `
    <article class="command-card command-card-${tone}" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0" title="افتح صفحة تفاصيل ${escapeHtml(item.symbol)}">
      <span>${escapeHtml(title)}</span>
      <div class="command-symbol-row">
        <strong>${escapeHtml(item.symbol)}</strong>
        <em class="action-${escapeHtml(item.action)}">${escapeHtml(item.actionLabel || item.action)}</em>
      </div>
      <p>${escapeHtml(item.name || item.symbol)}</p>
      <div class="command-card-metrics">
        <b>${formatNumber(item.confidence)}% ثقة</b>
        <b>Score ${formatNumber(score)}%</b>
        <b>بيانات ${formatNumber(health)}%</b>
      </div>
      <div class="command-card-footer">
        <span>الهدف ${formatMoney(target, item.currency)}</span>
        <span>الفريمات ${formatNumber(fastAgreement)}%</span>
      </div>
    </article>
  `;
}

function renderCommandMetricCard(title, value, note, tone) {
  return `
    <article class="command-card command-metric command-card-${tone}">
      <span>${escapeHtml(title)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <p>${escapeHtml(note)}</p>
    </article>
  `;
}

function getAssetBaseSymbol(symbol = "") {
  return String(symbol || "")
    .toUpperCase()
    .replace(/=X$/, "")
    .replace(/[-.].*$/, "")
    .replace(/=.*/, "");
}

const ASSET_VISUAL_RULES = [
  { symbols: ["XAUUSD", "GC=F"], contains: ["XAU"], names: ["gold"], className: "asset-logo-gold", kind: "gold", label: "Au" },
  { symbols: ["XAGUSD", "SI=F"], contains: ["XAG"], names: ["silver"], className: "asset-logo-silver", kind: "silver", label: "Ag" },
  { symbols: ["USOIL", "UKOIL", "CL=F", "BZ=F"], names: ["oil", "brent", "wti"], className: "asset-logo-oil", kind: "oil", label: "Oil" },
  { symbols: ["NATGAS", "NG=F"], names: ["natural gas", "natgas"], className: "asset-logo-energy", kind: "gas", label: "Gas" },
  { symbols: ["COPPER", "HG=F"], names: ["copper"], className: "asset-logo-copper", kind: "copper", label: "Cu" },
  { symbols: ["BTC", "BTCUSD", "BTC-USD"], contains: ["BTC"], names: ["bitcoin"], className: "asset-logo-crypto", kind: "bitcoin", label: "BTC" },
  { symbols: ["ETH", "ETHUSD", "ETH-USD"], contains: ["ETH"], names: ["ethereum"], className: "asset-logo-eth", kind: "ethereum", label: "ETH" },
  { symbols: ["BNB", "BNBUSD", "BNB-USD"], contains: ["BNB"], names: ["bnb"], className: "asset-logo-bnb", kind: "bnb", label: "BNB" },
  { symbols: ["SOL", "SOLUSD", "SOL-USD"], contains: ["SOL"], names: ["solana"], className: "asset-logo-sol", kind: "solana", label: "SOL" },
  { symbols: ["XRP", "XRPUSD", "XRP-USD"], contains: ["XRP"], names: ["xrp"], className: "asset-logo-xrp", kind: "xrp", label: "XRP" },
  { symbols: ["ADA", "ADAUSD", "ADA-USD"], contains: ["ADA"], names: ["cardano"], className: "asset-logo-ada", kind: "cardano", label: "ADA" },
  { symbols: ["AVAX", "AVAXUSD", "AVAX-USD"], contains: ["AVAX"], names: ["avalanche"], className: "asset-logo-avax", kind: "avalanche", label: "AVAX" },
  { symbols: ["AAPL", "APPLE"], names: ["apple"], className: "asset-logo-apple", kind: "apple", label: "AAPL" },
  { symbols: ["GOOGL", "GOOG"], names: ["alphabet", "google"], className: "asset-logo-google", kind: "google", label: "G" },
  { symbols: ["MSFT"], names: ["microsoft"], className: "asset-logo-microsoft", kind: "microsoft", label: "MS" },
  { symbols: ["AMZN"], names: ["amazon"], className: "asset-logo-amazon", kind: "amazon", label: "AM" },
  { symbols: ["META"], names: ["meta"], className: "asset-logo-meta", kind: "meta", label: "ME" },
  { symbols: ["TSLA"], names: ["tesla"], className: "asset-logo-tesla", kind: "tesla", label: "TS" },
  { symbols: ["NVDA"], names: ["nvidia"], className: "asset-logo-nvidia", kind: "nvidia", label: "NV" },
  { symbols: ["AMD"], names: ["amd"], className: "asset-logo-amd", kind: "amd", label: "AMD" },
  { symbols: ["INTC"], names: ["intel"], className: "asset-logo-intel", kind: "intel", label: "IN" },
  { symbols: ["NFLX"], names: ["netflix"], className: "asset-logo-netflix", kind: "netflix", label: "N" },
  { symbols: ["CRM"], names: ["salesforce"], className: "asset-logo-salesforce", kind: "text", label: "CRM" },
  { symbols: ["ORCL"], names: ["oracle"], className: "asset-logo-oracle", kind: "text", label: "OR" },
  { symbols: ["JPM"], names: ["jpmorgan", "jpmorgan chase"], className: "asset-logo-bank asset-logo-jpm", kind: "bank", label: "JPM" },
  { symbols: ["BAC"], names: ["bank of america"], className: "asset-logo-bank asset-logo-bac", kind: "bank", label: "BAC" },
  { symbols: ["WFC", "GS", "MS", "HSBC"], names: ["wells fargo", "goldman", "morgan stanley", "hsbc"], className: "asset-logo-bank", kind: "bank", label: "BK" },
  { symbols: ["LLY"], names: ["eli lilly"], className: "asset-logo-health asset-logo-lly", kind: "pharma", label: "LL" },
  { symbols: ["PFE"], names: ["pfizer"], className: "asset-logo-health asset-logo-pfe", kind: "pharma", label: "PF" },
  { symbols: ["JNJ", "MRK", "ABBV", "NVO", "UNH", "AMGN"], names: ["johnson", "merck", "abbvie", "novo", "unitedhealth", "amgen"], className: "asset-logo-health", kind: "pharma", label: "Rx" },
  { symbols: ["KO", "PEP", "MCD", "COST", "WMT", "PG", "MDLZ", "KHC", "SBUX"], names: ["coca-cola", "pepsico", "mcdonald", "costco", "walmart", "starbucks"], className: "asset-logo-food", kind: "food", label: "FD" },
  { symbols: ["XOM", "CVX", "COP", "SLB", "BP", "SHEL", "TTE"], names: ["exxon", "chevron", "conocophillips", "schlumberger", "shell"], className: "asset-logo-energy", kind: "oil", label: "EN" },
  { symbols: ["PLTR"], names: ["palantir"], className: "asset-logo-ai", kind: "text", label: "AI" },
  { symbols: ["AVGO", "TSM", "QCOM", "ASML", "MU"], names: ["broadcom", "taiwan semiconductor", "qualcomm", "asml", "micron"], className: "asset-logo-semiconductor", kind: "chip", label: "CH" },
  { symbols: ["EURUSD", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "EURNZD"], contains: ["EUR"], className: "asset-logo-eu", kind: "eu", label: "EU" },
  { symbols: ["GBPUSD", "USDJPY", "USDCHF", "USDCAD", "AUDUSD", "NZDUSD"], className: "asset-logo-fx", kind: "fx", label: "FX" }
];

function getAssetVisual(item = {}) {
  const visual = resolveAssetVisual(item);
  return { className: visual.className, text: visual.label };
}

function getPremiumAssetVisual(item = {}) {
  const visual = resolveAssetVisual(item);
  return { className: visual.className, html: renderAssetIcon(visual.kind, visual.label) };
}

function resolveAssetVisual(item = {}) {
  const symbol = String(item.symbol || "").toUpperCase();
  const name = String(item.name || "").toLowerCase();
  const base = getAssetBaseSymbol(symbol);
  const rule = ASSET_VISUAL_RULES.find((entry) => assetRuleMatches(entry, symbol, base, name));
  if (rule) return rule;

  const gulf = resolveGulfAssetVisual(symbol);
  if (gulf) return gulf;

  if (["US30", "US100", "NAS100", "SPX", "SP500", "S&P500"].some((value) => symbol.includes(value))) {
    return { className: "asset-logo-index", kind: "index", label: "IDX" };
  }

  return { className: "asset-logo-default", kind: "text", label: (base || symbol).slice(0, 3) || "S" };
}

function assetRuleMatches(rule, symbol, base, name) {
  const compact = symbol.replace(/[^A-Z0-9]/g, "");
  const exact = rule.symbols || [];
  if (exact.some((value) => {
    const key = String(value).toUpperCase();
    return key === symbol || key === base || key === compact;
  })) return true;

  const contains = rule.contains || [];
  if (contains.some((value) => {
    const key = String(value).toUpperCase();
    return symbol.includes(key) || compact.includes(key);
  })) return true;

  const names = rule.names || [];
  return names.some((value) => name.includes(String(value).toLowerCase()));
}

function resolveGulfAssetVisual(symbol = "") {
  const upper = String(symbol || "").toUpperCase();
  const rules = [
    { test: upper.endsWith(".KW"), className: "asset-logo-gulf asset-logo-kw", label: "KW" },
    { test: upper.startsWith("SR.") || upper.endsWith(".SR"), className: "asset-logo-gulf asset-logo-sa", label: "SA" },
    { test: upper.endsWith(".AD") || upper.endsWith(".DU") || upper.endsWith(".AE"), className: "asset-logo-gulf asset-logo-ae", label: "AE" },
    { test: upper.endsWith(".OM"), className: "asset-logo-gulf asset-logo-om", label: "OM" },
    { test: upper.endsWith(".BH"), className: "asset-logo-gulf asset-logo-bh", label: "BH" },
    { test: upper.endsWith(".QA"), className: "asset-logo-gulf asset-logo-qa", label: "QA" }
  ];
  const match = rules.find((rule) => rule.test);
  return match ? { className: match.className, kind: "text", label: match.label } : null;
}

function renderAssetIcon(kind, label) {
  if (kind === "apple") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-apple" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M17.3 12.4c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.1-1.8-1.3-.1-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.4 2.9 2.3 1.1 0 1.6-.7 2.9-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.3.9-1.3 1.2-2.5 1.2-2.6 0 0-2.4-.9-2.4-3.7Z"></path>
        <path d="M15.2 5.9c.6-.8 1.1-1.9.9-2.9-1 .1-2 .7-2.7 1.5-.6.7-1.1 1.8-.9 2.8 1 .1 2-.6 2.7-1.4Z"></path>
      </svg>
    `;
  }
  if (kind === "gold") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-gold" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5.2 15.4h6.6l1.2 4.2H4Z"></path>
        <path d="M12.2 15.4h6.6l1.2 4.2h-9Z"></path>
        <path d="M8.7 8.1h6.6l1.2 4.2h-9Z"></path>
      </svg>
    `;
  }
  if (kind === "bitcoin") return `<span class="asset-logo-text asset-logo-text-bitcoin">&#8383;</span>`;
  if (kind === "ethereum") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-ethereum" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3 6.8 12.1 12 15.2l5.2-3.1Z"></path>
        <path d="m6.8 13.2 5.2 7.8 5.2-7.8-5.2 3.1Z"></path>
      </svg>
    `;
  }
  if (kind === "bnb") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-bnb" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m12 3.4 3 3-3 3-3-3Z"></path><path d="m6.4 9 3 3-3 3-3-3Z"></path>
        <path d="m17.6 9 3 3-3 3-3-3Z"></path><path d="m12 14.6 3 3-3 3-3-3Z"></path>
        <path d="m12 9.2 2.8 2.8-2.8 2.8-2.8-2.8Z"></path>
      </svg>
    `;
  }
  if (kind === "solana") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-solana" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6.5h12l-2.2 2.4H3.8Z"></path><path d="M5.8 10.8h14.4L18 13.2H3.6Z"></path>
        <path d="M6 15.1h12l-2.2 2.4H3.8Z"></path>
      </svg>
    `;
  }
  if (kind === "xrp") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-xrp" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6.2c2.6 2.7 4.1 4 6 4s3.4-1.3 6-4"></path>
        <path d="M6 17.8c2.6-2.7 4.1-4 6-4s3.4 1.3 6 4"></path>
      </svg>
    `;
  }
  if (kind === "cardano") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-cardano" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="2.2"></circle><circle cx="12" cy="4.8" r="1.1"></circle><circle cx="12" cy="19.2" r="1.1"></circle>
        <circle cx="4.8" cy="12" r="1.1"></circle><circle cx="19.2" cy="12" r="1.1"></circle>
        <circle cx="6.9" cy="6.9" r=".9"></circle><circle cx="17.1" cy="6.9" r=".9"></circle>
        <circle cx="6.9" cy="17.1" r=".9"></circle><circle cx="17.1" cy="17.1" r=".9"></circle>
      </svg>
    `;
  }
  if (kind === "avalanche") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-avalanche" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4 21 20h-6.1L12 14.8 9.1 20H3Z"></path><path d="M14.5 13.3 17 9l2.5 4.3Z"></path>
      </svg>
    `;
  }
  if (kind === "nvidia") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-nvidia" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 12.2c3.7-4.1 9.5-4.8 16-1.9-3.6-.4-6.1.1-8 1.5 1.7-.4 3.4-.2 5 .6-2.8 2.9-7.1 3.4-10.6 1.3 1.2-.7 2.4-1.2 3.8-1.4-1.9-.3-3.9 0-6.2-.1Z"></path>
        <circle cx="12.6" cy="12.6" r="1.35"></circle>
      </svg>
    `;
  }
  if (kind === "amd") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-amd" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 5h6v4H9v2H5Z"></path>
        <path d="M13 5h6v6h-4V9h-2Z"></path>
        <path d="M5 13h4v2h2v4H5Z"></path>
        <path d="M15 13h4v6h-6v-4h2Z"></path>
      </svg>
    `;
  }
  if (kind === "intel") {
    return `<span class="asset-logo-wordmark asset-logo-wordmark-intel">intel</span>`;
  }
  if (kind === "netflix") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-netflix" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 4h4.1l5.9 16h-4.1Z"></path>
        <path d="M7 4h4v16H7Z"></path>
        <path d="M13 4h4v16h-4Z"></path>
      </svg>
    `;
  }
  if (kind === "google") return `<span class="asset-logo-text asset-logo-text-google">G</span>`;
  if (kind === "amazon") {
    return `
      <span class="asset-logo-text">AM</span>
      <svg class="asset-logo-smile" viewBox="0 0 24 8" aria-hidden="true" focusable="false">
        <path d="M4 2.3c4.2 3.2 11.2 3.3 16 .1"></path>
        <path d="M17.5 1.8 20.2 2l-.8 2.3"></path>
      </svg>
    `;
  }
  if (kind === "fx") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-fx" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M7 9h10M7 15h10M12 5.5c2.2 2.1 2.2 10.9 0 13M12 5.5c-2.2 2.1-2.2 10.9 0 13"></path>
      </svg>
    `;
  }
  if (kind === "eu") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-eu" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 5.7v2.1M12 16.2v2.1M5.7 12h2.1M16.2 12h2.1M7.6 7.6l1.5 1.5M14.9 14.9l1.5 1.5M16.4 7.6l-1.5 1.5M9.1 14.9l-1.5 1.5"></path>
      </svg>
    `;
  }
  if (kind === "oil" || kind === "gas") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-oil" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3.8c3.6 4.2 5.4 7.2 5.4 10a5.4 5.4 0 1 1-10.8 0c0-2.8 1.8-5.8 5.4-10Z"></path>
        <path d="M10 17.2c1.7 1.1 4 .5 4.8-1.5"></path>
      </svg>
    `;
  }
  if (kind === "index") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-index" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 17h16"></path><path d="M5 15 9 9l4 3 5-7"></path><path d="M16 5h2.8v2.8"></path>
      </svg>
    `;
  }
  if (kind === "microsoft") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-microsoft" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 4h7.3v7.3H4Z"></path><path d="M12.7 4H20v7.3h-7.3Z"></path>
        <path d="M4 12.7h7.3V20H4Z"></path><path d="M12.7 12.7H20V20h-7.3Z"></path>
      </svg>
    `;
  }
  if (kind === "meta") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-meta" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.2 15.5c1.5-5.6 3.6-8.3 6.1-8.3 2.9 0 3.9 8.3 7 8.3 1.8 0 2.8-1.5 2.8-3.2 0-2.6-1.7-5.1-4.2-5.1-3.1 0-5.3 8.3-8.4 8.3-1.9 0-3.2-1.4-3.3-3.2-.1-2.8 1.7-5.1 4.2-5.1"></path>
      </svg>
    `;
  }
  if (kind === "tesla") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-tesla" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.2 5.4c5.1-1.8 10.5-1.8 15.6 0"></path><path d="M8 7.4h8"></path>
        <path d="M12 7.4V20"></path><path d="M9.7 10.2 12 7.4l2.3 2.8"></path>
      </svg>
    `;
  }
  if (kind === "bank") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-bank" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 9.2 12 4l8 5.2Z"></path><path d="M6 10.8V18M10 10.8V18M14 10.8V18M18 10.8V18M4 20h16"></path>
      </svg>
      <span class="asset-logo-mini">${escapeHtml(label.slice(0, 3))}</span>
    `;
  }
  if (kind === "pharma") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-pharma" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4v16M4 12h16"></path><circle cx="12" cy="12" r="8"></circle>
      </svg>
      <span class="asset-logo-mini">${escapeHtml(label.slice(0, 3))}</span>
    `;
  }
  if (kind === "food") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-food" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7 4v7M10 4v7M8.5 11v9"></path><path d="M16 4c2 2.6 2 6.2 0 8v8"></path>
      </svg>
    `;
  }
  if (kind === "chip") {
    return `
      <svg class="asset-logo-svg asset-logo-svg-chip" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="7" y="7" width="10" height="10" rx="2"></rect>
        <path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3"></path>
      </svg>
    `;
  }
  if (kind === "silver") return `<span class="asset-logo-text">Ag</span>`;
  if (kind === "copper") return `<span class="asset-logo-text">Cu</span>`;
  return `<span class="asset-logo-text">${escapeHtml(label)}</span>`;
}

function renderHomeDeck(data, rankedRecommendations = []) {
  if (!homeRecommendations && !homeFollowedTrades) return;

  const ranked = rankedRecommendations.length
    ? rankedRecommendations
    : sortRecommendations(filterRecommendations(data?.recommendations || []));
  let picks = ranked
    .filter((item) => item?.action !== "hold")
    .slice(0, 3);
  if (!picks.length) picks = ranked.slice(0, 3);

  if (homeRecommendations) {
    homeRecommendations.innerHTML = picks.length
      ? picks.map(renderHomeRecommendationCard).join("")
      : `<div class="empty">${escapeHtml(localizeUiText("لا توجد فرصة واضحة حالياً."))}</div>`;
    attachDetailOpeners(homeRecommendations);
  }

  if (!homeFollowedTrades) return;

  const followed = recommendationHistory
    .filter((entry) => followedTradeKeys.has(entry.key))
    .slice(0, 5);
  const fallback = ranked.slice(0, 3).map((item) => ({
    key: `${item.symbol}:${item.action}`,
    symbol: item.symbol,
    action: item.action,
    actionLabel: item.actionLabel,
    lastPrice: item.currentPrice,
    currentPrice: item.currentPrice,
    currency: item.currency,
    observedReturnPct: Number(item.expectedMovePct || 0),
    confidence: item.confidence
  }));
  const rows = followed.length ? followed : fallback;

  homeFollowedTrades.innerHTML = rows.length
    ? rows.map(renderHomeFollowedTrade).join("")
    : `<div class="empty">${escapeHtml(localizeUiText("اختر صفقة من آخر إشارات الوكيل للمتابعة."))}</div>`;
  attachDetailOpeners(homeFollowedTrades);
}

function renderHomeHeatmap(data) {
  if (!homeHeatmapGrid) return;
  const items = [...(data?.recommendations || [])]
    .map((item) => ({ item, score: calculateFinalScore(item).score }))
    .sort((a, b) => Math.abs(Number(b.item.expectedMovePct || 0)) - Math.abs(Number(a.item.expectedMovePct || 0)) || b.score - a.score)
    .slice(0, 16);

  if (homeHeatmapLeader) {
    const leader = items[0]?.item;
    homeHeatmapLeader.textContent = leader
      ? `${leader.symbol} ${formatPercent(leader.expectedMovePct)}`
      : "--";
  }

  homeHeatmapGrid.innerHTML = items.length
    ? items.map(({ item, score }) => {
        const tone = item.action === "sell" ? "sell" : item.action === "buy" ? "buy" : "hold";
        const visual = getPremiumAssetVisual(item);
        return `
          <article class="home-heat-cell ${tone}" data-symbol="${escapeHtml(item.symbol)}" tabindex="0" role="link">
            <span class="asset-logo heat-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
            <strong>${escapeHtml(item.symbol)}</strong>
            <span>${formatPercent(item.expectedMovePct)}</span>
            <em>${formatNumber(score)}%</em>
          </article>
        `;
      }).join("")
    : `<div class="empty">${escapeHtml(localizeUiText("لا توجد بيانات كافية لخريطة الحرارة حالياً."))}</div>`;
  attachDetailOpeners(homeHeatmapGrid);
}

function renderHomeRecommendationCard(item) {
  const visual = getPremiumAssetVisual(item);
  const actionClass = item.action === "sell" ? "sell" : item.action === "hold" ? "hold" : "buy";
  const target = item.target1 || item.expectedPrice;
  return `
    <article class="home-rec-card ${actionClass}" data-symbol="${escapeHtml(item.symbol)}" tabindex="0" role="link">
      <div class="home-rec-top">
        <span class="asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <div>
          <strong>${escapeHtml(item.symbol)}</strong>
          <em>${escapeHtml(item.name || item.exchangeName || "")}</em>
        </div>
        <b class="action-${escapeHtml(item.action)}">${escapeHtml(localizeUiText(item.actionLabel || item.action))}</b>
      </div>
      <div class="home-rec-metrics">
        <div><span>${escapeHtml(localizeUiText("السعر الحالي"))}</span><strong>${formatMoney(item.currentPrice, item.currency)}</strong></div>
        <div><span>${escapeHtml(localizeUiText("الهدف"))}</span><strong>${formatMoney(target, item.currency)}</strong></div>
        <div><span>${escapeHtml(localizeUiText("وقف الخسارة"))}</span><strong>${item.stopLoss ? formatMoney(item.stopLoss, item.currency) : "--"}</strong></div>
      </div>
      <div class="home-rec-confidence">
        <span>${escapeHtml(localizeUiText("ثقة"))}</span>
        <i style="--confidence: ${clamp(Number(item.confidence || 0), 0, 100)}%"></i>
        <strong>${formatNumber(item.confidence)}%</strong>
      </div>
    </article>
  `;
}

function renderHomeFollowedTrade(entry) {
  const key = `${entry.symbol}:${entry.action}`;
  const actionClass = entry.action === "sell" ? "sell" : entry.action === "buy" ? "buy" : "hold";
  const returnPct = Number(entry.observedReturnPct || 0);
  const price = Number(entry.lastPrice ?? entry.currentPrice);
  const visual = getPremiumAssetVisual(entry);
  return `
    <article class="home-follow-row ${actionClass}" data-symbol="${escapeHtml(entry.symbol)}" tabindex="0" role="link">
      <span class="asset-logo follow-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
      <span>${escapeHtml(entry.symbol)}</span>
      <b>${escapeHtml(localizeUiText(entry.actionLabel || entry.action || "--"))}</b>
      <strong>${Number.isFinite(price) ? formatMoney(price, entry.currency || "USD") : "--"}</strong>
      <em class="${returnPct >= 0 ? "profit" : "loss"}">${formatPercent(returnPct)}</em>
    </article>
  `;
}

function setActiveAnalysisModeButtons() {
  for (const button of analysisModeButtons) {
    const isActive = button.dataset.analysisMode === activeAnalysisMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  if (commandCenterMode) commandCenterMode.textContent = getAnalysisModeLabel(activeAnalysisMode);
}

function getAnalysisModeLabel(mode = activeAnalysisMode) {
  const labels = isEnglishLanguage()
    ? {
        balanced: "Market command",
        scalp: "Scalping 5-15 min",
        swing: "Monthly investing",
        sharia: "Sharia only",
        safe: "Low risk"
      }
    : {
        balanced: "قيادة السوق",
        scalp: "مضاربة 5-15 دقيقة",
        swing: "استثمار شهري",
        sharia: "شرعي فقط",
        safe: "مخاطرة منخفضة"
      };
  return labels[mode] || labels.balanced;
}

function getAnalysisModeNote(mode = activeAnalysisMode) {
  const notes = isEnglishLanguage()
    ? {
        balanced: "Ranks opportunities by confidence, data quality, timeframes, and risk.",
        scalp: "Focuses on 1-minute, 15-minute, and 30-minute signals for fast entries.",
        swing: "Focuses on 1 to 3 month opportunities with clearer price targets.",
        sharia: "Shows Sharia-compliant stocks only.",
        safe: "Filters out high-risk and weak-data setups where possible."
      }
    : {
        balanced: "يرتب الفرص حسب الثقة، جودة البيانات، الفريمات، والمخاطر.",
        scalp: "يركز على إشارات الدقيقة و15 دقيقة و30 دقيقة للدخول السريع.",
        swing: "يركز على فرص شهر إلى 3 أشهر مع هدف سعري أوضح.",
        sharia: "يعرض الأسهم المطابقة للشريعة فقط.",
        safe: "يستبعد المخاطر العالية والبيانات الضعيفة قدر الإمكان."
      };
  return notes[mode] || notes.balanced;
}

function isRecommendationInMode(item) {
  if (!item) return false;
  if (activeAnalysisMode === "sharia") return item.shariaStatus === "compliant";
  if (activeAnalysisMode === "safe") return item.action !== "hold" && isLowRisk(item) && getDataHealthScore(item) >= 58 && !item.timeframeConsensus?.conflict;
  if (activeAnalysisMode === "scalp") return item.action !== "hold" && item.confidence >= 55 && getFastFrameAgreement(item) >= 45;
  if (activeAnalysisMode === "swing") return item.action === "buy" && item.confidence >= 55 && getSwingMoveScore(item) >= 1;
  return true;
}

function getAnalysisModeScore(item) {
  const finalScore = calculateFinalScore(item).score;
  const confidence = Number(item?.confidence || 0);
  const dataHealth = getDataHealthScore(item);
  const fastAgreement = getFastFrameAgreement(item);
  const riskBonus = isLowRisk(item) ? 8 : item?.risk?.level === "high" ? -10 : 0;

  if (activeAnalysisMode === "scalp") return confidence * 0.35 + fastAgreement * 0.35 + dataHealth * 0.15 + finalScore * 0.15 + riskBonus;
  if (activeAnalysisMode === "swing") return finalScore * 0.45 + confidence * 0.25 + getSwingMoveScore(item) * 6 + dataHealth * 0.15 + riskBonus;
  if (activeAnalysisMode === "safe") return finalScore * 0.35 + dataHealth * 0.35 + confidence * 0.2 + riskBonus * 2;
  if (activeAnalysisMode === "sharia") return item?.shariaStatus === "compliant" ? finalScore + 8 : finalScore - 30;
  return finalScore;
}

function getDataHealthScore(item) {
  return clamp(Number(item?.dataHealth?.score ?? item?.analysisQuality?.score ?? 0), 0, 100);
}

function getFastFrameAgreement(item) {
  const wanted = new Set(["1m", "15m", "30m"]);
  const frames = (item?.timeframes || []).filter((frame) => wanted.has(String(frame.id)));
  if (!frames.length || !item?.action || item.action === "hold") return 0;
  const matching = frames.filter((frame) => frame.action === item.action).length;
  return Math.round((matching / frames.length) * 100);
}

function getSwingMoveScore(item) {
  const outlook = item?.upsideOutlook || [];
  const bestMove = Math.max(0, ...outlook.map((entry) => Number(entry.movePct || 0)));
  const expected = item?.action === "buy" ? Number(item?.expectedMovePct || 0) : 0;
  return Math.max(bestMove, expected);
}

function isLowRisk(item) {
  const level = String(item?.risk?.level || "").toLowerCase();
  return level === "low" || level === "medium" || level === "moderate" || !level;
}

function getBestBy(items, scoreFn) {
  if (!items.length) return null;
  return [...items].sort((a, b) => scoreFn(b) - scoreFn(a))[0];
}

function filterRecommendations(items) {
  const query = searchInput.value.trim().toLowerCase();
  return items.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.action === activeFilter;
    const matchesSharia =
      activeShariaFilter === "all" ||
      item.shariaStatus === activeShariaFilter ||
      (activeShariaFilter === "doubtful" && !["compliant", "not_compliant"].includes(item.shariaStatus));
    const matchesQuery = !query || `${item.name} ${item.symbol}`.toLowerCase().includes(query);
    const matchesMode = isRecommendationInMode(item);
    return matchesFilter && matchesSharia && matchesQuery && matchesMode;
  });
}

function sortRecommendations(items) {
  const priority = { buy: 0, sell: 1, hold: 2 };
  return [...items].sort((a, b) => {
    const modeScore = getAnalysisModeScore(b) - getAnalysisModeScore(a);
    if (sortSelect.value === "priority" && Math.abs(modeScore) > 0.01) return modeScore;
    if (sortSelect.value === "confidence") return b.confidence - a.confidence;
    if (sortSelect.value === "score") return calculateFinalScore(b).score - calculateFinalScore(a).score;
    if (sortSelect.value === "move") return Math.abs(b.expectedMovePct) - Math.abs(a.expectedMovePct);
    if (sortSelect.value === "price") return b.currentPrice - a.currentPrice;
    return priority[a.action] - priority[b.action] || b.confidence - a.confidence;
  });
}

function setInsight(element, item, emptyText) {
  if (!item) {
    element.textContent = emptyText;
    return;
  }

  element.textContent = `${item.symbol} · ${item.confidence}% · ${formatPercent(item.expectedMovePct)}`;
}

function getTopItem(items, mode) {
  if (!items.length) return null;
  return [...items].sort((a, b) => {
    if (mode === "move") return Math.abs(b.expectedMovePct) - Math.abs(a.expectedMovePct);
    return b.confidence - a.confidence;
  })[0];
}

function getMarketPulse(items) {
  if (!items.length) return "--";
  const buy = items.filter((item) => item.action === "buy").length;
  const sell = items.filter((item) => item.action === "sell").length;

  if (buy > sell) return "صاعد";
  if (sell > buy) return "هابط";
  return "متوازن";
}

function updateTicker(items) {
  const top = sortRecommendations(items).slice(0, 8);
  const spans = top.length
    ? top.map((item) => `<span>${escapeHtml(item.symbol)} ${formatMoney(item.currentPrice, item.currency)} ${escapeHtml(item.actionLabel)} ${item.confidence}% ${formatPercent(item.expectedMovePct)}</span>`)
    : ["<span>لا توجد بيانات حالية</span>"];

  tickerTape.innerHTML = [...spans, ...spans].join("");
}

function startSessionClock() {
  if (!sessionClock && !sessionCountdown && !marketHoursGrid) return;
  updateSessionClock();
  if (!sessionClockTimer) {
    sessionClockTimer = window.setInterval(updateSessionClock, 1000);
  }
}

function updateSessionClock() {
  const marketId = activeMarket || lastData?.market?.id || "us";
  const [timeZone, label] = MARKET_TIME_ZONES[marketId] || MARKET_TIME_ZONES.us;
  const now = new Date();

  const formattedSessionTime = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZone
    }).format(now);

  if (sessionClock) sessionClock.textContent = formattedSessionTime;
  if (pulseSessionClock) pulseSessionClock.textContent = formattedSessionTime;
  if (headerSessionClock) headerSessionClock.textContent = formattedSessionTime;
  if (sessionZone) sessionZone.textContent = label;
  if (pulseSessionZone) pulseSessionZone.textContent = label;
  if (headerSessionZone) headerSessionZone.textContent = label;
  if (sessionMarketName) sessionMarketName.textContent = localizeUiText(getMarketSessionName(marketId));
  renderSessionCountdown(marketId, now);
  renderMarketHoursGrid(now);
}

function renderSessionCountdown(marketId, now = new Date()) {
  const state = getMarketSessionState(marketId, now);
  if (!state || !sessionCountdown || !sessionStateLabel || !sessionNextEvent) return;

  const statusLabel = state.isOpen ? "السوق مفتوح" : "السوق مغلق";
  sessionStateLabel.textContent = localizeUiText(statusLabel);
  sessionStateLabel.classList.toggle("is-open", state.isOpen);
  sessionStateLabel.classList.toggle("is-closed", !state.isOpen);
  sessionCountdown.textContent = localizeUiText(state.countdownLabel);
  sessionNextEvent.textContent = localizeUiText(state.eventLabel);

  if (sessionClockCard) {
    sessionClockCard.classList.toggle("is-open", state.isOpen);
    sessionClockCard.classList.toggle("is-closed", !state.isOpen);
  }
  if (sessionCardState) {
    sessionCardState.textContent = localizeUiText(statusLabel);
    sessionCardState.classList.toggle("is-open", state.isOpen);
    sessionCardState.classList.toggle("is-closed", !state.isOpen);
  }
  if (sessionCardCountdown) sessionCardCountdown.textContent = localizeUiText(state.countdownLabel);
  if (sessionCardEvent) sessionCardEvent.textContent = localizeUiText(state.eventLabel);
  if (pulseStatusCard) {
    pulseStatusCard.classList.toggle("is-open", state.isOpen);
    pulseStatusCard.classList.toggle("is-closed", !state.isOpen);
  }
  if (pulseSessionState) {
    pulseSessionState.textContent = localizeUiText(statusLabel);
    pulseSessionState.classList.toggle("is-open", state.isOpen);
    pulseSessionState.classList.toggle("is-closed", !state.isOpen);
  }
  if (pulseSessionCountdown) {
    const pulseCountdownLabel = isCompactViewport() ? getCompactCountdownLabel(state.countdownLabel) : state.countdownLabel;
    pulseSessionCountdown.textContent = localizeUiText(pulseCountdownLabel);
  }
  if (pulseSessionEvent) pulseSessionEvent.textContent = localizeUiText(state.eventLabel);
}

function getCompactCountdownLabel(label) {
  return String(label || "")
    .replace(/(\d+)\s*يوم\s*·\s*/g, "$1d ")
    .replace(/(\d+)\s*day[s]?\s*·\s*/gi, "$1d ");
}

function renderMarketHoursGrid(now = new Date()) {
  if (!marketHoursGrid) return;

  marketHoursGrid.innerHTML = MARKET_HOURS_IDS
    .map((id) => {
      const entry = EXCHANGE_SESSION_KNOWLEDGE[id] || {
        name: getMarketSessionName(id),
        session: MARKET_SESSIONS[id]
      };
      if (!entry?.session) return "";

      const state = getSessionStateForConfig(entry.session, now);
      const hoursLabel = getMarketHoursLabel(entry.session);
      const daysLabel = getSessionDaysLabel(entry.session);
      const stateLabel = state.isOpen ? "مفتوح الآن" : "مغلق الآن";

      return `
        <article class="market-hours-card ${state.isOpen ? "is-open" : "is-closed"}">
          <div>
            <span>${escapeHtml(localizeUiText(entry.name))}</span>
            <strong>${escapeHtml(localizeUiText(stateLabel))}</strong>
          </div>
          <p>${escapeHtml(localizeUiText(hoursLabel))}</p>
          <small>${escapeHtml(localizeUiText(daysLabel))}</small>
          <b>${escapeHtml(localizeUiText(`${state.eventLabel} ${state.countdownLabel}`))}</b>
        </article>
      `;
    })
    .join("");
}

function getMarketHoursLabel(config) {
  if (config.type === "always") return "مفتوح 24/7";
  return `${formatSessionTime(config.open)} - ${formatSessionTime(config.close)} ${config.label}`;
}

function getMarketSessionState(marketId, now = new Date()) {
  const config = MARKET_SESSIONS[marketId] || MARKET_SESSIONS.us;
  return getSessionStateForConfig(config, now);
}

function getSessionStateForConfig(config, now = new Date()) {
  if (config.type === "always") {
    return {
      isOpen: true,
      countdownLabel: "24/7",
      eventLabel: "السوق مفتوح دائماً"
    };
  }

  const state = config.type === "weekly"
    ? getWeeklySessionState(config, now)
    : getRegularSessionState(config, now);

  if (state.isOpen) {
    return {
      isOpen: true,
      countdownLabel: formatCountdown(state.closeAt - now),
      eventLabel: "يصكر بعد"
    };
  }

  return {
    isOpen: false,
    countdownLabel: formatCountdown(state.openAt - now),
    eventLabel: "يفتح بعد"
  };
}

function getRegularSessionState(config, now) {
  const parts = getZonedParts(now, config.timeZone);
  let nextOpen = null;

  for (let offset = -1; offset <= 8; offset += 1) {
    const day = addDaysToYmd(parts, offset);
    if (!config.days.includes(day.weekday)) continue;

    const openAt = makeZonedDate(day, config.open, config.timeZone);
    let closeAt = makeZonedDate(day, config.close, config.timeZone);
    if (closeAt <= openAt) {
      closeAt = makeZonedDate(addDaysToYmd(day, 1), config.close, config.timeZone);
    }

    if (now >= openAt && now < closeAt) return { isOpen: true, openAt, closeAt };
    if (openAt > now && (!nextOpen || openAt < nextOpen)) nextOpen = openAt;
  }

  return { isOpen: false, openAt: nextOpen || now };
}

function getWeeklySessionState(config, now) {
  const parts = getZonedParts(now, config.timeZone);
  const currentWeekStart = addDaysToYmd(parts, -parts.weekday);
  let nextOpen = null;

  for (let weekOffset = -1; weekOffset <= 2; weekOffset += 1) {
    const weekStart = addDaysToYmd(currentWeekStart, weekOffset * 7);
    const openDay = addDaysToYmd(weekStart, config.openDay);
    const closeDay = addDaysToYmd(weekStart, config.closeDay);
    const openAt = makeZonedDate(openDay, config.open, config.timeZone);
    let closeAt = makeZonedDate(closeDay, config.close, config.timeZone);
    if (closeAt <= openAt) {
      closeAt = makeZonedDate(addDaysToYmd(closeDay, 7), config.close, config.timeZone);
    }

    if (now >= openAt && now < closeAt) return { isOpen: true, openAt, closeAt };
    if (openAt > now && (!nextOpen || openAt < nextOpen)) nextOpen = openAt;
  }

  return { isOpen: false, openAt: nextOpen || now };
}

function getZonedParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    weekday: WEEKDAYS[values.weekday]
  };
}

function addDaysToYmd(parts, days) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    weekday: date.getUTCDay()
  };
}

function makeZonedDate(day, time, timeZone) {
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = Date.UTC(day.year, day.month - 1, day.day, hour, minute, 0);
  let offset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  let zonedDate = new Date(utcGuess - offset);
  const adjustedOffset = getTimeZoneOffsetMs(zonedDate, timeZone);
  if (adjustedOffset !== offset) zonedDate = new Date(utcGuess - adjustedOffset);
  return zonedDate;
}

function getTimeZoneOffsetMs(date, timeZone) {
  const parts = getZonedParts(date, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - date.getTime();
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const time = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  return days ? `${formatNumber(days)} يوم · ${time}` : time;
}

function renderLivePulseStrip(data) {
  if (!livePulseGrid) return;

  const items = [...(data?.recommendations || [])]
    .sort((a, b) => Math.abs(Number(b.expectedMovePct || 0)) - Math.abs(Number(a.expectedMovePct || 0)) || Number(b.confidence || 0) - Number(a.confidence || 0))
    .slice(0, 6);
  const nextSignature = `${data?.market?.id || activeMarket}:${items
    .map((item) => `${item.symbol}:${item.action}:${Math.round(Number(item.confidence || 0))}:${Math.round(Number(item.expectedMovePct || 0) * 100)}`)
    .join("|")}`;

  if (!items.length) {
    livePulseSignature = nextSignature;
    attachDetailOpeners(livePulseGrid);
    return;
  }

  if (nextSignature === livePulseSignature) return;
  livePulseSignature = nextSignature;

  livePulseGrid.innerHTML = items.length
    ? items.map(renderLivePulseCard).join("")
    : `<div class="empty">${escapeHtml(localizeUiText("لا توجد بيانات نبض حالياً."))}</div>`;
  attachDetailOpeners(livePulseGrid);
  queueTranslateInterface();
}

function renderLivePulseCard(item) {
  const move = Number(item.expectedMovePct || item.indicators?.momentum20 || 0);
  const tone = item.action === "sell" || move < 0 ? "down" : "up";
  const price = formatMoney(item.currentPrice, item.currency);
  const badge = localizeUiText(item.actionLabel || (item.action === "buy" ? "شراء" : item.action === "sell" ? "بيع" : "انتظار"));
  const visual = getPremiumAssetVisual(item);

  return `
    <article class="live-pulse-card is-${tone}" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0" aria-label="${escapeHtml(item.symbol)} ${escapeHtml(badge)}">
      <div class="pulse-symbol-row">
        <strong><span class="asset-logo pulse-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>${escapeHtml(item.symbol)}</strong>
        <span>${escapeHtml(formatPercent(move))}</span>
      </div>
      ${renderLivePulseSparkline(item.sparkline, tone, move)}
      <div class="pulse-price-row">
        <b>${escapeHtml(price)}</b>
        <em>${escapeHtml(badge)} · ${formatNumber(item.confidence)}%</em>
      </div>
    </article>
  `;
}

function renderLivePulseSparkline(values, tone, fallbackMove = 0) {
  const series = Array.isArray(values)
    ? values.map(Number).filter(Number.isFinite)
    : [];
  const points = series.length >= 2
    ? series.slice(-18)
    : [100, 100 + Number(fallbackMove || 0) * 10, 100 + Number(fallbackMove || 0) * 16];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const width = 132;
  const height = 42;
  const coords = points.map((value, index) => {
    const x = points.length === 1 ? 0 : (index / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return `
    <svg class="live-pulse-sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="mini chart">
      <polyline class="sparkline-line ${tone}" points="${coords}"></polyline>
    </svg>
  `;
}

function renderEconomicNews(calendar) {
  if (!economicNewsGrid || !economicNewsStatus) return;

  const status = calendar?.status || "clear";
  const statusText = status === "hot"
    ? "خبر قوي قريب"
    : status === "watch"
      ? "تحت المراقبة"
      : "واضح";
  economicNewsStatus.textContent = localizeUiText(statusText);
  economicNewsStatus.className = `news-status-${status}`;

  const events = [
    ...(calendar?.hotEvents || []),
    ...(calendar?.upcoming || [])
  ]
    .filter(Boolean)
    .filter((event, index, list) => list.findIndex((item) => item.title === event.title && item.currency === event.currency && item.isoTime === event.isoTime) === index)
    .slice(0, 6);

  if (!events.length) {
    economicNewsGrid.innerHTML = `
      <article class="economic-news-empty">
        <strong>${escapeHtml(localizeUiText(calendar?.summary || "لا توجد أخبار اقتصادية مؤثرة قريبة."))}</strong>
        <span>${escapeHtml(calendar?.source || "ForexFactory / Fair Economy")}</span>
      </article>
    `;
    return;
  }

  economicNewsGrid.innerHTML = events.map((event) => {
    const impact = event.impact || "medium";
    const impactLabel = impact === "high" ? "عالي" : impact === "medium" ? "متوسط" : "منخفض";
    return `
      <article class="economic-news-card is-${escapeHtml(impact)}">
        <div>
          <span>${escapeHtml(event.currency || "--")}</span>
          <strong>${escapeHtml(event.title || "--")}</strong>
        </div>
        <p>${escapeHtml(event.localTimeLabel || event.time || "--")}</p>
        <b>${escapeHtml(impactLabel)}</b>
      </article>
    `;
  }).join("");
}

function renderTradingAtmosphere(data) {
  const items = data.recommendations || [];
  updateSessionClock();

  const buy = items.filter((item) => item.action === "buy").length;
  const sell = items.filter((item) => item.action === "sell").length;
  const hold = items.length - buy - sell;
  const leader = getTopItem(items, "move");
  const highestScore = items.length
    ? [...items].sort((a, b) => calculateFinalScore(b).score - calculateFinalScore(a).score)[0]
    : null;
  const avgConfidenceValue = items.length
    ? Math.round(items.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / items.length)
    : 0;
  const pulse = getMarketPulse(items);
  const marketLabel = localizeUiText(data.market?.label || marketTitle?.textContent || "السوق");
  const readiness = avgConfidenceValue >= 70 && (buy || sell)
    ? "جاهز للتنفيذ"
    : "انتظر تأكيد أقوى";

  if (sfmLiveFloor) {
    sfmLiveFloor.classList.toggle("is-bullish", buy > sell);
    sfmLiveFloor.classList.toggle("is-bearish", sell > buy);
    sfmLiveFloor.classList.toggle("is-neutral", buy === sell);
  }

  if (sfmFloorBrief) {
    const briefText = items.length
      ? `${marketLabel}: النبض ${pulse}. SFM يراقب ${formatNumber(items.length)} رمز، متوسط الثقة ${formatNumber(avgConfidenceValue)}%، وأقوى تركيز الآن على ${leader?.symbol || highestScore?.symbol || "--"}.`
      : "SFM ينتظر وصول بيانات السوق حتى يبني قراءة كاملة.";
    sfmFloorBrief.textContent = localizeUiText(briefText);
  }

  if (floorAgentMood) {
    const moodText = buy > sell
      ? "المساعد يرى زخم شراء"
      : sell > buy
        ? "المساعد يرى ضغط بيع"
        : "المساعد ينتظر كسر التوازن";
    floorAgentMood.textContent = localizeUiText(moodText);
  }

  if (tradingMood) tradingMood.textContent = localizeUiText(`${pulse} · ${formatNumber(items.length)} رمز · ${formatNumber(avgConfidenceValue)}% ثقة`);
  if (flowLeader) {
    flowLeader.textContent = leader
      ? `${leader.symbol} · ${formatPercent(leader.expectedMovePct)}`
      : "--";
  }
  if (flowPressure) {
    const pressureText = items.length
      ? `شراء ${formatNumber(buy)} · بيع ${formatNumber(sell)} · انتظار ${formatNumber(hold)}`
      : "--";
    flowPressure.textContent = localizeUiText(pressureText);
  }
  if (floorNextMove) {
    const nextMoveText = leader
      ? `${leader.symbol} إلى ${formatMoney(leader.target1 || leader.expectedPrice, leader.currency)} خلال ${leader.duration || "الفترة القادمة"}`
      : "--";
    floorNextMove.textContent = localizeUiText(nextMoveText);
  }
  if (floorReadiness) floorReadiness.textContent = localizeUiText(readiness);
  if (floorHeatmapTitle) floorHeatmapTitle.textContent = highestScore ? `${highestScore.symbol} · Score ${calculateFinalScore(highestScore).score}%` : "TOP SIGNALS";

  if (floorHeatmap) {
    const heatItems = [...items]
      .map((item) => ({ item, score: calculateFinalScore(item).score }))
      .sort((a, b) => b.score - a.score || b.item.confidence - a.item.confidence)
      .slice(0, 12);
    const nextHeatmapSignature = buildFloorHeatmapSignature(heatItems);

    if (nextHeatmapSignature !== floorHeatmapSignature) {
      floorHeatmapSignature = nextHeatmapSignature;
      floorHeatmap.innerHTML = heatItems.length
        ? heatItems.map(({ item, score }, index) => renderFloorHeatCell(item, score, index)).join("")
        : `<div class="empty">${escapeHtml(localizeUiText("لا توجد بيانات كافية لخريطة الحرارة حالياً."))}</div>`;
      attachDetailOpeners(floorHeatmap);
      markLiveFloorRendered();
      queueTranslateInterface();
    }
  }

  if (!marketBoard) return;
  const boardItems = [...items]
    .map((item) => ({ item, score: calculateFinalScore(item).score }))
    .sort((a, b) => b.score - a.score || b.item.confidence - a.item.confidence)
    .slice(0, 6)
    .map(({ item }) => item);
  const nextBoardSignature = buildFloorBoardSignature(boardItems);

  if (nextBoardSignature !== floorBoardSignature) {
    floorBoardSignature = nextBoardSignature;
    marketBoard.innerHTML = boardItems.length
      ? boardItems.map(renderMarketBoardCard).join("")
      : "<div class=\"empty\">لا توجد بيانات للوحة التداول حالياً.</div>";
    attachDetailOpeners(marketBoard);
    markLiveFloorRendered();
    queueTranslateInterface();
  }
}

function buildFloorHeatmapSignature(heatItems) {
  return heatItems
    .map(({ item, score }) => `${item.symbol}:${item.action}:${Math.round(score / 2) * 2}:${Math.round(Number(item.confidence || 0) / 2) * 2}`)
    .join("|");
}

function buildFloorBoardSignature(items) {
  return items
    .map((item) => `${item.symbol}:${item.action}:${Math.round(Number(item.confidence || 0) / 2) * 2}`)
    .join("|");
}

function markLiveFloorRendered() {
  if (liveFloorHasRendered || !sfmLiveFloor) return;

  liveFloorHasRendered = true;
  window.setTimeout(() => {
    sfmLiveFloor.classList.add("live-floor-ready");
  }, 900);
}

function renderFloorHeatCell(item, score, index) {
  const tone = item.action === "buy" ? "buy" : item.action === "sell" ? "sell" : "hold";
  const width = clamp(score, 12, 100);
  const visual = getPremiumAssetVisual(item);
  return `
    <article class="floor-heat-cell ${tone}" data-symbol="${escapeHtml(item.symbol)}" tabindex="0" style="--heat-width: ${width}%; --heat-delay: ${index * 0.06}s">
      <div>
        <span class="asset-title-row">
          <span class="asset-logo floor-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
          <strong>${escapeHtml(item.symbol)}</strong>
        </span>
        <span>${escapeHtml(item.actionLabel)} · ${formatNumber(item.confidence)}%</span>
      </div>
      <b>${score}%</b>
    </article>
  `;
}

function renderMarketBoardCard(item) {
  const visual = getPremiumAssetVisual(item);
  return `
    <article class="market-board-card ${escapeHtml(item.action)}" data-symbol="${escapeHtml(item.symbol)}" tabindex="0">
      <div class="asset-title-row market-board-title">
        <span class="asset-logo market-board-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <div>
          <span>${escapeHtml(item.exchangeName || "MARKET")}</span>
          <strong>${escapeHtml(item.symbol)}</strong>
        </div>
      </div>
      <b>${formatMoney(item.currentPrice, item.currency)} · ${formatPercent(item.expectedMovePct)}</b>
      <em>${escapeHtml(item.actionLabel)} · ${item.confidence}%</em>
    </article>
  `;
}

function renderOpportunityRadar(data) {
  if (!radarGrid || !radarMonthlyGrid) return;
  const radar = data.opportunityRadar || {};
  const items = [
    radar.bestBuy,
    radar.bestSell,
    radar.mostTraded,
    radar.bestRiskReward,
    radar.shariaOpportunity
  ].filter(Boolean);
  const avgQuality = (data.recommendations || []).length
    ? Math.round((data.recommendations || []).reduce((sum, item) => sum + Number(item.analysisQuality?.score || 0), 0) / data.recommendations.length)
    : 0;

  radarQuality.textContent = avgQuality ? `${avgQuality}%` : "--";
  radarGrid.innerHTML = items.length
    ? items.map(renderRadarCard).join("")
    : "<div class=\"empty\">لا توجد فرص كافية للرادار حالياً.</div>";

  const monthly = radar.monthlyUpside || [];
  const avoid = radar.avoid || [];
  radarMonthlyGrid.innerHTML = `
    ${monthly.map(renderMonthlyRadarCard).join("")}
    ${avoid.slice(0, 3).map((item) => renderRadarCard({ ...item, label: "لا تتداول الآن" }, "avoid")).join("")}
  `;
  attachDetailOpeners(radarGrid);
  attachDetailOpeners(radarMonthlyGrid);
}

function renderRadarCard(item, tone = "") {
  if (!item) return "";
  const actionClass = item.action === "buy" ? "buy" : item.action === "sell" ? "sell" : "hold";
  const dangerClass = tone === "avoid" || item.decision?.kind === "avoid" ? " radar-card-avoid" : "";
  const visual = getPremiumAssetVisual(item);

  return `
    <article class="radar-card ${actionClass}${dangerClass}" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0">
      <span>${escapeHtml(item.label || item.actionLabel || "فرصة")}</span>
      <div class="radar-card-top">
        <span class="asset-logo radar-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <strong>${escapeHtml(item.symbol)}</strong>
        <em>${escapeHtml(item.actionLabel || item.decision?.badge || "--")}</em>
      </div>
      <p>${escapeHtml(item.name || "")}</p>
      <div class="radar-metrics">
        <div><span>Score</span><strong>${item.score ?? item.analysisQuality?.score ?? "--"}%</strong></div>
        <div><span>الثقة</span><strong>${item.confidence ?? "--"}%</strong></div>
        <div><span>الحالي</span><strong>${formatMoney(item.currentPrice, item.currency)}</strong></div>
        <div><span>هدف 1</span><strong>${formatMoney(item.target1 || item.expectedPrice, item.currency)}</strong></div>
        <div><span>وقف</span><strong>${item.stopLoss ? formatMoney(item.stopLoss, item.currency) : "--"}</strong></div>
        <div><span>R/R</span><strong>${item.riskReward ? `${formatNumber(item.riskReward, { maximumFractionDigits: 2 })}:1` : "--"}</strong></div>
      </div>
      <div class="radar-foot">
        <span>${item.latestVolume ? `تداول ${formatCompactNumber(item.latestVolume)}` : item.risk?.label || "--"}</span>
        <span>${item.shariaLabel || getShariaShortLabel(item.shariaStatus)}</span>
      </div>
    </article>
  `;
}

function renderMonthlyRadarCard(item) {
  if (!item || item.empty) {
    return `
      <article class="radar-card hold">
        <span>${escapeHtml(item?.label || "مدة")}</span>
        <strong>لا توجد فرصة</strong>
        <p>لا يوجد صعود واضح لهذه المدة حالياً.</p>
      </article>
    `;
  }
  const visual = getPremiumAssetVisual(item);

  return `
    <article class="radar-card buy" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0">
      <span>${escapeHtml(item.label)}</span>
      <div class="radar-card-top">
        <span class="asset-logo radar-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <strong>${escapeHtml(item.symbol)}</strong>
        <em>${item.confidence}%</em>
      </div>
      <p>${escapeHtml(item.name)}</p>
      <div class="radar-target-line">الصعود إلى ${formatMoney(item.targetPrice, item.currency)} · ${formatPercent(item.movePct)}</div>
      <div class="radar-foot">
        <span>الحالي ${formatMoney(item.currentPrice, item.currency)}</span>
        <span>${escapeHtml(item.shariaLabel || getShariaShortLabel(item.shariaStatus))}</span>
      </div>
    </article>
  `;
}

function getShariaShortLabel(status) {
  if (status === "compliant") return "مطابق";
  if (status === "not_compliant") return "غير مطابق";
  if (status === "doubtful") return "مختلف عليه";
  return "شرعي غير معروف";
}

function renderSmartAlerts(data) {
  const alerts = data.smartAlerts || [];
  smartAlertCount.textContent = alerts.length ? alerts.length : "لا توجد";

  if (!alerts.length) {
    smartAlertsList.innerHTML = "<div class=\"empty\">لا توجد حالياً إشارة تجمع شراء + مطابق للشريعة + ثقة فوق 70%.</div>";
    return;
  }

  smartAlertsList.innerHTML = alerts.map((alert) => {
    const visual = getPremiumAssetVisual(alert);
    return `
    <article class="smart-alert-card" data-symbol="${escapeHtml(alert.symbol)}" role="link" tabindex="0">
      <div class="asset-title-row">
        <span class="asset-logo smart-alert-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <div>
          <span>${escapeHtml(alert.name)}</span>
          <strong>${escapeHtml(alert.symbol)}</strong>
        </div>
      </div>
      <span>الحالي ${formatMoney(alert.currentPrice, alert.currency)}</span>
      <span>الهدف ${formatMoney(alert.expectedPrice, alert.currency)} · ${formatPercent(alert.expectedMovePct)}</span>
      <em>${alert.confidence}% ثقة</em>
    </article>
  `;
  }).join("");
  attachDetailOpeners(smartAlertsList);
}

function renderGoldenOpportunities(data) {
  const golden = (data.recommendations || [])
    .map((item) => ({ item, score: calculateFinalScore(item) }))
    .filter(({ item, score }) => {
      const backtestOk = Number(item.backtest?.winRate || 0) >= 55;
      return (
        item.action === "buy" &&
        item.shariaStatus === "compliant" &&
        item.risk?.level !== "high" &&
        backtestOk &&
        score.score >= 70
      );
    })
    .sort((a, b) => b.score.score - a.score.score || b.item.confidence - a.item.confidence)
    .slice(0, 8);

  goldenCount.textContent = golden.length ? golden.length : "لا توجد";

  if (!golden.length) {
    goldenGrid.innerHTML = "<div class=\"empty\">لا توجد فرصة ذهبية مكتملة الشروط حالياً. راقب التحديثات أو وسع السوق المختار.</div>";
    return;
  }

  goldenGrid.innerHTML = golden.map(({ item, score }) => {
    const visual = getPremiumAssetVisual(item);
    return `
    <article class="golden-card" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0">
      <div class="asset-title-row">
        <span class="asset-logo golden-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <div>
          <span>${escapeHtml(item.name)}</span>
          <strong>${escapeHtml(item.symbol)}</strong>
        </div>
      </div>
      <div class="golden-meta">
        <em class="score-pill">Score ${score.score}%</em>
        <em class="status-pill-mini">${escapeHtml(item.actionLabel)}</em>
        <em class="score-pill">${item.confidence}% ثقة</em>
      </div>
      <div class="outlook-target">
        الهدف ${formatMoney(item.expectedPrice, item.currency)} خلال ${escapeHtml(item.duration)}
      </div>
    </article>
  `;
  }).join("");

  attachDetailOpeners(goldenGrid);
}

async function loadWatchlistData(force = false) {
  if (!watchlist.length) {
    watchlistData = null;
    watchlistLoading = false;
    renderWatchlist();
    return;
  }

  if (watchlistLoading) return;
  if (!force && Date.now() - watchlistLastLoadedAt < WATCHLIST_REFRESH_MS) return;

  watchlistLoading = true;
  renderWatchlist();

  try {
    const data = await fetchJson(`/api/watchlist?symbols=${encodeURIComponent(watchlist.join(","))}`, {
      retries: 1,
      retryDelayMs: 700,
      fallbackMessage: "تعذر تحميل قائمة المراقبة. تأكد أن السيرفر يعمل ثم حاول مرة ثانية."
    });

    watchlistData = data;
    watchlistLastLoadedAt = Date.now();
  } catch (error) {
    const message = getFriendlyFetchError(error, "تعذر تحميل قائمة المراقبة. تأكد أن السيرفر يعمل ثم حاول مرة ثانية.");
    watchlistData = {
      recommendations: [],
      unavailable: watchlist.map((symbol) => ({
        symbol,
        name: symbol,
        reason: message
      }))
    };
  } finally {
    watchlistLoading = false;
    renderWatchlist();
  }
}

function renderWatchlist() {
  const currentItems = watchlistData?.recommendations || [];
  const unavailableItems = watchlistData?.unavailable || [];
  const lookup = getRecommendationLookup(currentItems);
  const unavailableLookup = new Map((unavailableItems || []).map((item) => [item.symbol.toUpperCase(), item]));

  watchlistChips.innerHTML = watchlist.length
    ? watchlist.map((symbol) => `
      <span class="chip">
        ${escapeHtml(symbol)}
        <button type="button" aria-label="حذف ${escapeHtml(symbol)}" data-remove-watchlist="${escapeHtml(symbol)}">×</button>
      </span>
    `).join("")
    : "<span class=\"empty\">أضف أول رمز لقائمة المراقبة.</span>";

  for (const button of watchlistChips.querySelectorAll("[data-remove-watchlist]")) {
    button.addEventListener("click", () => removeWatchlistSymbol(button.dataset.removeWatchlist));
  }

  if (!watchlist.length) {
    watchlistCards.innerHTML = "";
    return;
  }

  watchlistCards.innerHTML = watchlist.map((symbol) => {
    const item = lookup.get(symbol);
    if (!item) {
      const unavailable = unavailableLookup.get(symbol);
      if (unavailable) {
        return `
          <article class="mini-card is-pending">
            <span>تعذر جلب البيانات الآن</span>
            <strong>${escapeHtml(symbol)}</strong>
            <div class="mini-meta">
              <em class="status-pill-mini hold">المزود مشغول مؤقتاً</em>
            </div>
            <p class="mini-note">${escapeHtml(simplifyUnavailableReason(unavailable.reason))}</p>
          </article>
        `;
      }

      return `
        <article class="mini-card is-pending">
          <span>${watchlistLoading ? "جاري تحليل الرمز" : "بانتظار تحديث قائمة المراقبة"}</span>
          <strong>${escapeHtml(symbol)}</strong>
          <div class="mini-meta">
            <em class="status-pill-mini hold">${watchlistLoading ? "تحميل مستقل" : "سيتم التحليل تلقائياً"}</em>
          </div>
          <p class="mini-note">القائمة تحلل رموزها الآن حتى لو كانت من سوق آخر غير السوق المعروض.</p>
        </article>
      `;
    }
    return renderMiniSignalCard(item);
  }).join("");

  attachDetailOpeners(watchlistCards);
}

function addWatchlistSymbol(event) {
  event.preventDefault();
  const symbol = normalizeSymbol(watchlistSymbol.value);
  if (!symbol) return;

  if (!watchlist.includes(symbol)) {
    watchlist = [...watchlist, symbol].slice(0, 30);
    saveStored("the-sfm-trader-watchlist", watchlist);
  }

  watchlistSymbol.value = "";
  renderWatchlist();
  loadWatchlistData(true);
  if (watchlistOnly) loadRecommendations({ force: true });
}

function removeWatchlistSymbol(symbol) {
  watchlist = watchlist.filter((item) => item !== symbol);
  saveStored("the-sfm-trader-watchlist", watchlist);
  renderWatchlist();
  loadWatchlistData(true);
  if (watchlistOnly) loadRecommendations({ force: true });
}

function renderPortfolio(currentItems = []) {
  const lookup = getRecommendationLookup(currentItems);

  if (!portfolio.length) {
    portfolioList.innerHTML = "<div class=\"empty\">محفظتك فارغة. أضف سهم والكمية وسعر الشراء.</div>";
    return;
  }

  portfolioList.innerHTML = portfolio.map((position) => {
    const item = lookup.get(position.symbol);
    const currentPrice = Number(item?.currentPrice);
    const hasPrice = Number.isFinite(currentPrice);
    const cost = Number(position.qty) * Number(position.buyPrice);
    const value = hasPrice ? Number(position.qty) * currentPrice : null;
    const profit = hasPrice ? value - cost : null;
    const profitPct = hasPrice && cost > 0 ? (profit / cost) * 100 : null;
    const resultClass = profit >= 0 ? "profit" : "loss";
    const visual = getPremiumAssetVisual({ symbol: position.symbol, name: item?.name || position.symbol });

    return `
      <article class="portfolio-item">
        <div>
          <span class="asset-title-row">
            <span class="asset-logo portfolio-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
            <span>السهم</span>
          </span>
          <strong>${escapeHtml(position.symbol)}</strong>
        </div>
        <div>
          <span>الكمية</span>
          <strong>${formatNumber(position.qty, { maximumFractionDigits: 4 })}</strong>
        </div>
        <div>
          <span>سعر الشراء</span>
          <strong>${formatMoney(position.buyPrice, item?.currency || "USD")}</strong>
        </div>
        <div>
          <span>السعر الحالي</span>
          <strong>${hasPrice ? formatMoney(currentPrice, item.currency) : "--"}</strong>
        </div>
        <div>
          <span>الربح / الخسارة</span>
          <strong class="${resultClass}">${hasPrice ? `${formatMoney(profit, item.currency)} · ${formatPercent(profitPct)}` : "--"}</strong>
        </div>
        <button class="portfolio-remove" type="button" data-remove-position="${escapeHtml(position.id)}">حذف</button>
      </article>
    `;
  }).join("");

  for (const button of portfolioList.querySelectorAll("[data-remove-position]")) {
    button.addEventListener("click", () => removePortfolioPosition(button.dataset.removePosition));
  }
}

function addPortfolioPosition(event) {
  event.preventDefault();
  const symbol = normalizeSymbol(portfolioSymbol.value);
  const qty = Number(portfolioQty.value);
  const buyPrice = Number(portfolioPrice.value);

  if (!symbol || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(buyPrice) || buyPrice <= 0) return;

  const position = {
    id: `${symbol}-${Date.now()}`,
    symbol,
    qty,
    buyPrice
  };

  portfolio = [position, ...portfolio].slice(0, 60);
  saveStored("the-sfm-trader-portfolio", portfolio);

  if (!watchlist.includes(symbol)) {
    watchlist = [...watchlist, symbol].slice(0, 30);
    saveStored("the-sfm-trader-watchlist", watchlist);
  }

  portfolioSymbol.value = "";
  portfolioQty.value = "";
  portfolioPrice.value = "";
  renderWatchlist();
  loadWatchlistData(true);
  renderPortfolio(lastData?.recommendations || []);
}

function removePortfolioPosition(id) {
  portfolio = portfolio.filter((position) => position.id !== id);
  saveStored("the-sfm-trader-portfolio", portfolio);
  renderPortfolio(lastData?.recommendations || []);
}

function updateRecommendationHistory(items) {
  if (!items.length) return;

  const now = new Date().toISOString();
  const byKey = new Map(recommendationHistory.map((entry) => [entry.key, entry]));

  for (const item of items) {
    const key = `${item.symbol}:${item.action}`;
    const existing = byKey.get(key);
    const entryPrice = Number(existing?.entryPrice ?? existing?.currentPrice ?? item.currentPrice);
    const expectedPrice = Number(existing?.expectedPrice ?? item.expectedPrice);
    const target1 = Number(existing?.target1 ?? item.target1 ?? item.expectedPrice);
    const target2 = Number(existing?.target2 ?? item.target2 ?? item.expectedPrice);
    const stopLoss = Number(existing?.stopLoss ?? item.stopLoss);
    const lastPrice = Number(item.currentPrice);
    const targetHit = existing?.targetHit || isTargetHit(item.action, lastPrice, target1);
    const stopHit = existing?.stopHit || isStopHit(item.action, lastPrice, stopLoss);
    const observedReturnPct = getObservedReturnPct(item.action, entryPrice, lastPrice);
    const bestPrice = pickBestObservedPrice(item.action, existing?.bestPrice, lastPrice);
    const worstPrice = pickWorstObservedPrice(item.action, existing?.worstPrice, lastPrice);
    const outcome = targetHit ? "target" : stopHit ? "stop" : "pending";

    byKey.set(key, {
      key,
      symbol: item.symbol,
      name: item.name,
      action: item.action,
      actionLabel: item.actionLabel,
      currentPrice: entryPrice,
      lastPrice,
      expectedPrice,
      target1,
      target2,
      stopLoss: Number.isFinite(stopLoss) ? stopLoss : null,
      currency: item.currency,
      confidence: item.confidence,
      expectedMovePct: item.expectedMovePct,
      riskReward: item.riskReward,
      analysisQuality: item.analysisQuality,
      firstSeen: existing?.firstSeen || now,
      lastSeen: now,
      targetHit,
      stopHit,
      outcome,
      hitAt: existing?.hitAt || (targetHit ? now : null),
      stopAt: existing?.stopAt || (stopHit ? now : null),
      observedReturnPct,
      bestPrice,
      worstPrice
    });
  }

  const sortedHistory = [...byKey.values()]
    .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
  const followedEntries = sortedHistory.filter((entry) => followedTradeKeys.has(entry.key));
  const recentEntries = sortedHistory.filter((entry) => !followedTradeKeys.has(entry.key)).slice(0, 80);
  recommendationHistory = [...followedEntries, ...recentEntries].slice(0, Math.max(80, followedEntries.length));
  saveStored("the-sfm-trader-history", recommendationHistory);
  if (followedTradeKeys.size) scheduleSharedTradeStateSave();
}

async function loadSharedTradeState(options = {}) {
  try {
    const poll = Boolean(options.poll);
    const localKeysBeforeMerge = followedTradeKeys.size;
    const localEntriesBeforeMerge = getFollowedTradeEntries().length;
    const response = await fetch("/api/followed-trades", { cache: "no-store" });
    if (!response.ok) throw new Error("shared trade state unavailable");

    const data = await response.json();
    const remoteRemovedKeys = Array.isArray(data.removedFollowedTradeKeys) ? data.removedFollowedTradeKeys : [];
    for (const key of remoteRemovedKeys) {
      if (key) removedFollowedTradeKeys.add(key);
    }
    pruneRemovedFollowedTradeKeys();

    const removedSet = new Set(removedFollowedTradeKeys);
    const rawRemoteEntries = Array.isArray(data.followedEntries) ? data.followedEntries : [];
    const rawRemoteKeys = Array.isArray(data.followedTradeKeys) ? data.followedTradeKeys : [];
    const rawRemoteAlerts = Array.isArray(data.followedTradeAlerts) ? data.followedTradeAlerts : [];
    const remoteEntries = rawRemoteEntries.filter((entry) => entry?.key && !removedSet.has(entry.key));
    const remoteKeys = rawRemoteKeys.filter((key) => !removedSet.has(key));
    const remoteAlerts = rawRemoteAlerts.filter((alertKey) => !isAlertForRemovedTrade(alertKey, removedSet));
    const remoteHadData = rawRemoteKeys.length || rawRemoteEntries.length || rawRemoteAlerts.length;
    const remoteHadRemovedData = rawRemoteEntries.length !== remoteEntries.length
      || rawRemoteKeys.length !== remoteKeys.length
      || rawRemoteAlerts.length !== remoteAlerts.length;

    if (remoteEntries.length) mergeRecommendationHistory(remoteEntries);

    if (poll || sharedTradeStateLoaded) {
      followedTradeKeys = new Set([...remoteKeys, ...remoteEntries.map((entry) => entry.key).filter(Boolean)]);
      followedTradeAlerts = new Set(remoteAlerts);
    } else {
      followedTradeKeys = new Set([...followedTradeKeys, ...remoteKeys, ...remoteEntries.map((entry) => entry.key).filter(Boolean)]);
      followedTradeAlerts = new Set([...followedTradeAlerts, ...remoteAlerts]);
    }

    persistFollowedTradeLocalState();
    renderHistory();
    sharedTradeStateLoaded = true;

    const localHadData = localKeysBeforeMerge || localEntriesBeforeMerge;
    if ((!poll && (localHadData || !remoteHadData)) || remoteHadRemovedData) {
      scheduleSharedTradeStateSave({ force: true });
    }
  } catch {
    sharedTradeStateLoaded = false;
  }
}

function mergeRecommendationHistory(entries) {
  const byKey = new Map(recommendationHistory.map((entry) => [entry.key, entry]));

  for (const entry of entries) {
    if (!entry?.key) continue;

    const existing = byKey.get(entry.key);
    if (!existing || new Date(entry.lastSeen || 0) >= new Date(existing.lastSeen || 0)) {
      byKey.set(entry.key, entry);
    }
  }

  recommendationHistory = [...byKey.values()]
    .sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0))
    .slice(0, 160);
  saveStored("the-sfm-trader-history", recommendationHistory);
}

function getFollowedTradeEntries() {
  return recommendationHistory
    .filter((entry) => followedTradeKeys.has(entry.key))
    .sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0))
    .slice(0, 120);
}

function pruneRemovedFollowedTradeKeys() {
  const pruned = [...removedFollowedTradeKeys].filter(Boolean).slice(-REMOVED_FOLLOWED_TRADE_LIMIT);
  if (pruned.length !== removedFollowedTradeKeys.size) {
    removedFollowedTradeKeys = new Set(pruned);
  }
  return pruned;
}

function isAlertForRemovedTrade(alertKey, removedSet = removedFollowedTradeKeys) {
  if (!alertKey) return false;
  for (const key of removedSet) {
    if (alertKey.startsWith(`${key}:`)) return true;
  }
  return false;
}

function buildSharedTradeStatePayload() {
  const removedKeys = pruneRemovedFollowedTradeKeys();
  const removedSet = new Set(removedKeys);
  followedTradeKeys = new Set([...followedTradeKeys].filter((key) => !removedSet.has(key)));
  followedTradeAlerts = new Set([...followedTradeAlerts].filter((alertKey) => !isAlertForRemovedTrade(alertKey, removedSet)).slice(-160));

  return {
    followedTradeKeys: [...followedTradeKeys],
    followedEntries: getFollowedTradeEntries().filter((entry) => !removedSet.has(entry.key)),
    followedTradeAlerts: [...followedTradeAlerts].slice(-160),
    removedFollowedTradeKeys: removedKeys
  };
}

function persistFollowedTradeLocalState() {
  const payload = buildSharedTradeStatePayload();
  saveStored("the-sfm-trader-history", recommendationHistory);
  saveStored("the-sfm-trader-followed-trades", payload.followedTradeKeys);
  saveStored("the-sfm-trader-followed-alerts", payload.followedTradeAlerts);
  saveStored("the-sfm-trader-removed-followed-trades", payload.removedFollowedTradeKeys);
}

function persistSharedTradeState(options = {}) {
  persistFollowedTradeLocalState();
  scheduleSharedTradeStateSave(options);
}

function scheduleSharedTradeStateSave(options = {}) {
  const force = Boolean(options.force);
  if (!force && !sharedTradeStateLoaded && !followedTradeKeys.size) return;

  window.clearTimeout(sharedTradeSaveTimer);
  if (force) {
    sharedTradeSaveTimer = null;
    void saveSharedTradeState(true);
    return;
  }

  sharedTradeSaveTimer = window.setTimeout(() => saveSharedTradeState(false), SHARED_TRADE_SYNC_DEBOUNCE_MS);
}

async function saveSharedTradeState(force = false) {
  const payload = buildSharedTradeStatePayload();
  if (!force && !payload.followedTradeKeys.length && !payload.followedEntries.length) return;

  try {
    await fetch("/api/followed-trades", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    sharedTradeStateLoaded = true;
  } catch {
    sharedTradeStateLoaded = false;
  }
}

function flushSharedTradeStateOnExit() {
  window.clearTimeout(sharedTradeSaveTimer);
  sharedTradeSaveTimer = null;
  persistFollowedTradeLocalState();

  const payload = buildSharedTradeStatePayload();
  const shouldSync = payload.followedTradeKeys.length || payload.followedEntries.length || payload.removedFollowedTradeKeys.length;
  if (!shouldSync) return;

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/followed-trades", new Blob([body], { type: "application/json" }));
    return;
  }

  void saveSharedTradeState(true);
}

function renderAccuracyDashboard() {
  if (!accuracyGrid) return;

  const stats = calculateAccuracyStats(recommendationHistory);
  accuracyGrid.innerHTML = `
    <article>
      <span>إجمالي الإشارات</span>
      <strong>${formatNumber(stats.total)}</strong>
      <p>${formatNumber(stats.pending)} تحت المتابعة</p>
    </article>
    <article>
      <span>نسبة الوصول للهدف</span>
      <strong>${stats.closed ? `${formatNumber(stats.winRate)}%` : "--"}</strong>
      <p>${formatNumber(stats.closed)} صفقات مغلقة</p>
    </article>
    <article>
      <span>متوسط العائد</span>
      <strong class="${stats.avgReturn >= 0 ? "profit" : "loss"}">${stats.closed ? formatPercent(stats.avgReturn) : "--"}</strong>
      <p>${formatNumber(stats.wins)} رابحة · ${formatNumber(stats.losses)} خاسرة</p>
    </article>
    <article>
      <span>المختارة للمتابعة</span>
      <strong>${formatNumber(stats.followed)}</strong>
      <p>تنبيهات هدف ووقف وتغير توصية</p>
    </article>
  `;
}

function calculateAccuracyStats(entries = []) {
  const total = entries.length;
  const closedEntries = entries.filter((entry) => entry.outcome === "target" || entry.outcome === "stop");
  const wins = closedEntries.filter((entry) => entry.outcome === "target").length;
  const losses = closedEntries.filter((entry) => entry.outcome === "stop").length;
  const closed = closedEntries.length;
  const avgReturn = closed
    ? closedEntries.reduce((sum, entry) => sum + getHistoryReturnPct(entry), 0) / closed
    : 0;

  return {
    total,
    closed,
    wins,
    losses,
    pending: entries.filter((entry) => entry.outcome === "pending").length,
    followed: followedTradeKeys.size,
    winRate: closed ? Math.round((wins / closed) * 100) : 0,
    avgReturn
  };
}

function renderHistory() {
  renderAccuracyDashboard();

  if (!recommendationHistory.length) {
    historyList.innerHTML = "<div class=\"empty\">السجل فارغ حالياً. يبدأ الحفظ بعد أول تحديث للتوصيات.</div>";
    return;
  }

  historyList.innerHTML = getHistoryGroups()
    .map(renderHistoryGroup)
    .join("");

  for (const button of historyList.querySelectorAll("[data-follow-trade]")) {
    button.addEventListener("click", () => toggleFollowTrade(button.dataset.followTrade));
  }
}

function getHistoryGroups() {
  const sorted = [...recommendationHistory].sort((a, b) => {
    const followedSort = Number(followedTradeKeys.has(b.key)) - Number(followedTradeKeys.has(a.key));
    if (followedSort) return followedSort;
    return new Date(b.lastSeen) - new Date(a.lastSeen);
  });
  const followed = sorted.filter((entry) => followedTradeKeys.has(entry.key));
  const rest = sorted.filter((entry) => !followedTradeKeys.has(entry.key));

  return [
    {
      id: "followed",
      title: "قائمة المتابعة",
      note: "الصفقات اللي اخترتها وتوصل لك تنبيهات عنها.",
      empty: "ما اخترت أي صفقة للمتابعة للحين.",
      items: followed
    },
    {
      id: "pending",
      title: "تحت المتابعة",
      note: "صفقات نشطة لم تصل للهدف أو وقف الخسارة.",
      empty: "لا توجد صفقات نشطة حالياً.",
      items: rest.filter((entry) => entry.outcome === "pending").slice(0, 16)
    },
    {
      id: "target",
      title: "وصل الهدف",
      note: "إشارات حققت الهدف المسجل.",
      empty: "لا توجد صفقات وصلت الهدف حالياً.",
      items: rest.filter((entry) => entry.outcome === "target").slice(0, 16)
    },
    {
      id: "loss",
      title: "صفقة خاسرة",
      note: "إشارات وصلت وقف الخسارة.",
      empty: "لا توجد صفقات خاسرة حالياً.",
      items: rest.filter((entry) => entry.outcome === "stop").slice(0, 16)
    }
  ];
}

function renderHistoryGroup(group) {
  return `
    <section class="history-group history-group-${group.id}">
      <div class="history-group-head">
        <div>
          <h3>${group.title}</h3>
          <p>${group.note}</p>
        </div>
        <strong class="history-count">${formatNumber(group.items.length)}</strong>
      </div>
      <div class="history-group-list">
        ${group.items.length ? group.items.map(renderHistoryItem).join("") : `<div class="history-group-empty">${group.empty}</div>`}
      </div>
    </section>
  `;
}

function renderHistoryItem(entry) {
  return `
    <article class="history-item">
      <div>
        <span>السهم</span>
        <strong>${escapeHtml(entry.symbol)} · ${escapeHtml(entry.actionLabel)}</strong>
      </div>
      <div>
        <span>الثقة</span>
        <strong>${entry.confidence}%</strong>
      </div>
      <div>
        <span>السعر وقت الإشارة</span>
        <strong>${formatMoney(entry.currentPrice, entry.currency)}</strong>
      </div>
      <div>
        <span>آخر سعر</span>
        <strong>${formatMoney(entry.lastPrice ?? entry.currentPrice, entry.currency)}</strong>
      </div>
      <div>
        <span>الهدف</span>
        <strong>${formatMoney(entry.target1 || entry.expectedPrice, entry.currency)}</strong>
      </div>
      <div>
        <span>وقف الخسارة</span>
        <strong>${entry.stopLoss ? formatMoney(entry.stopLoss, entry.currency) : "--"}</strong>
      </div>
      <div>
        <span>العائد الحالي</span>
        ${renderHistoryReturn(entry)}
      </div>
      <div>
        <span>الحالة</span>
        <strong class="${entry.outcome === "target" ? "profit" : entry.outcome === "stop" ? "loss" : ""}">${getHistoryOutcomeLabel(entry)}</strong>
      </div>
      <div class="history-actions">
        <span>التنبيه</span>
        <button class="follow-trade-button ${followedTradeKeys.has(entry.key) ? "is-following" : ""}" type="button" data-follow-trade="${escapeHtml(entry.key)}">
          ${followedTradeKeys.has(entry.key) ? "إيقاف المتابعة" : "تابع الصفقة"}
        </button>
      </div>
    </article>
  `;
}

function toggleFollowTrade(key) {
  const entry = recommendationHistory.find((item) => item.key === key);
  if (!entry) return;

  if (followedTradeKeys.has(key)) {
    followedTradeKeys.delete(key);
    removedFollowedTradeKeys.add(key);
    clearFollowedTradeAlertState(key, { sync: false });
    showToast(`تم إيقاف متابعة ${entry.symbol}`, "لن تصلك تنبيهات لهذه الصفقة.");
  } else {
    removedFollowedTradeKeys.delete(key);
    followedTradeKeys.add(key);
    clearFollowedTradeAlertState(key, { sync: false });
    requestTradeAlertPermission();
    showToast(`تمت متابعة ${entry.symbol}`, `راح أنبهك عند الهدف، وقف الخسارة، أو تغير الإشارة.`);
    playSignalTone();
  }

  persistSharedTradeState({ force: true });
  checkFollowedTrades(lastData?.recommendations || []);
  renderHistory();
}

function clearFollowedTradeAlertState(key, options = {}) {
  followedTradeAlerts = new Set([...followedTradeAlerts].filter((value) => !value.startsWith(`${key}:`)));
  if (options.sync !== false) persistSharedTradeState();
}

function checkFollowedTrades(items) {
  if (!followedTradeKeys.size || !items?.length) return;

  const bySymbol = new Map(items.map((item) => [item.symbol.toUpperCase(), item]));
  let changed = false;

  for (const key of [...followedTradeKeys]) {
    const entry = recommendationHistory.find((item) => item.key === key);
    if (!entry) {
      followedTradeKeys.delete(key);
      removedFollowedTradeKeys.add(key);
      changed = true;
      continue;
    }

    const current = bySymbol.get(entry.symbol.toUpperCase());
    if (!current) continue;

    const currentPrice = Number(current.currentPrice);
    const targetPrice = Number(entry.target1 ?? entry.expectedPrice);
    const stopPrice = Number(entry.stopLoss);
    const targetHitNow = isTargetHit(entry.action, currentPrice, targetPrice);
    const stopHitNow = isStopHit(entry.action, currentPrice, stopPrice);
    const actionChanged = current.action && current.action !== entry.action;

    if (targetHitNow) {
      notifyFollowedTrade(entry, current, "target");
    } else if (stopHitNow) {
      notifyFollowedTrade(entry, current, "stop");
    } else if (actionChanged) {
      notifyFollowedTrade(entry, current, "action");
    }
  }

  if (changed) persistSharedTradeState({ force: true });
}

function notifyFollowedTrade(entry, current, eventType) {
  const alertKey = `${entry.key}:${eventType}`;
  if (followedTradeAlerts.has(alertKey)) return;

  followedTradeAlerts.add(alertKey);
  persistSharedTradeState();

  const currentPrice = formatMoney(current.currentPrice, current.currency || entry.currency);
  const target = formatMoney(entry.target1 ?? entry.expectedPrice, entry.currency);
  const stop = entry.stopLoss ? formatMoney(entry.stopLoss, entry.currency) : "--";
  const titles = {
    target: `وصل هدف ${entry.symbol}`,
    stop: `تنبيه وقف خسارة ${entry.symbol}`,
    action: `تغيرت إشارة ${entry.symbol}`
  };
  const messages = {
    target: `السعر الحالي ${currentPrice} وصل الهدف ${target}.`,
    stop: `السعر الحالي ${currentPrice} وصل وقف الخسارة ${stop}.`,
    action: `الإشارة تغيرت من ${entry.actionLabel} إلى ${current.actionLabel} بثقة ${current.confidence}%.`
  };

  showToast(titles[eventType], messages[eventType]);
  sendBrowserTradeNotification(titles[eventType], messages[eventType]);
  playSignalTone();

  if (voiceActive) {
    const spoken = `${titles[eventType]}. ${messages[eventType]}`;
    setVoiceReplyText(spoken, { speak: true });
    setVoiceStatusText("تنبيه صفقة متابعة");
  }
}

async function loadNotificationLog() {
  try {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    if (!response.ok) throw new Error("notifications unavailable");

    const data = await response.json();
    notificationLog = normalizeNotificationLog([
      ...notificationLog,
      ...(Array.isArray(data.notifications) ? data.notifications : [])
    ]);
    persistNotificationLocalState();
    scheduleNotificationSave({ force: true });
  } catch {
    persistNotificationLocalState();
  }
}

function saveNotification(title, message, options = {}) {
  const notification = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: String(title || "SFM"),
    message: String(message || ""),
    type: options.type || "system",
    createdAt: new Date().toISOString(),
    read: false
  };

  notificationLog = normalizeNotificationLog([notification, ...notificationLog]);
  persistNotificationLocalState();
  renderNotificationCenter();
  scheduleNotificationSave();
  return notification;
}

function normalizeNotificationLog(items) {
  const byId = new Map();

  for (const item of Array.isArray(items) ? items : []) {
    const notification = normalizeNotification(item);
    if (!notification) continue;

    const existing = byId.get(notification.id);
    if (!existing || new Date(notification.createdAt) >= new Date(existing.createdAt)) {
      byId.set(notification.id, notification);
    }
  }

  return [...byId.values()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, NOTIFICATION_LIMIT);
}

function normalizeNotification(item) {
  if (!item || typeof item !== "object") return null;

  const title = String(item.title || "").trim();
  const message = String(item.message || "").trim();
  if (!title && !message) return null;

  return {
    id: String(item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    title: title || "SFM",
    message,
    type: String(item.type || "system"),
    createdAt: normalizeDateString(item.createdAt),
    read: Boolean(item.read)
  };
}

function persistNotificationLocalState() {
  saveStored("the-sfm-trader-notifications", notificationLog);
}

function scheduleNotificationSave(options = {}) {
  const force = Boolean(options.force);
  window.clearTimeout(notificationSaveTimer);
  notificationSaveTimer = window.setTimeout(saveNotificationLogToServer, force ? 0 : NOTIFICATION_SAVE_DEBOUNCE_MS);
}

async function saveNotificationLogToServer() {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ notifications: notificationLog })
    });
  } catch {
    // يبقى السجل محفوظاً داخل المتصفح حتى يرجع الاتصال بالسيرفر.
  }
}

async function clearNotificationLog() {
  notificationLog = [];
  persistNotificationLocalState();
  renderNotificationCenter();

  try {
    await fetch("/api/notifications", { method: "DELETE" });
  } catch {
    scheduleNotificationSave({ force: true });
  }
}

function renderNotificationCenter() {
  if (!notificationButton || !notificationCount || !notificationPanel || !notificationList) return;

  const stockNotifications = notificationLog.filter(isStockNotification);
  notificationCount.textContent = formatNumber(stockNotifications.length);
  notificationButton.classList.toggle("has-notifications", stockNotifications.length > 0);

  notificationList.innerHTML = stockNotifications.length
    ? stockNotifications.map(renderNotificationItem).join("")
    : "<div class=\"notification-empty\">لا توجد إشعارات محفوظة حالياً.</div>";
}

function isStockNotification(notification) {
  const type = String(notification?.type || "").toLowerCase();
  if (["settings", "system", "layout", "page"].includes(type)) return false;
  if (["voice", "strong-signal", "signal-change", "risk-warning", "trade", "alert", "signal"].includes(type)) return true;

  const text = `${notification?.title || ""} ${notification?.message || ""}`;
  if (/Settings saved|page mode|fold|collapsed|expanded|compact/i.test(text)) return false;
  if (/وضع الصفحة|طي الأقسام|فتح الأقسام|الوضع المختصر|حفظ الإعدادات/.test(text)) return false;
  return /\b[A-Z]{1,8}(?:[.\-][A-Z]{1,4})?(?:=X|=F|-X)?\b/.test(text);
}

function renderNotificationItem(notification) {
  return `
    <article class="notification-item notification-type-${escapeHtml(notification.type)}">
      <div>
        <strong>${escapeHtml(notification.title)}</strong>
        <time>${formatDateTime(notification.createdAt)}</time>
      </div>
      <p>${escapeHtml(notification.message || "--")}</p>
    </article>
  `;
}

function toggleNotificationPanel() {
  setNotificationPanelOpen(!notificationPanelOpen);
}

function setNotificationPanelOpen(open) {
  if (!notificationButton || !notificationPanel) return;

  notificationPanelOpen = Boolean(open);
  notificationPanel.hidden = !notificationPanelOpen;
  notificationButton.setAttribute("aria-expanded", String(notificationPanelOpen));
  notificationButton.classList.toggle("is-open", notificationPanelOpen);
  if (notificationPanelOpen) setSettingsPanelOpen(false);
}

function checkSmartMarketNotifications(items = []) {
  if (!items.length) return;

  const nowHour = new Date().toISOString().slice(0, 13);
  let emitted = false;
  const nextState = { ...(recommendationSignalState && typeof recommendationSignalState === "object" ? recommendationSignalState : {}) };
  const tradable = items.filter((item) => item.action === "buy" || item.action === "sell");
  const strongest = [...tradable]
    .filter((item) => item.confidence >= 82 && getDataHealthScore(item) >= 58 && !item.timeframeConsensus?.conflict)
    .sort((a, b) => getAnalysisModeScore(b) - getAnalysisModeScore(a))
    .slice(0, 2);

  for (const item of strongest) {
    const key = `smart-strong:${nowHour}:${item.symbol}:${item.action}`;
    if (!rememberSmartAlert(key)) continue;
    emitted = true;
    showToast(
      `إشارة قوية: ${item.symbol}`,
      `${item.actionLabel} · ثقة ${formatNumber(item.confidence)}% · الهدف ${formatMoney(item.target1 || item.expectedPrice, item.currency)}`,
      { type: "strong-signal" }
    );
    sendBrowserTradeNotification(
      `the-sfm trader: ${item.symbol}`,
      `${item.actionLabel} بثقة ${formatNumber(item.confidence)}%`
    );
  }

  for (const item of tradable) {
    const previous = recommendationSignalState?.[item.symbol];
    const changed = previous?.action && previous.action !== item.action;
    if (changed && item.confidence >= 68) {
      const key = `smart-change:${nowHour}:${item.symbol}:${previous.action}:${item.action}`;
      if (rememberSmartAlert(key)) {
        emitted = true;
        showToast(
          `تغيرت توصية ${item.symbol}`,
          `انتقلت من ${previous.actionLabel || previous.action} إلى ${item.actionLabel} · ثقة ${formatNumber(item.confidence)}%`,
          { type: "signal-change" }
        );
      }
    }

    nextState[item.symbol] = {
      action: item.action,
      actionLabel: item.actionLabel,
      confidence: item.confidence,
      updatedAt: new Date().toISOString()
    };
  }

  const weakData = [...items]
    .filter((item) => getDataHealthScore(item) < 45 || item.timeframeConsensus?.conflict)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 1);

  for (const item of weakData) {
    const key = `smart-risk:${nowHour}:${item.symbol}`;
    if (!rememberSmartAlert(key)) continue;
    emitted = true;
    showToast(
      `تنبيه حذر: ${item.symbol}`,
      "البيانات أو الفريمات غير كافية، انتظر تأكيد أو افتح صفحة السهم للتفاصيل.",
      { type: "risk-warning" }
    );
  }

  recommendationSignalState = nextState;
  saveStored("the-sfm-trader-signal-state", recommendationSignalState);
  if (emitted) playSignalTone();
}

function rememberSmartAlert(key) {
  if (alertedKeys.has(key)) return false;
  alertedKeys.add(key);
  saveStored("the-sfm-trader-alerted", [...alertedKeys].slice(-180));
  return true;
}

function triggerSmartAlertPopup(alerts) {
  const today = new Date().toISOString().slice(0, 10);
  const freshAlerts = alerts
    .filter((alert) => !alertedKeys.has(`${today}:${alert.symbol}`))
    .slice(0, 2);

  if (!freshAlerts.length) return;

  for (const alert of freshAlerts) {
    alertedKeys.add(`${today}:${alert.symbol}`);
    showToast(
      `تنبيه شراء: ${alert.symbol}`,
      `${alert.confidence}% ثقة · الهدف ${formatMoney(alert.expectedPrice, alert.currency)}`
    );
  }

  saveStored("the-sfm-trader-alerted", [...alertedKeys].slice(-80));
  playSignalTone();
}

function showToast(title, message, options = {}) {
  if (options.persist !== false && isStockNotification({ title, message, type: options.type || "toast" })) {
    saveNotification(title, message, { type: options.type || "toast" });
  }

  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  stack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 6500);
}

function requestTradeAlertPermission() {
  if (!("Notification" in window) || Notification.permission !== "default") return;
  Notification.requestPermission().catch(() => {});
}

function sendBrowserTradeNotification(title, message) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    const notification = new Notification(title, {
      body: message,
      dir: "rtl",
      tag: `the-sfm-trader-${title}`
    });
    window.setTimeout(() => notification.close(), 9000);
  } catch {
    // Some browsers block notifications while the page is in focus or on mobile.
  }
}

function playSignalTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 740;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.24);
  } catch {
    // المتصفح قد يمنع الصوت قبل أول تفاعل من المستخدم.
  }
}

function renderUsDashboard(data) {
  const isUsMarket = data.market?.id === "us";
  usDashboardSection.classList.toggle("is-hidden", !isUsMarket);
  if (!isUsMarket) return;

  const all = data.recommendations;
  const shariaOnly = all.filter((item) => item.shariaStatus === "compliant");
  const highRisk = [...all].sort((a, b) => (b.risk?.score || 0) - (a.risk?.score || 0)).slice(0, 5);
  const bestBacktest = [...all]
    .filter((item) => Number.isFinite(item.backtest?.winRate))
    .sort((a, b) => b.backtest.winRate - a.backtest.winRate)
    .slice(0, 5);
  const strongestUpside = [...all].sort((a, b) => Math.abs(b.expectedMovePct) - Math.abs(a.expectedMovePct)).slice(0, 5);
  const summary = data.backtestSummary || {};

  usBacktestScore.textContent = summary.avgWinRate ? `${summary.avgWinRate}%` : "--";
  usDashboardGrid.innerHTML = `
    ${renderDashboardCard("توصيات اليوم", `${all.length} سهم`, [
      `شراء: ${all.filter((item) => item.action === "buy").length}`,
      `بيع: ${all.filter((item) => item.action === "sell").length}`,
      `انتظار: ${all.filter((item) => item.action === "hold").length}`
    ])}
    ${renderDashboardCard("الأسهم الشرعية فقط", `${shariaOnly.length} سهم`, shariaOnly.slice(0, 5).map((item) => `${item.symbol} · ${item.actionLabel} · ${item.confidence}%`))}
    ${renderDashboardCard("أعلى مخاطرة", highRisk[0]?.symbol || "--", highRisk.map((item) => `${item.symbol} · ${item.risk?.label || "--"}`))}
    ${renderDashboardCard("أفضل Backtest", summary.bestSymbol || "--", bestBacktest.map((item) => `${item.symbol} · ${item.backtest.winRate}% نجاح`))}
    ${renderDashboardCard("أقوى حركة متوقعة", strongestUpside[0]?.symbol || "--", strongestUpside.map((item) => `${item.symbol} · ${formatPercent(item.expectedMovePct)}`))}
  `;
}

function renderDashboardCard(title, value, lines) {
  const safeLines = lines.length ? lines : ["لا توجد بيانات"];
  return `
    <article class="dashboard-card">
      <span>${escapeHtml(title)}</span>
      <strong>${escapeHtml(value)}</strong>
      <ul class="dashboard-list">
        ${safeLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderUsOutlook(data) {
  if (!usOutlookSection || !usOutlookGrid) return;

  const isUsMarket = data.market?.id === "us";
  usOutlookSection.classList.toggle("is-hidden", !isUsMarket);
  if (!isUsMarket) return;

  const horizons = [
    { months: 1, title: "خلال شهر" },
    { months: 2, title: "خلال شهرين" },
    { months: 3, title: "خلال 3 شهور" }
  ];
  const candidates = data.recommendations
    .flatMap((item) => (item.upsideOutlook || []).map((outlook) => ({ ...outlook, item })))
    .filter((candidate) => candidate.targetPrice > candidate.item.currentPrice && candidate.movePct >= 0.75)
    .sort((a, b) => b.confidence - a.confidence || b.movePct - a.movePct);
  const uniqueSymbols = new Set(candidates.map((candidate) => candidate.item.symbol));

  usOutlookCount.textContent = uniqueSymbols.size ? `${uniqueSymbols.size} سهم` : "لا توجد";
  usOutlookGrid.innerHTML = horizons.map((horizon) => renderOutlookColumn(horizon, candidates)).join("");
}

function renderOutlookColumn(horizon, candidates) {
  const items = candidates
    .filter((candidate) => candidate.months === horizon.months)
    .sort((a, b) => b.confidence - a.confidence || b.movePct - a.movePct)
    .slice(0, 8);

  if (!items.length) {
    return `
      <article class="outlook-column">
        <h3>${horizon.title}</h3>
        <div class="empty">لا توجد فرص صعود واضحة لهذه المدة حاليا.</div>
      </article>
    `;
  }

  return `
    <article class="outlook-column">
      <h3>${horizon.title}</h3>
      <div class="outlook-list">
        ${items.map(renderOutlookItem).join("")}
      </div>
    </article>
  `;
}

function renderOutlookItem(candidate) {
  const item = candidate.item;
  return `
    <div class="outlook-item">
      <div class="outlook-item-top">
        <span class="outlook-symbol">${escapeHtml(item.symbol)}</span>
        <span class="outlook-confidence">${candidate.confidence}%</span>
      </div>
      <div class="outlook-name">${escapeHtml(item.name)}</div>
      <div class="outlook-target">
        الصعود إلى <strong>${formatMoney(candidate.targetPrice, item.currency)}</strong> خلال ${escapeHtml(candidate.label)}
      </div>
      <div class="outlook-item-meta">
        <span>الحالي ${formatMoney(item.currentPrice, item.currency)}</span>
        <span>${formatPercent(candidate.movePct)}</span>
      </div>
    </div>
  `;
}

function renderMiniSignalCard(item) {
  const score = calculateFinalScore(item);
  const statusClass = item.action === "sell" ? "sell" : item.action === "hold" ? "hold" : "";
  const visual = getPremiumAssetVisual(item);

  return `
    <article class="mini-card" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0">
      <div class="asset-title-row">
        <span class="asset-logo mini-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <div>
          <span>${escapeHtml(item.name)}</span>
          <strong>${escapeHtml(item.symbol)}</strong>
        </div>
      </div>
      <div class="mini-meta">
        <em class="status-pill-mini ${statusClass}">${escapeHtml(item.actionLabel)}</em>
        <em class="score-pill">Score ${score.score}%</em>
        <em class="score-pill">${item.confidence}% ثقة</em>
      </div>
      <div class="outlook-target">
        الحالي ${formatMoney(item.currentPrice, item.currency)} · الهدف ${formatMoney(item.expectedPrice, item.currency)}
      </div>
    </article>
  `;
}

function attachDetailOpeners(root) {
  for (const card of root.querySelectorAll("[data-symbol]")) {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      openDetailPage(card.dataset.symbol);
    });
    card.addEventListener("keydown", (event) => {
      if (event.target.closest("button, a, input, select, textarea")) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetailPage(card.dataset.symbol);
      }
    });
  }
}

function getEmptyRecommendationsMessage(data) {
  const pendingCount = Number(data?.pendingCount || 0);
  const unavailableCount = Array.isArray(data?.unavailable) ? data.unavailable.length : 0;
  const isClosed = data?.market?.session?.isOpen === false;
  const english = isEnglishLanguage();

  if (pendingCount > 0 || data?.partial || data?.refreshing) {
    return english
      ? `Finishing analysis in the background. Analyzed ${formatNumber(data?.analyzedCount || 0)} with ${formatNumber(pendingCount)} remaining.`
      : `جاري إكمال التحليل بالخلفية. تم تحليل ${formatNumber(data?.analyzedCount || 0)} وباقي ${formatNumber(pendingCount)}.`;
  }

  if (isClosed) {
    return english
      ? "The market is closed now. No live entry recommendations; watch the next open."
      : "السوق مغلق الآن. لا توجد توصيات دخول فورية، راقب الافتتاح القادم.";
  }

  if (unavailableCount > 0) {
    return english
      ? `Not enough live data for this market yet. Incomplete symbols: ${formatNumber(unavailableCount)}.`
      : `لا توجد بيانات كافية حالياً لهذا السوق. رموز غير مكتملة: ${formatNumber(unavailableCount)}.`;
  }

  return localizeUiText("لا توجد نتائج مطابقة للبحث أو الفلتر الحالي.");
}

function setupSignalCardToggle(card, item) {
  const button = card.querySelector(".card-toggle");
  const isCollapsed = !expandedSignalCards.has(item.symbol);
  setSignalCardCollapsed(card, isCollapsed);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldCollapse = !card.classList.contains("is-collapsed");

    if (shouldCollapse) {
      expandedSignalCards.delete(item.symbol);
    } else {
      expandedSignalCards.add(item.symbol);
    }

    saveStored("the-sfm-trader-expanded-cards", [...expandedSignalCards]);
    setSignalCardCollapsed(card, shouldCollapse);

    if (!shouldCollapse) {
      drawSparkline(card.querySelector(".sparkline"), item.sparkline, item.action);
    }
  });
}

function setSignalCardCollapsed(card, isCollapsed) {
  const button = card.querySelector(".card-toggle");
  card.classList.toggle("is-collapsed", isCollapsed);
  if (button) {
    button.textContent = localizeUiText(isCollapsed ? "فتح التفاصيل" : "غلق التفاصيل");
    button.setAttribute("aria-expanded", String(!isCollapsed));
  }
}

function openDetailPage(symbol) {
  const normalized = normalizeSymbol(symbol);
  if (!normalized) return;
  window.open(`/detail.html?symbol=${encodeURIComponent(normalized)}`, "_blank", "noopener");
}

function renderTimeframePills(timeframes) {
  if (!timeframes.length) {
    return "<div class=\"timeframe-pill action-hold-lite\"><span>الفريمات</span><strong>غير مكتملة</strong></div>";
  }

  return timeframes.map((frame) => {
    const actionClass =
      frame.action === "buy" ? "action-buy-lite" : frame.action === "sell" ? "action-sell-lite" : "action-hold-lite";
    return `
      <div class="timeframe-pill ${actionClass}" title="RSI ${frame.rsi14} · زخم ${formatPercent(frame.momentum20)}">
        <span>${escapeHtml(frame.label)}</span>
        <strong>${escapeHtml(frame.actionLabel)}</strong>
      </div>
    `;
  }).join("");
}

function initVoiceAssistant() {
  if (!voiceStartButton) return;

  voiceStartButton.addEventListener("click", () => {
    if (voiceActive) {
      stopVoiceAssistant();
    } else {
      startVoiceAssistant();
    }
  });
  mobileVoiceOrb?.addEventListener("click", () => {
    if (voiceActive) {
      stopVoiceAssistant();
    } else {
      startVoiceAssistant();
    }
  });

  voiceTextForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = voiceTextCommand.value.trim();
    if (!text) return;
    voiceTextCommand.value = "";
    handleVoiceTranscript(text);
  });

  voiceMonitorBestButton?.addEventListener("click", monitorBestVoiceOpportunity);

  if (!("mediaDevices" in navigator) || !navigator.mediaDevices?.getUserMedia) {
    setVoiceStatusText("المتصفح لا يدعم المايك");
    voiceStartButton.disabled = true;
  }
}

async function loadOllamaStatus() {
  if (!ollamaStatus) return;

  try {
    const response = await fetch("/api/ollama-status");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "تعذر فحص Ollama");

    if (!data.enabled) {
      ollamaStatus.textContent = localizeVoiceText("Ollama معطل");
      return;
    }

    if (!data.connected) {
      ollamaStatus.textContent = localizeVoiceText("Ollama غير مثبت أو غير شغال");
      return;
    }

    ollamaStatus.textContent = data.hasConfiguredModel
      ? localizeVoiceText(`Ollama جاهز: ${data.model}`)
      : localizeVoiceText(`Ollama يحتاج موديل: ${data.model}`);
  } catch {
    ollamaStatus.textContent = localizeVoiceText("تعذر فحص Ollama");
  }
}

function getVoiceSpeechLocale() {
  const language = getAppLanguage();
  if (language === "fr") return "fr-FR";
  return language === "en" ? "en-US" : "ar-SA";
}

function getPreferredSpeechVoice() {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices?.() || [];
  const language = getAppLanguage();
  const primaryPrefix = language === "fr" ? "fr" : language === "en" ? "en" : "ar";
  const fallbackPrefix = language === "ar" ? "en" : "ar";
  return (
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(primaryPrefix)) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(fallbackPrefix)) ||
    voices[0] ||
    null
  );
}

function localizeVoiceText(text) {
  if (!isEnglishLanguage()) return text;

  let translated = translateArabicTextToEnglish(text);
  const replacements = [
    ["يا سيدي", "Sir"],
    ["سمعت التصفيق", "I heard the clap"],
    ["SFM حاضر", "SFM is ready"],
    ["شنو تبي اليوم", "what would you like today"],
    ["تم تنبيه SFM بالتصفيق", "SFM was alerted by clap"],
    ["يفهم الأمر", "Understanding the command"],
    ["رد محلي عن جلسة السوق", "Local market session reply"],
    ["رد محلي عن الأصل المطلوب", "Local asset reply"],
    ["رد محلي حسب السوق المطلوب", "Local market reply"],
    ["تم الرد بواسطة Ollama", "Answered by Ollama"],
    ["تم الرد بواسطة Python", "Answered by Python"],
    ["Ollama معطل", "Ollama disabled"],
    ["Ollama غير مثبت أو غير شغال", "Ollama is not installed or not running"],
    ["Ollama يحتاج موديل", "Ollama needs a model"],
    ["Ollama جاهز", "Ollama ready"],
    ["تعذر فحص Ollama", "Could not check Ollama"],
    ["تعذر الرد", "Could not reply"],
    ["تعذر تنفيذ الأمر الصوتي حالياً.", "Could not run the voice command right now."],
    ["المتصفح لا يدعم المايك", "This browser does not support the microphone"],
    ["جاري طلب إذن المايك", "Requesting microphone permission"],
    ["طلب إذن المايك", "Requesting microphone permission"],
    ["تعذر تشغيل المايك", "Could not start the microphone"],
    ["تأكد من سماح المتصفح باستخدام المايك.", "Allow microphone access in the browser."],
    ["التعرف الصوتي غير مدعوم في هذا المتصفح", "Speech recognition is not supported in this browser"],
    ["المراقبة الصوتية مفعلة", "Voice monitoring is active"],
    ["شغل المحادثة الصوتية لسماع التنبيه", "Start voice chat to hear alerts"],
    ["لا توجد فرصة شراء واضحة حالياً للمراقبة الصوتية.", "No clear buy opportunity is available for voice monitoring right now."],
    ["انتظر تحديث السوق أو اختر سوقاً آخر.", "Wait for a market update or choose another market."],
    ["أفضل فرصة حالياً لا تزال", "The current best opportunity is still"],
    ["لذلك بقيت تحت المراقبة الصوتية.", "so it remains under voice monitoring."],
    ["تم تبديل المراقبة إلى", "Monitoring switched to"],
    ["إذا ظهرت فرصة قوية راح أنبهك صوتياً.", "I will notify you by voice if a strong opportunity appears."],
    ["لا توجد أسهم مراقبة", "No monitored stocks"],
    ["لم تضف رمزاً للمراقبة الصوتية بعد.", "No symbol has been added to voice monitoring yet."],
    ["اضغط × لإزالة أي سهم", "Press x to remove any stock"],
    ["أو راقب أفضل فرصة لتبديل الاختيار.", "or monitor the best opportunity to switch selection."],
    ["شغل المحادثة الصوتية لسماع التنبيه.", "Start voice chat to hear the alert."],
    ["تنبيه صوتي", "Voice alert"],
    ["ظهرت عليه فرصة", "has an opportunity"],
    ["بثقة", "with confidence"],
    ["السعر الحالي", "current price"],
    ["والهدف", "and target"],
    ["التوصية", "recommendation"],
    ["الهدف", "target"],
    ["خلال", "within"],
    ["الفترة القادمة", "the coming period"],
    ["راجع المخاطر قبل أي قرار.", "Review risk before any decision."],
    ["تذكير:", "Reminder:"],
    ["تنبيه صفقة متابعة", "Followed trade alert"],
    ["السوق", "market"],
    ["مفتوح الآن", "is open now"],
    ["مغلق الآن", "is closed now"],
    ["ويفتح بعد", "and opens in"],
    ["ويصكر بعد", "and closes in"],
    ["ويغلق", "and closes"],
    ["بتوقيت", "time"],
    ["من الأحد إلى الخميس", "Sunday to Thursday"],
    ["من الاثنين إلى الجمعة", "Monday to Friday"],
    ["من مساء الأحد إلى مساء الجمعة", "Sunday evening to Friday evening"],
    ["حسب أيام التداول المعتادة", "according to regular trading days"],
    ["أعرف أوقات الأسواق الرئيسية", "I know the main market hours"],
    ["هذه أوقات اعتيادية ولا تشمل العطل الرسمية أو المزادات الخاصة.", "These are regular hours and do not include official holidays or special auctions."],
    ["ما وصلت بيانات كافية حالياً عشان أحدد فرصة دقيقة.", "I do not have enough data right now to identify a precise opportunity."],
    ["جرّب تحديث السوق بعد ثواني.", "Try refreshing the market in a few seconds."],
    ["اتجاه السوق حالياً", "The current market trend is"],
    ["صاعد", "bullish"],
    ["هابط", "bearish"],
    ["متوازن", "balanced"],
    ["إشارات الشراء", "buy signals"],
    ["البيع", "sell signals"],
    ["والانتظار", "and wait signals"],
    ["أقوى رمز للمتابعة", "strongest symbol to watch"],
    ["أكثر سهم تداولاً حالياً هو", "The most traded stock right now is"],
    ["حجم التداول تقريباً", "approximate volume"],
    ["والتوصية", "and recommendation"],
    ["أقوى صعود", "strongest upside"],
    ["هو", "is"],
    ["الثقة", "confidence"],
    ["أفضل سهم مطابق للشريعة", "best Sharia compliant stock"],
    ["أقوى فرصة بيع", "strongest sell opportunity"],
    ["أفضل سهم", "best stock"],
    ["ومذكور أنه مطابق للشريعة.", "and it is marked Sharia compliant."],
    ["ومذكور أنه غير مطابق للشريعة.", "and it is marked not Sharia compliant."],
    ["والتصنيف الشرعي يحتاج تحقق.", "and the Sharia rating needs verification."],
  ["ما قدرت أحمل بيانات", "I could not load data for"],
  ["تعذر جلب البيانات", "Could not fetch data"],
  ["جلب البيانات", "fetch data"],
  ["كل المزودين", "all providers"],
  ["الرد", "reply"],
  ["ما قدرت أحمل", "I could not load"],
    ["حالياً", "right now"],
    ["السبب:", "Reason:"],
    ["راقب المخاطر لأن السلع والعقود الآجلة تتحرك بسرعة.", "Watch risk because commodities and futures move quickly."],
    ["يستمع الآن", "Listening now"],
    ["بانتظار صوتك", "Waiting for your voice"],
    ["خطأ صوتي", "Voice error"],
    ["أجرب لغة ثانية", "Trying another language"],
    ["اللغة غير مدعومة في المتصفح، أجرب لغة ثانية", "Language is not supported in the browser, trying another language"],
    ["الاستماع يعمل بالفعل", "Listening is already active"],
    ["خطأ في المايك", "Microphone error"],
    ["خدمة التعرف الصوتي في المتصفح تعذرت بسبب الشبكة", "Browser speech recognition failed because of the network"],
    ["التعرف الصوتي متوقف بسبب network. استخدم خانة الأمر النصي مؤقتاً.", "Speech recognition stopped because of network. Use the text command box for now."],
    ["التصفيق والرد الصوتي ما زالوا يعملون، لكن تحويل الكلام إلى نص من المتصفح يحتاج اتصالاً بخدمة التعرف الصوتي.", "Clap detection and voice replies still work, but browser speech-to-text needs a connection to the recognition service."],
    ["متوقف", "Stopped"],
    ["الصوت جاهز", "Voice ready"],
    ["يستقبل صوتك", "Listening"],
    ["يفكر", "Thinking"],
    ["SFM يتكلم", "SFM speaking"],
    ["جاهز", "Ready"]
  ];

  for (const [arabic, english] of replacements) {
    translated = translated.replaceAll(arabic, english);
  }

  return translated;
}

function setVoiceStatusText(text) {
  if (!voiceStatus) return;
  voiceStatus.textContent = localizeVoiceText(text);
}

function setVoiceReplyText(text, options = {}) {
  const localized = localizeVoiceText(text);
  if (voiceReply) voiceReply.textContent = localized;
  if (options.speak) speakVoice(localized, { alreadyLocalized: true });
  return localized;
}

function setVoiceActivityState(state = "idle", label = "") {
  if (!voiceActivity) return;

  const labels = isEnglishLanguage()
    ? {
        idle: "Ready",
        listening: "Listening",
        thinking: "Thinking",
        speaking: "SFM speaking",
        error: "Voice alert"
      }
    : {
        idle: "جاهز",
        listening: "يستقبل صوتك",
        thinking: "يفكر",
        speaking: "SFM يتكلم",
        error: "تنبيه صوتي"
      };
  const states = ["idle", "listening", "thinking", "speaking", "error"];
  const safeState = states.includes(state) ? state : "idle";

  voiceActivity.classList.remove(...states.map((item) => `is-${item}`));
  voiceActivity.classList.add(`is-${safeState}`);
  voiceActivity.dataset.state = safeState;
  if (voiceActivityText) voiceActivityText.textContent = label ? localizeVoiceText(label) : labels[safeState];

  if (voiceBand) {
    voiceBand.classList.toggle("voice-is-listening", safeState === "listening");
    voiceBand.classList.toggle("voice-is-speaking", safeState === "speaking");
    voiceBand.classList.toggle("voice-is-thinking", safeState === "thinking");
  }
  if (mobileVoiceOrb) {
    mobileVoiceOrb.classList.remove(...states.map((item) => `is-${item}`));
    mobileVoiceOrb.classList.add(`is-${safeState}`);
    mobileVoiceOrb.setAttribute("aria-label", labels[safeState]);
  }
}

function restoreVoiceActivityState() {
  if (voiceActive && !voiceRecognitionSuspended) {
    setVoiceActivityState("listening", "يستقبل صوتك");
  } else if (voiceActive) {
    setVoiceActivityState("idle", "الصوت جاهز");
  } else {
    setVoiceActivityState("idle", "جاهز");
  }
}

async function startVoiceAssistant() {
  voiceActive = true;
  voiceRecognitionLanguageIndex = 0;
  voiceRecognitionSuspended = false;
  setVoiceActivityState("thinking", "طلب إذن المايك");
  voiceStartButton.classList.add("is-listening");
  voiceStartButton.textContent = isEnglishLanguage() ? "Stop voice chat" : "إيقاف المحادثة الصوتية";
  setVoiceStatusText("جاري طلب إذن المايك");
  renderVoiceMonitor();

  try {
    voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    startClapDetector(voiceStream);
    const recognitionStarted = startSpeechRecognition();
    const reply = getLocalGreeting();
    setVoiceReplyText(reply);
    if (recognitionStarted) {
      setVoiceStatusText(`يستمع الآن (${getVoiceRecognitionLanguages()[voiceRecognitionLanguageIndex]})`);
      setVoiceActivityState("listening", "يستقبل صوتك");
    }
    speakVoice(reply);
  } catch (error) {
    setVoiceStatusText("تعذر تشغيل المايك");
    setVoiceReplyText(error.message || "تأكد من سماح المتصفح باستخدام المايك.");
    stopVoiceAssistant();
    setVoiceActivityState("error", "خطأ في المايك");
  }
}

function stopVoiceAssistant() {
  voiceActive = false;
  voiceRecognitionSuspended = true;
  voiceStartButton.classList.remove("is-listening");
  voiceStartButton.textContent = isEnglishLanguage() ? "Start voice chat" : "ابدأ المحادثة الصوتية";
  setVoiceStatusText("متوقف");
  setVoiceActivityState("idle", "متوقف");
  renderVoiceMonitor();

  if (voiceRecognition) {
    voiceRecognition.onend = null;
    try {
      voiceRecognition.stop();
    } catch {
      // قد يكون متوقفاً بالفعل.
    }
    voiceRecognition = null;
  }

  if (voiceClapFrame) {
    window.cancelAnimationFrame(voiceClapFrame);
    voiceClapFrame = null;
  }

  if (voiceAudioContext) {
    voiceAudioContext.close().catch(() => {});
    voiceAudioContext = null;
  }

  if (voiceStream) {
    voiceStream.getTracks().forEach((track) => track.stop());
    voiceStream = null;
  }
}

function startSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setVoiceStatusText("التعرف الصوتي غير مدعوم في هذا المتصفح");
    return false;
  }

  if (voiceRecognitionSuspended) return false;

  if (voiceRecognition) {
    voiceRecognition.onend = null;
    try {
      voiceRecognition.stop();
    } catch {
      // قد يكون متوقفاً بالفعل.
    }
  }

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = getVoiceRecognitionLanguages()[voiceRecognitionLanguageIndex] || "ar-SA";
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = true;
  voiceRecognition.maxAlternatives = 1;

  voiceRecognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const text = event.results[index][0]?.transcript || "";
      if (event.results[index].isFinal) finalText += text;
      else interimText += text;
    }

    const heard = (finalText || interimText).trim();
    if (heard) {
      voiceTranscript.textContent = heard;
      setVoiceActivityState("listening", "يستقبل صوتك");
    }
    if (finalText.trim()) {
      setVoiceActivityState("thinking", "يفهم الأمر");
      handleVoiceTranscript(finalText.trim());
    }
  };

  voiceRecognition.onerror = (event) => {
    if (event.error === "network") {
      handleSpeechNetworkError();
      return;
    }

    if (event.error === "language-not-supported") {
      handleSpeechNetworkError("اللغة غير مدعومة في المتصفح، أجرب لغة ثانية");
      return;
    }

    setVoiceStatusText(event.error === "no-speech" ? "بانتظار صوتك" : `خطأ صوتي: ${event.error}`);
    setVoiceActivityState(event.error === "no-speech" ? "listening" : "error", event.error === "no-speech" ? "بانتظار صوتك" : "خطأ صوتي");
  };

  voiceRecognition.onend = () => {
    if (!voiceActive || !voiceRecognition || voiceRecognitionSuspended) return;
    window.setTimeout(() => {
      try {
        voiceRecognition?.start();
      } catch {
        // بعض المتصفحات تحتاج فاصلاً قصيراً قبل إعادة التشغيل.
      }
    }, 450);
  };

  try {
    voiceRecognition.start();
    setVoiceStatusText(`يستمع الآن (${voiceRecognition.lang})`);
    setVoiceActivityState("listening", "يستقبل صوتك");
    return true;
  } catch {
    setVoiceStatusText("الاستماع يعمل بالفعل");
    setVoiceActivityState("listening", "يستقبل صوتك");
    return false;
  }
}

function handleSpeechNetworkError(message = "خدمة التعرف الصوتي في المتصفح تعذرت بسبب الشبكة") {
  if (voiceRecognition) {
    voiceRecognition.onend = null;
    try {
      voiceRecognition.stop();
    } catch {
      // قد يكون متوقفاً بالفعل.
    }
  }

  const languages = getVoiceRecognitionLanguages();
  if (voiceRecognitionLanguageIndex < languages.length - 1) {
    voiceRecognitionLanguageIndex += 1;
    const nextLanguage = languages[voiceRecognitionLanguageIndex];
    setVoiceStatusText(`${message}. أجرب ${nextLanguage}`);
    setVoiceActivityState("thinking", "أجرب لغة ثانية");
    window.setTimeout(() => {
      if (voiceActive) startSpeechRecognition();
    }, 900);
    return;
  }

  voiceRecognitionSuspended = true;
  setVoiceStatusText("التعرف الصوتي متوقف بسبب network. استخدم خانة الأمر النصي مؤقتاً.");
  setVoiceReplyText("التصفيق والرد الصوتي ما زالوا يعملون، لكن تحويل الكلام إلى نص من المتصفح يحتاج اتصالاً بخدمة التعرف الصوتي.");
  setVoiceActivityState("error", "network");
}

function getVoiceRecognitionLanguages() {
  const language = getAppLanguage();
  if (language === "fr") return ["fr-FR", "en-US", "ar-SA", "ar-KW", "ar"];
  return language === "en"
    ? ["en-US", "ar-SA", "ar-KW", "ar"]
    : VOICE_RECOGNITION_LANGUAGES;
}

function startClapDetector(stream) {
  voiceAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = voiceAudioContext.createMediaStreamSource(stream);
  const analyser = voiceAudioContext.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const samples = new Uint8Array(analyser.fftSize);

  function tick() {
    analyser.getByteTimeDomainData(samples);
    let peak = 0;
    let total = 0;

    for (const sample of samples) {
      const value = Math.abs((sample - 128) / 128);
      peak = Math.max(peak, value);
      total += value * value;
    }

    const rms = Math.sqrt(total / samples.length);
    const now = Date.now();
    if (peak > 0.92 && rms > 0.19 && now > voiceClapCooldownUntil) {
      voiceClapCooldownUntil = now + 3000;
      const reply = isEnglishLanguage()
        ? `I heard the clap, Sir ${getUserDisplayName()}. SFM is ready. What would you like today?`
        : `سمعت التصفيق يا سيدي ${getUserDisplayName()}. SFM حاضر، شنو تبي اليوم؟`;
      setVoiceReplyText(reply, { speak: true });
      setVoiceStatusText("تم تنبيه SFM بالتصفيق");
    }

    if (voiceActive) voiceClapFrame = window.requestAnimationFrame(tick);
  }

  tick();
}

async function handleVoiceTranscript(text) {
  voiceTranscript.textContent = text;
  setVoiceStatusText("يفهم الأمر");
  setVoiceActivityState("thinking", "يفهم الأمر");

  const localSessionReply = getLocalMarketSessionReply(text);
  if (localSessionReply) {
    setVoiceReplyText(localSessionReply.reply, { speak: true });
    setVoiceStatusText("رد محلي عن جلسة السوق");

    if (localSessionReply.marketId && localSessionReply.marketId !== activeMarket) {
      activeMarket = localSessionReply.marketId;
      setActiveMarketButton();
      updateSessionClock();
      loadRecommendations({ force: true });
    }
    return;
  }

  const localAssetReply = await getLocalAssetQueryReply(text);
  if (localAssetReply) {
    setVoiceReplyText(localAssetReply.reply, { speak: true });
    setVoiceStatusText("رد محلي عن الأصل المطلوب");

    if (localAssetReply.marketId && localAssetReply.marketId !== activeMarket) {
      activeMarket = localAssetReply.marketId;
      activeShariaFilter = "all";
      setActiveMarketButton();
      setActiveShariaFilterButton();
      updateSessionClock();
      loadRecommendations({ force: true });
    }
    return;
  }

  const localRecommendationReply = await getLocalMarketRecommendationReply(text);
  if (localRecommendationReply) {
    setVoiceReplyText(localRecommendationReply.reply, { speak: true });
    setVoiceStatusText("رد محلي حسب السوق المطلوب");
    return;
  }

  try {
    const response = await fetch("/api/voice-command", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        transcript: text,
        language: isEnglishLanguage() ? "en" : "ar",
        activeMarket,
        recommendations: summarizeRecommendationsForVoice(lastData?.recommendations || [])
      })
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "تعذر تنفيذ الأمر الصوتي");
    }

    setVoiceReplyText(result.reply || "--", { speak: true });
    setVoiceStatusText(result.aiEngine === "ollama" ? "تم الرد بواسطة Ollama" : "تم الرد بواسطة Python");

    if (result.marketId && result.marketId !== activeMarket) {
      activeMarket = result.marketId;
      activeShariaFilter = "all";
      setActiveMarketButton();
      setActiveShariaFilterButton();
      updateSessionClock();
      loadRecommendations({ force: true });
    }

    if (result.monitor && result.watchSymbol) {
      addVoiceMonitor(result.watchSymbol);
    }

    if (result.openDetail && result.detailUrl) {
      window.open(result.detailUrl, "_blank", "noopener");
    }
  } catch (error) {
    setVoiceStatusText("تعذر الرد");
    setVoiceReplyText(error.message);
    speakVoice("تعذر تنفيذ الأمر الصوتي حالياً.");
  }
}

async function getLocalAssetQueryReply(text) {
  const normalized = normalizeArabicText(text);
  const match = ASSET_QUERY_ALIASES.find((item) => item.pattern.test(normalized));
  const asksAsset =
    /(سعر|كم|بكم|بجم|حلل|تحليل|اتجاه|وين|ذهب|فضه|فضة|نفط|برنت|غاز|نحاس|قهوه|قهوة|كاكاو|ككاو|gold|silver|oil|coffee|cocoa)/.test(normalized);

  if (!match || !asksAsset) return null;

  try {
    const response = await fetch(`/api/asset?symbol=${encodeURIComponent(match.symbol)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "تعذر تحميل الأصل");

    const item = data.recommendation || {};
    const marketId = ["KC=F", "CC=F"].includes(match.symbol) ? "food" : "commodities";
    return {
      marketId,
      reply: `${match.name}: السعر الحالي ${formatMoney(item.currentPrice, item.currency)}، التوصية ${item.actionLabel || "انتظار"} بثقة ${formatNumber(item.confidence || 0)}%. الهدف ${formatMoney(item.target1 || item.expectedPrice, item.currency)} خلال ${item.duration || "الفترة القادمة"}. راقب المخاطر لأن السلع والعقود الآجلة تتحرك بسرعة.`
    };
  } catch (error) {
    return {
      marketId: ["KC=F", "CC=F"].includes(match.symbol) ? "food" : "commodities",
      reply: `ما قدرت أحمل ${match.name} حالياً. السبب: ${error.message}`
    };
  }
}

async function getLocalMarketRecommendationReply(text) {
  const normalized = normalizeArabicText(text);
  const marketId = resolveMarketIdFromText(normalized);
  const intent = resolveVoiceMarketIntent(normalized);

  if (!intent || !marketId || marketId === "world" || marketId === "gcc") return null;
  if (!["best_buy", "best_sell", "best_sharia", "monthly_upside", "most_traded", "market_trend"].includes(intent)) return null;

  try {
    const data = await fetchMarketRecommendationsForVoice(marketId);
    applyVoiceMarketData(data, marketId);
    return {
      marketId,
      reply: buildLocalRecommendationReply(data, intent)
    };
  } catch (error) {
    return {
      marketId,
      reply: `ما قدرت أحمل بيانات ${getMarketSessionName(marketId)} حالياً. السبب: ${error.message}`
    };
  }
}

function resolveVoiceMarketIntent(text) {
  if (/(اكثر|الأكثر|اكبر|اعلى|أعلى|سيوله|سيولة|حجم التداول|تداول اليوم|most traded|volume)/.test(text)) return "most_traded";
  if (/(شرعي|الشريعه|الشريعة|حلال|halal|مطابق)/.test(text)) return "best_sharia";
  if (/(شهر|شهرين|ثلاث|3|تصعد|صعود|ترتفع|يرتفع|upside|monthly)/.test(text)) return "monthly_upside";
  if (/(ابيع|أبيع|بيع|بيعه|اخرج|sell)/.test(text)) return "best_sell";
  if (/(اتجاه|ترند|نبض|صاعد|هابط|وضع السوق|market trend)/.test(text)) return "market_trend";
  if (/(افضل|أفضل|اقوى|أقوى|اشتري|أشتري|شراء|فرصه|فرصة|سهم اليوم|ترشح|تنصح|best|buy)/.test(text)) return "best_buy";
  return null;
}

async function fetchMarketRecommendationsForVoice(marketId) {
  const response = await fetch(`/api/recommendations?market=${encodeURIComponent(marketId)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "تعذر تحميل بيانات السوق");
  }
  return data;
}

function applyVoiceMarketData(data, marketId) {
  activeMarket = marketId;
  activeShariaFilter = "all";
  lastData = data;
  updateRecommendationHistory(data.recommendations || []);
  renderRecommendations(data);
  setActiveMarketButton();
  setActiveShariaFilterButton();
  updateSessionClock();
  connectionStatus.textContent = getConnectionStatusText(data);
}

function buildLocalRecommendationReply(data, intent) {
  const items = data.recommendations || [];
  const marketLabel = data.market?.label || "السوق";

  if (!items.length) {
    return `${marketLabel}: ما وصلت بيانات كافية حالياً عشان أحدد فرصة دقيقة. جرّب تحديث السوق بعد ثواني.`;
  }

  if (intent === "market_trend") {
    const buys = items.filter((item) => item.action === "buy").length;
    const sells = items.filter((item) => item.action === "sell").length;
    const holds = items.filter((item) => item.action === "hold").length;
    const pulse = buys > sells ? "صاعد" : sells > buys ? "هابط" : "متوازن";
    const leader = pickBestVoiceItem(items);
    return `${marketLabel}: اتجاه السوق حالياً ${pulse}. إشارات الشراء ${buys}، البيع ${sells}، والانتظار ${holds}. أقوى رمز للمتابعة ${leader.symbol} بثقة ${formatNumber(leader.confidence)}%.`;
  }

  if (intent === "most_traded") {
    const liquid = items.filter((item) => Number(item.latestVolume) > 0);
    if (!liquid.length) return `${marketLabel}: مزود البيانات الحالي ما أعطاني حجم تداول واضح لهذا السوق. أقدر أعطيك أفضل فرصة فنية بدل السيولة.`;
    const item = [...liquid].sort((a, b) => Number(b.latestVolume || 0) - Number(a.latestVolume || 0))[0];
    return `${marketLabel}: أكثر سهم تداولاً حالياً هو ${item.name || item.symbol} (${item.symbol}). حجم التداول تقريباً ${formatCompactNumber(item.latestVolume)}، والتوصية ${item.actionLabel} بثقة ${formatNumber(item.confidence)}%. السعر ${formatMoney(item.currentPrice, item.currency)} والهدف ${formatMoney(item.target1 || item.expectedPrice, item.currency)}.`;
  }

  if (intent === "monthly_upside") {
    const monthly = items
      .flatMap((item) => (item.upsideOutlook || []).map((outlook) => ({ item, outlook })))
      .filter(({ item, outlook }) => Number(outlook.targetPrice) > Number(item.currentPrice))
      .sort((a, b) => Number(b.outlook.confidence || 0) - Number(a.outlook.confidence || 0) || Number(b.outlook.movePct || 0) - Number(a.outlook.movePct || 0));
    const picked = monthly[0];
    if (picked) {
      return `${marketLabel}: أقوى صعود خلال ${picked.outlook.label || "الفترة القادمة"} هو ${picked.item.name || picked.item.symbol} (${picked.item.symbol}). السعر الحالي ${formatMoney(picked.item.currentPrice, picked.item.currency)} والهدف ${formatMoney(picked.outlook.targetPrice, picked.item.currency)}، والثقة ${formatNumber(picked.outlook.confidence || picked.item.confidence)}%.`;
    }
  }

  const candidates = filterVoiceCandidates(items, intent);
  const item = pickBestVoiceItem(candidates.length ? candidates : items);
  const target = item.target1 || item.expectedPrice;
  const sharia = item.shariaStatus === "compliant" ? "ومذكور أنه مطابق للشريعة." : item.shariaStatus === "not_compliant" ? "ومذكور أنه غير مطابق للشريعة." : "والتصنيف الشرعي يحتاج تحقق.";
  const prefix = intent === "best_sell"
    ? "أقوى فرصة بيع"
    : intent === "best_sharia"
      ? "أفضل سهم مطابق للشريعة"
      : "أفضل سهم";

  return `${marketLabel}: ${prefix} الآن هو ${item.name || item.symbol} (${item.symbol}). التوصية ${item.actionLabel}، الثقة ${formatNumber(item.confidence)}%. السعر الحالي ${formatMoney(item.currentPrice, item.currency)}، الهدف ${formatMoney(target, item.currency)} خلال ${item.duration || "الفترة القادمة"}. ${sharia} تذكير: راجع المخاطر قبل أي قرار.`;
}

function filterVoiceCandidates(items, intent) {
  if (intent === "best_sell") return items.filter((item) => item.action === "sell");
  if (intent === "best_sharia") return items.filter((item) => item.shariaStatus === "compliant");
  return items.filter((item) => item.action === "buy");
}

function pickBestVoiceItem(items) {
  return [...items].sort((a, b) => {
    const scoreA = calculateFinalScore(a).score + Number(a.confidence || 0) + Math.abs(Number(a.expectedMovePct || 0));
    const scoreB = calculateFinalScore(b).score + Number(b.confidence || 0) + Math.abs(Number(b.expectedMovePct || 0));
    return scoreB - scoreA;
  })[0];
}

function getLocalMarketSessionReply(text) {
  const normalized = normalizeArabicText(text);
  const isSessionQuestion =
    /(متى|وقت|اوقات|أوقات|كم|هل)/.test(normalized) &&
    /(يفتح|تفتح|فتح|يبدا|يبدأ|يصكر|تسكر|يغلق|اغلاق|إغلاق|مفتوح|مغلق|الجلسه|الجلسة|السوق|البورصه|البورصة)/.test(normalized);

  if (!isSessionQuestion) return null;

  if (/(كل|جميع|العالم|عالمي|world|global)/.test(normalized)) {
    return {
      marketId: null,
      reply: getWorldSessionsReply()
    };
  }

  const exchangeId = resolveExchangeSessionIdFromText(normalized);
  const marketId = resolveMarketIdFromText(normalized) || (MARKET_SESSIONS[exchangeId] ? exchangeId : activeMarket || "kuwait");
  const entry = EXCHANGE_SESSION_KNOWLEDGE[exchangeId];
  const config = entry?.session || MARKET_SESSIONS[marketId] || MARKET_SESSIONS.kuwait;
  const state = getSessionStateForConfig(config, new Date());
  const marketName = entry?.name || getMarketSessionName(marketId);

  if (config.type === "always") {
    return {
      marketId: MARKET_SESSIONS[marketId] ? marketId : null,
      reply: `${marketName} مفتوح 24 ساعة، 7 أيام في الأسبوع.`
    };
  }

  const openLabel = formatSessionTime(config.open);
  const closeLabel = formatSessionTime(config.close);
  const daysLabel = getSessionDaysLabel(config);
  const status = state.isOpen
    ? `مفتوح الآن ويصكر بعد ${state.countdownLabel}`
    : `مغلق الآن ويفتح بعد ${state.countdownLabel}`;

  return {
    marketId: MARKET_SESSIONS[marketId] ? marketId : null,
    reply: `${marketName}: يفتح ${openLabel} ويغلق ${closeLabel} بتوقيت ${config.label}، ${daysLabel}. ${status}.`
  };
}

function getWorldSessionsReply() {
  const ids = ["kuwait", "saudi", "uae", "qatar", "bahrain", "oman", "us", "uk", "germany", "france", "netherlands", "switzerland", "japan", "hongkong", "china", "korea", "india", "australia", "singapore", "forex", "commodities", "crypto"];
  const lines = ids
    .map((id) => EXCHANGE_SESSION_KNOWLEDGE[id])
    .filter(Boolean)
    .map((entry) => formatExchangeSessionLine(entry));
  return `أعرف أوقات الأسواق الرئيسية: ${lines.join("، ")}. هذه أوقات اعتيادية ولا تشمل العطل الرسمية أو المزادات الخاصة.`;
}

function formatExchangeSessionLine(entry) {
  const config = entry.session;
  if (config.type === "always") return `${entry.name}: مفتوح 24/7`;
  if (config.type === "weekly") return `${entry.name}: من ${formatSessionTime(config.open)} إلى ${formatSessionTime(config.close)} بتوقيت ${config.label}`;
  return `${entry.name}: ${formatSessionTime(config.open)}-${formatSessionTime(config.close)} بتوقيت ${config.label}`;
}

function resolveExchangeSessionIdFromText(text) {
  const tests = [
    ["kuwait", /(كويت|الكويتي|بورصة الكويت|kuwait|xkuw)/],
    ["saudi", /(سعود|تداول|saudi|tadawul)/],
    ["uae", /(امارات|دبي|ابوظبي|uae|dfm|adx)/],
    ["qatar", /(قطر|qatar|doha)/],
    ["bahrain", /(بحرين|bahrain)/],
    ["oman", /(عمان|مسقط|oman|muscat)/],
    ["us", /(امريكا|امريكي|الامريكي|ناسداك|داو|nyse|nasdaq|us)/],
    ["canada", /(كندا|canada|toronto)/],
    ["brazil", /(برازيل|البرازيل|brazil|sao paulo)/],
    ["uk", /(بريطانيا|لندن|uk|london)/],
    ["germany", /(المانيا|ألمانيا|germany|frankfurt)/],
    ["france", /(فرنسا|france|paris)/],
    ["netherlands", /(هولندا|netherlands|amsterdam)/],
    ["switzerland", /(سويسرا|switzerland|zurich)/],
    ["japan", /(اليابان|يابان|japan|tokyo)/],
    ["hongkong", /(هونغ|هونج|hong kong|hkex)/],
    ["china", /(الصين|صين|china|shanghai)/],
    ["korea", /(كوريا|korea|seoul)/],
    ["india", /(الهند|india|mumbai)/],
    ["australia", /(استراليا|أستراليا|australia|sydney)/],
    ["singapore", /(سنغافوره|سنغافورة|singapore)/],
    ["forex", /(فوركس|عملات|forex|fx)/],
    ["commodities", /(ذهب|فضه|فضة|نفط|برنت|غاز|نحاس|سلع|commodities|gold|silver|oil)/],
    ["crypto", /(كريبتو|رقميه|رقمية|بتكوين|بيتكوين|crypto|bitcoin)/]
  ];
  return tests.find(([, pattern]) => pattern.test(text))?.[0] || "";
}

function normalizeArabicText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/[^\u0600-\u06FFa-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveMarketIdFromText(text) {
  const sectorMarketTests = [
    ["banking", /(بنوك|مصارف|مصرف|bank|banks|banking|financials)/],
    ["energy", /(اسهم الطاقة|أسهم الطاقة|قطاع الطاقة|oil stocks|energy stocks|energy|xom|cvx|slb)/],
    ["semiconductors", /(اشباه الموصلات|أشباه الموصلات|رقائق|شرائح|chip|chips|semiconductor|semiconductors)/]
  ];
  const sectorMarketMatch = sectorMarketTests.find(([, pattern]) => pattern.test(text));
  if (sectorMarketMatch) return sectorMarketMatch[0];
  const tests = [
    ["kuwait", /(كويت|الكويتي|xkuw|kuwait)/],
    ["saudi", /(سعود|تداول|tadawul|saudi)/],
    ["ai", /(ذكاء اصطناعي|الذكاء|ai|artificial intelligence)/],
    ["tech", /(تقنيه|تقنية|تكنولوجيا|tech|technology)/],
    ["dividends", /(توزيع|توزيعات|ارباح|أرباح|dividend|dividends)/],
    ["healthcare", /(طبي|طبيه|طبية|الطب|رعايه صحيه|رعاية صحية|صحيه|صحية|ادويه|أدوية|دواء|مستشفى|مستشفيات|بيوتك|بايوتك|healthcare|health care|medical|pharma|biotech|hospital)/],
    ["commodities", /(ذهب|فضه|فضة|نفط|برنت|غاز|نحاس|سلع|commodities|gold|silver|oil)/],
    ["food", /(طعام|اغذيه|أغذية|قهوه|قهوة|كاكاو|ككاو|coffee|cocoa|food)/],
    ["us", /(امريكا|امريكي|الامريكي|ناسداك|داو|وول|nyse|nasdaq|us)/],
    ["forex", /(فوركس|عملات|forex|fx)/],
    ["crypto", /(كريبتو|رقميه|رقمية|بتكوين|بيتكوين|crypto|bitcoin)/],
    ["uae", /(امارات|دبي|ابوظبي|uae|dfm|adx)/],
    ["qatar", /(قطر|qatar|doha)/],
    ["bahrain", /(بحرين|bahrain)/],
    ["oman", /(عمان|مسقط|oman|muscat)/],
    ["europe", /(بريطانيا|لندن|المانيا|ألمانيا|فرنسا|هولندا|سويسرا|اوروبا|اوروبي|europe|london|germany|france|netherlands|switzerland)/],
    ["asia", /(اليابان|هونغ|هونج|الصين|كوريا|الهند|اسيا|اسيوي|asia|tokyo|japan|china|korea|india)/],
    ["world", /(كل الاسواق|كل الأسواق|جميع الاسواق|جميع الأسواق|العالم|عالمي|world|global)/]
  ];
  return tests.find(([, pattern]) => pattern.test(text))?.[0] || null;
}

function getMarketSessionName(marketId) {
  const overrideMarketNames = {
    banking: "أسهم البنوك",
    energy: "أسهم الطاقة",
    semiconductors: "أسهم أشباه الموصلات",
    food: "الأسهم الغذائية",
    healthcare: "الأسهم الدوائية"
  };
  if (overrideMarketNames[marketId]) return overrideMarketNames[marketId];
  const names = {
    forex: "سوق الفوركس",
    crypto: "سوق العملات الرقمية",
    kuwait: "بورصة الكويت",
    saudi: "بورصة السعودية",
    uae: "أسواق الإمارات",
    qatar: "بورصة قطر",
    bahrain: "بورصة البحرين",
    oman: "بورصة عمان",
    gcc: "بورصات الخليج",
    us: "السوق الأمريكي",
    europe: "السوق الأوروبي",
    asia: "السوق الآسيوي",
    world: "جميع الأسواق",
    ai: "أسهم الذكاء الاصطناعي",
    tech: "أسهم التقنية",
    dividends: "أسهم توزيعات الأرباح",
    healthcare: "أسهم الرعاية الصحية والطب",
    commodities: "الذهب والفضة والنفط",
    food: "اسهم سلع غذائية",
    watchlist: "قائمة المراقبة"
  };
  return names[marketId] || "السوق";
}

function getSessionDaysLabel(config) {
  if (config.type === "weekly") return "من مساء الأحد إلى مساء الجمعة";
  const dayKey = JSON.stringify(config.days || []);
  if (dayKey === JSON.stringify([0, 1, 2, 3, 4])) return "من الأحد إلى الخميس";
  if (dayKey === JSON.stringify([1, 2, 3, 4, 5])) return "من الاثنين إلى الجمعة";
  return "حسب أيام التداول المعتادة";
}

function formatSessionTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  const suffix = hour >= 12 ? "م" : "ص";
  const hour12 = hour % 12 || 12;
  return `${formatNumber(hour12)}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function summarizeRecommendationsForVoice(items) {
  return items.slice(0, 80).map((item) => ({
    symbol: item.symbol,
    name: item.name,
    action: item.action,
    actionLabel: item.actionLabel,
    confidence: item.confidence,
    currentPrice: item.currentPrice,
    expectedPrice: item.expectedPrice,
    target1: item.target1,
    target2: item.target2,
    stopLoss: item.stopLoss,
    riskReward: item.riskReward,
    expectedMovePct: item.expectedMovePct,
    currency: item.currency,
    duration: item.duration,
    latestVolume: item.latestVolume,
    averageVolume20: item.averageVolume20,
    averageVolume50: item.averageVolume50,
    relativeVolume: item.relativeVolume,
    shariaStatus: item.shariaStatus,
    shariaLabel: item.shariaLabel,
    finalScore: calculateFinalScore(item).score,
    risk: item.risk ? { level: item.risk.level, label: item.risk.label } : null,
    analysisQuality: item.analysisQuality ? { score: item.analysisQuality.score, label: item.analysisQuality.label } : null,
    upsideOutlook: item.upsideOutlook || []
  }));
}

function monitorBestVoiceOpportunity() {
  const rankedBuys = (lastData?.recommendations || [])
    .filter((item) => item.action === "buy")
    .map((item) => ({ item, score: calculateFinalScore(item).score }))
    .sort((a, b) => b.score - a.score || Number(b.item.confidence || 0) - Number(a.item.confidence || 0));
  const best = rankedBuys[0]?.item;

  if (!best) {
    const reply = "لا توجد فرصة شراء واضحة حالياً للمراقبة الصوتية.";
    setVoiceReplyText(reply, { speak: true });
    if (voiceMonitorNote) voiceMonitorNote.textContent = localizeVoiceText("انتظر تحديث السوق أو اختر سوقاً آخر.");
    return;
  }

  const previous = voiceMonitors.join(", ");
  voiceMonitors = [normalizeSymbol(best.symbol)];
  saveStored("the-sfm-trader-voice-monitors", voiceMonitors);
  renderVoiceMonitor();

  const isSame = previous === voiceMonitors.join(", ");
  const reply = isSame
    ? `أفضل فرصة حالياً لا تزال ${best.symbol}. لذلك بقيت تحت المراقبة الصوتية.`
    : `تم تبديل المراقبة إلى ${best.symbol}. إذا ظهرت فرصة قوية راح أنبهك صوتياً.`;
  setVoiceReplyText(reply, { speak: true });
  setVoiceStatusText(voiceActive ? "المراقبة الصوتية مفعلة" : "شغل المحادثة الصوتية لسماع التنبيه");
}

function addVoiceMonitor(symbol) {
  const normalized = normalizeSymbol(symbol);
  if (!normalized) return;
  if (!voiceMonitors.includes(normalized)) {
    voiceMonitors = [...voiceMonitors, normalized].slice(0, 20);
    saveStored("the-sfm-trader-voice-monitors", voiceMonitors);
  }
  renderVoiceMonitor();
}

function removeVoiceMonitor(symbol) {
  const normalized = normalizeSymbol(symbol);
  if (!normalized) return;
  voiceMonitors = voiceMonitors.filter((value) => value !== normalized);
  saveStored("the-sfm-trader-voice-monitors", voiceMonitors);
  renderVoiceMonitor();
}

function renderVoiceMonitor() {
  if (!voiceMonitor) return;
  if (voiceMonitors.length) {
    voiceMonitor.innerHTML = `
      <span class="voice-monitor-list">
        ${voiceMonitors.map((symbol) => `
          <span class="voice-monitor-chip">
            ${escapeHtml(symbol)}
            <button type="button" data-remove-voice-monitor="${escapeHtml(symbol)}" aria-label="إزالة ${escapeHtml(symbol)}">×</button>
          </span>
        `).join("")}
      </span>
    `;
    for (const button of voiceMonitor.querySelectorAll("[data-remove-voice-monitor]")) {
      button.addEventListener("click", () => removeVoiceMonitor(button.dataset.removeVoiceMonitor));
    }
    if (voiceMonitorNote) {
      voiceMonitorNote.textContent = localizeVoiceText(voiceActive
        ? "اضغط × لإزالة أي سهم، أو راقب أفضل فرصة لتبديل الاختيار."
        : "اضغط × لإزالة أي سهم. شغل المحادثة الصوتية لسماع التنبيه.");
    }
    return;
  }

  voiceMonitor.textContent = localizeVoiceText("لا توجد أسهم مراقبة");
  if (voiceMonitorNote) voiceMonitorNote.textContent = localizeVoiceText("لم تضف رمزاً للمراقبة الصوتية بعد.");
}

function checkVoiceMonitors(items) {
  if (!voiceActive || !voiceMonitors.length) return;
  const lookup = getRecommendationLookup(items);

  for (const symbol of [...voiceMonitors]) {
    const item = lookup.get(symbol.toUpperCase());
    if (!item) continue;

    const isStrongBuy = item.action === "buy" && item.confidence >= 70;
    const isStrongSell = item.action === "sell" && item.confidence >= 75;
    if (!isStrongBuy && !isStrongSell) continue;

    const reply = `${item.symbol} ظهرت عليه فرصة ${item.actionLabel} بثقة ${item.confidence}%. السعر الحالي ${formatMoney(item.currentPrice, item.currency)} والهدف ${formatMoney(item.expectedPrice, item.currency)}.`;
    const localizedReply = setVoiceReplyText(reply);
    setVoiceStatusText("تنبيه صوتي");
    showToast(localizeVoiceText(`تنبيه صوتي: ${item.symbol}`), localizedReply, { type: "voice" });
    speakVoice(localizedReply, { alreadyLocalized: true });
    voiceMonitors = voiceMonitors.filter((value) => value !== symbol);
    saveStored("the-sfm-trader-voice-monitors", voiceMonitors);
    renderVoiceMonitor();
    break;
  }
}

function speakVoice(text, options = {}) {
  if (!text || !("speechSynthesis" in window)) {
    restoreVoiceActivityState();
    return;
  }
  const spokenText = options.alreadyLocalized ? text : localizeVoiceText(text);
  const utterance = new SpeechSynthesisUtterance(spokenText);
  utterance.lang = getVoiceSpeechLocale();
  utterance.rate = 0.95;
  utterance.pitch = 1;
  const preferredVoice = getPreferredSpeechVoice();
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.onstart = () => setVoiceActivityState("speaking", "SFM يتكلم");
  utterance.onend = () => restoreVoiceActivityState();
  utterance.onerror = () => restoreVoiceActivityState();
  window.speechSynthesis.cancel();
  setVoiceActivityState("speaking", "SFM يتكلم");
  window.speechSynthesis.speak(utterance);
}

function getLocalGreeting() {
  const hour = new Date().getHours();
  if (isEnglishLanguage()) {
    const honorificName = `Sir ${getUserDisplayName()}`;
    if (hour >= 5 && hour < 12) return `Good morning ${honorificName}. SFM is at your service. What shall we analyze today?`;
    if (hour >= 18 || hour < 5) return `Good evening ${honorificName}. SFM is at your service. What shall we do today?`;
    return `What would you like today, ${honorificName}? SFM is ready for analysis.`;
  }

  const honorificName = `يا سيدي ${getUserDisplayName()}`;
  if (hour >= 5 && hour < 12) return `صباح الخير ${honorificName}، SFM مساعدك تحت أمرك. شنو تبي نسوي اليوم؟`;
  if (hour >= 18 || hour < 5) return `مساء الخير ${honorificName}، SFM مساعدك تحت أمرك. شنو تبي نسوي اليوم؟`;
  return `ماذا تريد اليوم ${honorificName}؟ SFM جاهز للتحليل.`;
}

function calculateFinalScore(item) {
  const confidencePoints = clamp(Number(item.confidence || 0), 0, 100) * 0.31;
  const agreementPoints = clamp(Number(item.timeframeConsensus?.agreementPct || 0), 0, 100) * 0.14;
  const dataHealthPoints = clamp(Number(item.dataHealth?.score || 0), 0, 100) * 0.1;
  const shariaPoints = {
    compliant: 20,
    doubtful: 8,
    unknown: 4,
    not_compliant: 0
  }[item.shariaStatus] ?? 4;
  const riskPoints = {
    low: 15,
    medium: 9,
    high: 3
  }[item.risk?.level] ?? 8;
  const winRate = Number(item.backtest?.winRate);
  const backtestPoints = Number.isFinite(winRate) ? clamp(winRate * 0.1, 0, 10) : 4;
  const movePoints = clamp(Math.abs(Number(item.expectedMovePct || 0)) * 1.2, 0, 5);
  const qualityPoints = clamp(Number(item.analysisQuality?.score || 0), 0, 100) * 0.07;
  const riskRewardPoints = clamp(Number(item.riskReward || 0), 0, 3) * 2;
  const conflictPenalty = item.timeframeConsensus?.conflict ? 8 : 0;
  const lowDataPenalty = Number(item.dataHealth?.score || 100) < 55 ? 7 : 0;
  const score = Math.round(clamp(confidencePoints + agreementPoints + dataHealthPoints + shariaPoints + riskPoints + backtestPoints + movePoints + qualityPoints + riskRewardPoints - conflictPenalty - lowDataPenalty, 0, 100));
  const label = score >= 80 ? "قوي جداً" : score >= 70 ? "قوي" : score >= 55 ? "متوسط" : "ضعيف";

  return { score, label };
}

function getRecommendationLookup(items) {
  return new Map((items || []).map((item) => [item.symbol.toUpperCase(), item]));
}

function isTargetHit(action, currentPrice, expectedPrice) {
  const current = Number(currentPrice);
  const expected = Number(expectedPrice);
  if (!Number.isFinite(current) || !Number.isFinite(expected)) return false;
  if (action === "buy") return current >= expected;
  if (action === "sell") return current <= expected;
  return false;
}

function isStopHit(action, currentPrice, stopLoss) {
  const current = Number(currentPrice);
  const stop = Number(stopLoss);
  if (!Number.isFinite(current) || !Number.isFinite(stop)) return false;
  if (action === "buy") return current <= stop;
  if (action === "sell") return current >= stop;
  return false;
}

function getObservedReturnPct(action, entryPrice, currentPrice) {
  const entry = Number(entryPrice);
  const current = Number(currentPrice);
  if (!Number.isFinite(entry) || !Number.isFinite(current) || entry <= 0) return 0;
  const raw = ((current - entry) / entry) * 100;
  return action === "sell" ? -raw : raw;
}

function renderHistoryReturn(entry) {
  const value = getHistoryReturnPct(entry);
  const isFresh = Number.isFinite(Number(entry.lastPrice));
  const className = value >= 0 ? "profit" : "loss";
  const suffix = !isFresh && entry.outcome === "pending" ? " · بانتظار تحديث السعر" : "";
  return `<strong class="${className}">${formatPercent(value)}${suffix}</strong>`;
}

function getHistoryReturnPct(entry) {
  const entryPrice = Number(entry.entryPrice ?? entry.currentPrice);
  const lastPrice = Number(entry.lastPrice ?? entry.currentPrice);

  if (entry.outcome === "target" || entry.targetHit) {
    const target = Number(entry.target1 ?? entry.expectedPrice);
    if (Number.isFinite(target)) return getObservedReturnPct(entry.action, entryPrice, target);
  }

  if (entry.outcome === "stop" || entry.stopHit) {
    const stop = Number(entry.stopLoss);
    if (Number.isFinite(stop)) return getObservedReturnPct(entry.action, entryPrice, stop);
  }

  return getObservedReturnPct(entry.action, entryPrice, lastPrice);
}

function pickBestObservedPrice(action, existing, currentPrice) {
  const current = Number(currentPrice);
  const previous = Number(existing);
  if (!Number.isFinite(current)) return Number.isFinite(previous) ? previous : null;
  if (!Number.isFinite(previous)) return current;
  return action === "sell" ? Math.min(previous, current) : Math.max(previous, current);
}

function pickWorstObservedPrice(action, existing, currentPrice) {
  const current = Number(currentPrice);
  const previous = Number(existing);
  if (!Number.isFinite(current)) return Number.isFinite(previous) ? previous : null;
  if (!Number.isFinite(previous)) return current;
  return action === "sell" ? Math.max(previous, current) : Math.min(previous, current);
}

function getHistoryOutcomeLabel(entry) {
  if (entry.outcome === "target") return "وصل الهدف";
  if (entry.outcome === "stop") return "ضرب وقف الخسارة";
  return "تحت المتابعة";
}

function normalizeSymbol(value) {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9.^=-]/g, "")
    .slice(0, 18);

  return SYMBOL_ALIASES[raw] || raw;
}

function normalizeWatchlist(items) {
  return [...new Set((items || []).map(normalizeSymbol).filter(Boolean))].slice(0, 30);
}

function simplifyUnavailableReason(reason = "") {
  if (String(reason).includes("429")) {
    return "مزود البيانات رفض الطلب مؤقتاً بسبب كثرة التحديثات. انتظر ثواني أو فعّل القائمة الخاصة لعدد أقل من الرموز.";
  }

  if (String(reason).includes("لا توجد بيانات")) {
    return "الرمز غير متوفر عند مزود البيانات الحالي أو يحتاج صيغة مختلفة.";
  }

  return reason || "تعذر تحميل هذا الرمز حالياً.";
}

function loadStored(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);

    const legacyKey = key.startsWith(STORAGE_PREFIX)
      ? `${LEGACY_STORAGE_PREFIX}${key.slice(STORAGE_PREFIX.length)}`
      : null;

    if (legacyKey) {
      const legacyRaw = window.localStorage.getItem(legacyKey);
      if (legacyRaw !== null) {
        window.localStorage.setItem(key, legacyRaw);
        return JSON.parse(legacyRaw);
      }
    }

    return fallback;
  } catch {
    return fallback;
  }
}

function saveStored(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // التخزين المحلي قد يكون مغلقاً في بعض المتصفحات.
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setActiveMarketButton() {
  for (const button of marketTabs.querySelectorAll(".market-button")) {
    const isActive = button.dataset.market === activeMarket;
    button.classList.toggle("active", isActive);
  }
}

function setActiveShariaFilterButton() {
  for (const button of document.querySelectorAll(".sharia-filter-button")) {
    button.classList.toggle("active", button.dataset.shariaFilter === activeShariaFilter);
  }
}

function drawSparkline(canvas, values = [], action) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  context.scale(dpr, dpr);
  context.clearRect(0, 0, rect.width, rect.height);

  const data = values.filter(Number.isFinite);
  if (data.length < 2) return;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 10;
  const width = rect.width - pad * 2;
  const height = rect.height - pad * 2;

  context.strokeStyle = "rgba(135, 154, 172, 0.16)";
  context.lineWidth = 1;
  for (let index = 1; index <= 3; index += 1) {
    const y = pad + (height / 4) * index;
    context.beginPath();
    context.moveTo(pad, y);
    context.lineTo(rect.width - pad, y);
    context.stroke();
  }

  const lineColor = action === "sell" ? "#ff6b6b" : action === "hold" ? "#91a7ff" : "#65d98d";
  context.strokeStyle = lineColor;
  context.lineWidth = 2;
  context.beginPath();
  data.forEach((value, index) => {
    const x = pad + (index / (data.length - 1)) * width;
    const y = pad + height - ((value - min) / range) * height;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();

  context.fillStyle = lineColor;
  const last = data.at(-1);
  const x = pad + width;
  const y = pad + height - ((last - min) / range) * height;
  context.beginPath();
  context.arc(x, y, 3.5, 0, Math.PI * 2);
  context.fill();
}

function initMarketBackground() {
  const canvas = document.querySelector("#market-bg");
  const context = canvas.getContext("2d");
  const rows = Array.from({ length: 8 }, (_, index) => ({
    y: 80 + index * 92,
    phase: Math.random() * 100,
    speed: 0.35 + Math.random() * 0.45,
    color: index % 3 === 0 ? "53, 194, 164" : index % 3 === 1 ? "255, 107, 107" : "90, 167, 255"
  }));

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawGrid(context);

    for (const row of rows) {
      row.phase += row.speed;
      drawMarketLine(context, row);
      drawCandles(context, row);
    }

    window.requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  frame();
}

function drawGrid(context) {
  context.strokeStyle = "rgba(135, 154, 172, 0.055)";
  context.lineWidth = 1;

  for (let x = 0; x < window.innerWidth; x += 72) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, window.innerHeight);
    context.stroke();
  }

  for (let y = 0; y < window.innerHeight; y += 72) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(window.innerWidth, y);
    context.stroke();
  }
}

function drawMarketLine(context, row) {
  context.strokeStyle = `rgba(${row.color}, 0.22)`;
  context.lineWidth = 1.5;
  context.beginPath();

  for (let x = -20; x <= window.innerWidth + 20; x += 18) {
    const wave = Math.sin((x + row.phase * 3) * 0.012) * 18 + Math.cos((x - row.phase) * 0.027) * 9;
    const y = (row.y + row.phase * 0.12 + wave) % (window.innerHeight + 120);
    if (x === -20) context.moveTo(x, y);
    else context.lineTo(x, y);
  }

  context.stroke();
}

function drawCandles(context, row) {
  for (let x = ((row.phase * 7) % 90) - 90; x < window.innerWidth + 90; x += 90) {
    const mid = (row.y + Math.sin((x + row.phase) * 0.02) * 20) % (window.innerHeight + 120);
    const height = 18 + Math.abs(Math.sin((x + row.phase) * 0.04)) * 34;
    const up = Math.sin((x + row.phase) * 0.03) > 0;
    context.strokeStyle = up ? "rgba(101, 217, 141, 0.24)" : "rgba(255, 107, 107, 0.2)";
    context.fillStyle = up ? "rgba(101, 217, 141, 0.12)" : "rgba(255, 107, 107, 0.1)";
    context.beginPath();
    context.moveTo(x, mid - height * 0.65);
    context.lineTo(x, mid + height * 0.65);
    context.stroke();
    context.fillRect(x - 5, mid - height * 0.28, 10, height * 0.56);
  }
}

function formatMoney(value, currency) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "--";
  }

  const normalizedCurrency = normalizeCurrencyCode(currency);
  const digits = Math.abs(number) < 1 ? 4 : 2;
  return `${formatNumber(number, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}${normalizedCurrency ? ` ${normalizedCurrency}` : ""}`;
}

function normalizeCurrencyCode(currency) {
  const code = String(currency || "").trim().toUpperCase();
  const currencyMap = {
    KWF: "KWD",
    KW: "KWD",
    KWD: "KWD",
    SAR: "SAR",
    SA: "SAR",
    AED: "AED",
    AE: "AED",
    QAR: "QAR",
    QA: "QAR",
    BHD: "BHD",
    BH: "BHD",
    OMR: "OMR",
    OM: "OMR",
    USD: "USD",
    EUR: "EUR"
  };
  return currencyMap[code] || code;
}

function formatPercent(value) {
  const number = Number(value || 0);
  const prefix = number > 0 ? "+" : "";
  return `${prefix}${formatNumber(number, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat(NUMBER_LOCALE, {
    numberingSystem: "latn",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

function normalizeDateString(value) {
  const date = new Date(value || Date.now());
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function formatNumber(value, options = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return number.toLocaleString(NUMBER_LOCALE, {
    ...NUMBER_OPTIONS,
    ...options
  });
}

function formatCompactNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return number.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  });
}

async function fetchJson(url, options = {}) {
  const retries = Number.isFinite(options.retries) ? options.retries : 0;
  const retryDelayMs = Number.isFinite(options.retryDelayMs) ? options.retryDelayMs : 500;
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store", signal: options.signal });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || `تعذر تحميل البيانات (${response.status})`);
      }

      return data;
    } catch (error) {
      if (error?.name === "AbortError") throw error;

      lastError = error;
      if (attempt < retries) {
        await wait(retryDelayMs);
      }
    }
  }

  throw new Error(getFriendlyFetchError(lastError, options.fallbackMessage));
}

function getFriendlyFetchError(error, fallbackMessage = "تعذر الاتصال بالسيرفر. تأكد أن التطبيق يعمل ثم حاول مرة ثانية.") {
  const message = error?.message || "";

  if (!message || message === "Failed to fetch" || message.includes("NetworkError") || message.includes("Load failed")) {
    return fallbackMessage;
  }

  if (message.includes("Unexpected token") || message.includes("JSON")) {
    return "وصل رد غير مفهوم من السيرفر. حدث الصفحة وحاول مرة ثانية.";
  }

  return message;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}


/* SFM acceptance fixes: navigation, currency, trade history, market map, and useful empty states. */
const SFM_ACCEPTANCE_GLOBAL_SESSIONS = [
  { id: "new-york", cityAr: "نيويورك", cityEn: "New York", marketAr: "بورصة نيويورك وناسداك", marketEn: "NYSE / NASDAQ", zone: "America/New_York", open: "09:30", close: "16:00", weekend: ["Sat", "Sun"] },
  { id: "london", cityAr: "لندن", cityEn: "London", marketAr: "بورصة لندن", marketEn: "London Stock Exchange", zone: "Europe/London", open: "08:00", close: "16:30", weekend: ["Sat", "Sun"] },
  { id: "frankfurt", cityAr: "فرانكفورت", cityEn: "Frankfurt", marketAr: "بورصة فرانكفورت", marketEn: "Frankfurt Stock Exchange", zone: "Europe/Berlin", open: "09:00", close: "17:30", weekend: ["Sat", "Sun"] },
  { id: "kuwait", cityAr: "الكويت", cityEn: "Kuwait", marketAr: "بورصة الكويت", marketEn: "Boursa Kuwait", zone: "Asia/Kuwait", open: "09:00", close: "12:45", weekend: ["Fri", "Sat"] },
  { id: "riyadh", cityAr: "الرياض", cityEn: "Riyadh", marketAr: "تداول السعودية", marketEn: "Saudi Exchange", zone: "Asia/Riyadh", open: "10:00", close: "15:00", weekend: ["Fri", "Sat"] },
  { id: "dubai", cityAr: "دبي", cityEn: "Dubai", marketAr: "دبي وأبوظبي", marketEn: "DFM / ADX", zone: "Asia/Dubai", open: "10:00", close: "15:00", weekend: ["Sat", "Sun"] },
  { id: "tokyo", cityAr: "طوكيو", cityEn: "Tokyo", marketAr: "بورصة طوكيو", marketEn: "Tokyo Stock Exchange", zone: "Asia/Tokyo", open: "09:00", close: "15:00", weekend: ["Sat", "Sun"] },
  { id: "hong-kong", cityAr: "هونغ كونغ", cityEn: "Hong Kong", marketAr: "بورصة هونغ كونغ", marketEn: "Hong Kong Exchange", zone: "Asia/Hong_Kong", open: "09:30", close: "16:00", weekend: ["Sat", "Sun"] },
  { id: "sydney", cityAr: "سيدني", cityEn: "Sydney", marketAr: "البورصة الأسترالية", marketEn: "Australian Securities Exchange", zone: "Australia/Sydney", open: "10:00", close: "16:00", weekend: ["Sat", "Sun"] }
];

const SFM_ACCEPTANCE_TEXT_PAIRS = [
  ["Home", "الرئيسية"],
  ["Markets", "الأسواق"],
  ["Signals", "التوصيات"],
  ["Watchlist", "قائمة المراقبة"],
  ["Portfolio", "المحفظة"],
  ["Trade Log", "سجل الصفقات"],
  ["News", "الأخبار"],
  ["Calendar", "التقويم"],
  ["Education", "التعليم"],
  ["AI Analysis", "تحليل الذكاء الاصطناعي"],
  ["Settings", "الإعدادات"],
  ["Voice", "الصوت"],
  ["Scanning markets", "فحص الأسواق"],
  ["Connected markets", "الأسواق المتصلة"],
  ["Active signals", "التوصيات النشطة"],
  ["Risk status", "حالة المخاطر"],
  ["LIVE MARKET PULSE", "نبض السوق المباشر"],
  ["AI AGENT WORKFLOW", "سير عمل وكيل الذكاء الاصطناعي"],
  ["COMMAND CENTER", "مركز الأوامر"],
  ["OPPORTUNITY HEATMAP", "خريطة الفرص"],
  ["FOREXFACTORY NEWS RISK", "مخاطر الأخبار الاقتصادية"],
  ["SFM VOICE", "محادثة SFM"],
  ["Backtest", "اختبار الأداء"],
  ["Score", "النقاط"],
  ["Symbol", "الرمز"],
  ["Action", "الإجراء"],
  ["Entry", "الدخول"],
  ["Current price", "السعر الحالي"],
  ["Target", "الهدف"],
  ["Stop loss", "وقف الخسارة"],
  ["Confidence", "الثقة"],
  ["P/L", "الربح/الخسارة"],
  ["Status", "الحالة"],
  ["Date", "التاريخ"]
];

function sfmAcceptanceIsEnglish() {
  return typeof appState !== "undefined" && appState.language === "en";
}

normalizeCurrencyCode = function normalizeCurrencyCode(currency) {
  const code = String(currency || "").trim().toUpperCase();
  if (!code || code === "PAIR" || code === "MIXED" || code === "GCC") return "";
  const currencyMap = {
    KWF: "KWD",
    KW: "KWD",
    KWD: "KWD",
    SAR: "SAR",
    AED: "AED",
    QAR: "QAR",
    BHD: "BHD",
    OMR: "OMR",
    USD: "USD",
    USDT: "USD",
    USDC: "USD",
    EUR: "EUR",
    GBP: "GBP",
    JPY: "JPY",
    CHF: "CHF",
    CAD: "CAD",
    AUD: "AUD",
    CNY: "CNY",
    HKD: "HKD"
  };
  return currencyMap[code] || code;
}

function inferDisplayCurrencyFromSymbol(symbol) {
  const upper = String(symbol || "").trim().toUpperCase();
  if (!upper) return "";
  if (upper.endsWith("=X")) return "";
  if (upper.endsWith("-USD") || upper.endsWith("USDT") || upper.endsWith("USDC")) return "USD";
  if (upper.endsWith("=F")) return "USD";
  if (upper.endsWith(".KW")) return "KWD";
  if (upper.endsWith(".SR")) return "SAR";
  if (upper.endsWith(".AE") || upper.endsWith(".AD") || upper.endsWith(".DU")) return "AED";
  if (upper.endsWith(".QA")) return "QAR";
  if (upper.endsWith(".BH")) return "BHD";
  if (upper.endsWith(".OM")) return "OMR";
  if (upper.endsWith(".AS") || upper.endsWith(".DE") || upper.endsWith(".PA") || upper.endsWith(".SW") || upper.endsWith(".L")) return "EUR";
  return "USD";
}

function normalizeDisplayCurrency(currency, symbol) {
  return normalizeCurrencyCode(currency) || inferDisplayCurrencyFromSymbol(symbol);
}

formatMoney = function formatMoney(value, currency) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return sfmAcceptanceIsEnglish() ? "Unavailable" : "غير متاح";
  const normalizedCurrency = normalizeCurrencyCode(currency);
  const locale = sfmAcceptanceIsEnglish() ? "en-US" : "ar-KW";
  const fractionDigits = Math.abs(numeric) >= 1000 ? 2 : 3;
  if (!normalizedCurrency) {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(numeric);
  }
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: fractionDigits
    }).format(numeric);
  } catch (error) {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(numeric)} ${normalizedCurrency}`;
  }
}

renderHistory = function renderHistory() {
  if (!historyList) return;
  if (typeof renderAccuracyDashboard === "function") renderAccuracyDashboard();
  const groups = getHistoryGroups();
  historyList.innerHTML = groups.map(renderHistoryGroup).join("");
  for (const button of historyList.querySelectorAll("[data-follow-trade]")) {
    button.addEventListener("click", () => toggleFollowTrade(button.dataset.followTrade));
  }
}

getHistoryGroups = function getHistoryGroups() {
  const values = Array.isArray(recommendationHistory) ? recommendationHistory : [];
  const sorted = values.slice().sort((a, b) => sfmTradeTimestamp(b) - sfmTradeTimestamp(a));
  const isWaitingTrade = (entry) => entry?.outcome === "pending" && (entry?.marketClosed || String(entry?.action || "").toLowerCase() === "hold" || !Number.isFinite(Number(entry?.lastPrice ?? entry?.currentPrice)));
  const isActiveTrade = (entry) => entry?.outcome === "pending" && !isWaitingTrade(entry);
  const groups = [
    {
      key: "winning",
      titleAr: "الصفقات الرابحة",
      titleEn: "Winning trades",
      hintAr: "الصفقات التي وصلت إلى الهدف أو حققت ربحا مؤكدا.",
      hintEn: "Trades that reached target or locked a positive result.",
      items: sorted.filter((entry) => entry?.outcome === "target").slice(0, 24)
    },
    {
      key: "losing",
      titleAr: "الصفقات الخاسرة",
      titleEn: "Losing trades",
      hintAr: "الصفقات التي وصلت إلى وقف الخسارة أو أغلقت بخسارة.",
      hintEn: "Trades that hit stop loss or closed negative.",
      items: sorted.filter((entry) => entry?.outcome === "stop").slice(0, 24)
    },
    {
      key: "waiting",
      titleAr: "صفقات الانتظار",
      titleEn: "Waiting trades",
      hintAr: "إعدادات لا تزال بانتظار تفعيل السعر أو افتتاح السوق.",
      hintEn: "Setups still waiting for trigger price or market open.",
      items: sorted.filter(isWaitingTrade).slice(0, 24)
    },
    {
      key: "followed",
      titleAr: "صفقات تحت المتابعة",
      titleEn: "Trades under watch",
      hintAr: "صفقات نشطة أو مثبتة للمتابعة المستمرة.",
      hintEn: "Active or pinned trades that remain under monitoring.",
      items: sorted.filter((entry) => followedTradeKeys?.has?.(entry?.key) || isActiveTrade(entry)).slice(0, 24)
    }
  ];
  return groups;
}

renderHistoryGroup = function renderHistoryGroup(group) {
  const english = sfmAcceptanceIsEnglish();
  const title = english ? group.titleEn : group.titleAr;
  const hint = english ? group.hintEn : group.hintAr;
  const empty = english ? "No trades in this section yet. The provider status and supported symbols remain available in market views." : "لا توجد صفقات في هذا القسم حاليا. تظهر حالة المزود والرموز المدعومة داخل صفحات الأسواق.";
  return `
    <section class="history-group-card history-${group.key}">
      <div class="history-group-head">
        <div>
          <h3>${title}</h3>
          <p>${hint}</p>
        </div>
        <span class="history-count">${group.items.length}</span>
      </div>
      <div class="history-table-head" role="row">
        <span>${english ? "Symbol" : "الرمز"}</span>
        <span>${english ? "Action" : "الإجراء"}</span>
        <span>${english ? "Entry" : "الدخول"}</span>
        <span>${english ? "Current price" : "السعر الحالي"}</span>
        <span>${english ? "Target" : "الهدف"}</span>
        <span>${english ? "Stop loss" : "وقف الخسارة"}</span>
        <span>${english ? "Confidence" : "الثقة"}</span>
        <span>${english ? "P/L" : "الربح/الخسارة"}</span>
        <span>${english ? "Status" : "الحالة"}</span>
        <span>${english ? "Date" : "التاريخ"}</span>
      </div>
      <div class="history-group-list">
        ${group.items.length ? group.items.map(renderHistoryItem).join("") : `<div class="history-empty-state">${empty}</div>`}
      </div>
    </section>`;
}

renderHistoryItem = function renderHistoryItem(entry) {
  const symbol = escapeHtml(entry?.symbol || "-");
  const action = sfmFormatTradeAction(entry?.action, entry?.actionLabel);
  const currency = normalizeDisplayCurrency(entry?.currency, entry?.symbol);
  const entryPrice = sfmFormatHistoryMoney(entry?.entryPrice ?? entry?.entry ?? entry?.currentPrice, currency);
  const currentPrice = sfmFormatHistoryMoney(entry?.lastPrice ?? entry?.currentPrice, currency);
  const target = sfmFormatHistoryMoney(entry?.target1 ?? entry?.expectedPrice, currency);
  const stop = sfmFormatHistoryMoney(entry?.stopLoss, currency);
  const confidence = Number.isFinite(Number(entry?.confidence)) ? `${Math.round(Number(entry.confidence))}%` : "-";
  const pnlValue = typeof getHistoryReturnPct === "function" ? Number(getHistoryReturnPct(entry)) : Number(entry?.returnPct);
  const pnl = Number.isFinite(pnlValue) ? `${pnlValue >= 0 ? "+" : ""}${pnlValue.toFixed(2)}%` : "-";
  const pnlClass = Number.isFinite(pnlValue) ? (pnlValue >= 0 ? "is-profit" : "is-loss") : "";
  const status = sfmFormatTradeStatus(entry);
  const date = sfmFormatTradeDate(entry);
  const key = escapeHtml(entry?.key || entry?.symbol || "");
  return `
    <article class="history-item history-row" role="row">
      <strong class="history-symbol">${symbol}</strong>
      <span>${action}</span>
      <span>${entryPrice}</span>
      <span>${currentPrice}</span>
      <span>${target}</span>
      <span>${stop}</span>
      <span>${confidence}</span>
      <span class="${pnlClass}">${pnl}</span>
      <span>${status}</span>
      <time>${date}</time>
      <button class="follow-trade-button ${followedTradeKeys.has(entry?.key) ? "is-following" : ""}" type="button" data-follow-trade="${key}">${followedTradeKeys.has(entry?.key) ? (sfmAcceptanceIsEnglish() ? "Unfollow" : "إيقاف المتابعة") : (sfmAcceptanceIsEnglish() ? "Follow" : "تابع")}</button>
    </article>`;
}

function sfmTradeTimestamp(entry) {
  const date = entry?.hitAt || entry?.stopAt || entry?.lastSeen || entry?.firstSeen || entry?.timestamp || entry?.date || 0;
  const timestamp = Number(new Date(date));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function sfmFormatHistoryMoney(value, currency) {
  if (!Number.isFinite(Number(value))) return sfmAcceptanceIsEnglish() ? "Unavailable" : "غير متاح";
  return formatMoney(value, currency);
}

function sfmFormatTradeAction(action, actionLabel) {
  const english = sfmAcceptanceIsEnglish();
  const normalized = String(action || "").toLowerCase();
  const ar = { buy: "شراء", sell: "بيع", hold: "انتظار", watch: "متابعة" };
  const en = { buy: "Buy", sell: "Sell", hold: "Wait", watch: "Watch" };
  return (english ? en[normalized] : ar[normalized]) || escapeHtml(actionLabel || (english ? "Watch" : "متابعة"));
}

function sfmFormatTradeStatus(entry) {
  const english = sfmAcceptanceIsEnglish();
  if (entry?.outcome === "target" || Number(entry?.returnPct) > 0) return english ? "Won" : "رابحة";
  if (entry?.outcome === "stop" || Number(entry?.returnPct) < 0) return english ? "Lost" : "خاسرة";
  if (entry?.marketClosed) return english ? "Waiting for market" : "بانتظار السوق";
  if (String(entry?.action || "").toLowerCase() === "hold") return english ? "Waiting" : "انتظار";
  return english ? "Under watch" : "تحت المتابعة";
}

function sfmFormatTradeDate(entry) {
  const timestamp = sfmTradeTimestamp(entry);
  if (!timestamp) return "-";
  const locale = sfmAcceptanceIsEnglish() ? "en-US" : "ar-KW";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
}

function ensureAcceptanceNavigation() {
  const nav = document.querySelector(".desktop-trading-rail nav");
  if (!nav) return;
  const aiLink = nav.querySelector('[data-nav-key="tools"], [href="#command-center-section"]');
  if (aiLink) {
    aiLink.dataset.navKey = "ai-analysis";
    aiLink.setAttribute("href", "#command-center-section");
  }
  const calendarLink = nav.querySelector('[data-nav-key="calendar"]');
  if (calendarLink) calendarLink.setAttribute("href", "#calendar-section");
  const voiceLink = nav.querySelector('[data-nav-key="voice"]');
  if (voiceLink) voiceLink.setAttribute("href", "#voice-section");
  const settingsButton = nav.querySelector("#rail-settings-button, #settings-rail-button");
  if (settingsButton) settingsButton.dataset.navKey = "settings";
  if (!nav.querySelector('[data-nav-key="education"]')) {
    const educationLink = document.createElement("a");
    educationLink.className = "rail-link";
    educationLink.href = "#education-section";
    educationLink.dataset.navKey = "education";
    educationLink.innerHTML = '<span aria-hidden="true">◈</span><b>التعليم</b>';
    nav.insertBefore(educationLink, settingsButton || null);
  }
  if (typeof syncNavigationLanguage === "function") syncNavigationLanguage();
}

function ensureAcceptanceSections() {
  const marketHours = document.querySelector(".market-hours-band");
  if (marketHours && !marketHours.id) marketHours.id = "calendar-section";
  ensureEducationSection();
  ensureProfessionalMarketMap();
  applyAcceptanceLanguage();
}

function ensureEducationSection() {
  if (document.querySelector("#education-section")) return;
  const section = document.createElement("section");
  section.id = "education-section";
  section.className = "education-band app-section";
  const english = sfmAcceptanceIsEnglish();
  section.innerHTML = `
    <div class="section-heading">
      <span>${english ? "TRADING EDUCATION" : "التعليم التداولي"}</span>
      <h2>${english ? "Practical playbooks for disciplined trading" : "دروس عملية لبناء قرار تداول منضبط"}</h2>
      <p>${english ? "Concise guides for risk, session timing, signal validation, and portfolio discipline." : "إرشادات مختصرة لإدارة المخاطر وتوقيت الجلسات والتحقق من التوصيات وانضباط المحفظة."}</p>
    </div>
    <div class="education-grid">
      ${[
        [english ? "Risk first" : "المخاطر أولا", english ? "Size positions before reading upside. Every signal must have stop loss, invalidation, and max exposure." : "حدد حجم الصفقة قبل النظر إلى الربح المتوقع. كل توصية تحتاج وقف خسارة ونقطة إلغاء وحد تعرض واضح."],
        [english ? "Session timing" : "توقيت الجلسات", english ? "Match liquidity to the asset. Gulf equities, US stocks, forex, crypto, and commodities do not share one clock." : "اربط السيولة بالسوق الصحيح. أسهم الخليج والأسهم الأمريكية والفوركس والعملات الرقمية والسلع لا تعمل بتوقيت واحد."],
        [english ? "Signal checklist" : "قائمة فحص التوصية", english ? "Confirm trend, entry, target, stop, confidence, provider status, and event risk before acting." : "تحقق من الاتجاه والدخول والهدف ووقف الخسارة والثقة وحالة المزود ومخاطر الأخبار قبل التنفيذ."],
        [english ? "Review loop" : "دورة المراجعة", english ? "Track winners, losers, waiting trades, and watched setups to improve the strategy instead of chasing alerts." : "تابع الرابحة والخاسرة والمنتظرة وتحت المتابعة لتحسين الاستراتيجية بدلا من مطاردة التنبيهات."]
      ].map(([title, body]) => `<article><strong>${title}</strong><p>${body}</p></article>`).join("")}
    </div>`;
  const anchor = document.querySelector("#voice-section") || document.querySelector("#temporary-legal-notices") || document.body.lastElementChild;
  anchor?.parentNode?.insertBefore(section, anchor);
}

function applyAcceptanceLanguage() {
  const english = sfmAcceptanceIsEnglish();
  const pairs = SFM_ACCEPTANCE_TEXT_PAIRS;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;
    const pair = pairs.find(([en, ar]) => trimmed === en || trimmed === ar);
    if (!pair) return;
    const replacement = english ? pair[0] : pair[1];
    node.nodeValue = original.replace(trimmed, replacement);
  });
  ensureAcceptanceNavigationLabels();
}

function ensureAcceptanceNavigationLabels() {
  const english = sfmAcceptanceIsEnglish();
  const labels = {
    home: ["Home", "الرئيسية"],
    markets: ["Markets", "الأسواق"],
    recommendations: ["Signals", "التوصيات"],
    favorites: ["Watchlist", "قائمة المراقبة"],
    portfolio: ["Portfolio", "المحفظة"],
    trades: ["Trade Log", "سجل الصفقات"],
    news: ["News", "الأخبار"],
    calendar: ["Calendar", "التقويم"],
    "ai-analysis": ["AI Analysis", "تحليل الذكاء الاصطناعي"],
    education: ["Education", "التعليم"],
    settings: ["Settings", "الإعدادات"],
    voice: ["Voice", "الصوت"]
  };
  document.querySelectorAll(".rail-link[data-nav-key]").forEach((link) => {
    const label = labels[link.dataset.navKey]?.[english ? 0 : 1];
    if (!label) return;
    const text = link.querySelector("b");
    if (text) text.textContent = label;
    link.setAttribute("title", label);
    link.dataset.tooltip = label;
  });
}

function ensureProfessionalMarketMap() {
  const map = document.querySelector(".ai-world-map");
  if (!map || map.dataset.acceptanceMapReady === "true") return;
  map.dataset.acceptanceMapReady = "true";
  map.classList.add("terminal-session-map");
  map.innerHTML = `
    <svg class="session-route-layer" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
      <path class="session-route route-main" d="M95 190 C245 80 360 95 485 190 S715 320 900 160" />
      <path class="session-route route-gcc" d="M430 225 C485 170 565 165 640 205" />
      <path class="session-route route-asia" d="M620 210 C715 120 810 115 925 245" />
      <path class="session-route route-us" d="M95 190 C185 260 275 275 370 218" />
    </svg>
    <div class="session-map-grid" aria-label="${sfmAcceptanceIsEnglish() ? "Global trading sessions" : "جلسات التداول العالمية"}">
      ${SFM_ACCEPTANCE_GLOBAL_SESSIONS.map((session) => `<button class="session-node node-${session.id}" type="button" data-session-node="${session.id}"><span>${sfmAcceptanceIsEnglish() ? session.cityEn : session.cityAr}</span><small>${sfmAcceptanceIsEnglish() ? session.marketEn : session.marketAr}</small></button>`).join("")}
    </div>
    <div id="global-session-cards" class="global-session-cards"></div>`;
}

function renderGlobalSessionCards(now = new Date()) {
  ensureProfessionalMarketMap();
  const container = document.querySelector("#global-session-cards");
  if (!container) return;
  const english = sfmAcceptanceIsEnglish();
  const states = SFM_ACCEPTANCE_GLOBAL_SESSIONS.map((session) => ({ ...session, ...sfmGetSessionState(session, now) }));
  const openCount = states.filter((session) => session.openNow).length;
  container.innerHTML = `
    <div class="global-session-summary">
      <strong>${english ? "Global market sessions" : "جلسات الأسواق العالمية"}</strong>
      <span>${english ? `${openCount} active now` : `${openCount} جلسات نشطة الآن`}</span>
    </div>
    <div class="global-session-card-grid">
      ${states.map((session) => `
        <article class="global-session-card ${session.openNow ? "is-open" : "is-closed"}" data-session-card="${session.id}">
          <div>
            <strong>${english ? session.cityEn : session.cityAr}</strong>
            <span>${english ? session.marketEn : session.marketAr}</span>
          </div>
          <b>${session.openNow ? (english ? "Open" : "مفتوحة") : (english ? "Closed" : "مغلقة")}</b>
          <small>${session.localTime} · ${session.open}-${session.close}</small>
        </article>`).join("")}
    </div>`;
  states.forEach((session) => {
    const node = document.querySelector(`[data-session-node="${session.id}"]`);
    if (!node) return;
    node.classList.toggle("is-open", session.openNow);
    node.classList.toggle("is-closed", !session.openNow);
  });
}

function sfmGetSessionState(session, now) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: session.zone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]));
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const open = sfmTimeToMinutes(session.open);
  const close = sfmTimeToMinutes(session.close);
  const openNow = !session.weekend.includes(parts.weekday) && minutes >= open && minutes <= close;
  const display = new Intl.DateTimeFormat(sfmAcceptanceIsEnglish() ? "en-US" : "ar-KW", {
    timeZone: session.zone,
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);
  return { openNow, localTime: display };
}

function sfmTimeToMinutes(value) {
  const [hour, minute] = String(value).split(":").map(Number);
  return hour * 60 + minute;
}

document.addEventListener("DOMContentLoaded", () => {
  ensureAcceptanceNavigation();
  ensureAcceptanceSections();
  renderGlobalSessionCards(new Date());
  if (typeof renderHistory === "function") renderHistory();
  window.setInterval(() => renderGlobalSessionCards(new Date()), 60000);
  document.addEventListener("change", (event) => {
    if (event.target?.matches?.("#preferred-language, [name='language'], [data-language-option]")) {
      window.setTimeout(() => {
        ensureEducationSection();
        applyAcceptanceLanguage();
        renderGlobalSessionCards(new Date());
        if (typeof renderHistory === "function") renderHistory();
      }, 0);
    }
  });
});

/* SFM mobile fixes: real market overview timeframe controls and compact mobile cards. */
const SFM_MARKET_OVERVIEW_TIMEFRAMES = [
  { id: "ALL", labelAr: "كل الجلسات", labelEn: "All sessions", pulse: 1, routeClass: "range-all" },
  { id: "1Y", labelAr: "سنة واحدة", labelEn: "1 year", pulse: 0.9, routeClass: "range-year" },
  { id: "1M", labelAr: "شهر واحد", labelEn: "1 month", pulse: 1.05, routeClass: "range-month" },
  { id: "1W", labelAr: "أسبوع واحد", labelEn: "1 week", pulse: 1.15, routeClass: "range-week" },
  { id: "1D", labelAr: "يوم واحد", labelEn: "1 day", pulse: 1.3, routeClass: "range-day" }
];
let sfmMarketOverviewTimeframe = "ALL";

function sfmGetMarketOverviewTimeframe(id = sfmMarketOverviewTimeframe) {
  return SFM_MARKET_OVERVIEW_TIMEFRAMES.find((item) => item.id === id) || SFM_MARKET_OVERVIEW_TIMEFRAMES[0];
}

function sfmSetMarketOverviewTimeframe(id) {
  const next = sfmGetMarketOverviewTimeframe(id).id;
  if (sfmMarketOverviewTimeframe === next) {
    sfmSyncMarketOverviewTimeframeState();
    return;
  }
  sfmMarketOverviewTimeframe = next;
  sfmSyncMarketOverviewTimeframeState();
  renderGlobalSessionCards(new Date());
}

function sfmRenderMarketOverviewToolbar() {
  const english = sfmAcceptanceIsEnglish();
  return `
    <div class="market-overview-toolbar" aria-label="${english ? "Market overview timeframe" : "إطار عرض خريطة السوق"}">
      <div class="market-overview-title">
        <span>${english ? "Market overview" : "نظرة السوق"}</span>
        <strong id="market-overview-timeframe-label">${english ? "All sessions" : "كل الجلسات"}</strong>
      </div>
      <div class="market-timeframe-controls" role="group" aria-label="${english ? "Select timeframe" : "اختيار الإطار الزمني"}">
        ${SFM_MARKET_OVERVIEW_TIMEFRAMES.map((item) => `
          <button class="market-timeframe-button" type="button" data-market-timeframe="${item.id}" aria-pressed="false" aria-label="${english ? item.labelEn : item.labelAr}">${item.id}</button>
        `).join("")}
      </div>
    </div>`;
}

function sfmSyncMarketOverviewTimeframeState() {
  const overview = document.querySelector(".ai-global-overview");
  const map = document.querySelector(".terminal-session-map, .ai-world-map");
  const current = sfmGetMarketOverviewTimeframe();
  const english = sfmAcceptanceIsEnglish();
  if (overview) {
    overview.dataset.timeframe = current.id;
    overview.style.setProperty("--session-pulse-scale", String(current.pulse));
  }
  if (map) {
    map.dataset.timeframe = current.id;
    map.classList.remove(...SFM_MARKET_OVERVIEW_TIMEFRAMES.map((item) => item.routeClass));
    map.classList.add(current.routeClass);
  }
  const label = document.querySelector("#market-overview-timeframe-label");
  if (label) label.textContent = english ? current.labelEn : current.labelAr;
  document.querySelectorAll("[data-market-timeframe]").forEach((button) => {
    const active = button.dataset.marketTimeframe === current.id;
    const option = sfmGetMarketOverviewTimeframe(button.dataset.marketTimeframe);
    button.classList.toggle("active", active);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", english ? option.labelEn : option.labelAr);
    button.title = english ? option.labelEn : option.labelAr;
  });
}

const sfmPreviousEnsureProfessionalMarketMap = ensureProfessionalMarketMap;
ensureProfessionalMarketMap = function ensureProfessionalMarketMap() {
  sfmPreviousEnsureProfessionalMarketMap();
  const overview = document.querySelector(".ai-global-overview");
  if (!overview) return;
  overview.classList.add("market-overview-panel");
  if (!overview.querySelector(".market-overview-toolbar")) {
    overview.insertAdjacentHTML("afterbegin", sfmRenderMarketOverviewToolbar());
  }
  sfmSyncMarketOverviewTimeframeState();
};

renderGlobalSessionCards = function renderGlobalSessionCards(now = new Date()) {
  ensureProfessionalMarketMap();
  const container = document.querySelector("#global-session-cards");
  if (!container) return;
  const english = sfmAcceptanceIsEnglish();
  const current = sfmGetMarketOverviewTimeframe();
  const states = SFM_ACCEPTANCE_GLOBAL_SESSIONS.map((session) => ({ ...session, ...sfmGetSessionState(session, now) }));
  const openCount = states.filter((session) => session.openNow).length;
  container.innerHTML = `
    <div class="global-session-summary">
      <strong>${english ? "Global market sessions" : "جلسات الأسواق العالمية"}</strong>
      <span>${english ? `${openCount} active now · ${current.labelEn}` : `${openCount} جلسات نشطة الآن · ${current.labelAr}`}</span>
    </div>
    <div class="global-session-card-grid">
      ${states.map((session) => `
        <article class="global-session-card ${session.openNow ? "is-open" : "is-closed"}" data-session-card="${session.id}">
          <div>
            <strong>${english ? session.cityEn : session.cityAr}</strong>
            <span>${english ? session.marketEn : session.marketAr}</span>
          </div>
          <b>${session.openNow ? (english ? "Open" : "مفتوحة") : (english ? "Closed" : "مغلقة")}</b>
          <small>${session.localTime} · ${session.open}-${session.close}</small>
        </article>`).join("")}
    </div>`;
  states.forEach((session) => {
    const node = document.querySelector(`[data-session-node="${session.id}"]`);
    if (!node) return;
    node.classList.toggle("is-open", session.openNow);
    node.classList.toggle("is-closed", !session.openNow);
  });
  sfmSyncMarketOverviewTimeframeState();
};

renderMiniSignalCard = function renderMiniSignalCard(item) {
  const english = sfmAcceptanceIsEnglish();
  const score = calculateFinalScore(item);
  const statusClass = item.action === "sell" ? "sell" : item.action === "hold" ? "hold" : "buy";
  const visual = getPremiumAssetVisual(item);
  const actionLabel = localizeUiText(item.actionLabel || (item.action === "buy" ? "شراء" : item.action === "sell" ? "بيع" : "انتظار"));
  const confidenceLabel = english ? `${formatNumber(item.confidence)}% confidence` : `${formatNumber(item.confidence)}% ثقة`;
  const scoreLabel = english ? `Score ${formatNumber(score.score)}%` : `النقاط ${formatNumber(score.score)}%`;

  return `
    <article class="mini-card watch-card" data-symbol="${escapeHtml(item.symbol)}" role="link" tabindex="0" aria-label="${escapeHtml(item.symbol)} ${escapeHtml(actionLabel)}">
      <div class="watch-card-head">
        <span class="asset-logo mini-asset-logo ${visual.className}" aria-hidden="true">${visual.html}</span>
        <div class="watch-card-title">
          <strong>${escapeHtml(item.symbol)}</strong>
          <span>${escapeHtml(item.name || item.symbol)}</span>
        </div>
        <em class="status-pill-mini ${statusClass}">${escapeHtml(actionLabel)}</em>
      </div>
      <div class="watch-card-price">
        <span>${english ? "Current price" : "السعر الحالي"}</span>
        <strong>${formatMoney(item.currentPrice, item.currency)}</strong>
        <b>${escapeHtml(confidenceLabel)}</b>
      </div>
      <div class="mini-meta watch-card-meta">
        <em class="score-pill">${escapeHtml(scoreLabel)}</em>
        <em class="score-pill">${english ? "Target" : "الهدف"} ${formatMoney(item.expectedPrice, item.currency)}</em>
      </div>
    </article>
  `;
};

document.addEventListener("click", (event) => {
  const button = event.target?.closest?.("[data-market-timeframe]");
  if (!button) return;
  event.preventDefault();
  sfmSetMarketOverviewTimeframe(button.dataset.marketTimeframe);
});

document.addEventListener("DOMContentLoaded", () => {
  ensureProfessionalMarketMap();
  sfmSyncMarketOverviewTimeframeState();
  renderGlobalSessionCards(new Date());
});

/* SFM mobile compact recommendation behavior. */
setupSignalCardToggle = function setupSignalCardToggle(card, item) {
  const button = card.querySelector(".card-toggle");
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const isCollapsed = isMobile ? true : !expandedSignalCards.has(item.symbol);
  setSignalCardCollapsed(card, isCollapsed);

  button?.addEventListener("click", (event) => {
    event.stopPropagation();
    const shouldCollapse = !card.classList.contains("is-collapsed");

    if (shouldCollapse) {
      expandedSignalCards.delete(item.symbol);
    } else {
      expandedSignalCards.add(item.symbol);
    }

    saveStored("the-sfm-trader-expanded-cards", [...expandedSignalCards]);
    setSignalCardCollapsed(card, shouldCollapse);

    if (!shouldCollapse) {
      drawSparkline(card.querySelector(".sparkline"), item.sparkline, item.action);
    }
  });
};

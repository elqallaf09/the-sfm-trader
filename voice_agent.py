import json
import re
import sys
from datetime import datetime


if hasattr(sys.stdin, "reconfigure"):
    sys.stdin.reconfigure(encoding="utf-8")
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


SYMBOL_ALIASES = {
    "microsoft": "MSFT",
    "مايكروسوفت": "MSFT",
    "msft": "MSFT",
    "apple": "AAPL",
    "ابل": "AAPL",
    "آبل": "AAPL",
    "aapl": "AAPL",
    "google": "GOOGL",
    "قوقل": "GOOGL",
    "جوجل": "GOOGL",
    "googl": "GOOGL",
    "amazon": "AMZN",
    "امازون": "AMZN",
    "أمازون": "AMZN",
    "amzn": "AMZN",
    "tesla": "TSLA",
    "تسلا": "TSLA",
    "tsla": "TSLA",
    "nvidia": "NVDA",
    "نفيديا": "NVDA",
    "nvda": "NVDA",
    "amd": "AMD",
    "meta": "META",
    "ميتا": "META",
    "bitcoin": "BTC-USD",
    "بتكوين": "BTC-USD",
    "بيتكوين": "BTC-USD",
    "btc": "BTC-USD",
    "ethereum": "ETH-USD",
    "ايثيريوم": "ETH-USD",
    "إيثيريوم": "ETH-USD",
    "eth": "ETH-USD",
    "solana": "SOL-USD",
    "سولانا": "SOL-USD",
    "sol": "SOL-USD",
    "gold": "GC=F",
    "ذهب": "GC=F",
    "silver": "SI=F",
    "فضه": "SI=F",
    "فضة": "SI=F",
    "oil": "CL=F",
    "wti": "CL=F",
    "نفط": "CL=F",
    "brent": "BZ=F",
    "برنت": "BZ=F",
    "gas": "NG=F",
    "غاز": "NG=F",
    "coffee": "KC=F",
    "قهوه": "KC=F",
    "قهوة": "KC=F",
    "cocoa": "CC=F",
    "كاكاو": "CC=F",
    "ككاو": "CC=F",
    "lilly": "LLY",
    "eli lilly": "LLY",
    "pfizer": "PFE",
    "moderna": "MRNA",
    "johnson": "JNJ",
    "johnson johnson": "JNJ",
    "merck": "MRK",
    "abbvie": "ABBV",
    "amgen": "AMGN",
    "gilead": "GILD",
    "unitedhealth": "UNH",
    "medtronic": "MDT",
    "stryker": "SYK",
}


def main():
    raw = sys.stdin.read()
    payload = json.loads(raw or "{}")
    transcript = str(payload.get("transcript", ""))
    recommendations = payload.get("recommendations") or []
    active_market = payload.get("activeMarket") or ""

    result = handle_command(transcript, recommendations, active_market)
    print(json.dumps(result, ensure_ascii=False))


def handle_command(transcript, recommendations, active_market):
    clean = normalize(transcript)
    symbol = find_symbol(clean)
    monitor = wants_monitor(clean)

    if is_wake_only(clean):
        return {
            "intent": "greeting",
            "reply": greeting(),
            "listen": True,
        }

    if symbol and any(word in clean for word in ["سعر", "حلل", "تحليل", "شارت", "راقب", "تابع", "microsoft", "مايكروسوفت"]):
        return {
            "intent": "asset_lookup",
            "symbol": symbol,
            "monitor": monitor,
            "openDetail": True,
            "reply": f"تمام يا سيدي، أحلل لك {symbol} الآن.",
        }

    if any(phrase in clean for phrase in ["اكثر سهم تداول", "اكثر تداول", "الأكثر تداول", "حجم التداول", "اعلى تداول", "أعلى تداول", "سيوله", "سيولة"]):
        return most_traded(recommendations)

    if wants_sharia(clean):
        return best_sharia(recommendations)

    if any(word in clean for word in ["تصعد", "صعود", "ترتفع", "شهر", "شهرين", "ثلاث", "3"]):
        return monthly_upside(recommendations)

    if any(word in clean for word in ["ابيع", "أبيع", "بيعه", "بيع", "اخرج"]):
        return best_action(recommendations, "sell")

    if any(
        phrase in clean
        for phrase in [
            "اشتري",
            "شراء",
            "فرصه",
            "ادخل",
            "افضل سهم",
            "افضل فرصه",
            "افضل شراء",
            "اقوي سهم",
            "اقوي فرصه",
            "سهم اليوم",
            "ترشح",
            "تنصحني",
        ]
    ):
        return best_action(recommendations, "buy")

    if symbol:
        return {
            "intent": "asset_lookup",
            "symbol": symbol,
            "monitor": monitor,
            "openDetail": True,
            "reply": f"لقيت الرمز {symbol}. راح أفتح لك التحليل التفصيلي.",
        }

    return {
        "intent": "unknown",
        "reply": "سمعتك يا سيدي. قل لي مثلاً: شنو أشتري اليوم، شنو أبيع، أكثر سهم تداول اليوم، أو حلل سهم Microsoft.",
        "listen": True,
    }


def best_action(recommendations, action):
    candidates = [item for item in recommendations if item.get("action") == action]
    if not candidates:
        return best_available(recommendations, action)

    item = pick_best(candidates)
    action_text = "شراء" if action == "buy" else "بيع"
    return {
        "intent": f"best_{action}",
        "symbol": item.get("symbol"),
        "reply": (
            f"أقوى فرصة {action_text} الآن هي {item.get('name') or item.get('symbol')}، "
            f"الرمز {item.get('symbol')}. الثقة {pct(item.get('confidence'))}، "
            f"السعر الحالي {money(item.get('currentPrice'), item.get('currency'))}، "
            f"والهدف الأول {money(item.get('target1') or item.get('expectedPrice'), item.get('currency'))} "
            f"خلال {item.get('duration') or 'مدة قصيرة'}. "
            f"وقف الخسارة {money(item.get('stopLoss'), item.get('currency'))}. "
            "تأكد من إدارة المخاطر قبل أي قرار."
        ),
    }


def best_sharia(recommendations):
    compliant = [item for item in recommendations if item.get("shariaStatus") == "compliant"]
    if not compliant:
        return {
            "intent": "best_sharia",
            "reply": "ما لقيت سهم مصنف مطابق للشريعة في السوق الحالي. اختار السوق الأمريكي أو حدّث بيانات التصنيف الشرعي.",
            "noCandidates": True,
        }

    buy_candidates = [item for item in compliant if item.get("action") == "buy"]
    item = pick_best(buy_candidates or compliant)
    action_label = item.get("actionLabel") or item.get("action") or "مراقبة"
    intro = "أفضل سهم شرعي للشراء الآن هو" if item.get("action") == "buy" else "أفضل سهم مطابق للشريعة للمراقبة الآن هو"

    return {
        "intent": "best_sharia",
        "symbol": item.get("symbol"),
        "reply": (
            f"{intro} {item.get('name') or item.get('symbol')}، الرمز {item.get('symbol')}. "
            f"التصنيف: مطابق للشريعة حسب بيانات the-sfm trader. "
            f"القرار الحالي {action_label} بثقة {pct(item.get('confidence'))}. "
            f"السعر الحالي {money(item.get('currentPrice'), item.get('currency'))}، "
            f"والهدف الأول {money(item.get('target1') or item.get('expectedPrice'), item.get('currency'))} "
            f"خلال {item.get('duration') or 'مدة قصيرة'}. "
            f"وقف الخسارة {money(item.get('stopLoss'), item.get('currency'))}. "
            "راجع التصنيف الشرعي قبل التنفيذ."
        ),
    }


def pick_best(items):
    def rank(item):
        confidence = number(item.get("confidence"))
        move = abs(number(item.get("expectedMovePct")))
        score = number(item.get("finalScore"))
        quality = number((item.get("analysisQuality") or {}).get("score"))
        rr = min(number(item.get("riskReward")), 3)
        sharia_bonus = 8 if item.get("shariaStatus") == "compliant" else 0
        risk_penalty = 10 if (item.get("risk") or {}).get("level") == "high" else 0
        action_bonus = 12 if item.get("action") == "buy" else 3 if item.get("action") == "hold" else -4
        return confidence + score * 0.35 + quality * 0.2 + move * 0.7 + rr * 4 + sharia_bonus + action_bonus - risk_penalty

    return sorted(items, key=rank, reverse=True)[0]


def best_available(recommendations, requested_action):
    if not recommendations:
        label = "شراء" if requested_action == "buy" else "بيع"
        return {
            "intent": f"best_{requested_action}",
            "reply": f"حالياً ما وصلتني بيانات كافية عشان أحدد أفضل {label}. انتظر تحديث السوق أو اختر السوق الأمريكي.",
            "noCandidates": True,
        }

    item = pick_best(recommendations)
    action_label = item.get("actionLabel") or item.get("action") or "مراقبة"
    prefix = "مافي إشارة شراء صريحة في السوق الحالي، لكن أفضل سهم للمراقبة الآن هو"
    if requested_action == "sell":
        prefix = "مافي إشارة بيع صريحة في السوق الحالي، لكن أقرب سهم للمراقبة الآن هو"

    return {
        "intent": f"best_{requested_action}",
        "symbol": item.get("symbol"),
        "reply": (
            f"{prefix} {item.get('name') or item.get('symbol')}، الرمز {item.get('symbol')}. "
            f"القرار الحالي {action_label} بثقة {pct(item.get('confidence'))}. "
            f"السعر الحالي {money(item.get('currentPrice'), item.get('currency'))}، "
            f"والهدف الأول {money(item.get('target1') or item.get('expectedPrice'), item.get('currency'))} "
            f"خلال {item.get('duration') or 'مدة قصيرة'}. "
            f"وقف الخسارة {money(item.get('stopLoss'), item.get('currency'))}. "
            "إذا تبي شراء فقط، انتظر إشارة شراء أو غيّر السوق."
        ),
    }


def most_traded(recommendations):
    candidates = [item for item in recommendations if number(item.get("latestVolume")) > 0]
    if not candidates:
        return {
            "intent": "most_traded",
            "reply": "ما عندي حجم تداول واضح في السوق المفتوح حالياً. انتظر تحديث البيانات أو اختار سوق فيه أحجام تداول متاحة.",
        }

    def rank(item):
        volume = number(item.get("latestVolume"))
        relative = number(item.get("relativeVolume"))
        confidence = number(item.get("confidence"))
        return volume * (1 + min(relative, 5) * 0.05) + confidence

    item = sorted(candidates, key=rank, reverse=True)[0]
    return {
        "intent": "most_traded",
        "symbol": item.get("symbol"),
        "reply": (
            f"أكثر سهم تداولاً حالياً حسب بيانات السوق المعروضة هو {item.get('name') or item.get('symbol')}، "
            f"الرمز {item.get('symbol')}. حجم التداول تقريباً {compact_number(item.get('latestVolume'))} سهم، "
            f"والحجم النسبي {number(item.get('relativeVolume')):.2f} مرة من متوسط 20 فترة. "
            f"التوصية الحالية {item.get('actionLabel') or item.get('action')} بثقة {pct(item.get('confidence'))}. "
            "راقب السيولة ولا تدخل بدون إدارة مخاطر."
        ),
    }


def monthly_upside(recommendations):
    candidates = []
    for item in recommendations:
        for outlook in item.get("upsideOutlook") or []:
            if number(outlook.get("targetPrice")) > number(item.get("currentPrice")):
                candidates.append((item, outlook))

    if not candidates:
        return {
            "intent": "monthly_upside",
            "reply": "ما عندي حالياً فرصة صعود شهرية واضحة في السوق المفتوح. خلنا ننتظر تحديث أقوى أو اختار السوق الأمريكي.",
        }

    def rank(pair):
        item, outlook = pair
        return number(outlook.get("confidence")) + number(outlook.get("movePct")) * 1.5 + number(item.get("confidence")) * 0.25

    item, outlook = sorted(candidates, key=rank, reverse=True)[0]
    return {
        "intent": "monthly_upside",
        "symbol": item.get("symbol"),
        "reply": (
            f"أقوى فرصة صعود خلال {outlook.get('label') or 'الفترة القادمة'} هي {item.get('name') or item.get('symbol')}، "
            f"الرمز {item.get('symbol')}. الهدف {money(outlook.get('targetPrice'), item.get('currency'))}، "
            f"والحركة المتوقعة {pct(outlook.get('movePct'))}، بثقة {pct(outlook.get('confidence'))}."
        ),
    }


def find_symbol(clean):
    for key, symbol in SYMBOL_ALIASES.items():
        if key in clean:
            return symbol

    match = re.search(r"\b[A-Z]{1,5}(?:[-.][A-Z]{2,4})?\b", clean.upper())
    if match:
        return SYMBOL_ALIASES.get(match.group(0).lower(), match.group(0))

    return ""


def wants_monitor(clean):
    return any(phrase in clean for phrase in ["اول ما", "أول ما", "اذا صارت", "إذا صارت", "قولي", "نبهني", "راقب"])


def wants_sharia(clean):
    return any(
        phrase in clean
        for phrase in [
            "مطابق للشريعه",
            "مطابق الشريعه",
            "متوافق مع الشريعه",
            "شرعي",
            "شرعيه",
            "الشريعه",
            "حلال",
            "halal",
        ]
    )


def is_wake_only(clean):
    wake_words = ["sfm", "s f m", "اس اف ام", "إس إف إم", "اسفم"]
    has_wake = any(word in clean for word in wake_words)
    command_words = ["اشتري", "شراء", "بيع", "سعر", "حلل", "شارت", "تصعد", "صعود", "تداول", "حجم", "سيوله", "سيولة", "افضل", "اقوي", "سهم اليوم", "شريعه", "شرعي", "حلال"]
    return has_wake and not any(word in clean for word in command_words)


def greeting():
    hour = datetime.now().hour
    if 5 <= hour < 12:
        return "صباح الخير يا سيدي، SFM مساعدك تحت أمرك. شنو تبي نسوي اليوم؟"
    if 18 <= hour or hour < 5:
        return "مساء الخير يا سيدي، SFM حاضر. شنو تبي نحلل اليوم؟"
    return "ماذا تريد اليوم يا سيدي؟ SFM جاهز للتحليل."


def normalize(text):
    text = str(text or "").strip().lower()
    replacements = {
        "أ": "ا",
        "إ": "ا",
        "آ": "ا",
        "ى": "ي",
        "ة": "ه",
        "ؤ": "و",
        "ئ": "ي",
        "ـ": "",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return re.sub(r"\s+", " ", text)


def number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def pct(value):
    return f"{number(value):.0f}%"


def money(value, currency=""):
    value = number(value)
    digits = 4 if abs(value) < 1 else 2
    formatted = f"{value:,.{digits}f}"
    return f"{formatted} {currency}".strip()


def compact_number(value):
    value = number(value)
    abs_value = abs(value)
    if abs_value >= 1_000_000_000:
        return f"{value / 1_000_000_000:.2f} مليار"
    if abs_value >= 1_000_000:
        return f"{value / 1_000_000:.2f} مليون"
    if abs_value >= 1_000:
        return f"{value / 1_000:.2f} ألف"
    return f"{value:,.0f}"


if __name__ == "__main__":
    main()

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const LANGS = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "om", label: "Oromo", native: "Afaan Oromoo" },
  { code: "ti", label: "Tigrinya", native: "ትግርኛ" },
];

const en = {
  // header / nav
  "nav.browse": "Browse services",
  "nav.categories": "Categories",
  "nav.how": "How it works",
  "nav.searchPlaceholder": "Search services…",
  "nav.login": "Log in",
  "nav.becomeProvider": "Become a provider",
  "nav.menu": "Menu",
  "nav.notifications": "Notifications",
  "nav.dashboard": "Dashboard",

  // hero
  "hero.badge": "Trusted by 12,400+ professionals across Ethiopia",
  "hero.title1": "Find trusted local pros",
  "hero.title2": "in minutes, not days.",
  "hero.subtitle":
    "From same-day plumbing to wedding photography — book verified service providers across Addis Ababa, Bahir Dar, Hawassa and Mekelle.",
  "hero.searchWhat": "What service do you need?",
  "hero.searchCity": "Addis Ababa",
  "hero.searchBtn": "Search",

  // sections
  "sec.categories": "Popular categories",
  "sec.categoriesSub": "Browse the most-requested services near you.",
  "sec.viewAll": "View all",
  "sec.featured": "Featured services",
  "sec.featuredSub": "Hand-picked professionals with outstanding reviews.",
  "sec.how": "How ServiceHub works",
  "sec.howSub": "Three simple steps from search to done.",
  "sec.why": "Why Ethiopians choose ServiceHub",
  "sec.whySub":
    "We built ServiceHub for how services actually work here — trust matters, referrals matter, and pricing has to be clear.",

  // how steps
  "how.1.t": "Search & compare",
  "how.1.b": "Browse verified providers, real reviews, and transparent pricing in ETB.",
  "how.2.t": "Chat & book",
  "how.2.b": "Message the provider directly, agree on details, and confirm your booking.",
  "how.3.t": "Get it done",
  "how.3.b": "Track progress, pay securely, and leave a review to help the community.",

  // why bullets
  "why.1.t": "Verified providers only",
  "why.1.b": "Every provider is ID-verified and rated by real customers.",
  "why.2.t": "Transparent ETB pricing",
  "why.2.b": "No hidden fees. See the price before you book.",
  "why.3.t": "Chat in your language",
  "why.3.b": "Full support for English, Amharic, Oromo and Tigrinya.",

  // CTA
  "cta.title": "Grow your business on ServiceHub.",
  "cta.body":
    "Join thousands of Ethiopian professionals earning more, managing bookings in one place, and getting paid on time.",
  "cta.explore": "Explore services",

  // browse
  "browse.home": "Home",
  "browse.title": "All services",
  "browse.count": "{n} services available across Ethiopia",
  "browse.searchPlaceholder": "Search services…",
  "browse.sort.rec": "Recommended",
  "browse.sort.pAsc": "Price: low to high",
  "browse.sort.pDesc": "Price: high to low",
  "browse.sort.rating": "Highest rated",
  "browse.filters": "Filters",
  "browse.category": "Category",
  "browse.allCategories": "All categories",
  "browse.maxPrice": "Max price",
  "browse.upTo": "Up to ETB {n}",
  "browse.clear": "Clear all filters",
  "browse.showing": "Showing {a} of {b}",
  "browse.prev": "Previous",
  "browse.next": "Next",
  "browse.empty.t": "No services match your filters",
  "browse.empty.b":
    "Try broadening your search, choosing a different category, or raising your maximum price.",

  // sidebar sections
  "side.menu": "Menu",
  "side.provider": "Provider",
  "side.account": "Account",
  "side.dashboard": "Dashboard",
  "side.browse": "Browse",
  "side.requests": "My requests",
  "side.messages": "Messages",
  "side.notifications": "Notifications",
  "side.services": "My services",
  "side.reviews": "Reviews",
  "side.profile": "Profile",
  "side.settings": "Settings",
  "side.logout": "Log out",

  // auth
  "auth.welcome": "Welcome back",
  "auth.welcomeSub": "Log in to manage your bookings and messages.",
  "auth.noAccount": "Don't have an account?",
  "auth.createOne": "Create one",
  "auth.haveAccount": "Already have an account?",
  "auth.login": "Log in",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.forgot": "Forgot password?",
  "auth.remember": "Remember me for 30 days",
  "auth.or": "or continue with",
  "auth.google": "Continue with Google",
  "auth.createTitle": "Create your account",
  "auth.createSub": "Free to join. Book services or become a provider.",
  "auth.firstName": "First name",
  "auth.lastName": "Last name",
  "auth.confirm": "Confirm password",
  "auth.terms": "By creating an account you agree to our Terms and Privacy Policy.",
  "auth.create": "Create account",

  // footer
  "foot.tagline":
    "Ethiopia's trusted marketplace for local services. From Addis Ababa to Mekelle — find verified professionals in minutes.",
  "foot.marketplace": "Marketplace",
  "foot.company": "Company",
  "foot.support": "Support",
  "foot.rights": "© {y} ServiceHub. Made in Ethiopia.",
};

const am = {
  "nav.browse": "አገልግሎቶችን ያስሱ",
  "nav.categories": "ምድቦች",
  "nav.how": "እንዴት ይሰራል",
  "nav.searchPlaceholder": "አገልግሎት ይፈልጉ…",
  "nav.login": "ግባ",
  "nav.becomeProvider": "አገልጋይ ይሁኑ",
  "nav.menu": "ዝርዝር",
  "nav.notifications": "ማሳወቂያዎች",
  "nav.dashboard": "ዳሽቦርድ",

  "hero.badge": "በኢትዮጵያ ውስጥ በ12,400+ ባለሙያዎች የተመሰከረ",
  "hero.title1": "የታመኑ የአካባቢ ባለሙያዎችን",
  "hero.title2": "በደቂቃዎች ውስጥ ያግኙ።",
  "hero.subtitle":
    "ከቧንቧ ስራ እስከ ሠርግ ፎቶግራፍ — በአዲስ አበባ፣ ባህር ዳር፣ ሀዋሳ እና መቀሌ የተመሰከሩ አገልጋዮችን ይመዝግቡ።",
  "hero.searchWhat": "ምን አገልግሎት ይፈልጋሉ?",
  "hero.searchCity": "አዲስ አበባ",
  "hero.searchBtn": "ፈልግ",

  "sec.categories": "ተወዳጅ ምድቦች",
  "sec.categoriesSub": "በአካባቢዎ ተፈላጊ የሆኑ አገልግሎቶችን ያስሱ።",
  "sec.viewAll": "ሁሉንም ይመልከቱ",
  "sec.featured": "ተመራጭ አገልግሎቶች",
  "sec.featuredSub": "በእጅ የተመረጡ ምርጥ ደረጃ ያላቸው ባለሙያዎች።",
  "sec.how": "ServiceHub እንዴት ይሰራል",
  "sec.howSub": "ከፍለጋ እስከ መጨረሻ ሦስት ቀላል ደረጃዎች።",
  "sec.why": "Template.ኢትዮጵያውያን ServiceHubን የሚመርጡበት ምክንያት",
  "sec.whySub": "እዚህ አገልግሎቶች የሚሰሩበትን መንገድ በማወቅ ገንብተነዋል — መተማመን፣ ግልጽ ዋጋ።",

  "how.1.t": "ፈልጉ እና አነጻጽሩ",
  "how.1.b": "የተመሰከሩ አገልጋዮችን፣ እውነተኛ ግምገማዎችን እና ግልጽ በብር ዋጋ ይመልከቱ።",
  "how.2.t": "ወያዩ እና ይመዝግቡ",
  "how.2.b": "አገልጋዩን በቀጥታ ያነጋግሩ፣ ዝርዝሮችን ይስማሙ እና ቀጠሮዎን ያረጋግጡ።",
  "how.3.t": "አጠናቅቁ",
  "how.3.b": "እድገቱን ይከታተሉ፣ በደህና ይክፈሉ እና ማህበረሰቡን ለመርዳት ግምገማ ይተው።",

  "why.1.t": "የተመሰከሩ አገልጋዮች ብቻ",
  "why.1.b": "እያንዳንዱ አገልጋይ በመታወቂያ የተመሰከረ እና በእውነተኛ ደንበኞች የተገመገመ ነው።",
  "why.2.t": "ግልጽ የብር ዋጋ",
  "why.2.b": "የተደበቁ ክፍያዎች የሉም። ከመመዝገብዎ በፊት ዋጋውን ይመልከቱ።",
  "why.3.t": "በቋንቋዎ ወያዩ",
  "why.3.b": "ለእንግሊዘኛ፣ አማርኛ፣ ኦሮሚኛ እና ትግርኛ ሙሉ ድጋፍ።",

  "cta.title": "ንግድዎን በ ServiceHub ላይ ያሳድጉ።",
  "cta.body": "ተጨማሪ ገቢ የሚያገኙ በሺዎች የሚቆጠሩ ኢትዮጵያውያን ባለሙያዎችን ይቀላቀሉ።",
  "cta.explore": "አገልግሎቶችን ያስሱ",

  "browse.home": "መነሻ",
  "browse.title": "ሁሉም አገልግሎቶች",
  "browse.count": "በኢትዮጵያ ውስጥ {n} አገልግሎቶች ይገኛሉ",
  "browse.searchPlaceholder": "አገልግሎት ይፈልጉ…",
  "browse.sort.rec": "የተመከሩ",
  "browse.sort.pAsc": "ዋጋ፡ ከዝቅተኛ ወደ ከፍተኛ",
  "browse.sort.pDesc": "ዋጋ፡ ከከፍተኛ ወደ ዝቅተኛ",
  "browse.sort.rating": "ከፍተኛ ደረጃ",
  "browse.filters": "ማጣሪያዎች",
  "browse.category": "ምድብ",
  "browse.allCategories": "ሁሉም ምድቦች",
  "browse.maxPrice": "ከፍተኛ ዋጋ",
  "browse.upTo": "እስከ ብር {n}",
  "browse.clear": "ማጣሪያዎችን አጽዳ",
  "browse.showing": "ከ{b} ውስጥ {a} እያሳየ",
  "browse.prev": "ቀዳሚ",
  "browse.next": "ቀጣይ",
  "browse.empty.t": "ከማጣሪያዎችዎ ጋር የሚዛመድ አገልግሎት የለም",
  "browse.empty.b": "ፍለጋዎን ያሰፉ ወይም የተለየ ምድብ ይምረጡ።",

  "side.menu": "ዝርዝር",
  "side.provider": "አገልጋይ",
  "side.account": "መለያ",
  "side.dashboard": "ዳሽቦርድ",
  "side.browse": "አስስ",
  "side.requests": "የእኔ ጥያቄዎች",
  "side.messages": "መልእክቶች",
  "side.notifications": "ማሳወቂያዎች",
  "side.services": "የእኔ አገልግሎቶች",
  "side.reviews": "ግምገማዎች",
  "side.profile": "መገለጫ",
  "side.settings": "ቅንብሮች",
  "side.logout": "ውጣ",

  "auth.welcome": "እንኳን ደህና መጡ",
  "auth.welcomeSub": "ቀጠሮዎችን እና መልእክቶችን ለማስተዳደር ይግቡ።",
  "auth.noAccount": "መለያ የለዎትም?",
  "auth.createOne": "አንድ ይፍጠሩ",
  "auth.haveAccount": "አስቀድሞ መለያ አለዎት?",
  "auth.login": "ግባ",
  "auth.email": "ኢሜይል",
  "auth.password": "የይለፍ ቃል",
  "auth.forgot": "የይለፍ ቃል ረሱ?",
  "auth.remember": "ለ30 ቀናት አስታውሰኝ",
  "auth.or": "ወይም ይቀጥሉ በ",
  "auth.google": "በጎግል ይቀጥሉ",
  "auth.createTitle": "መለያ ይፍጠሩ",
  "auth.createSub": "ለመቀላቀል ነጻ ነው። አገልግሎት ይመዝገቡ ወይም አገልጋይ ይሁኑ።",
  "auth.firstName": "ስም",
  "auth.lastName": "የአባት ስም",
  "auth.confirm": "የይለፍ ቃል ያረጋግጡ",
  "auth.terms": "መለያ በመፍጠር የአገልግሎት ውሎችን እና የግላዊነት መመሪያን ተስማምተዋል።",
  "auth.create": "መለያ ፍጠር",

  "foot.tagline":
    "የኢትዮጵያ የተመሰከረ የአካባቢ አገልግሎት መገበያያ። ከአዲስ አበባ እስከ መቀሌ — በደቂቃዎች ውስጥ የተመሰከሩ ባለሙያዎችን ያግኙ።",
  "foot.marketplace": "ገበያ",
  "foot.company": "ኩባንያ",
  "foot.support": "ድጋፍ",
  "foot.rights": "© {y} ServiceHub. በኢትዮጵያ የተሰራ።",
};

const om = {
  "nav.browse": "Tajaajila ilaali",
  "nav.categories": "Ramaddiiwwan",
  "nav.how": "Akkamitti hojjeta",
  "nav.searchPlaceholder": "Tajaajila barbaadi…",
  "nav.login": "Seeni",
  "nav.becomeProvider": "Kennaa tajaajilaa ta'i",
  "nav.menu": "Baafata",
  "nav.notifications": "Beeksisawwan",
  "nav.dashboard": "Daashboordii",

  "hero.badge": "Ogeessota 12,400+ Itoophiyaa keessaa ittiin amanaman",
  "hero.title1": "Ogeessota naannoo amanamoo",
  "hero.title2": "daqiiqaa muraasa keessatti argadhu.",
  "hero.subtitle":
    "Suuqii bishaanii irraa hanga suuraa cidhaatti — Finfinnee, Bahir Daar, Hawaasaa fi Maqaleetti kennaa tajaajilaa mirkanaa'an galmeessi.",
  "hero.searchWhat": "Tajaajila kam barbaadda?",
  "hero.searchCity": "Finfinnee",
  "hero.searchBtn": "Barbaadi",

  "sec.categories": "Ramaddiiwwan beekamoo",
  "sec.categoriesSub": "Tajaajila naannoo keetti barbaadamoo ta'an ilaali.",
  "sec.viewAll": "Hunda ilaali",
  "sec.featured": "Tajaajila filatamoo",
  "sec.featuredSub": "Ogeeyyii sadarkaa olaanaa qaban.",
  "sec.how": "ServiceHub akkamitti hojjeta",
  "sec.howSub": "Barbaacharraa hanga xumurutti tarkaanfii sadi salphaa.",
  "sec.why": "Itoophiyaanonni maaliif ServiceHub filatan",
  "sec.whySub": "Amantaan, mallattoon fi gatii ifaan barbaachisaa dha.",

  "how.1.t": "Barbaadi fi wal bira qabi",
  "how.1.b": "Kennaa tajaajilaa mirkanaa'an, gamaggama dhugaa fi gatii ifa ta'e Birrii keessaan ilaali.",
  "how.2.t": "Haasa'i fi galmeessi",
  "how.2.b": "Kennaa tajaajilaa kallattiin haasofsiisi, walii galtee mirkaneessi.",
  "how.3.t": "Xumursiisi",
  "how.3.b": "Deemsa hordofi, nageenyaan kaffali, hawaasa gargaaruuf gamaggama kenni.",

  "why.1.t": "Kennaa tajaajilaa mirkanaa'an qofa",
  "why.1.b": "Kennaan tajaajilaa hundi eenyummaa mirkanaa'e qabu.",
  "why.2.t": "Gatii Birrii ifaa",
  "why.2.b": "Kaffaltiin dhokataa hin jiru. Duraan gatii ilaali.",
  "why.3.t": "Afaan keetiin haasa'i",
  "why.3.b": "Ingiliffa, Amaariffa, Afaan Oromoo fi Tigrinyaa deeggara.",

  "cta.title": "Daldala kee ServiceHub irratti guddisi.",
  "cta.body": "Ogeeyyii Itoophiyaa kumaatamaan lakkaa'aman waliin makami.",
  "cta.explore": "Tajaajila ilaali",

  "browse.home": "Fuula jalqabaa",
  "browse.title": "Tajaajila hunda",
  "browse.count": "Itoophiyaa keessatti tajaajilli {n} ni jira",
  "browse.searchPlaceholder": "Tajaajila barbaadi…",
  "browse.sort.rec": "Kan gorfaman",
  "browse.sort.pAsc": "Gatii: gadiirraa gubbaatti",
  "browse.sort.pDesc": "Gatii: gubbaarraa gadiitti",
  "browse.sort.rating": "Sadarkaa olaanaa",
  "browse.filters": "Calaltuwwan",
  "browse.category": "Ramaddii",
  "browse.allCategories": "Ramaddii hunda",
  "browse.maxPrice": "Gatii olaanaa",
  "browse.upTo": "Hanga Birrii {n}",
  "browse.clear": "Calaltuwwan haqi",
  "browse.showing": "{a} kan {b} keessaa agarsiisaa jira",
  "browse.prev": "Duraa",
  "browse.next": "Itti aanu",
  "browse.empty.t": "Tajaajilli calaltuu keetiin walsimu hin jiru",
  "browse.empty.b": "Barbaacha kee bal'isi ykn ramaddii biraa filadhu.",

  "side.menu": "Baafata",
  "side.provider": "Kennaa tajaajilaa",
  "side.account": "Herrega",
  "side.dashboard": "Daashboordii",
  "side.browse": "Ilaali",
  "side.requests": "Gaaffiiwwan koo",
  "side.messages": "Ergaawwan",
  "side.notifications": "Beeksisawwan",
  "side.services": "Tajaajila koo",
  "side.reviews": "Gamaggama",
  "side.profile": "Piroofaayilii",
  "side.settings": "Qindaa'ina",
  "side.logout": "Ba'i",

  "auth.welcome": "Baga nagaan deebite",
  "auth.welcomeSub": "Galmee fi ergaawwan bulchuuf seeni.",
  "auth.noAccount": "Herrega hin qabdu?",
  "auth.createOne": "Uumi",
  "auth.haveAccount": "Duraan herrega qabda?",
  "auth.login": "Seeni",
  "auth.email": "Imeelii",
  "auth.password": "Jecha darbii",
  "auth.forgot": "Jecha darbii dagatte?",
  "auth.remember": "Guyyaa 30 na yaadadhu",
  "auth.or": "ykn itti fufi",
  "auth.google": "Google waliin itti fufi",
  "auth.createTitle": "Herrega kee uumi",
  "auth.createSub": "Bilisa. Tajaajila galmeessi ykn kennaa tajaajilaa ta'i.",
  "auth.firstName": "Maqaa",
  "auth.lastName": "Maqaa abbaa",
  "auth.confirm": "Jecha darbii mirkaneessi",
  "auth.terms": "Herrega uumuudhaan Waliigaltee fi Iccitii ni fudhatta.",
  "auth.create": "Herrega uumi",

  "foot.tagline":
    "Gabaa tajaajila naannoo Itoophiyaa amanamaa. Finfinneerraa hanga Maqaleetti — daqiiqaa muraasatti ogeeyyii argadhu.",
  "foot.marketplace": "Gabaa",
  "foot.company": "Dhaabbata",
  "foot.support": "Deeggarsa",
  "foot.rights": "© {y} ServiceHub. Itoophiyaa keessatti hojjetame.",
};

const ti = {
  "nav.browse": "ኣገልግሎታት ርአ",
  "nav.categories": "ምድባት",
  "nav.how": "ከመይ ከም ዝሰርሕ",
  "nav.searchPlaceholder": "ኣገልግሎት ድለ…",
  "nav.login": "እቶ",
  "nav.becomeProvider": "ኣገልጋሊ ኹን",
  "nav.menu": "ዝርዝር",
  "nav.notifications": "ምልክታታት",
  "nav.dashboard": "ዳሽቦርድ",

  "hero.badge": "ኣብ ኢትዮጵያ ብ12,400+ ሞያውያን ዝተኣመነ",
  "hero.title1": "እሙናት ኣብ ከባቢኻ ዝርከቡ ሞያውያን",
  "hero.title2": "ኣብ ደቓይቕ ርኸብ።",
  "hero.subtitle":
    "ካብ መስመር ማይ ክሳብ ናይ መርዓ ስእሊ — ኣብ ኣዲስ ኣበባ፣ ባህር ዳል፣ ሓዋሳ ከምኡ’ውን መቐለ ዝተኣመኑ ኣገልገልቲ ሓዝ።",
  "hero.searchWhat": "እንታይ ኣገልግሎት ትደሊ?",
  "hero.searchCity": "ኣዲስ ኣበባ",
  "hero.searchBtn": "ድለ",

  "sec.categories": "ተፈተውቲ ምድባት",
  "sec.categoriesSub": "ኣብ ከባቢኻ ዝዝረቡ ኣገልግሎታት ርአ።",
  "sec.viewAll": "ኵሉ ርአ",
  "sec.featured": "ውሩያት ኣገልግሎታት",
  "sec.featuredSub": "ብኢድ ዝተመርጹ ብልጫ ዘለዎም ሞያውያን።",
  "sec.how": "ServiceHub ከመይ ይሰርሕ",
  "sec.howSub": "ካብ ድሌት ክሳብ ምዝዛም ሰለስተ ቀሊላት ስጉምትታት።",
  "sec.why": "ኢትዮጵያውያን ንምንታይ ServiceHub ይመርጹ",
  "sec.whySub": "እምነት፣ ግልጺ ዋጋ፣ ኣብዚ ንብረት እዩ።",

  "how.1.t": "ድለን ኣወዳድር",
  "how.1.b": "ዝተኣመኑ ኣገልገልቲ፣ ናይ ብሓቂ ገምጋማት ከምኡ’ውን ግልጺ ብር ዋጋ ርአ።",
  "how.2.t": "ተዘራረብን ሓዝን",
  "how.2.b": "ኣገልጋሊ ብቐጥታ ተዘራረብ፣ ዝርዝራት ተሰማምዑ፣ ቆጸራኻ ኣረጋግጽ።",
  "how.3.t": "ወድኦ",
  "how.3.b": "ኣካይዳ ተኸታተል፣ ብድሕንነት ክፈል፣ ገምጋም ግደፍ።",

  "why.1.t": "ዝተኣመኑ ኣገልገልቲ ጥራይ",
  "why.1.b": "ኩሉ ኣገልጋሊ ብመንነት ተረጋጊጹ እዩ።",
  "why.2.t": "ግልጺ ናይ ብር ዋጋ",
  "why.2.b": "ዝተኸወሉ ክፍሊታት የለውን። ቅድሚ ምሓዝ ዋጋ ርአ።",
  "why.3.t": "ብቛንቛኻ ተዘራረብ",
  "why.3.b": "ንእንግሊዝኛ፣ ኣምሓርኛ፣ ኦሮሞ ከምኡ’ውን ትግርኛ ምሉእ ደገፍ።",

  "cta.title": "ንግድኻ ኣብ ServiceHub ኣዕቢ።",
  "cta.body": "ብዙሓት ኢትዮጵያውያን ሞያውያን ተጸምበር።",
  "cta.explore": "ኣገልግሎታት ርአ",

  "browse.home": "መእተዊ",
  "browse.title": "ኵሎም ኣገልግሎታት",
  "browse.count": "ኣብ ኢትዮጵያ {n} ኣገልግሎታት ኣለዉ",
  "browse.searchPlaceholder": "ኣገልግሎት ድለ…",
  "browse.sort.rec": "ዝተመኸሩ",
  "browse.sort.pAsc": "ዋጋ፡ ካብ ትሑት ናብ ላዕሊ",
  "browse.sort.pDesc": "ዋጋ፡ ካብ ላዕሊ ናብ ትሑት",
  "browse.sort.rating": "ላዕለዋይ ደረጃ",
  "browse.filters": "ኣጻረይቲ",
  "browse.category": "ምድብ",
  "browse.allCategories": "ኩሎም ምድባት",
  "browse.maxPrice": "ላዕለዋይ ዋጋ",
  "browse.upTo": "ክሳብ ብር {n}",
  "browse.clear": "ኣጻረይቲ ኣጽዲ",
  "browse.showing": "ካብ {b} {a} ይረአ",
  "browse.prev": "ቀዳማይ",
  "browse.next": "ዝቕጽል",
  "browse.empty.t": "ምስ ኣጻረይትኻ ዝሰማማዕ ኣገልግሎት የለን",
  "browse.empty.b": "ድሌትካ ኣስፍሕ ወይ ካልእ ምድብ ምረጽ።",

  "side.menu": "ዝርዝር",
  "side.provider": "ኣገልጋሊ",
  "side.account": "ኣካውንት",
  "side.dashboard": "ዳሽቦርድ",
  "side.browse": "ርአ",
  "side.requests": "ናተይ ጠለባት",
  "side.messages": "መልእኽትታት",
  "side.notifications": "ምልክታታት",
  "side.services": "ናተይ ኣገልግሎታት",
  "side.reviews": "ገምጋማት",
  "side.profile": "ፕሮፋይል",
  "side.settings": "ቅንብር",
  "side.logout": "ውጻእ",

  "auth.welcome": "ብደሓን መጻእካ",
  "auth.welcomeSub": "ቆጸራታትን መልእኽትታትን ንምምሕዳር እቶ።",
  "auth.noAccount": "ኣካውንት የብልካን?",
  "auth.createOne": "ፍጠር",
  "auth.haveAccount": "ኣካውንት ኣለካ ድዩ?",
  "auth.login": "እቶ",
  "auth.email": "ኢመይል",
  "auth.password": "መሕለፊ ቃል",
  "auth.forgot": "መሕለፊ ቃል ረሲዕካ?",
  "auth.remember": "ን30 መዓልቲ ዘክረኒ",
  "auth.or": "ወይ ቀጽል ብ",
  "auth.google": "ብGoogle ቀጽል",
  "auth.createTitle": "ኣካውንትካ ፍጠር",
  "auth.createSub": "ናጻ እዩ። ኣገልግሎት ሓዝ ወይ ኣገልጋሊ ኹን።",
  "auth.firstName": "ሽም",
  "auth.lastName": "ናይ ኣቦ ሽም",
  "auth.confirm": "መሕለፊ ቃል ኣረጋግጽ",
  "auth.terms": "ኣካውንት ብምፍጣር ውዕላትና ትቕበል።",
  "auth.create": "ኣካውንት ፍጠር",

  "foot.tagline":
    "እሙን ናይ ኢትዮጵያ ናይ ከባቢ ኣገልግሎት ዕዳጋ። ካብ ኣዲስ ኣበባ ክሳብ መቐለ — ዝተኣመኑ ሞያውያን ኣብ ደቓይቕ ርኸብ።",
  "foot.marketplace": "ዕዳጋ",
  "foot.company": "ኩባንያ",
  "foot.support": "ደገፍ",
  "foot.rights": "© {y} ServiceHub. ኣብ ኢትዮጵያ ተሰሪሑ።",
};

const DICTS = { en, am, om, ti };

const Ctx = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (saved && DICTS[saved]) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        if (typeof window !== "undefined") localStorage.setItem("lang", l);
      },
      t: (key, vars) => {
        const dict = DICTS[lang] || en;
        let str = dict[key] ?? en[key] ?? key;
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            str = str.replaceAll(`{${k}}`, String(v));
          }
        }
        return str;
      },
    }),
    [lang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) return { lang: "en", setLang: () => {}, t: (k) => k };
  return c;
}
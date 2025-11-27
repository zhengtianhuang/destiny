import Foundation

// MARK: - 籤詩模型
struct FortuneStick: Identifiable, Codable {
    let id: Int
    let number: String           // 籤號：第一籤、第二籤...
    let level: FortuneLevel      // 吉凶等級
    let poem: String             // 籤詩（四句）
    let poemJapanese: String?    // 日文版籤詩
    let interpretation: String   // 解籤
    let advice: String           // 建議
    let categories: [FortuneCategory] // 適用類別
}

// MARK: - 吉凶等級
enum FortuneLevel: String, Codable, CaseIterable {
    case daJi = "大吉"
    case zhongJi = "中吉"
    case xiaoJi = "小吉"
    case ji = "吉"
    case ping = "平"
    case xiaoXiong = "小凶"
    case xiong = "凶"
    
    var color: String {
        switch self {
        case .daJi: return "gold"
        case .zhongJi, .ji: return "green"
        case .xiaoJi: return "lightGreen"
        case .ping: return "gray"
        case .xiaoXiong: return "orange"
        case .xiong: return "red"
        }
    }
    
    var emoji: String {
        switch self {
        case .daJi: return "🌟"
        case .zhongJi, .ji: return "✨"
        case .xiaoJi: return "🍀"
        case .ping: return "☯️"
        case .xiaoXiong: return "⚡"
        case .xiong: return "🌙"
        }
    }
}

// MARK: - 籤詩類別
enum FortuneCategory: String, Codable, CaseIterable {
    case general = "綜合運勢"
    case love = "感情姻緣"
    case career = "事業財運"
    case health = "健康平安"
    case study = "學業考試"
    case travel = "出行旅遊"
    case decision = "抉擇判斷"
}

// MARK: - 用戶問題記錄
struct FortuneQuery: Identifiable, Codable {
    let id: UUID
    let question: String
    let stick: FortuneStick
    let timestamp: Date
    
    init(question: String, stick: FortuneStick) {
        self.id = UUID()
        self.question = question
        self.stick = stick
        self.timestamp = Date()
    }
}

// MARK: - 籤詩庫（100+ 籤詩）
struct FortuneStickDatabase {
    static let sticks: [FortuneStick] = [
        // ===== 大吉籤 (1-10) =====
        FortuneStick(
            id: 1,
            number: "第一籤",
            level: .daJi,
            poem: "日出東方照大地\n春風得意馬蹄疾\n貴人相助事事順\n心想事成在今時",
            poemJapanese: "東より日が昇り大地を照らす\n春風に乗り馬は軽やかに走る\n貴人の助けで万事順調\n願いは今まさに叶う時",
            interpretation: "此籤大吉大利，如旭日東昇，萬物更新。所問之事將得貴人相助，順風順水，心想事成。",
            advice: "把握當下機會，勇敢前行，好運正在眷顧你。",
            categories: [.general, .career, .love]
        ),
        FortuneStick(
            id: 2,
            number: "第二籤",
            level: .daJi,
            poem: "月明星稀照前程\n龍門一躍化為龍\n多年辛苦今朝報\n功成名就世人崇",
            poemJapanese: "月明かりが前途を照らし\n龍門を越え龍となる\n長年の苦労が今報われ\n功成り名遂げて世に称えらる",
            interpretation: "此籤象徵努力終有回報，如鯉魚躍龍門，即將迎來人生轉折點。",
            advice: "堅持到底，成功就在眼前，不要放棄最後一步。",
            categories: [.career, .study]
        ),
        FortuneStick(
            id: 3,
            number: "第三籤",
            level: .daJi,
            poem: "鴛鴦戲水情意長\n比翼雙飛向天堂\n姻緣天定今朝遇\n白首偕老永不忘",
            poemJapanese: "鴛鴦が水に戯れ情深く\n比翼の鳥のように天へ飛ぶ\n縁は天の定め今日出会い\n白髪になるまで共に歩む",
            interpretation: "此籤主姻緣美滿，感情和諧。單身者將遇良緣，有伴者感情升溫。",
            advice: "珍惜眼前人，用心經營感情，幸福就在身邊。",
            categories: [.love]
        ),
        FortuneStick(
            id: 4,
            number: "第四籤",
            level: .daJi,
            poem: "財源廣進四方來\n金玉滿堂福自開\n經商投資皆得利\n富貴榮華步步來",
            poemJapanese: "財源が四方より広く入り\n金玉満堂で福自ずから開く\n商売投資みな利を得て\n富貴栄華が歩々と来る",
            interpretation: "此籤主財運亨通，投資理財皆有斬獲，事業發展順利。",
            advice: "積極把握商機，但也要穩健經營，不宜過度冒險。",
            categories: [.career, .general]
        ),
        FortuneStick(
            id: 5,
            number: "第五籤",
            level: .daJi,
            poem: "天賜良機莫錯過\n雲開霧散見青天\n萬事俱備東風至\n一帆風順達彼岸",
            poemJapanese: "天が与えた好機を逃すな\n雲が晴れ青空が見える\n万事整い東風が吹く\n順風満帆で彼岸に着く",
            interpretation: "此籤表示時機成熟，萬事俱備，正是行動的最佳時刻。",
            advice: "機不可失，現在就是最好的時機，立刻行動吧！",
            categories: [.general, .decision]
        ),
        FortuneStick(
            id: 6,
            number: "第六籤",
            level: .daJi,
            poem: "紫氣東來滿門春\n和氣生財笑迎人\n家和萬事皆興旺\n福祿壽喜伴終身",
            poemJapanese: "紫気が東より来て門に春満つ\n和気が財を生み笑顔で迎える\n家和して万事興旺し\n福禄寿喜が終身伴う",
            interpretation: "此籤主家庭和睦，諸事順遂。家人團結一心，事業興旺。",
            advice: "以和為貴，多與家人溝通，家和才能萬事興。",
            categories: [.general, .health]
        ),
        FortuneStick(
            id: 7,
            number: "第七籤",
            level: .daJi,
            poem: "金榜題名天下知\n十年寒窗今朝喜\n學業有成功名就\n青雲直上展鴻圖",
            poemJapanese: "金榜に名を連ね天下に知られ\n十年の苦学が今日報われる\n学業成就し功名を得て\n青雲直上で大志を展く",
            interpretation: "此籤主學業考試大吉，努力必有回報，即將金榜題名。",
            advice: "繼續努力複習，保持信心，好成績正等著你。",
            categories: [.study]
        ),
        FortuneStick(
            id: 8,
            number: "第八籤",
            level: .daJi,
            poem: "觀音菩薩護身旁\n逢凶化吉保安康\n貴人指引明燈照\n平安順遂福綿長",
            poemJapanese: "観音菩薩が身を守り\n凶を吉に変え安康を保つ\n貴人が導き明灯照らし\n平安順調で福長く続く",
            interpretation: "此籤表示有神明庇佑，遇困難也能化險為夷，平安無事。",
            advice: "心存善念，多做善事，福報自然降臨。",
            categories: [.health, .travel, .general]
        ),
        FortuneStick(
            id: 9,
            number: "第九籤",
            level: .daJi,
            poem: "春風化雨潤無聲\n桃李滿園芬芳呈\n貴人提攜步步高\n前程似錦任君行",
            poemJapanese: "春風が雨を化し静かに潤す\n桃李満園で芳香が漂う\n貴人の引き立てで歩歩高く\n前途洋々自由に歩む",
            interpretation: "此籤表示將得貴人相助，事業順利，前程光明。",
            advice: "虛心學習，尊重前輩，貴人就在身邊。",
            categories: [.career, .general]
        ),
        FortuneStick(
            id: 10,
            number: "第十籤",
            level: .daJi,
            poem: "雨過天晴彩虹現\n苦盡甘來樂無邊\n守得雲開見月明\n美夢成真在今年",
            poemJapanese: "雨が過ぎ晴れて虹が現れ\n苦尽きて甘きが来て楽しみ無辺\n雲が開くのを待てば月明かり\n美しい夢が今年叶う",
            interpretation: "此籤表示困難即將過去，好運正在來臨，堅持就是勝利。",
            advice: "再堅持一下，黎明前的黑暗即將結束。",
            categories: [.general, .decision]
        ),
        
        // ===== 中吉籤 (11-30) =====
        FortuneStick(
            id: 11,
            number: "第十一籤",
            level: .zhongJi,
            poem: "春來花開滿園香\n蝴蝶飛舞繞芬芳\n把握時機勤耕耘\n秋收冬藏喜洋洋",
            poemJapanese: "春来りて花開き園に香満つ\n蝶が舞い芳香を巡る\n時機を把握し勤勉に耕し\n秋の収穫冬の蓄えで喜び満つ",
            interpretation: "此籤表示時機尚可，需要努力經營才能有所收獲。",
            advice: "現在播種，將來收穫，不要急於求成。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 12,
            number: "第十二籤",
            level: .zhongJi,
            poem: "明月當空照四方\n清風徐來暑氣消\n心靜自然涼如水\n萬事從容自逍遙",
            poemJapanese: "明月が空に輝き四方を照らす\n清風がゆるやかに暑気を消す\n心静かなれば自然と水のように涼しく\n万事従容として自在に遊ぶ",
            interpretation: "此籤表示保持平常心，不急不躁，事情自然會有好結果。",
            advice: "放慢腳步，靜心思考，答案自然浮現。",
            categories: [.decision, .general]
        ),
        FortuneStick(
            id: 13,
            number: "第十三籤",
            level: .zhongJi,
            poem: "行船遇順風\n百里不消時\n若問前程事\n揚帆正當期",
            poemJapanese: "船を行かせれば順風に遇い\n百里も時を消さず\n前程の事を問わば\n帆を揚げる正にその時",
            interpretation: "此籤表示目前運勢順暢，適合展開行動。",
            advice: "趁現在運勢好，積極推進計劃。",
            categories: [.travel, .career, .decision]
        ),
        FortuneStick(
            id: 14,
            number: "第十四籤",
            level: .zhongJi,
            poem: "柳暗花明又一村\n山窮水盡疑無路\n轉個彎處見光明\n峰迴路轉別有天",
            poemJapanese: "柳暗く花明るくまた一村\n山窮まり水尽きて路無きかと疑う\n角を曲がれば光明を見\n峰回り路転じて別天地",
            interpretation: "此籤表示遇到困難不要灰心，轉個念頭就有出路。",
            advice: "換個角度思考，困難中也藏著機會。",
            categories: [.decision, .general]
        ),
        FortuneStick(
            id: 15,
            number: "第十五籤",
            level: .zhongJi,
            poem: "緣份天注定\n相逢即是緣\n用心去經營\n感情自然甜",
            poemJapanese: "縁は天が定め\n出会いは即ち縁\n心を込めて営めば\n感情は自然と甘い",
            interpretation: "此籤主感情緣份，需要用心經營，不可強求。",
            advice: "感情需要耐心培養，急不得。",
            categories: [.love]
        ),
        FortuneStick(
            id: 16,
            number: "第十六籤",
            level: .zhongJi,
            poem: "財運中平莫強求\n安份守己福自留\n腳踏實地勤工作\n細水長流永不休",
            poemJapanese: "財運は中平で無理に求めず\n分を守り福は自ら留まる\n地に足をつけ勤勉に働けば\n細水長流で永遠に休まず",
            interpretation: "此籤財運平穩，不宜冒險投機，穩健經營為佳。",
            advice: "不要貪心，穩紮穩打才是致富之道。",
            categories: [.career]
        ),
        FortuneStick(
            id: 17,
            number: "第十七籤",
            level: .zhongJi,
            poem: "讀書用功終有報\n一分耕耘一分收\n金榜題名非偶然\n日積月累見成效",
            poemJapanese: "読書に励めば終に報われ\n一分の耕作で一分の収穫\n金榜に名を連ねるは偶然にあらず\n日積月累で成果を見る",
            interpretation: "此籤主學業穩步進展，繼續努力必有好成績。",
            advice: "每天進步一點點，積少成多。",
            categories: [.study]
        ),
        FortuneStick(
            id: 18,
            number: "第十八籤",
            level: .zhongJi,
            poem: "身體健康是財富\n飲食起居要規律\n心情愉快少煩惱\n長命百歲不是夢",
            poemJapanese: "身体の健康は財産\n飲食起居は規則正しく\n心情愉快で煩い少なく\n長寿百歳は夢にあらず",
            interpretation: "此籤主健康運勢平穩，注意保養可保無恙。",
            advice: "注意作息，適度運動，健康自然來。",
            categories: [.health]
        ),
        FortuneStick(
            id: 19,
            number: "第十九籤",
            level: .zhongJi,
            poem: "出門在外多小心\n逢人只說三分話\n謹慎行事少是非\n平安歸來見笑顏",
            poemJapanese: "外出時は多く用心し\n人に会えば三分の話のみ\n謹慎に事を行い是非少なく\n平安に帰りて笑顔を見る",
            interpretation: "此籤出行運勢尚可，但需小心謹慎。",
            advice: "出門前做好準備，旅途中保持警覺。",
            categories: [.travel]
        ),
        FortuneStick(
            id: 20,
            number: "第二十籤",
            level: .zhongJi,
            poem: "兩人相處需包容\n退一步海闊天空\n莫因小事傷和氣\n攜手同心向前衝",
            poemJapanese: "二人の付き合いには寛容が必要\n一歩退けば海闘天空\n小事で和気を傷つけず\n手を携え同心で前へ進む",
            interpretation: "此籤感情運勢中等，需要雙方共同努力。",
            advice: "多溝通，少計較，感情才能長久。",
            categories: [.love]
        ),
        FortuneStick(
            id: 21,
            number: "第二十一籤",
            level: .zhongJi,
            poem: "循序漸進莫心急\n穩紮穩打步步行\n雖無大進亦無退\n持之以恆終成功",
            poemJapanese: "順序を追って進み心急ぐな\n着実に歩歩進む\n大進なくとも退きもなく\n堅持すれば終に成功",
            interpretation: "此籤表示進展緩慢但穩定，耐心等待。",
            advice: "不要急躁，慢慢來比較快。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 22,
            number: "第二十二籤",
            level: .zhongJi,
            poem: "潛龍勿用待時機\n韜光養晦蓄精力\n一朝雲起龍飛天\n大展宏圖正當時",
            poemJapanese: "潜龍は用いず時機を待つ\n韜光養晦で精力を蓄え\n一朝雲起きて龍天に飛び\n大志を展く正にその時",
            interpretation: "此籤表示目前宜蓄積實力，等待更好時機。",
            advice: "現在不是行動的最佳時機，先做好準備。",
            categories: [.decision, .career]
        ),
        FortuneStick(
            id: 23,
            number: "第二十三籤",
            level: .zhongJi,
            poem: "雨後春筍節節高\n向上生長不停留\n機會來時要把握\n更上層樓展風采",
            poemJapanese: "雨後の筍は節々高く\n上へ生長して止まらず\n機会来たれば把握し\n更に上の階で風采を展く",
            interpretation: "此籤表示運勢上升中，把握機會可更進一步。",
            advice: "機會來了就要抓住，不要猶豫。",
            categories: [.career, .study]
        ),
        FortuneStick(
            id: 24,
            number: "第二十四籤",
            level: .zhongJi,
            poem: "桃花朵朵開\n春風送情來\n緣份自有定\n何須苦苦猜",
            poemJapanese: "桃の花が朵々と開き\n春風が情を送り来る\n縁には定めあり\n何故苦々と推測する",
            interpretation: "此籤桃花運不錯，但順其自然最好。",
            advice: "不要強求，緣份到了自然會遇到對的人。",
            categories: [.love]
        ),
        FortuneStick(
            id: 25,
            number: "第二十五籤",
            level: .zhongJi,
            poem: "家和萬事興\n和氣自生財\n互相多體諒\n幸福自然來",
            poemJapanese: "家和して万事興り\n和気は自ら財を生む\n互いに多く体諒し\n幸福は自然と来る",
            interpretation: "此籤主家庭運勢平穩，和睦相處最重要。",
            advice: "多關心家人，家庭和諧才是根本。",
            categories: [.general, .love]
        ),
        FortuneStick(
            id: 26,
            number: "第二十六籤",
            level: .zhongJi,
            poem: "積少成多不嫌少\n聚沙成塔見功效\n理財有方存儲好\n將來富足樂逍遙",
            poemJapanese: "積少成多で少なきを嫌わず\n沙を聚めて塔を成し功効を見る\n理財に方ありて貯蓄良く\n将来富足で楽しく遊ぶ",
            interpretation: "此籤財運平穩，宜理財儲蓄，不宜大投資。",
            advice: "養成儲蓄習慣，積少成多。",
            categories: [.career]
        ),
        FortuneStick(
            id: 27,
            number: "第二十七籤",
            level: .zhongJi,
            poem: "書中自有黃金屋\n勤學苦練終有成\n莫因困難就放棄\n堅持到底見曙光",
            poemJapanese: "書中に自ら黄金の屋あり\n勤学苦練で終に成就\n困難により放棄するな\n堅持到底で曙光を見る",
            interpretation: "此籤主學習運勢中等，需要加倍努力。",
            advice: "遇到困難不要放棄，堅持就是勝利。",
            categories: [.study]
        ),
        FortuneStick(
            id: 28,
            number: "第二十八籤",
            level: .zhongJi,
            poem: "養生之道在日常\n早睡早起身體壯\n心寬體健少病痛\n延年益壽保安康",
            poemJapanese: "養生の道は日常にあり\n早寝早起きで体壮健\n心広く体健やかで病痛少なく\n延年益寿で安康を保つ",
            interpretation: "此籤健康運勢平穩，注意日常保養。",
            advice: "規律生活，適當運動，預防勝於治療。",
            categories: [.health]
        ),
        FortuneStick(
            id: 29,
            number: "第二十九籤",
            level: .zhongJi,
            poem: "千里之行始足下\n一步一腳印前行\n雖然路遠終會到\n堅定信念向前衝",
            poemJapanese: "千里の行は足下より始まり\n一歩一歩足跡を残し前進\n路遠しと雖も終に着き\n信念堅く前へ進む",
            interpretation: "此籤表示目標雖遠但可達成，貴在堅持。",
            advice: "制定計劃，一步一步來，終會到達目的地。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 30,
            number: "第三十籤",
            level: .zhongJi,
            poem: "心誠則靈感應通\n神明保佑在冥冥\n但求問心無愧過\n福報自然隨身行",
            poemJapanese: "心誠なれば霊感応通じ\n神明の加護は冥々にあり\n ただ問心無愧に過ぎれば\n福報は自然と身に随う",
            interpretation: "此籤表示心存正念，自有神明庇佑。",
            advice: "行善積德，問心無愧，福報自來。",
            categories: [.general, .health]
        ),
        
        // ===== 小吉籤 (31-50) =====
        FortuneStick(
            id: 31,
            number: "第三十一籤",
            level: .xiaoJi,
            poem: "小有所成莫自滿\n謙虛謹慎再前行\n穩扎穩打步步進\n前途光明在眼前",
            poemJapanese: "小成ありて自ら満たず\n謙虚謹慎に再び前進\n着実に歩歩進み\n前途光明は眼前に",
            interpretation: "此籤表示小有進展，但不可驕傲自滿。",
            advice: "繼續保持努力，更大的成功在後頭。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 32,
            number: "第三十二籤",
            level: .xiaoJi,
            poem: "月有陰晴圓缺時\n人有悲歡離合事\n順其自然心不亂\n靜待花開好時機",
            poemJapanese: "月には陰晴円欠の時あり\n人には悲歓離合の事あり\n自然に順い心乱さず\n静かに花開く好機を待つ",
            interpretation: "此籤表示起伏不定，保持平常心最重要。",
            advice: "順其自然，不要強求，時機自會到來。",
            categories: [.general, .decision]
        ),
        FortuneStick(
            id: 33,
            number: "第三十三籤",
            level: .xiaoJi,
            poem: "有情人終成眷屬\n但須耐心等時機\n緣份未到莫強求\n水到渠成自然成",
            poemJapanese: "有情の人は終に眷属と成り\n ただし耐心で時機を待つ\n縁未だ到らず無理に求めず\n水到り渠成りて自然に成る",
            interpretation: "此籤感情運勢需要耐心，時機未到不宜急進。",
            advice: "先充實自己，緣份到了自然會遇到。",
            categories: [.love]
        ),
        FortuneStick(
            id: 34,
            number: "第三十四籤",
            level: .xiaoJi,
            poem: "財運小有進展時\n莫貪大利守本分\n穩健投資有小利\n知足常樂是福氣",
            poemJapanese: "財運小しく進展の時\n大利を貪らず本分を守る\n穏健な投資で小利あり\n知足常楽は福気なり",
            interpretation: "此籤財運小有斬獲，但不宜貪心。",
            advice: "見好就收，不要貪心，小利積累成大財。",
            categories: [.career]
        ),
        FortuneStick(
            id: 35,
            number: "第三十五籤",
            level: .xiaoJi,
            poem: "學海無涯勤是岸\n書山有路勤為徑\n雖有困難別氣餒\n努力終有出頭天",
            poemJapanese: "学海無涯で勤は岸\n書山に路あり勤を径と為す\n困難ありとも気を落とさず\n努力すれば終に頭角を現す",
            interpretation: "此籤學業運勢平平，需要加倍用功。",
            advice: "勤能補拙，多花時間複習，成績會進步。",
            categories: [.study]
        ),
        FortuneStick(
            id: 36,
            number: "第三十六籤",
            level: .xiaoJi,
            poem: "身體小恙不必慌\n注意休息多保養\n飲食清淡勤運動\n恢復健康不需長",
            poemJapanese: "身体の小恙に慌てず\n休息に注意し多く保養し\n飲食清淡で勤勉に運動\n健康回復は長からず",
            interpretation: "此籤健康有小問題，但不嚴重，注意保養即可。",
            advice: "多休息，注意飲食，小病自然會好。",
            categories: [.health]
        ),
        FortuneStick(
            id: 37,
            number: "第三十七籤",
            level: .xiaoJi,
            poem: "出行小心無大礙\n逢人少說是非事\n低調行事保平安\n順利歸來笑開懷",
            poemJapanese: "出行は小心なれば大事なし\n人に会えば是非の事少なく言う\n低調に事を行い平安を保ち\n順利に帰りて笑い開く",
            interpretation: "此籤出行運勢尚可，謹慎行事可保平安。",
            advice: "出門在外小心謹慎，少管閒事。",
            categories: [.travel]
        ),
        FortuneStick(
            id: 38,
            number: "第三十八籤",
            level: .xiaoJi,
            poem: "事業小成莫自滿\n再接再厲向前看\n機會總是留給準備好的人\n繼續努力終會有大成",
            poemJapanese: "事業小成で自ら満たず\n再接再厲で前を見る\n機会は常に準備ある人に留まる\n努力を続ければ終に大成",
            interpretation: "此籤事業小有成就，但仍需努力。",
            advice: "不要因小成就而滿足，繼續進步。",
            categories: [.career]
        ),
        FortuneStick(
            id: 39,
            number: "第三十九籤",
            level: .xiaoJi,
            poem: "春天播種秋收穫\n耐心等待好時節\n雖然進展有點慢\n終會迎來豐收季",
            poemJapanese: "春に種蒔き秋に収穫\n耐心で好い時節を待つ\n進展は少し遅きと雖も\n終に豊収の季を迎える",
            interpretation: "此籤表示進展緩慢，但最終會有成果。",
            advice: "保持耐心，繼續努力，成果會來的。",
            categories: [.general]
        ),
        FortuneStick(
            id: 40,
            number: "第四十籤",
            level: .xiaoJi,
            poem: "貴人相助在暗處\n時機成熟自會來\n且將心事放一邊\n順其自然最自在",
            poemJapanese: "貴人の助けは暗処にあり\n時機成熟すれば自ら来る\n且つ心事を一辺に放ち\n自然に順うのが最も自在",
            interpretation: "此籤表示會有貴人相助，但需等待時機。",
            advice: "放輕鬆，該來的會來，不必焦慮。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 41,
            number: "第四十一籤",
            level: .xiaoJi,
            poem: "緣淺緣深皆是緣\n用心經營情意綿\n切莫因小失大好\n包容理解最重要",
            poemJapanese: "縁浅き縁深きは皆縁なり\n用心して営めば情意綿々\n小事で大事を失うな\n包容理解が最も重要",
            interpretation: "此籤感情有小波折，需要包容理解。",
            advice: "多溝通，少計較，感情需要經營。",
            categories: [.love]
        ),
        FortuneStick(
            id: 42,
            number: "第四十二籤",
            level: .xiaoJi,
            poem: "守得住寂寞\n等得到花開\n默默努力中\n終會有驚喜",
            poemJapanese: "寂しさを守り\n花開くを待てば\n黙々と努力の中\n終に驚きあり",
            interpretation: "此籤表示目前運勢平淡，但持續努力會有驚喜。",
            advice: "耐住寂寞，繼續努力，好事會發生。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 43,
            number: "第四十三籤",
            level: .xiaoJi,
            poem: "小舟行在大海中\n雖有波浪亦前行\n只要方向不偏離\n終會抵達目的地",
            poemJapanese: "小舟が大海を行く中\n波浪あれども亦前進\n只要方向が離れざれば\n終に目的地に抵る",
            interpretation: "此籤表示雖有困難但仍可前進，方向正確最重要。",
            advice: "確認目標，堅定信念，困難終會過去。",
            categories: [.decision, .travel]
        ),
        FortuneStick(
            id: 44,
            number: "第四十四籤",
            level: .xiaoJi,
            poem: "投資理財需謹慎\n小進小出保平安\n莫貪大利忘風險\n穩健經營最安全",
            poemJapanese: "投資理財は謹慎を要す\n小進小出で平安を保つ\n大利を貪り風険を忘れるな\n穏健経営が最も安全",
            interpretation: "此籤財運平穩，適合保守投資。",
            advice: "不要冒險，穩健投資，保本最重要。",
            categories: [.career]
        ),
        FortuneStick(
            id: 45,
            number: "第四十五籤",
            level: .xiaoJi,
            poem: "學業進步慢慢來\n一步一腳印前行\n急不得也慢不得\n剛剛好的節奏最合適",
            poemJapanese: "学業進歩はゆっくり来る\n一歩一歩足跡を残し前進\n急がず緩まず\n丁度良い節奏が最も合適",
            interpretation: "此籤學業運勢平穩，按部就班即可。",
            advice: "保持現有的學習節奏，不要急躁。",
            categories: [.study]
        ),
        FortuneStick(
            id: 46,
            number: "第四十六籤",
            level: .xiaoJi,
            poem: "養生之道貴持久\n一日不可廢此功\n雖無大病需預防\n防患未然保健康",
            poemJapanese: "養生の道は持久を貴ぶ\n一日もこの功を廃するべからず\n大病なしと雖も予防を要す\n患いを未然に防ぎ健康を保つ",
            interpretation: "此籤健康運勢平穩，注意預防保健。",
            advice: "養成健康習慣，預防勝於治療。",
            categories: [.health]
        ),
        FortuneStick(
            id: 47,
            number: "第四十七籤",
            level: .xiaoJi,
            poem: "家有一老如有一寶\n敬老愛幼是美德\n家庭和睦財自來\n團團圓圓最幸福",
            poemJapanese: "家に一老あれば一宝あるが如し\n老を敬い幼を愛するは美徳\n家庭和睦すれば財自ら来る\n団団円円が最も幸福",
            interpretation: "此籤主家庭運勢平穩，和睦相處最重要。",
            advice: "多陪伴家人，家和萬事興。",
            categories: [.general]
        ),
        FortuneStick(
            id: 48,
            number: "第四十八籤",
            level: .xiaoJi,
            poem: "待人接物需謙和\n與人為善結善緣\n人緣好時運自好\n貴人相助在眼前",
            poemJapanese: "人に接し物を待つは謙和を要す\n人と善を為し善縁を結ぶ\n人縁良ければ運自ら良し\n貴人の助けは眼前にあり",
            interpretation: "此籤表示人際關係影響運勢，待人和善可得貴人。",
            advice: "多交朋友，廣結善緣，運氣會更好。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 49,
            number: "第四十九籤",
            level: .xiaoJi,
            poem: "細雨潤無聲\n春風吹又生\n付出終有報\n耐心等佳音",
            poemJapanese: "細雨は静かに潤し\n春風が吹きて又生ず\n付出は終に報われ\n耐心で佳音を待つ",
            interpretation: "此籤表示付出會有回報，但需要耐心等待。",
            advice: "繼續努力，好消息會來的。",
            categories: [.general]
        ),
        FortuneStick(
            id: 50,
            number: "第五十籤",
            level: .xiaoJi,
            poem: "明知山有虎\n偏向虎山行\n有膽有識者\n終能成大事",
            poemJapanese: "山に虎ありと明知し\n偏に虎山へ向かう\n胆識ある者は\n終に大事を成す",
            interpretation: "此籤表示雖有挑戰但可嘗試，有勇有謀可成功。",
            advice: "做好準備，勇敢面對挑戰。",
            categories: [.decision, .career]
        ),
        
        // ===== 平籤 (51-70) =====
        FortuneStick(
            id: 51,
            number: "第五十一籤",
            level: .ping,
            poem: "不上不下居中間\n不好不壞亦尋常\n保持現狀莫急進\n靜觀其變待時機",
            poemJapanese: "上下せず中間に居り\n良くも悪くも尋常なり\n現状を保ち急進するな\n静かに変を観て時機を待つ",
            interpretation: "此籤表示運勢平平，不宜大動作，維持現狀為宜。",
            advice: "不要急著改變，觀察形勢再行動。",
            categories: [.general, .decision]
        ),
        FortuneStick(
            id: 52,
            number: "第五十二籤",
            level: .ping,
            poem: "平平淡淡才是真\n無風無浪最安穩\n莫羨他人大富貴\n知足常樂心安寧",
            poemJapanese: "平々淡々が真なり\n風浪なきが最も安穏\n他人の大富貴を羨むな\n知足常楽で心安寧",
            interpretation: "此籤表示運勢平穩，無大起大落，平凡是福。",
            advice: "珍惜當下的平穩，知足常樂。",
            categories: [.general]
        ),
        FortuneStick(
            id: 53,
            number: "第五十三籤",
            level: .ping,
            poem: "感情之事順其然\n強求不得亦枉然\n若有緣份自會來\n無緣強求亦徒勞",
            poemJapanese: "感情の事は自然に順え\n強いて求むるを得ずして枉然なり\n若し縁あらば自ずと来る\n縁なくして強いて求むるは徒労",
            interpretation: "此籤感情運勢平平，緣份未定，不宜強求。",
            advice: "順其自然，不要太執著於感情。",
            categories: [.love]
        ),
        FortuneStick(
            id: 54,
            number: "第五十四籤",
            level: .ping,
            poem: "財運不好不壞時\n守住本業最穩當\n莫要妄想一夜富\n腳踏實地慢慢來",
            poemJapanese: "財運良くも悪くもなき時\n本業を守るが最も穏当\n一夜の富を妄想するな\n地に足をつけてゆっくり来る",
            interpretation: "此籤財運平平，不宜冒險，守成為上。",
            advice: "專注本業，不要投機取巧。",
            categories: [.career]
        ),
        FortuneStick(
            id: 55,
            number: "第五十五籤",
            level: .ping,
            poem: "讀書成績中平穩\n不高不低亦尋常\n繼續努力不放鬆\n終會有所突破時",
            poemJapanese: "読書の成績は中平で穏やか\n高くも低くも尋常なり\n努力を続け緩めず\n終に突破の時あり",
            interpretation: "此籤學業運勢平穩，維持努力可逐步提升。",
            advice: "保持現有努力，不要鬆懈。",
            categories: [.study]
        ),
        FortuneStick(
            id: 56,
            number: "第五十六籤",
            level: .ping,
            poem: "身體無大礙\n平日多保養\n勿因小毛病\n疏忽成大患",
            poemJapanese: "身体は大事なし\n平日多く保養し\n小さな病気で\n大患を成すな",
            interpretation: "此籤健康運勢平穩，但仍需注意保養。",
            advice: "小病不能忽視，定期健康檢查。",
            categories: [.health]
        ),
        FortuneStick(
            id: 57,
            number: "第五十七籤",
            level: .ping,
            poem: "出行平安無大事\n小心謹慎保周全\n逢人莫說是非話\n平平安安最重要",
            poemJapanese: "出行は平安で大事なし\n小心謹慎で周全を保つ\n人に会いて是非の話をするな\n平々安々が最も重要",
            interpretation: "此籤出行運勢平穩，謹慎行事可保平安。",
            advice: "出門低調，不惹是非，平安最重要。",
            categories: [.travel]
        ),
        FortuneStick(
            id: 58,
            number: "第五十八籤",
            level: .ping,
            poem: "事業平穩無大進\n亦無後退守中庸\n待時而動最穩妥\n切莫冒進失方寸",
            poemJapanese: "事業は平穏で大進なし\n亦後退なく中庸を守る\n時を待ちて動くが最も穏当\n冒進して方寸を失うな",
            interpretation: "此籤事業運勢平穩，不宜冒進，守成為上。",
            advice: "維持現狀，等待更好的機會。",
            categories: [.career]
        ),
        FortuneStick(
            id: 59,
            number: "第五十九籤",
            level: .ping,
            poem: "兩人相處平平淡\n既無大喜亦無憂\n細水長流才長久\n平淡之中見真情",
            poemJapanese: "二人の付き合いは平々淡々\n大喜びもなく憂いもなし\n細水長流こそ長久\n平淡の中に真情を見る",
            interpretation: "此籤感情運勢平穩，雖無激情但關係穩定。",
            advice: "平淡也是一種幸福，珍惜當下。",
            categories: [.love]
        ),
        FortuneStick(
            id: 60,
            number: "第六十籤",
            level: .ping,
            poem: "進退兩難難抉擇\n左右為難費思量\n不如暫時停一停\n等待時機再前行",
            poemJapanese: "進退両難で決択し難く\n左右為難で思量を費やす\n暫く停まるに如かず\n時機を待ちて再び前進",
            interpretation: "此籤表示目前面臨抉擇，暫時不宜決定。",
            advice: "不要急著做決定，多收集資訊再判斷。",
            categories: [.decision]
        ),
        FortuneStick(
            id: 61,
            number: "第六十一籤",
            level: .ping,
            poem: "浮雲遮日暫時蔽\n終有雲開見日時\n莫因一時不順遂\n否極泰來自有期",
            poemJapanese: "浮雲が日を遮り暫く蔽う\n終に雲開き日を見る時あり\n一時の不順で落胆するな\n否極まりて泰来る自ら期あり",
            interpretation: "此籤表示目前運勢受阻，但終會好轉。",
            advice: "暫時的困難會過去，保持信心。",
            categories: [.general]
        ),
        FortuneStick(
            id: 62,
            number: "第六十二籤",
            level: .ping,
            poem: "春去秋來又一年\n時光匆匆莫等閒\n珍惜當下每一刻\n把握機會莫遲疑",
            poemJapanese: "春去り秋来りて又一年\n時光匆々として等閑にするな\n当下の毎一刻を珍惜し\n機会を把握して遅疑するな",
            interpretation: "此籤提醒珍惜時間，不要虛度光陰。",
            advice: "時間寶貴，有機會就要把握。",
            categories: [.general]
        ),
        FortuneStick(
            id: 63,
            number: "第六十三籤",
            level: .ping,
            poem: "風平浪靜暫安寧\n小船隨波逐流行\n既無大風亦無雨\n平穩前行看風景",
            poemJapanese: "風平らぎ浪静かにして暫く安寧\n小船は波に随い流れに逐う\n大風もなく雨もなく\n平穏に前進して風景を見る",
            interpretation: "此籤表示目前運勢平穩，沒有大起大落。",
            advice: "享受平靜的時光，充實自己。",
            categories: [.general, .travel]
        ),
        FortuneStick(
            id: 64,
            number: "第六十四籤",
            level: .ping,
            poem: "投資理財宜保守\n不求大利求穩妥\n守住本金最重要\n待時而動見真章",
            poemJapanese: "投資理財は保守を宜しとす\n大利を求めず穏当を求む\n本金を守るが最も重要\n時を待ちて動き真章を見る",
            interpretation: "此籤財運平平，不宜冒險投資。",
            advice: "保本最重要，不要追求高風險高回報。",
            categories: [.career]
        ),
        FortuneStick(
            id: 65,
            number: "第六十五籤",
            level: .ping,
            poem: "家庭平穩無大事\n日常瑣碎亦尋常\n珍惜平凡的幸福\n家和萬事自然興",
            poemJapanese: "家庭は平穏で大事なし\n日常の瑣碎も尋常なり\n平凡な幸福を珍惜し\n家和して万事自然に興る",
            interpretation: "此籤家庭運勢平穩，維持和諧最重要。",
            advice: "珍惜家人，多陪伴關心。",
            categories: [.general]
        ),
        FortuneStick(
            id: 66,
            number: "第六十六籤",
            level: .ping,
            poem: "考試成績中平穩\n既無大進亦無退\n保持努力不鬆懈\n漸漸會有好成績",
            poemJapanese: "試験の成績は中平穏やか\n大進もなく退きもなし\n努力を保ち緩めず\n漸く良い成績あり",
            interpretation: "此籤學業運勢平穩，繼續努力會有進步。",
            advice: "保持學習態度，成績會慢慢提升。",
            categories: [.study]
        ),
        FortuneStick(
            id: 67,
            number: "第六十七籤",
            level: .ping,
            poem: "身體健康無大礙\n小病小痛亦平常\n注意飲食與作息\n養生之道貴堅持",
            poemJapanese: "身体は健康で大事なし\n小病小痛も平常なり\n飲食と作息に注意し\n養生の道は堅持を貴ぶ",
            interpretation: "此籤健康運勢平穩，注意日常保健。",
            advice: "規律作息，均衡飲食，保持健康。",
            categories: [.health]
        ),
        FortuneStick(
            id: 68,
            number: "第六十八籤",
            level: .ping,
            poem: "人際關係保平穩\n不遠不近最適當\n廣結善緣是好事\n但莫交友不擇人",
            poemJapanese: "人際関係は平穏を保ち\n遠からず近からずが最も適当\n広く善縁を結ぶは好事\n但し友を交えて人を択ばざるな",
            interpretation: "此籤人際關係運勢平穩，交友需謹慎。",
            advice: "擇友而交，不必勉強維持不適合的關係。",
            categories: [.general]
        ),
        FortuneStick(
            id: 69,
            number: "第六十九籤",
            level: .ping,
            poem: "工作平穩無大變\n日復一日亦尋常\n莫要急著求改變\n穩定之中求發展",
            poemJapanese: "工作は平穏で大変なし\n日復一日も尋常なり\n変化を急いで求めるな\n安定の中で発展を求む",
            interpretation: "此籤事業運勢平穩，不宜急於求變。",
            advice: "在穩定中尋求突破，不要冒然改變。",
            categories: [.career]
        ),
        FortuneStick(
            id: 70,
            number: "第七十籤",
            level: .ping,
            poem: "感情不溫亦不火\n平平淡淡過日子\n雖無浪漫亦無憂\n細水長流見真心",
            poemJapanese: "感情は温かくも火熱くもなく\n平々淡々と日を過ごす\n浪漫なくも憂いなく\n細水長流で真心を見る",
            interpretation: "此籤感情運勢平穩，雖無激情但關係穩定。",
            advice: "平淡中見真情，不要追求刺激。",
            categories: [.love]
        ),
        
        // ===== 小凶籤 (71-85) =====
        FortuneStick(
            id: 71,
            number: "第七十一籤",
            level: .xiaoXiong,
            poem: "烏雲蔽日暫時遮\n心中煩悶莫憂慮\n雨過天晴總有時\n耐心等待見光明",
            poemJapanese: "烏雲が日を蔽い暫く遮る\n心中煩悶すれども憂慮するな\n雨過ぎ天晴れる時必ずあり\n耐心で待てば光明を見る",
            interpretation: "此籤表示目前運勢低迷，但不會持續太久。",
            advice: "耐心等待，困難很快會過去。",
            categories: [.general]
        ),
        FortuneStick(
            id: 72,
            number: "第七十二籤",
            level: .xiaoXiong,
            poem: "感情多波折\n緣份待考驗\n莫因一時困\n放棄真感情",
            poemJapanese: "感情は波折多く\n縁は考験を待つ\n一時の困難で\n真の感情を放棄するな",
            interpretation: "此籤感情有波折，需要耐心經營。",
            advice: "感情需要時間考驗，不要輕易放棄。",
            categories: [.love]
        ),
        FortuneStick(
            id: 73,
            number: "第七十三籤",
            level: .xiaoXiong,
            poem: "財運欠佳莫強求\n守住本錢最穩妥\n投機取巧恐失利\n腳踏實地慢慢來",
            poemJapanese: "財運欠佳で強いて求めるな\n本銭を守るが最も穏当\n投機取巧は失利を恐れ\n地に足をつけてゆっくり来る",
            interpretation: "此籤財運不佳，不宜投資冒險。",
            advice: "保守理財，不要追求高風險投資。",
            categories: [.career]
        ),
        FortuneStick(
            id: 74,
            number: "第七十四籤",
            level: .xiaoXiong,
            poem: "學業遇阻莫氣餒\n困難只是暫時的\n加倍努力終會過\n撥雲見日有希望",
            poemJapanese: "学業が阻まれても気を落とすな\n困難はただ暫時のもの\n倍加努力すれば終に過ぎ\n雲を撥いて日を見れば希望あり",
            interpretation: "此籤學業運勢不佳，但努力可改善。",
            advice: "不要灰心，加倍努力，終會好轉。",
            categories: [.study]
        ),
        FortuneStick(
            id: 75,
            number: "第七十五籤",
            level: .xiaoXiong,
            poem: "身體微恙需注意\n切莫輕忽小毛病\n早日就醫保健康\n拖延恐怕釀大患",
            poemJapanese: "身体の微恙は注意を要す\n小さな病気を軽忽するな\n早日に医者に見せて健康を保ち\n遅延すれば大患を醸すを恐れる",
            interpretation: "此籤健康有小問題，不可輕忽。",
            advice: "有任何不適要及早就醫，不要拖延。",
            categories: [.health]
        ),
        FortuneStick(
            id: 76,
            number: "第七十六籤",
            level: .xiaoXiong,
            poem: "出行不宜在此時\n暫且延後為上策\n若是硬行恐不順\n待時而動保平安",
            poemJapanese: "出行はこの時宜しからず\n暫く延後するを上策とす\n若し強いて行けば不順を恐れ\n時を待ちて動き平安を保つ",
            interpretation: "此籤出行運勢不佳，宜延後或取消。",
            advice: "不急的話，建議延後出行計劃。",
            categories: [.travel]
        ),
        FortuneStick(
            id: 77,
            number: "第七十七籤",
            level: .xiaoXiong,
            poem: "事業遇阻難前行\n小人當道需防備\n謹言慎行避是非\n待時而動見曙光",
            poemJapanese: "事業が阻まれ前進し難く\n小人当道で防備を要す\n言を謹み行を慎み是非を避け\n時を待ちて動けば曙光を見る",
            interpretation: "此籤事業運勢不佳，小心小人。",
            advice: "職場上謹言慎行，不要捲入是非。",
            categories: [.career]
        ),
        FortuneStick(
            id: 78,
            number: "第七十八籤",
            level: .xiaoXiong,
            poem: "兩人相處有摩擦\n小事爭吵傷和氣\n退一步海闘天空\n包容理解化干戈",
            poemJapanese: "二人の付き合いに摩擦あり\n小事の争いで和気を傷つく\n一歩退けば海闘天空\n包容理解で干戈を化す",
            interpretation: "此籤感情有摩擦，需要互相包容。",
            advice: "多溝通，少計較，包容理解最重要。",
            categories: [.love]
        ),
        FortuneStick(
            id: 79,
            number: "第七十九籤",
            level: .xiaoXiong,
            poem: "家中不和須調解\n互相體諒消嫌隙\n家和方能萬事興\n莫因小事傷親情",
            poemJapanese: "家中不和は調解を須う\n互いに体諒して嫌隙を消す\n家和して方に万事興り\n小事で親情を傷つけるな",
            interpretation: "此籤家庭有不和諧，需要調解。",
            advice: "家人之間多溝通，化解矛盾。",
            categories: [.general]
        ),
        FortuneStick(
            id: 80,
            number: "第八十籤",
            level: .xiaoXiong,
            poem: "投資失利莫傷心\n塞翁失馬焉知非福\n亡羊補牢猶未晚\n吸取教訓再出發",
            poemJapanese: "投資失利しても心傷めるな\n塞翁が馬失うも焉んぞ非福と知らん\n亡羊補牢は猶未だ晚からず\n教訓を吸い取り再出発",
            interpretation: "此籤財運不佳，投資可能失利。",
            advice: "從失敗中學習，不要一蹶不振。",
            categories: [.career]
        ),
        FortuneStick(
            id: 81,
            number: "第八十一籤",
            level: .xiaoXiong,
            poem: "逆水行舟需努力\n不進則退須警惕\n雖然辛苦莫放棄\n堅持到底見曙光",
            poemJapanese: "逆水に舟を行かせるは努力を要す\n進まざれば退く警惕を須う\n辛苦と雖も放棄するな\n堅持到底で曙光を見る",
            interpretation: "此籤表示目前逆境，需要努力克服。",
            advice: "不要放棄，堅持下去會好轉。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 82,
            number: "第八十二籤",
            level: .xiaoXiong,
            poem: "抉擇困難難下定\n左思右想費心神\n不如暫時停一停\n待頭腦清醒再決定",
            poemJapanese: "抉択困難で定め難く\n左思右想で心神を費やす\n暫く停まるに如かず\n頭脳清醒を待ちて再び決定",
            interpretation: "此籤表示目前不宜做重大決定。",
            advice: "不要急著決定，多收集資訊再判斷。",
            categories: [.decision]
        ),
        FortuneStick(
            id: 83,
            number: "第八十三籤",
            level: .xiaoXiong,
            poem: "人際關係有阻礙\n是非口舌需防備\n謹言慎行避小人\n莫與他人起爭端",
            poemJapanese: "人際関係に阻礙あり\n是非口舌は防備を要す\n言を謹み行を慎み小人を避け\n他人と争端を起こすな",
            interpretation: "此籤人際關係有問題，小心是非。",
            advice: "職場社交謹言慎行，不要捲入是非。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 84,
            number: "第八十四籤",
            level: .xiaoXiong,
            poem: "考試成績不理想\n需要加倍努力了\n莫因挫折就灰心\n失敗乃成功之母",
            poemJapanese: "試験の成績は理想的でなく\n倍加努力する必要あり\n挫折で灰心するな\n失敗は成功の母",
            interpretation: "此籤學業運勢不佳，需要加倍努力。",
            advice: "不要灰心，找出問題，努力改進。",
            categories: [.study]
        ),
        FortuneStick(
            id: 85,
            number: "第八十五籤",
            level: .xiaoXiong,
            poem: "情緒低落心煩躁\n調整心態最重要\n與友傾訴解憂愁\n陰霾終會散去時",
            poemJapanese: "情緒低落で心煩躁\n心態を調整するが最も重要\n友と語り憂愁を解き\n陰霾は終に散去する時あり",
            interpretation: "此籤表示心情低落，需要調整心態。",
            advice: "找人傾訴，調整心情，困難會過去。",
            categories: [.general, .health]
        ),
        
        // ===== 凶籤 (86-100) =====
        FortuneStick(
            id: 86,
            number: "第八十六籤",
            level: .xiong,
            poem: "暴風雨前黑雲密\n狂風暴雨即將至\n謹守家門莫外出\n待風雨過見晴天",
            poemJapanese: "暴風雨前に黒雲密集\n狂風暴雨が間もなく至る\n家門を謹守し外出するな\n風雨過ぎれば晴天を見る",
            interpretation: "此籤表示運勢不佳，宜謹慎行事，避免外出冒險。",
            advice: "這段時間要低調行事，不宜冒險，等待時機好轉。",
            categories: [.general, .travel]
        ),
        FortuneStick(
            id: 87,
            number: "第八十七籤",
            level: .xiong,
            poem: "感情分離恐難免\n緣盡情了莫強求\n若是硬留徒傷心\n放手或是新開始",
            poemJapanese: "感情分離は免れ難きを恐れ\n縁尽き情了われば強いて求めるな\n若し強いて留めれば徒に心傷み\n放手すれば或いは新たな始まり",
            interpretation: "此籤感情運勢不佳，可能面臨分離。",
            advice: "緣份盡了不要強求，放手也許是新的開始。",
            categories: [.love]
        ),
        FortuneStick(
            id: 88,
            number: "第八十八籤",
            level: .xiong,
            poem: "財運大凶需謹慎\n投資理財恐失利\n守住本錢最重要\n切莫貪心反蝕把米",
            poemJapanese: "財運大凶で謹慎を要す\n投資理財は失利を恐れ\n本銭を守るが最も重要\n貪心すれば却って把米を蝕む",
            interpretation: "此籤財運大凶，投資恐有損失。",
            advice: "不要投資，守住手上的錢，避免借貸。",
            categories: [.career]
        ),
        FortuneStick(
            id: 89,
            number: "第八十九籤",
            level: .xiong,
            poem: "學業不順心煩躁\n考試失利莫氣餒\n檢討原因再出發\n失敗乃成功之母",
            poemJapanese: "学業不順で心煩躁\n試験失利しても気を落とすな\n原因を検討して再出発\n失敗は成功の母",
            interpretation: "此籤學業運勢很差，考試可能不理想。",
            advice: "冷靜面對，找出問題所在，重新出發。",
            categories: [.study]
        ),
        FortuneStick(
            id: 90,
            number: "第九十籤",
            level: .xiong,
            poem: "身體違和需注意\n及早就醫勿延遲\n若是輕忽恐加重\n健康為重莫兒戲",
            poemJapanese: "身体違和は注意を要す\n及早に就医し遅延するな\n若し軽忽すれば加重を恐れ\n健康を重んじて児戯にするな",
            interpretation: "此籤健康運勢不佳，需要注意身體狀況。",
            advice: "有任何不適立刻就醫，不要拖延。",
            categories: [.health]
        ),
        FortuneStick(
            id: 91,
            number: "第九十一籤",
            level: .xiong,
            poem: "出行大凶宜延後\n旅途恐有意外事\n留在原地保平安\n待運勢好轉再行",
            poemJapanese: "出行は大凶で延後を宜しとす\n旅途に意外の事ある恐れ\n原地に留まり平安を保ち\n運勢好転を待ちて再び行く",
            interpretation: "此籤出行運勢極差，強烈建議取消或延後。",
            advice: "這段時間不要遠行，待在原地最安全。",
            categories: [.travel]
        ),
        FortuneStick(
            id: 92,
            number: "第九十二籤",
            level: .xiong,
            poem: "事業遭逢大挫折\n小人當道需防備\n暫時退避三舍吧\n待東山再起有時",
            poemJapanese: "事業が大挫折に遭い\n小人当道で防備を要す\n暫く退避三舎せよ\n東山再起の時を待つ",
            interpretation: "此籤事業運勢很差，可能遭逢挫折。",
            advice: "暫時退讓，保存實力，等待東山再起。",
            categories: [.career]
        ),
        FortuneStick(
            id: 93,
            number: "第九十三籤",
            level: .xiong,
            poem: "家門不幸有災殃\n家人失和須化解\n若是放任不調解\n恐怕家散人離場",
            poemJapanese: "家門不幸で災殃あり\n家人失和は化解を須う\n若し放任して調解せざれば\n恐らくは家散じ人離れる",
            interpretation: "此籤家庭運勢不佳，家人可能失和。",
            advice: "主動化解矛盾，不要讓問題惡化。",
            categories: [.general]
        ),
        FortuneStick(
            id: 94,
            number: "第九十四籤",
            level: .xiong,
            poem: "感情破裂難挽回\n強求只會更傷心\n不如放手各自飛\n緣盡情了莫留戀",
            poemJapanese: "感情破裂で挽回し難く\n強いて求むれば只更に心傷む\n放手して各自飛ぶに如かず\n縁尽き情了われば留恋するな",
            interpretation: "此籤感情運勢極差，可能面臨分手。",
            advice: "如果真的無法挽回，放手也是一種解脫。",
            categories: [.love]
        ),
        FortuneStick(
            id: 95,
            number: "第九十五籤",
            level: .xiong,
            poem: "是非口舌纏上身\n謹言慎行避災禍\n莫與小人起爭端\n忍一時海闘天空",
            poemJapanese: "是非口舌が身に纏い\n言を謹み行を慎み災禍を避け\n小人と争端を起こすな\n一時を忍べば海闘天空",
            interpretation: "此籤人際關係運勢很差，可能有是非口舌。",
            advice: "謹言慎行，不要捲入是非，忍耐為上。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 96,
            number: "第九十六籤",
            level: .xiong,
            poem: "投資血本無歸時\n錢財損失難避免\n亡羊補牢猶未晚\n保住剩餘最重要",
            poemJapanese: "投資で血本帰らざる時\n銭財損失は免れ難し\n亡羊補牢は猶未だ晚からず\n残りを保つが最も重要",
            interpretation: "此籤財運極差，投資恐有重大損失。",
            advice: "立刻停止所有投資，保住剩餘的錢。",
            categories: [.career]
        ),
        FortuneStick(
            id: 97,
            number: "第九十七籤",
            level: .xiong,
            poem: "山窮水盡疑無路\n走投無路心徬徨\n莫要絕望尋短見\n柳暗花明總有時",
            poemJapanese: "山窮まり水尽きて路無きかと疑い\n走投無路で心彷徨う\n絶望して短見を尋ねるな\n柳暗花明の時必ずあり",
            interpretation: "此籤表示目前處境艱難，但不要絕望。",
            advice: "困難是暫時的，尋求幫助，不要做傻事。",
            categories: [.general]
        ),
        FortuneStick(
            id: 98,
            number: "第九十八籤",
            level: .xiong,
            poem: "健康亮紅燈\n疾病纏上身\n切莫再拖延\n速速求醫去",
            poemJapanese: "健康は赤信号\n疾病が身に纏い\n再び遅延するな\n速速と医を求めよ",
            interpretation: "此籤健康運勢極差，可能有疾病。",
            advice: "立刻去看醫生，不要再拖延了！",
            categories: [.health]
        ),
        FortuneStick(
            id: 99,
            number: "第九十九籤",
            level: .xiong,
            poem: "禍從口出需謹慎\n一言不慎惹禍端\n守口如瓶最安全\n沉默是金莫多言",
            poemJapanese: "禍は口より出で謹慎を要す\n一言不慎で禍端を惹く\n口を守りて瓶の如きが最も安全\n沈黙は金で多言するな",
            interpretation: "此籤表示言語可能惹禍，需要謹言慎行。",
            advice: "少說話，不要議論他人，沉默是金。",
            categories: [.general, .career]
        ),
        FortuneStick(
            id: 100,
            number: "第一百籤",
            level: .xiong,
            poem: "否極泰來終有時\n黑夜過後見黎明\n雖然目前運勢差\n守得雲開見月明",
            poemJapanese: "否極まりて泰来る終に時あり\n黒夜過ぎれば黎明を見る\n目前運勢差しと雖も\n雲開くを守れば月明を見る",
            interpretation: "此籤雖為凶籤，但提醒黑暗終會過去。",
            advice: "最壞的時候快過去了，堅持下去就是勝利。",
            categories: [.general]
        )
    ]
    
    // 隨機抽籤
    static func drawRandom() -> FortuneStick {
        return sticks.randomElement()!
    }
    
    // 根據類別抽籤
    static func drawByCategory(_ category: FortuneCategory) -> FortuneStick {
        let filtered = sticks.filter { $0.categories.contains(category) }
        return filtered.randomElement() ?? drawRandom()
    }
}

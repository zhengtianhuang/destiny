import SwiftUI
import CoreMotion

struct FortuneStickView: View {
    @StateObject private var viewModel = FortuneStickViewModel()
    @State private var showResult = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                // 背景
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(red: 0.1, green: 0.05, blue: 0.15),
                        Color(red: 0.2, green: 0.1, blue: 0.25),
                        Color(red: 0.15, green: 0.08, blue: 0.2)
                    ]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                // 裝飾粒子
                ForEach(0..<15, id: \.self) { i in
                    Circle()
                        .fill(Color.yellow.opacity(0.2))
                        .frame(width: CGFloat.random(in: 2...5))
                        .position(
                            x: CGFloat.random(in: 0...UIScreen.main.bounds.width),
                            y: CGFloat.random(in: 0...UIScreen.main.bounds.height)
                        )
                        .blur(radius: 1)
                }
                
                VStack(spacing: 0) {
                    // 標題區
                    VStack(spacing: 8) {
                        Text("🏮")
                            .font(.system(size: 50))
                        
                        Text("籤筒")
                            .font(.system(size: 32, weight: .bold, design: .serif))
                            .foregroundColor(.white)
                        
                        Text("誠心祈願・搖動手機")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.6))
                    }
                    .padding(.top, 20)
                    
                    // 問題輸入
                    VStack(spacing: 12) {
                        Text("請輸入您的問題")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(.yellow)
                        
                        ZStack(alignment: .topLeading) {
                            if viewModel.question.isEmpty {
                                Text("例如：今天運勢如何？\n這份工作適合我嗎？")
                                    .font(.system(size: 14))
                                    .foregroundColor(.white.opacity(0.3))
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 10)
                            }
                            
                            TextEditor(text: $viewModel.question)
                                .font(.system(size: 15))
                                .foregroundColor(.white)
                                .scrollContentBackground(.hidden)
                                .frame(height: 80)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 6)
                        }
                        .background(
                            RoundedRectangle(cornerRadius: 12)
                                .fill(Color.white.opacity(0.08))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.yellow.opacity(0.25), lineWidth: 1)
                                )
                        )
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 24)
                    
                    Spacer()
                    
                    // 籤筒
                    ZStack {
                        // 籤筒容器
                        RoundedRectangle(cornerRadius: 20)
                            .fill(
                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        Color(red: 0.55, green: 0.28, blue: 0.1),
                                        Color(red: 0.4, green: 0.18, blue: 0.05)
                                    ]),
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: 100, height: 160)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(Color.yellow.opacity(0.4), lineWidth: 2)
                            )
                            .shadow(color: .black.opacity(0.4), radius: 8)
                        
                        // 籤
                        ForEach(0..<6, id: \.self) { i in
                            Capsule()
                                .fill(
                                    LinearGradient(
                                        gradient: Gradient(colors: [.yellow.opacity(0.9), .orange.opacity(0.8)]),
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .frame(width: 6, height: 80)
                                .offset(
                                    x: CGFloat(i - 3) * 8 + (viewModel.isShaking ? CGFloat.random(in: -4...4) : 0),
                                    y: -45 + (viewModel.isShaking ? CGFloat.random(in: -8...8) : 0)
                                )
                                .rotationEffect(.degrees(Double(i - 3) * 2 + (viewModel.isShaking ? Double.random(in: -8...8) : 0)))
                                .animation(viewModel.isShaking ? .easeInOut(duration: 0.08).repeatForever(autoreverses: true) : .default, value: viewModel.isShaking)
                        }
                        
                        // 籤字
                        VStack {
                            Spacer()
                            Text("籤")
                                .font(.system(size: 20, weight: .bold, design: .serif))
                                .foregroundColor(.yellow)
                                .padding(.bottom, 16)
                        }
                        .frame(width: 100, height: 160)
                    }
                    .rotationEffect(.degrees(viewModel.isShaking ? Double.random(in: -4...4) : 0))
                    .animation(viewModel.isShaking ? .easeInOut(duration: 0.08).repeatForever(autoreverses: true) : .default, value: viewModel.isShaking)
                    
                    // 狀態提示
                    Group {
                        if viewModel.isShaking {
                            Text("搖動中...")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.yellow)
                        } else if viewModel.question.isEmpty {
                            Text("請先輸入問題")
                                .font(.system(size: 16))
                                .foregroundColor(.white.opacity(0.4))
                        } else {
                            Text("搖動手機抽籤")
                                .font(.system(size: 16))
                                .foregroundColor(.yellow.opacity(0.7))
                        }
                    }
                    .padding(.top, 20)
                    
                    Spacer()
                    
                    // 手動抽籤按鈕
                    if !viewModel.question.isEmpty && !viewModel.isShaking {
                        Button(action: {
                            viewModel.manualDraw()
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "hand.tap.fill")
                                    .font(.system(size: 18))
                                Text("點擊抽籤")
                                    .font(.system(size: 16, weight: .semibold))
                            }
                            .foregroundColor(.black)
                            .padding(.horizontal, 36)
                            .padding(.vertical, 14)
                            .background(
                                LinearGradient(
                                    gradient: Gradient(colors: [.yellow, .orange]),
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(25)
                            .shadow(color: .yellow.opacity(0.25), radius: 8)
                        }
                    }
                    
                    // 底部提示
                    VStack(spacing: 6) {
                        Text("💫 心誠則靈")
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.5))
                        Text("搖動手機或點擊按鈕")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.3))
                    }
                    .padding(.vertical, 24)
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                viewModel.startMotionDetection()
            }
            .onDisappear {
                viewModel.stopMotionDetection()
            }
            .onChange(of: viewModel.drawnStick) { oldValue, newValue in
                if newValue != nil {
                    showResult = true
                }
            }
            .sheet(isPresented: $showResult) {
                if let stick = viewModel.drawnStick {
                    StickResultView(
                        stick: stick,
                        question: viewModel.question,
                        onDismiss: {
                            showResult = false
                            viewModel.reset()
                        }
                    )
                }
            }
        }
    }
}

// MARK: - ViewModel
class FortuneStickViewModel: ObservableObject {
    @Published var question: String = ""
    @Published var isShaking: Bool = false
    @Published var drawnStick: FortuneStickData?
    
    private let motionManager = CMMotionManager()
    private var shakeCount = 0
    private var lastShakeTime: Date?
    private let requiredShakes = 5
    
    func startMotionDetection() {
        guard motionManager.isAccelerometerAvailable else { return }
        
        motionManager.accelerometerUpdateInterval = 0.1
        motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, _ in
            guard let self = self, let data = data else { return }
            
            let acceleration = sqrt(
                pow(data.acceleration.x, 2) +
                pow(data.acceleration.y, 2) +
                pow(data.acceleration.z, 2)
            )
            
            if acceleration > 2.5 && !self.question.isEmpty {
                self.handleShake()
            }
        }
    }
    
    func stopMotionDetection() {
        motionManager.stopAccelerometerUpdates()
    }
    
    private func handleShake() {
        let now = Date()
        if let lastTime = lastShakeTime, now.timeIntervalSince(lastTime) < 0.3 { return }
        
        lastShakeTime = now
        shakeCount += 1
        
        DispatchQueue.main.async { self.isShaking = true }
        
        if shakeCount >= requiredShakes {
            drawStick()
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            if self.drawnStick == nil { self.isShaking = false }
        }
    }
    
    func manualDraw() {
        isShaking = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            self.drawStick()
        }
    }
    
    private func drawStick() {
        let generator = UIImpactFeedbackGenerator(style: .heavy)
        generator.impactOccurred()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            self.isShaking = false
            self.drawnStick = FortuneStickData.allSticks.randomElement()
            self.shakeCount = 0
        }
    }
    
    func reset() {
        question = ""
        drawnStick = nil
        shakeCount = 0
        isShaking = false
    }
}

// MARK: - 籤詩結果頁
struct StickResultView: View {
    let stick: FortuneStickData
    let question: String
    let onDismiss: () -> Void
    
    var body: some View {
        ZStack {
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.1, green: 0.05, blue: 0.15),
                    Color(red: 0.15, green: 0.08, blue: 0.2)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 20) {
                    // 關閉
                    HStack {
                        Spacer()
                        Button(action: onDismiss) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.system(size: 28))
                                .foregroundColor(.white.opacity(0.4))
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    
                    // 籤號 + 吉凶
                    VStack(spacing: 8) {
                        Text(stick.number)
                            .font(.system(size: 32, weight: .bold, design: .serif))
                            .foregroundColor(.yellow)
                        
                        HStack(spacing: 6) {
                            Text(stick.level.emoji)
                                .font(.system(size: 22))
                            Text(stick.level.rawValue)
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(stick.level.color)
                        }
                        .padding(.horizontal, 20)
                        .padding(.vertical, 6)
                        .background(
                            Capsule()
                                .fill(stick.level.color.opacity(0.15))
                                .overlay(Capsule().stroke(stick.level.color.opacity(0.4), lineWidth: 1))
                        )
                    }
                    
                    // 問題
                    if !question.isEmpty {
                        VStack(spacing: 6) {
                            Text("所問之事")
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.4))
                            Text("「\(question)」")
                                .font(.system(size: 16))
                                .foregroundColor(.white.opacity(0.8))
                                .multilineTextAlignment(.center)
                        }
                        .padding(.horizontal, 20)
                    }
                    
                    // 籤詩
                    VStack(spacing: 14) {
                        Text("籤詩")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.yellow.opacity(0.7))
                        
                        Text(stick.poem)
                            .font(.system(size: 18, design: .serif))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                            .lineSpacing(6)
                    }
                    .padding(20)
                    .frame(maxWidth: .infinity)
                    .background(
                        RoundedRectangle(cornerRadius: 14)
                            .fill(Color.white.opacity(0.06))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(Color.yellow.opacity(0.2), lineWidth: 1)
                            )
                    )
                    .padding(.horizontal, 16)
                    
                    // 解籤
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Image(systemName: "text.book.closed.fill")
                                .foregroundColor(.yellow)
                            Text("解籤")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.yellow)
                        }
                        Text(stick.interpretation)
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.85))
                            .lineSpacing(5)
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: 14)
                            .fill(Color.purple.opacity(0.12))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.purple.opacity(0.25), lineWidth: 1))
                    )
                    .padding(.horizontal, 16)
                    
                    // 建議
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Image(systemName: "lightbulb.fill")
                                .foregroundColor(.orange)
                            Text("神明指引")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.orange)
                        }
                        Text(stick.advice)
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.85))
                            .lineSpacing(5)
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        RoundedRectangle(cornerRadius: 14)
                            .fill(Color.orange.opacity(0.12))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.orange.opacity(0.25), lineWidth: 1))
                    )
                    .padding(.horizontal, 16)
                    
                    // 再抽一次
                    Button(action: onDismiss) {
                        HStack(spacing: 10) {
                            Image(systemName: "arrow.counterclockwise")
                            Text("再抽一籤")
                                .font(.system(size: 16, weight: .semibold))
                        }
                        .foregroundColor(.black)
                        .padding(.horizontal, 36)
                        .padding(.vertical, 14)
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [.yellow, .orange]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(25)
                    }
                    .padding(.top, 8)
                    .padding(.bottom, 32)
                }
            }
        }
    }
}

// MARK: - 籤詩數據
enum StickLevel: String {
    case daJi = "大吉"
    case zhongJi = "中吉"
    case xiaoJi = "小吉"
    case ji = "吉"
    case ping = "平"
    case xiaoXiong = "小凶"
    case xiong = "凶"
    
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
    
    var color: Color {
        switch self {
        case .daJi: return .yellow
        case .zhongJi, .ji: return .green
        case .xiaoJi: return Color(red: 0.5, green: 0.8, blue: 0.5)
        case .ping: return .gray
        case .xiaoXiong: return .orange
        case .xiong: return .red
        }
    }
}

struct FortuneStickData: Identifiable, Equatable {
    let id = UUID()
    let number: String
    let level: StickLevel
    let poem: String
    let interpretation: String
    let advice: String
    
    static func == (lhs: FortuneStickData, rhs: FortuneStickData) -> Bool {
        lhs.id == rhs.id
    }
    
    static let allSticks: [FortuneStickData] = [
        FortuneStickData(number: "第一籤", level: .daJi, poem: "日出東方照大地\n春風得意馬蹄疾\n貴人相助事事順\n心想事成在今時", interpretation: "此籤大吉大利，如旭日東昇，萬物更新。所問之事將得貴人相助，順風順水，心想事成。", advice: "把握當下機會，勇敢前行，好運正在眷顧你。"),
        FortuneStickData(number: "第二籤", level: .daJi, poem: "月明星稀照前程\n龍門一躍化為龍\n多年辛苦今朝報\n功成名就世人崇", interpretation: "此籤象徵努力終有回報，如鯉魚躍龍門，即將迎來人生轉折點。", advice: "堅持到底，成功就在眼前，不要放棄最後一步。"),
        FortuneStickData(number: "第三籤", level: .daJi, poem: "鴛鴦戲水情意長\n比翼雙飛向天堂\n姻緣天定今朝遇\n白首偕老永不忘", interpretation: "此籤主姻緣美滿，感情和諧。單身者將遇良緣，有伴者感情升溫。", advice: "珍惜眼前人，用心經營感情，幸福就在身邊。"),
        FortuneStickData(number: "第四籤", level: .zhongJi, poem: "春來花開滿園香\n蝴蝶飛舞繞芬芳\n把握時機勤耕耘\n秋收冬藏喜洋洋", interpretation: "此籤表示時機尚可，需要努力經營才能有所收獲。", advice: "現在播種，將來收穫，不要急於求成。"),
        FortuneStickData(number: "第五籤", level: .zhongJi, poem: "明月當空照四方\n清風徐來暑氣消\n心靜自然涼如水\n萬事從容自逍遙", interpretation: "此籤表示保持平常心，不急不躁，事情自然會有好結果。", advice: "放慢腳步，靜心思考，答案自然浮現。"),
        FortuneStickData(number: "第六籤", level: .zhongJi, poem: "柳暗花明又一村\n山窮水盡疑無路\n轉個彎處見光明\n峰迴路轉別有天", interpretation: "此籤表示遇到困難不要灰心，轉個念頭就有出路。", advice: "換個角度思考，困難中也藏著機會。"),
        FortuneStickData(number: "第七籤", level: .xiaoJi, poem: "小有所成莫自滿\n謙虛謹慎再前行\n穩扎穩打步步進\n前途光明在眼前", interpretation: "此籤表示小有進展，但不可驕傲自滿。", advice: "繼續保持努力，更大的成功在後頭。"),
        FortuneStickData(number: "第八籤", level: .xiaoJi, poem: "月有陰晴圓缺時\n人有悲歡離合事\n順其自然心不亂\n靜待花開好時機", interpretation: "此籤表示起伏不定，保持平常心最重要。", advice: "順其自然，不要強求，時機自會到來。"),
        FortuneStickData(number: "第九籤", level: .ping, poem: "不上不下居中間\n不好不壞亦尋常\n保持現狀莫急進\n靜觀其變待時機", interpretation: "此籤表示運勢平平，不宜大動作，維持現狀為宜。", advice: "不要急著改變，觀察形勢再行動。"),
        FortuneStickData(number: "第十籤", level: .ping, poem: "平平淡淡才是真\n無風無浪最安穩\n莫羨他人大富貴\n知足常樂心安寧", interpretation: "此籤表示運勢平穩，無大起大落，平凡是福。", advice: "珍惜當下的平穩，知足常樂。"),
        FortuneStickData(number: "第十一籤", level: .xiaoXiong, poem: "烏雲蔽日暫時遮\n心中煩悶莫憂慮\n雨過天晴總有時\n耐心等待見光明", interpretation: "此籤表示目前運勢低迷，但不會持續太久。", advice: "耐心等待，困難很快會過去。"),
        FortuneStickData(number: "第十二籤", level: .xiaoXiong, poem: "財運欠佳莫強求\n守住本錢最穩妥\n投機取巧恐失利\n腳踏實地慢慢來", interpretation: "此籤財運不佳，不宜投資冒險。", advice: "保守理財，不要追求高風險投資。"),
        FortuneStickData(number: "第十三籤", level: .xiong, poem: "暴風雨前黑雲密\n狂風暴雨即將至\n謹守家門莫外出\n待風雨過見晴天", interpretation: "此籤表示運勢不佳，宜謹慎行事，避免外出冒險。", advice: "這段時間要低調行事，不宜冒險，等待時機好轉。"),
        FortuneStickData(number: "第十四籤", level: .xiong, poem: "山窮水盡疑無路\n走投無路心徬徨\n莫要絕望尋短見\n柳暗花明總有時", interpretation: "此籤表示目前處境艱難，但不要絕望。", advice: "困難是暫時的，尋求幫助，不要做傻事。"),
        FortuneStickData(number: "第十五籤", level: .daJi, poem: "天賜良機莫錯過\n雲開霧散見青天\n萬事俱備東風至\n一帆風順達彼岸", interpretation: "此籤表示時機成熟，萬事俱備，正是行動的最佳時刻。", advice: "機不可失，現在就是最好的時機，立刻行動吧！"),
        FortuneStickData(number: "第十六籤", level: .zhongJi, poem: "緣份天注定\n相逢即是緣\n用心去經營\n感情自然甜", interpretation: "此籤主感情緣份，需要用心經營，不可強求。", advice: "感情需要耐心培養，急不得。"),
        FortuneStickData(number: "第十七籤", level: .xiaoJi, poem: "守得住寂寞\n等得到花開\n默默努力中\n終會有驚喜", interpretation: "此籤表示目前運勢平淡，但持續努力會有驚喜。", advice: "耐住寂寞，繼續努力，好事會發生。"),
        FortuneStickData(number: "第十八籤", level: .ping, poem: "感情不溫亦不火\n平平淡淡過日子\n雖無浪漫亦無憂\n細水長流見真心", interpretation: "此籤感情運勢平穩，雖無激情但關係穩定。", advice: "平淡中見真情，不要追求刺激。"),
        FortuneStickData(number: "第十九籤", level: .xiaoXiong, poem: "兩人相處有摩擦\n小事爭吵傷和氣\n退一步海闊天空\n包容理解化干戈", interpretation: "此籤感情有摩擦，需要互相包容。", advice: "多溝通，少計較，包容理解最重要。"),
        FortuneStickData(number: "第二十籤", level: .daJi, poem: "雨過天晴彩虹現\n苦盡甘來樂無邊\n守得雲開見月明\n美夢成真在今年", interpretation: "此籤表示困難即將過去，好運正在來臨，堅持就是勝利。", advice: "再堅持一下，黎明前的黑暗即將結束。")
    ]
}

#Preview {
    FortuneStickView()
}

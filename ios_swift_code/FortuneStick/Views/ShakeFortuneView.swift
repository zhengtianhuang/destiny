import SwiftUI
import CoreMotion

struct ShakeFortuneView: View {
    @StateObject private var viewModel = ShakeFortuneViewModel()
    @State private var showResult = false
    
    var body: some View {
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
            ForEach(0..<20, id: \.self) { i in
                Circle()
                    .fill(Color.yellow.opacity(0.3))
                    .frame(width: CGFloat.random(in: 2...6))
                    .position(
                        x: CGFloat.random(in: 0...UIScreen.main.bounds.width),
                        y: CGFloat.random(in: 0...UIScreen.main.bounds.height)
                    )
                    .blur(radius: 1)
            }
            
            VStack(spacing: 0) {
                // 標題
                VStack(spacing: 8) {
                    Text("🏮")
                        .font(.system(size: 50))
                    
                    Text("籤筒")
                        .font(.system(size: 36, weight: .bold, design: .serif))
                        .foregroundColor(.white)
                    
                    Text("誠心祈願・搖動手機")
                        .font(.system(size: 16))
                        .foregroundColor(.white.opacity(0.7))
                }
                .padding(.top, 40)
                
                // 問題輸入區
                VStack(spacing: 16) {
                    Text("請輸入您的問題")
                        .font(.system(size: 18, weight: .medium, design: .serif))
                        .foregroundColor(.yellow)
                    
                    ZStack(alignment: .topLeading) {
                        if viewModel.question.isEmpty {
                            Text("例如：今天的運勢如何？\n她對我有什麼想法？\n這份工作適合我嗎？")
                                .font(.system(size: 15))
                                .foregroundColor(.white.opacity(0.4))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 12)
                        }
                        
                        TextEditor(text: $viewModel.question)
                            .font(.system(size: 16))
                            .foregroundColor(.white)
                            .scrollContentBackground(.hidden)
                            .background(Color.clear)
                            .frame(height: 100)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                    }
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color.white.opacity(0.1))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.yellow.opacity(0.3), lineWidth: 1)
                            )
                    )
                    .padding(.horizontal, 24)
                }
                .padding(.top, 30)
                
                Spacer()
                
                // 籤筒區域
                VStack(spacing: 20) {
                    // 籤筒圖示
                    ZStack {
                        // 籤筒容器
                        RoundedRectangle(cornerRadius: 20)
                            .fill(
                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        Color(red: 0.6, green: 0.3, blue: 0.1),
                                        Color(red: 0.4, green: 0.2, blue: 0.05),
                                        Color(red: 0.5, green: 0.25, blue: 0.08)
                                    ]),
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: 120, height: 200)
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(Color.yellow.opacity(0.5), lineWidth: 2)
                            )
                            .shadow(color: .black.opacity(0.5), radius: 10)
                        
                        // 籤
                        ForEach(0..<8, id: \.self) { i in
                            Capsule()
                                .fill(
                                    LinearGradient(
                                        gradient: Gradient(colors: [
                                            Color.yellow.opacity(0.9),
                                            Color.orange.opacity(0.8)
                                        ]),
                                        startPoint: .top,
                                        endPoint: .bottom
                                    )
                                )
                                .frame(width: 8, height: 100)
                                .offset(
                                    x: CGFloat(i - 4) * 10 + (viewModel.isShaking ? CGFloat.random(in: -5...5) : 0),
                                    y: -60 + (viewModel.isShaking ? CGFloat.random(in: -10...10) : 0)
                                )
                                .rotationEffect(.degrees(Double(i - 4) * 3 + (viewModel.isShaking ? Double.random(in: -10...10) : 0)))
                                .animation(viewModel.isShaking ? .easeInOut(duration: 0.1).repeatForever(autoreverses: true) : .default, value: viewModel.isShaking)
                        }
                        
                        // 籤筒裝飾
                        VStack {
                            Spacer()
                            Text("籤")
                                .font(.system(size: 24, weight: .bold, design: .serif))
                                .foregroundColor(.yellow)
                                .padding(.bottom, 20)
                        }
                        .frame(width: 120, height: 200)
                    }
                    .rotationEffect(.degrees(viewModel.isShaking ? Double.random(in: -5...5) : 0))
                    .animation(viewModel.isShaking ? .easeInOut(duration: 0.1).repeatForever(autoreverses: true) : .default, value: viewModel.isShaking)
                    
                    // 狀態文字
                    if viewModel.isShaking {
                        Text("搖動中...")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.yellow)
                            .transition(.opacity)
                    } else if viewModel.question.isEmpty {
                        Text("請先輸入問題")
                            .font(.system(size: 18))
                            .foregroundColor(.white.opacity(0.5))
                    } else {
                        Text("搖動手機抽籤")
                            .font(.system(size: 18))
                            .foregroundColor(.yellow.opacity(0.8))
                    }
                }
                
                Spacer()
                
                // 手動抽籤按鈕（備用）
                if !viewModel.question.isEmpty && !viewModel.isShaking {
                    Button(action: {
                        viewModel.manualDraw()
                        showResult = true
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: "hand.tap.fill")
                                .font(.system(size: 20))
                            Text("點擊抽籤")
                                .font(.system(size: 18, weight: .semibold))
                        }
                        .foregroundColor(.black)
                        .padding(.horizontal, 40)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [.yellow, .orange]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(30)
                        .shadow(color: .yellow.opacity(0.3), radius: 10)
                    }
                    .padding(.bottom, 20)
                }
                
                // 提示
                VStack(spacing: 8) {
                    Text("💫 誠心祈禱，心誠則靈")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.6))
                    
                    Text("搖動手機或點擊按鈕抽籤")
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.4))
                }
                .padding(.bottom, 40)
            }
        }
        .onAppear {
            viewModel.startMotionDetection()
        }
        .onDisappear {
            viewModel.stopMotionDetection()
        }
        .onChange(of: viewModel.drawnStick) { stick in
            if stick != nil {
                showResult = true
            }
        }
        .sheet(isPresented: $showResult) {
            if let stick = viewModel.drawnStick {
                FortuneStickResultView(
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

// MARK: - 搖籤 ViewModel
class ShakeFortuneViewModel: ObservableObject {
    @Published var question: String = ""
    @Published var isShaking: Bool = false
    @Published var drawnStick: FortuneStick?
    
    private let motionManager = CMMotionManager()
    private var shakeCount = 0
    private var lastShakeTime: Date?
    private let requiredShakes = 5
    
    func startMotionDetection() {
        guard motionManager.isAccelerometerAvailable else { return }
        
        motionManager.accelerometerUpdateInterval = 0.1
        motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, error in
            guard let self = self, let data = data else { return }
            
            let acceleration = sqrt(
                pow(data.acceleration.x, 2) +
                pow(data.acceleration.y, 2) +
                pow(data.acceleration.z, 2)
            )
            
            // 搖動閾值
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
        
        if let lastTime = lastShakeTime, now.timeIntervalSince(lastTime) < 0.3 {
            return
        }
        
        lastShakeTime = now
        shakeCount += 1
        
        DispatchQueue.main.async {
            self.isShaking = true
        }
        
        // 搖動足夠次數後抽籤
        if shakeCount >= requiredShakes {
            drawStick()
        }
        
        // 重置搖動狀態
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            if self.drawnStick == nil {
                self.isShaking = false
            }
        }
    }
    
    func manualDraw() {
        isShaking = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.drawStick()
        }
    }
    
    private func drawStick() {
        // 觸覺反饋
        let generator = UIImpactFeedbackGenerator(style: .heavy)
        generator.impactOccurred()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.isShaking = false
            self.drawnStick = FortuneStickDatabase.drawRandom()
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

// MARK: - 籤詩結果視圖
struct FortuneStickResultView: View {
    let stick: FortuneStick
    let question: String
    let onDismiss: () -> Void
    
    @State private var showDetails = false
    
    var body: some View {
        ZStack {
            // 背景
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
                VStack(spacing: 24) {
                    // 關閉按鈕
                    HStack {
                        Spacer()
                        Button(action: onDismiss) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.system(size: 30))
                                .foregroundColor(.white.opacity(0.5))
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 20)
                    
                    // 籤號
                    VStack(spacing: 8) {
                        Text(stick.number)
                            .font(.system(size: 36, weight: .bold, design: .serif))
                            .foregroundColor(.yellow)
                        
                        // 吉凶等級
                        HStack(spacing: 8) {
                            Text(stick.level.emoji)
                                .font(.system(size: 24))
                            Text(stick.level.rawValue)
                                .font(.system(size: 28, weight: .bold, design: .serif))
                                .foregroundColor(levelColor)
                        }
                        .padding(.horizontal, 24)
                        .padding(.vertical, 8)
                        .background(
                            Capsule()
                                .fill(levelColor.opacity(0.2))
                                .overlay(
                                    Capsule()
                                        .stroke(levelColor.opacity(0.5), lineWidth: 1)
                                )
                        )
                    }
                    
                    // 問題
                    if !question.isEmpty {
                        VStack(spacing: 8) {
                            Text("所問之事")
                                .font(.system(size: 14))
                                .foregroundColor(.white.opacity(0.5))
                            Text("「\(question)」")
                                .font(.system(size: 18, design: .serif))
                                .foregroundColor(.white.opacity(0.9))
                                .multilineTextAlignment(.center)
                        }
                        .padding(.horizontal, 24)
                    }
                    
                    // 籤詩卡片
                    VStack(spacing: 20) {
                        // 中文籤詩
                        VStack(spacing: 16) {
                            Text("籤詩")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.yellow.opacity(0.8))
                            
                            Text(stick.poem)
                                .font(.system(size: 20, design: .serif))
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)
                                .lineSpacing(8)
                        }
                        .padding(24)
                        .frame(maxWidth: .infinity)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.white.opacity(0.08))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.yellow.opacity(0.2), lineWidth: 1)
                                )
                        )
                        
                        // 日文籤詩（如果有）
                        if let japanese = stick.poemJapanese {
                            VStack(spacing: 16) {
                                Text("日文版")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.5))
                                
                                Text(japanese)
                                    .font(.system(size: 16))
                                    .foregroundColor(.white.opacity(0.7))
                                    .multilineTextAlignment(.center)
                                    .lineSpacing(6)
                            }
                            .padding(20)
                            .frame(maxWidth: .infinity)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.white.opacity(0.05))
                            )
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    // 解籤區域
                    VStack(spacing: 20) {
                        // 解籤
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Image(systemName: "text.book.closed.fill")
                                    .foregroundColor(.yellow)
                                Text("解籤")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.yellow)
                            }
                            
                            Text(stick.interpretation)
                                .font(.system(size: 16))
                                .foregroundColor(.white.opacity(0.9))
                                .lineSpacing(6)
                        }
                        .padding(20)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.purple.opacity(0.15))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.purple.opacity(0.3), lineWidth: 1)
                                )
                        )
                        
                        // 建議
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Image(systemName: "lightbulb.fill")
                                    .foregroundColor(.orange)
                                Text("神明指引")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.orange)
                            }
                            
                            Text(stick.advice)
                                .font(.system(size: 16))
                                .foregroundColor(.white.opacity(0.9))
                                .lineSpacing(6)
                        }
                        .padding(20)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color.orange.opacity(0.15))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.orange.opacity(0.3), lineWidth: 1)
                                )
                        )
                    }
                    .padding(.horizontal, 20)
                    
                    // 適用類別
                    VStack(spacing: 12) {
                        Text("適用範圍")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.5))
                        
                        HStack(spacing: 8) {
                            ForEach(stick.categories, id: \.self) { category in
                                Text(category.rawValue)
                                    .font(.system(size: 12))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(
                                        Capsule()
                                            .fill(Color.white.opacity(0.15))
                                    )
                            }
                        }
                    }
                    
                    // 再抽一次按鈕
                    Button(action: onDismiss) {
                        HStack(spacing: 12) {
                            Image(systemName: "arrow.counterclockwise")
                                .font(.system(size: 18))
                            Text("再抽一籤")
                                .font(.system(size: 18, weight: .semibold))
                        }
                        .foregroundColor(.black)
                        .padding(.horizontal, 40)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [.yellow, .orange]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(30)
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 40)
                }
            }
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.5).delay(0.3)) {
                showDetails = true
            }
        }
    }
    
    private var levelColor: Color {
        switch stick.level {
        case .daJi: return .yellow
        case .zhongJi, .ji: return .green
        case .xiaoJi: return Color(red: 0.5, green: 0.8, blue: 0.5)
        case .ping: return .gray
        case .xiaoXiong: return .orange
        case .xiong: return .red
        }
    }
}

#Preview {
    ShakeFortuneView()
}

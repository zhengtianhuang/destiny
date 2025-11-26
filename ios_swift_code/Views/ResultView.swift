import SwiftUI

struct ResultView: View {
    @ObservedObject var viewModel: FortuneViewModel
    @State private var selectedTab = 0
    
    private let tabs = ["運勢", "性格", "事業", "命理"]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                HStack {
                    Button(action: { viewModel.reset() }) {
                        HStack(spacing: 6) {
                            Image(systemName: "arrow.left")
                            Text("重新解析")
                        }
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.7))
                    }
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.top, 16)
                
                if let result = viewModel.analysisResult {
                    VStack(spacing: 16) {
                        ZStack {
                            Circle()
                                .fill(FortuneTheme.primaryPurple.opacity(0.2))
                                .frame(width: 80, height: 80)
                                .blur(radius: 15)
                            
                            Image(systemName: "sparkles")
                                .font(.system(size: 40))
                                .foregroundStyle(
                                    LinearGradient(
                                        colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                        }
                        
                        Text(result.input.name)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        HStack(spacing: 16) {
                            InfoBadge(icon: "star.fill", text: result.astrology.zodiacSign)
                            if let moon = result.astrology.moonSign {
                                InfoBadge(icon: "moon.fill", text: moon)
                            }
                        }
                    }
                    .padding(.top, 16)
                    
                    DailyFortuneSection(fortune: result.dailyFortune)
                    
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(Array(tabs.enumerated()), id: \.offset) { index, tab in
                                Button(action: { selectedTab = index }) {
                                    Text(tab)
                                        .font(.subheadline)
                                        .fontWeight(.medium)
                                        .foregroundColor(selectedTab == index ? .white : .white.opacity(0.6))
                                        .padding(.horizontal, 20)
                                        .padding(.vertical, 10)
                                        .background(
                                            selectedTab == index ?
                                            FortuneTheme.primaryPurple : FortuneTheme.cardBackground
                                        )
                                        .cornerRadius(20)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    switch selectedTab {
                    case 0:
                        VStack(spacing: 16) {
                            AstrologyCard(astrology: result.astrology)
                            if let faceReading = result.faceReading {
                                FaceReadingCard(analysis: faceReading)
                            }
                        }
                    case 1:
                        PersonalityCard(personality: result.personality)
                    case 2:
                        CareerCard(career: result.career)
                    case 3:
                        VStack(spacing: 16) {
                            HumanDesignCard(humanDesign: result.humanDesign)
                            ZiWeiCard(ziWei: result.ziWei)
                            IChingCard(iChing: result.iChing)
                        }
                    default:
                        EmptyView()
                    }
                }
            }
            .padding(.bottom, 40)
        }
    }
}

struct InfoBadge: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption)
            Text(text)
                .font(.caption)
                .fontWeight(.medium)
        }
        .foregroundColor(.white.opacity(0.8))
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(FortuneTheme.cardBackground)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
    }
}

struct DailyFortuneSection: View {
    let fortune: DailyFortune
    
    var body: some View {
        VStack(spacing: 16) {
            Text("今日運勢")
                .font(.headline)
                .foregroundColor(.white)
            
            Text(fortune.overallFortune)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .multilineTextAlignment(.center)
                .lineSpacing(4)
            
            HStack(spacing: 8) {
                Text("幸運色：")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.7))
                
                ForEach(fortune.luckyColors, id: \.self) { color in
                    Text(color)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(colorForName(color))
                        .cornerRadius(16)
                }
            }
            
            VStack(spacing: 8) {
                Text("幸運號碼")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.7))
                
                HStack(spacing: 10) {
                    ForEach(fortune.luckyNumbers, id: \.self) { number in
                        Text(String(format: "%02d", number))
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .frame(width: 40, height: 40)
                            .background(
                                LinearGradient(
                                    colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .clipShape(Circle())
                    }
                }
            }
            
            Text(fortune.advice)
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.8))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
    
    func colorForName(_ name: String) -> Color {
        switch name {
        case "紅色": return .red
        case "金色", "黃色": return FortuneTheme.secondaryGold
        case "藍色": return .blue
        case "綠色": return .green
        case "紫色": return FortuneTheme.primaryPurple
        case "白色": return .white.opacity(0.3)
        case "黑色": return .black
        case "橙色": return .orange
        case "粉色": return .pink
        default: return FortuneTheme.primaryPurple
        }
    }
}

struct AstrologyCard: View {
    let astrology: AstrologyAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "star.circle.fill")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("星座分析")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 12) {
                InfoRow(label: "太陽星座", value: astrology.zodiacSign)
                if let moon = astrology.moonSign {
                    InfoRow(label: "月亮星座", value: moon)
                }
                if let rising = astrology.risingSign {
                    InfoRow(label: "上升星座", value: rising)
                }
            }
            
            Text(astrology.interpretation)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .lineSpacing(4)
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(.white.opacity(0.6))
            Spacer()
            Text(value)
                .font(.subheadline)
                .foregroundColor(.white)
        }
    }
}

struct PersonalityCard: View {
    let personality: PersonalityAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "person.fill")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("性格分析")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            Text(personality.description)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .lineSpacing(4)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("個性特質")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                FlowLayout(spacing: 8) {
                    ForEach(personality.traits, id: \.self) { trait in
                        Text(trait)
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(FortuneTheme.primaryPurple.opacity(0.5))
                            .cornerRadius(12)
                    }
                }
            }
            
            VStack(alignment: .leading, spacing: 12) {
                Text("優勢特質")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                ForEach(personality.strengths, id: \.self) { strength in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.caption)
                            .foregroundColor(.green)
                        Text(strength)
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.8))
                    }
                }
            }
            
            VStack(alignment: .leading, spacing: 12) {
                Text("需要注意")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                ForEach(personality.weaknesses, id: \.self) { weakness in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.caption)
                            .foregroundColor(.orange)
                        Text(weakness)
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.8))
                    }
                }
            }
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct CareerCard: View {
    let career: CareerAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "briefcase.fill")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("事業分析")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            VStack(alignment: .leading, spacing: 12) {
                Text("適合領域")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                FlowLayout(spacing: 8) {
                    ForEach(career.suitableFields, id: \.self) { field in
                        Text(field)
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(FortuneTheme.primaryPurple.opacity(0.5))
                            .cornerRadius(16)
                    }
                }
            }
            
            VStack(alignment: .leading, spacing: 12) {
                Text("需謹慎考慮")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                FlowLayout(spacing: 8) {
                    ForEach(career.avoidFields, id: \.self) { field in
                        Text(field)
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(.orange.opacity(0.3))
                            .cornerRadius(16)
                    }
                }
            }
            
            VStack(alignment: .leading, spacing: 8) {
                Text("職業建議")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.7))
                Text(career.advice)
                    .font(.body)
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(4)
            }
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct HumanDesignCard: View {
    let humanDesign: HumanDesignAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "person.crop.circle.badge.moon.fill")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("人類圖")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                InfoCell(label: "類型", value: humanDesign.type)
                InfoCell(label: "人生策略", value: humanDesign.strategy)
                InfoCell(label: "內在權威", value: humanDesign.authority)
            }
            
            Text(humanDesign.description)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .lineSpacing(4)
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct InfoCell: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundColor(.white.opacity(0.6))
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.white)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(FortuneTheme.cardBackground.opacity(0.5))
        .cornerRadius(8)
    }
}

struct ZiWeiCard: View {
    let ziWei: ZiWeiAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "sparkle.magnifyingglass")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("紫微斗數")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            HStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("命宮主星")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                    Text(ziWei.mainStar)
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(FortuneTheme.secondaryGold)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("宮位")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                    Text(ziWei.palace)
                        .font(.subheadline)
                        .foregroundColor(.white)
                }
            }
            
            Text(ziWei.interpretation)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .lineSpacing(4)
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct IChingCard: View {
    let iChing: IChing
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "hexagon.fill")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("易經")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            HStack(spacing: 16) {
                Text(iChing.hexagram)
                    .font(.system(size: 48))
                    .foregroundColor(FortuneTheme.secondaryGold)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(iChing.hexagramName)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
            }
            
            Text(iChing.interpretation)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .lineSpacing(4)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("卦辭建議")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                Text(iChing.advice)
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(FortuneTheme.primaryPurple.opacity(0.2))
                    .cornerRadius(8)
            }
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct FaceReadingCard: View {
    let analysis: FaceReadingAnalysis
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "face.smiling.inverse")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                
                Text("面相分析")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            
            VStack(alignment: .leading, spacing: 8) {
                Text("面相特徵")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                
                ForEach(analysis.features, id: \.self) { feature in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "circle.fill")
                            .font(.system(size: 6))
                            .foregroundColor(FortuneTheme.secondaryGold)
                            .padding(.top, 6)
                        Text(feature)
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.8))
                    }
                }
            }
            
            Text(analysis.interpretation)
                .font(.body)
                .foregroundColor(.white.opacity(0.8))
                .lineSpacing(4)
        }
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let width = proposal.width ?? 0
        var height: CGFloat = 0
        var x: CGFloat = 0
        var rowHeight: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > width && x > 0 {
                height += rowHeight + spacing
                x = 0
                rowHeight = 0
            }
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }
        height += rowHeight
        
        return CGSize(width: width, height: height)
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX && x > bounds.minX {
                y += rowHeight + spacing
                x = bounds.minX
                rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: .unspecified)
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }
    }
}

#Preview {
    ZStack {
        FortuneTheme.backgroundGradient.ignoresSafeArea()
        
        let viewModel = FortuneViewModel()
        
        ResultView(viewModel: viewModel)
    }
    .preferredColorScheme(.dark)
}

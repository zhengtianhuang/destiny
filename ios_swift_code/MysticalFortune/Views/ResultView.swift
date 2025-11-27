import SwiftUI

struct ResultView: View {
    let result: FortuneResult
    let name: String
    @Environment(\.dismiss) var dismiss
    @State private var selectedSection = 0
    
    let sections = ["總覽", "星座", "人類圖", "紫微", "面相", "易經"]
    
    var body: some View {
        NavigationStack {
            ZStack {
                // 背景
                LinearGradient(
                    gradient: Gradient(colors: [
                        Color(red: 0.08, green: 0.05, blue: 0.15),
                        Color(red: 0.15, green: 0.08, blue: 0.25)
                    ]),
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // 標籤選擇器
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(0..<sections.count, id: \.self) { index in
                                SectionTab(
                                    title: sections[index],
                                    isSelected: selectedSection == index
                                ) {
                                    withAnimation {
                                        selectedSection = index
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                    }
                    .padding(.vertical, 16)
                    
                    // 內容區域
                    ScrollView {
                        VStack(spacing: 20) {
                            switch selectedSection {
                            case 0:
                                OverviewSection(result: result, name: name)
                            case 1:
                                AstrologySection(astrology: result.astrology)
                            case 2:
                                HumanDesignSection(humanDesign: result.humanDesign)
                            case 3:
                                ZiWeiSection(ziWei: result.ziWei)
                            case 4:
                                if let faceReading = result.faceReading {
                                    FaceReadingSection(faceReading: faceReading)
                                } else {
                                    NoDataView(message: "未提供照片，無法進行面相分析")
                                }
                            case 5:
                                IChingSection(iChing: result.iChing)
                            default:
                                EmptyView()
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 40)
                    }
                }
            }
            .navigationTitle("\(name)的命理報告")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("完成") {
                        dismiss()
                    }
                    .foregroundColor(.yellow)
                }
            }
        }
    }
}

// MARK: - 標籤按鈕
struct SectionTab: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 14, weight: isSelected ? .semibold : .regular))
                .foregroundColor(isSelected ? .black : .white.opacity(0.7))
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(
                    Capsule()
                        .fill(isSelected ? Color.yellow : Color.white.opacity(0.1))
                )
        }
    }
}

// MARK: - 總覽
struct OverviewSection: View {
    let result: FortuneResult
    let name: String
    
    var body: some View {
        VStack(spacing: 20) {
            // 歡迎卡片
            ResultCard(title: "🔮 命理總覽", color: .purple) {
                VStack(alignment: .leading, spacing: 12) {
                    Text("親愛的 \(name)，")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(.white)
                    
                    Text(result.personality.description)
                        .font(.system(size: 15))
                        .foregroundColor(.white.opacity(0.8))
                        .lineSpacing(6)
                }
            }
            
            // 性格特質
            ResultCard(title: "✨ 性格特質", color: .yellow) {
                TagsView(tags: result.personality.traits, color: .yellow)
            }
            
            // 優勢
            ResultCard(title: "💪 個人優勢", color: .green) {
                TagsView(tags: result.personality.strengths, color: .green)
            }
            
            // 需注意
            ResultCard(title: "⚠️ 需要注意", color: .orange) {
                TagsView(tags: result.personality.weaknesses, color: .orange)
            }
            
            // 今日運勢
            ResultCard(title: "🌟 今日運勢", color: .blue) {
                VStack(alignment: .leading, spacing: 16) {
                    Text(result.dailyFortune.overallFortune)
                        .font(.system(size: 15))
                        .foregroundColor(.white.opacity(0.8))
                        .lineSpacing(6)
                    
                    Divider()
                        .background(Color.white.opacity(0.2))
                    
                    HStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("幸運色")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.5))
                            HStack(spacing: 6) {
                                ForEach(result.dailyFortune.luckyColors, id: \.self) { color in
                                    Text(color)
                                        .font(.system(size: 13))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 4)
                                        .background(Color.white.opacity(0.15))
                                        .cornerRadius(12)
                                }
                            }
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("幸運數字")
                                .font(.system(size: 12))
                                .foregroundColor(.white.opacity(0.5))
                            HStack(spacing: 6) {
                                ForEach(result.dailyFortune.luckyNumbers, id: \.self) { number in
                                    Text("\(number)")
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.yellow)
                                        .frame(width: 28, height: 28)
                                        .background(Color.yellow.opacity(0.2))
                                        .cornerRadius(14)
                                }
                            }
                        }
                    }
                    
                    Text("💡 \(result.dailyFortune.advice)")
                        .font(.system(size: 14))
                        .foregroundColor(.yellow.opacity(0.9))
                        .padding(12)
                        .background(Color.yellow.opacity(0.1))
                        .cornerRadius(8)
                }
            }
            
            // 事業建議
            ResultCard(title: "💼 事業財運", color: .cyan) {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("適合領域")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.white.opacity(0.6))
                        TagsView(tags: result.career.suitableFields, color: .cyan)
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("需避開")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.white.opacity(0.6))
                        TagsView(tags: result.career.avoidFields, color: .red)
                    }
                    
                    Text("📝 \(result.career.advice)")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.8))
                        .lineSpacing(4)
                }
            }
        }
    }
}

// MARK: - 星座分析
struct AstrologySection: View {
    let astrology: AstrologyAnalysis
    
    var body: some View {
        VStack(spacing: 20) {
            ResultCard(title: "♈ 星座分析", color: .purple) {
                VStack(spacing: 20) {
                    HStack(spacing: 30) {
                        InfoItem(label: "星座", value: astrology.zodiacSign)
                        InfoItem(label: "元素", value: astrology.element)
                        InfoItem(label: "守護星", value: astrology.rulingPlanet)
                    }
                    
                    Divider()
                        .background(Color.white.opacity(0.2))
                    
                    Text(astrology.characteristics)
                        .font(.system(size: 15))
                        .foregroundColor(.white.opacity(0.8))
                        .lineSpacing(6)
                }
            }
            
            ResultCard(title: "💕 相配星座", color: .pink) {
                TagsView(tags: astrology.compatibility, color: .pink)
            }
        }
    }
}

// MARK: - 人類圖
struct HumanDesignSection: View {
    let humanDesign: HumanDesignAnalysis
    
    var body: some View {
        VStack(spacing: 20) {
            ResultCard(title: "🧬 人類圖分析", color: .indigo) {
                VStack(spacing: 20) {
                    HStack(spacing: 16) {
                        HDInfoCard(label: "類型", value: humanDesign.type)
                        HDInfoCard(label: "人生策略", value: humanDesign.strategy)
                    }
                    
                    HStack(spacing: 16) {
                        HDInfoCard(label: "內在權威", value: humanDesign.authority)
                        HDInfoCard(label: "人生角色", value: humanDesign.profile)
                    }
                }
            }
            
            ResultCard(title: "📖 詳細解讀", color: .indigo) {
                Text(humanDesign.description)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
        }
    }
}

struct HDInfoCard: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(spacing: 8) {
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.5))
            Text(value)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.yellow)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(Color.white.opacity(0.08))
        .cornerRadius(12)
    }
}

// MARK: - 紫微斗數
struct ZiWeiSection: View {
    let ziWei: ZiWeiAnalysis
    
    var body: some View {
        VStack(spacing: 20) {
            ResultCard(title: "☯️ 紫微斗數", color: .red) {
                VStack(alignment: .leading, spacing: 16) {
                    HStack {
                        Text("命宮主星")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.6))
                        Spacer()
                        Text(ziWei.mainStar)
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.yellow)
                    }
                    
                    Divider()
                        .background(Color.white.opacity(0.2))
                    
                    Text(ziWei.palaceAnalysis)
                        .font(.system(size: 15))
                        .foregroundColor(.white.opacity(0.8))
                        .lineSpacing(6)
                }
            }
            
            ResultCard(title: "📅 流年運勢", color: .orange) {
                Text(ziWei.yearlyFortune)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
            
            ResultCard(title: "💡 人生建議", color: .green) {
                Text(ziWei.lifeAdvice)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
        }
    }
}

// MARK: - 面相分析
struct FaceReadingSection: View {
    let faceReading: FaceReadingAnalysis
    
    var body: some View {
        VStack(spacing: 20) {
            ResultCard(title: "👁️ 面相分析", color: .teal) {
                VStack(alignment: .leading, spacing: 16) {
                    FaceFeatureRow(label: "臉型", value: faceReading.faceShape)
                    FaceFeatureRow(label: "眼睛", value: faceReading.eyeAnalysis)
                    FaceFeatureRow(label: "鼻子", value: faceReading.noseAnalysis)
                    FaceFeatureRow(label: "嘴巴", value: faceReading.mouthAnalysis)
                }
            }
            
            ResultCard(title: "📝 綜合解讀", color: .teal) {
                Text(faceReading.overallReading)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
        }
    }
}

struct FaceFeatureRow: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.yellow)
            Text(value)
                .font(.system(size: 14))
                .foregroundColor(.white.opacity(0.7))
        }
        .padding(.bottom, 8)
    }
}

// MARK: - 易經
struct IChingSection: View {
    let iChing: IChingAnalysis
    
    var body: some View {
        VStack(spacing: 20) {
            ResultCard(title: "☰ 易經占卜", color: .amber) {
                VStack(spacing: 16) {
                    Text(iChing.hexagramSymbol)
                        .font(.system(size: 48))
                    
                    Text("第 \(iChing.hexagramNumber) 卦")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.5))
                    
                    Text(iChing.hexagramName)
                        .font(.system(size: 24, weight: .bold, design: .serif))
                        .foregroundColor(.yellow)
                }
            }
            
            ResultCard(title: "📖 卦象解讀", color: .amber) {
                Text(iChing.interpretation)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
            
            ResultCard(title: "🔄 變爻提示", color: .orange) {
                Text(iChing.changingLines)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
            
            ResultCard(title: "💡 行動指引", color: .green) {
                Text(iChing.advice)
                    .font(.system(size: 15))
                    .foregroundColor(.white.opacity(0.8))
                    .lineSpacing(6)
            }
        }
    }
}

// MARK: - 輔助視圖
struct ResultCard<Content: View>: View {
    let title: String
    let color: Color
    @ViewBuilder let content: Content
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(color)
            
            content
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(color.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

struct TagsView: View {
    let tags: [String]
    let color: Color
    
    var body: some View {
        FlowLayout(spacing: 8) {
            ForEach(tags, id: \.self) { tag in
                Text(tag)
                    .font(.system(size: 13))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(color.opacity(0.25))
                    .cornerRadius(16)
            }
        }
    }
}

struct InfoItem: View {
    let label: String
    let value: String
    
    var body: some View {
        VStack(spacing: 6) {
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(.white.opacity(0.5))
            Text(value)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
        }
    }
}

struct NoDataView: View {
    let message: String
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "photo.badge.exclamationmark")
                .font(.system(size: 48))
                .foregroundColor(.white.opacity(0.3))
            
            Text(message)
                .font(.system(size: 16))
                .foregroundColor(.white.opacity(0.5))
                .multilineTextAlignment(.center)
        }
        .padding(40)
    }
}

// MARK: - Flow Layout
struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.width ?? 0, subviews: subviews, spacing: spacing)
        return result.size
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(x: bounds.minX + result.positions[index].x,
                                      y: bounds.minY + result.positions[index].y),
                          proposal: .unspecified)
        }
    }
    
    struct FlowResult {
        var size: CGSize = .zero
        var positions: [CGPoint] = []
        
        init(in maxWidth: CGFloat, subviews: Subviews, spacing: CGFloat) {
            var x: CGFloat = 0
            var y: CGFloat = 0
            var rowHeight: CGFloat = 0
            
            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)
                
                if x + size.width > maxWidth && x > 0 {
                    x = 0
                    y += rowHeight + spacing
                    rowHeight = 0
                }
                
                positions.append(CGPoint(x: x, y: y))
                rowHeight = max(rowHeight, size.height)
                x += size.width + spacing
                
                self.size.width = max(self.size.width, x)
            }
            
            self.size.height = y + rowHeight
        }
    }
}

// Custom color
extension Color {
    static let amber = Color(red: 1.0, green: 0.75, blue: 0.0)
}

#Preview {
    ResultView(
        result: FortuneResult(
            personality: PersonalityAnalysis(
                traits: ["創意", "敏感", "理想主義"],
                strengths: ["想像力豐富", "同理心強"],
                weaknesses: ["過於理想化", "容易逃避"],
                description: "你是一個充滿創意和想像力的人。"
            ),
            career: CareerAnalysis(
                suitableFields: ["藝術", "心理諮詢"],
                avoidFields: ["高壓業務"],
                advice: "發揮你的創意天賦。"
            ),
            dailyFortune: DailyFortune(
                luckyColors: ["藍色", "白色"],
                luckyNumbers: [3, 7],
                overallFortune: "今日運勢不錯！",
                advice: "多與朋友交流。"
            ),
            astrology: AstrologyAnalysis(
                zodiacSign: "雙魚座",
                element: "水象",
                rulingPlanet: "海王星",
                characteristics: "浪漫、敏感、富有同情心。",
                compatibility: ["巨蟹座", "天蠍座"]
            ),
            humanDesign: HumanDesignAnalysis(
                type: "投射者",
                strategy: "等待邀請",
                authority: "情緒權威",
                profile: "3/5",
                description: "你是一個指導者類型。"
            ),
            ziWei: ZiWeiAnalysis(
                mainStar: "紫微星",
                palaceAnalysis: "命宮有紫微星坐守。",
                lifeAdvice: "把握機會，穩健發展。",
                yearlyFortune: "今年財運亨通。"
            ),
            faceReading: nil,
            iChing: IChingAnalysis(
                hexagramNumber: 1,
                hexagramName: "乾卦",
                hexagramSymbol: "☰",
                interpretation: "元亨利貞。",
                changingLines: "潛龍勿用。",
                advice: "穩健前行，不宜冒進。"
            )
        ),
        name: "測試用戶"
    )
}

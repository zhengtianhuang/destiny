import Foundation

class OpenAIService {
    static let shared = OpenAIService()
    
    private let apiKey = "YOUR_OPENAI_API_KEY"
    private let baseURL = "https://api.openai.com/v1/chat/completions"
    
    private init() {}
    
    private func getZodiacSign(month: Int, day: Int) -> String {
        let signs = [
            ("摩羯座", 12, 22, 1, 19),
            ("水瓶座", 1, 20, 2, 18),
            ("雙魚座", 2, 19, 3, 20),
            ("牡羊座", 3, 21, 4, 19),
            ("金牛座", 4, 20, 5, 20),
            ("雙子座", 5, 21, 6, 20),
            ("巨蟹座", 6, 21, 7, 22),
            ("獅子座", 7, 23, 8, 22),
            ("處女座", 8, 23, 9, 22),
            ("天秤座", 9, 23, 10, 22),
            ("天蠍座", 10, 23, 11, 21),
            ("射手座", 11, 22, 12, 21)
        ]
        
        for sign in signs {
            let (name, startMonth, startDay, endMonth, endDay) = sign
            if startMonth == endMonth {
                if month == startMonth && day >= startDay && day <= endDay {
                    return name
                }
            } else if startMonth > endMonth {
                if (month == startMonth && day >= startDay) || (month == endMonth && day <= endDay) {
                    return name
                }
            } else {
                if (month == startMonth && day >= startDay) || (month == endMonth && day <= endDay) {
                    return name
                }
            }
        }
        return "摩羯座"
    }
    
    func analyzeFortuneWithAI(input: FortuneInput) async throws -> FortuneResult {
        let zodiacSign = getZodiacSign(month: input.birthMonth, day: input.birthDay)
        let today = DateFormatter.localizedString(from: Date(), dateStyle: .medium, timeStyle: .none)
        
        var birthInfo = """
        姓名：\(input.name)
        出生日期：\(input.birthYear)年\(input.birthMonth)月\(input.birthDay)日
        性別：\(input.gender.displayName)
        """
        
        if let hour = input.birthHour {
            birthInfo += "\n出生時間：\(hour)時\(input.birthMinute ?? 0)分"
        }
        if let place = input.birthPlace, !place.isEmpty {
            birthInfo += "\n出生地：\(place)"
        }
        if let location = input.currentLocation, !location.isEmpty {
            birthInfo += "\n現居地：\(location)"
        }
        birthInfo += "\n太陽星座：\(zodiacSign)\n今日日期：\(today)"
        
        let systemPrompt = """
        你是一位精通東西方命理的大師，擅長西洋占星術、人類圖、紫微斗數、面相學和易經。
        請根據提供的個人資料進行全面的命理分析。
        回應必須使用繁體中文，並以 JSON 格式輸出。
        分析要具體、有深度，但語氣要親切易懂。
        幸運號碼應該給出6個1-49之間的數字（台灣樂透格式）。
        幸運顏色從以下選擇：紅色、橙色、黃色、綠色、藍色、紫色、粉色、白色、黑色、金色、銀色、米色、棕色、灰色
        """
        
        let analysisPrompt = """
        請為以下人士進行完整的命理分析：
        
        \(birthInfo)
        
        請以 JSON 格式回應，包含以下結構：
        {
          "personality": {
            "traits": ["特質1", "特質2", "特質3", "特質4", "特質5"],
            "strengths": ["優點1", "優點2", "優點3"],
            "weaknesses": ["需注意1", "需注意2", "需注意3"],
            "description": "200字左右的性格綜合描述"
          },
          "career": {
            "suitableFields": ["適合領域1", "適合領域2", "適合領域3", "適合領域4"],
            "avoidFields": ["需謹慎領域1", "需謹慎領域2"],
            "advice": "150字左右的職業發展建議"
          },
          "dailyFortune": {
            "luckyColors": ["顏色1", "顏色2"],
            "luckyNumbers": [數字1, 數字2, 數字3, 數字4, 數字5, 數字6],
            "overallFortune": "100字左右的今日整體運勢",
            "advice": "50字左右的今日行動建議"
          },
          "ziWei": {
            "mainStar": "命宮主星名稱",
            "palace": "命宮名稱",
            "interpretation": "100字左右的紫微斗數解讀"
          },
          "humanDesign": {
            "type": "人類圖類型（生產者/投射者/顯示者/反映者/顯示生產者之一）",
            "strategy": "人生策略",
            "authority": "內在權威",
            "description": "100字左右的人類圖解讀"
          },
          "astrology": {
            "zodiacSign": "\(zodiacSign)",
            "moonSign": "可能的月亮星座",
            "risingSign": "可能的上升星座",
            "interpretation": "100字左右的星盤解讀"
          },
          "iChing": {
            "hexagram": "卦象符號（如☰）",
            "hexagramName": "卦名（如乾卦）",
            "interpretation": "100字左右的易經解讀",
            "advice": "卦辭或爻辭建議"
          }
        }
        """
        
        let messages: [[String: Any]] = [
            ["role": "system", "content": systemPrompt],
            ["role": "user", "content": analysisPrompt]
        ]
        
        let requestBody: [String: Any] = [
            "model": "gpt-4o",
            "messages": messages,
            "response_format": ["type": "json_object"],
            "max_tokens": 4096
        ]
        
        var request = URLRequest(url: URL(string: baseURL)!)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        request.timeoutInterval = 120
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw OpenAIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw OpenAIError.httpError(statusCode: httpResponse.statusCode)
        }
        
        let openAIResponse = try JSONDecoder().decode(OpenAIResponse.self, from: data)
        
        guard let content = openAIResponse.choices.first?.message.content else {
            throw OpenAIError.noContent
        }
        
        guard let contentData = content.data(using: .utf8) else {
            throw OpenAIError.invalidJSON
        }
        
        let analysis = try JSONDecoder().decode(AIAnalysisResponse.self, from: contentData)
        
        let result = FortuneResult(
            id: UUID().uuidString,
            input: input,
            personality: analysis.personality,
            career: analysis.career,
            dailyFortune: analysis.dailyFortune,
            faceReading: nil,
            ziWei: analysis.ziWei,
            humanDesign: analysis.humanDesign,
            astrology: analysis.astrology,
            iChing: analysis.iChing,
            generatedAt: ISO8601DateFormatter().string(from: Date())
        )
        
        return result
    }
    
    func analyzeFaceWithAI(base64Image: String) async throws -> FaceReadingAnalysis {
        let messages: [[String: Any]] = [
            [
                "role": "system",
                "content": """
                你是一位精通面相學的大師。請分析照片中人物的面相特徵，並提供面相解讀。
                回應必須使用繁體中文，並以 JSON 格式輸出。
                分析要專業但語氣親切，著重於正面特質的描述。
                """
            ],
            [
                "role": "user",
                "content": [
                    [
                        "type": "text",
                        "text": """
                        請分析這張照片中的面相，以 JSON 格式回應：
                        {
                          "features": ["面相特徵1", "面相特徵2", "面相特徵3", "面相特徵4", "面相特徵5"],
                          "interpretation": "200字左右的面相綜合解讀，包含運勢和性格分析"
                        }
                        """
                    ],
                    [
                        "type": "image_url",
                        "image_url": [
                            "url": "data:image/jpeg;base64,\(base64Image)"
                        ]
                    ]
                ]
            ]
        ]
        
        let requestBody: [String: Any] = [
            "model": "gpt-4o",
            "messages": messages,
            "response_format": ["type": "json_object"],
            "max_tokens": 2048
        ]
        
        var request = URLRequest(url: URL(string: baseURL)!)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        request.timeoutInterval = 60
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw OpenAIError.invalidResponse
        }
        
        let openAIResponse = try JSONDecoder().decode(OpenAIResponse.self, from: data)
        
        guard let content = openAIResponse.choices.first?.message.content,
              let contentData = content.data(using: .utf8) else {
            throw OpenAIError.noContent
        }
        
        return try JSONDecoder().decode(FaceReadingAnalysis.self, from: contentData)
    }
}

struct AIAnalysisResponse: Codable {
    let personality: PersonalityAnalysis
    let career: CareerAnalysis
    let dailyFortune: DailyFortune
    let ziWei: ZiWeiAnalysis
    let humanDesign: HumanDesignAnalysis
    let astrology: AstrologyAnalysis
    let iChing: IChing
}

struct OpenAIResponse: Codable {
    let choices: [Choice]
    
    struct Choice: Codable {
        let message: Message
    }
    
    struct Message: Codable {
        let content: String?
    }
}

enum OpenAIError: LocalizedError {
    case invalidResponse
    case httpError(statusCode: Int)
    case noContent
    case invalidJSON
    
    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "無效的伺服器回應"
        case .httpError(let code):
            return "HTTP 錯誤：\(code)"
        case .noContent:
            return "AI 未返回內容"
        case .invalidJSON:
            return "無法解析回應內容"
        }
    }
}

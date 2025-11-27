import Foundation

// MARK: - 輸入模型
struct FortuneInput: Codable {
    let name: String
    let birthYear: Int
    let birthMonth: Int
    let birthDay: Int
    let gender: String
    let birthHour: Int?
    let birthMinute: Int?
    let birthPlace: String?
    let currentLocation: String?
    let photoBase64: String?
}

// MARK: - 結果模型
struct FortuneResult: Codable {
    let personality: PersonalityAnalysis
    let career: CareerAnalysis
    let dailyFortune: DailyFortune
    let astrology: AstrologyAnalysis
    let humanDesign: HumanDesignAnalysis
    let ziWei: ZiWeiAnalysis
    let faceReading: FaceReadingAnalysis?
    let iChing: IChingAnalysis
}

struct PersonalityAnalysis: Codable {
    let traits: [String]
    let strengths: [String]
    let weaknesses: [String]
    let description: String
}

struct CareerAnalysis: Codable {
    let suitableFields: [String]
    let avoidFields: [String]
    let advice: String
}

struct DailyFortune: Codable {
    let luckyColors: [String]
    let luckyNumbers: [Int]
    let overallFortune: String
    let advice: String
}

struct AstrologyAnalysis: Codable {
    let zodiacSign: String
    let element: String
    let rulingPlanet: String
    let characteristics: String
    let compatibility: [String]
}

struct HumanDesignAnalysis: Codable {
    let type: String
    let strategy: String
    let authority: String
    let profile: String
    let description: String
}

struct ZiWeiAnalysis: Codable {
    let mainStar: String
    let palaceAnalysis: String
    let lifeAdvice: String
    let yearlyFortune: String
}

struct FaceReadingAnalysis: Codable {
    let faceShape: String
    let eyeAnalysis: String
    let noseAnalysis: String
    let mouthAnalysis: String
    let overallReading: String
}

struct IChingAnalysis: Codable {
    let hexagramNumber: Int
    let hexagramName: String
    let hexagramSymbol: String
    let interpretation: String
    let changingLines: String
    let advice: String
}

// MARK: - API Response
struct APIResponse: Codable {
    let success: Bool
    let data: FortuneResult?
    let error: String?
}

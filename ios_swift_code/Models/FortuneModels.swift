import Foundation

struct FortuneInput: Codable {
    let name: String
    let birthYear: Int
    let birthMonth: Int
    let birthDay: Int
    let gender: Gender
    let birthHour: Int?
    let birthMinute: Int?
    let birthPlace: String?
    let currentLocation: String?
    let photoBase64: String?
}

enum Gender: String, Codable, CaseIterable {
    case male = "male"
    case female = "female"
    case other = "other"
    
    var displayName: String {
        switch self {
        case .male: return "男"
        case .female: return "女"
        case .other: return "其他"
        }
    }
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

struct FaceReadingAnalysis: Codable {
    let features: [String]
    let interpretation: String
}

struct ZiWeiAnalysis: Codable {
    let mainStar: String
    let palace: String
    let interpretation: String
}

struct HumanDesignAnalysis: Codable {
    let type: String
    let strategy: String
    let authority: String
    let description: String
}

struct AstrologyAnalysis: Codable {
    let zodiacSign: String
    let risingSign: String?
    let moonSign: String?
    let interpretation: String
}

struct IChing: Codable {
    let hexagram: String
    let hexagramName: String
    let interpretation: String
    let advice: String
}

struct FortuneResult: Codable, Identifiable {
    let id: String
    let input: FortuneInput
    let personality: PersonalityAnalysis
    let career: CareerAnalysis
    let dailyFortune: DailyFortune
    let faceReading: FaceReadingAnalysis?
    let ziWei: ZiWeiAnalysis
    let humanDesign: HumanDesignAnalysis
    let astrology: AstrologyAnalysis
    let iChing: IChing
    let generatedAt: String
}

struct APIResponse: Codable {
    let success: Bool
    let result: FortuneResult?
    let error: String?
}

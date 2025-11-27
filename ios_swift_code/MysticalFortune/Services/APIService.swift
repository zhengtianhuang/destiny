import Foundation
import UIKit

class APIService {
    // 改成你的 Replit 網址
    static let baseURL = "https://your-replit-app.replit.app"
    
    static func analyzeForture(input: FortuneInput) async throws -> FortuneResult {
        guard let url = URL(string: "\(baseURL)/api/analyze") else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 120 // AI 分析需要較長時間
        
        let encoder = JSONEncoder()
        request.httpBody = try encoder.encode(input)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw APIError.serverError(statusCode: httpResponse.statusCode)
        }
        
        let decoder = JSONDecoder()
        let result = try decoder.decode(FortuneResult.self, from: data)
        return result
    }
    
    // 將 UIImage 轉換為 Base64
    static func imageToBase64(_ image: UIImage, compressionQuality: CGFloat = 0.5) -> String? {
        guard let imageData = image.jpegData(compressionQuality: compressionQuality) else {
            return nil
        }
        return imageData.base64EncodedString()
    }
}

enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case serverError(statusCode: Int)
    case decodingError
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "無效的網址"
        case .invalidResponse:
            return "伺服器回應錯誤"
        case .serverError(let statusCode):
            return "伺服器錯誤 (\(statusCode))"
        case .decodingError:
            return "資料解析錯誤"
        }
    }
}

import Foundation
import SwiftUI
import PhotosUI

@MainActor
class FortuneViewModel: ObservableObject {
    @Published var name: String = ""
    @Published var birthYear: Int = 1990
    @Published var birthMonth: Int = 1
    @Published var birthDay: Int = 1
    @Published var gender: Gender = .male
    @Published var birthHour: Int?
    @Published var birthMinute: Int?
    @Published var birthPlace: String = ""
    @Published var currentLocation: String = ""
    
    @Published var selectedPhotoItem: PhotosPickerItem?
    @Published var photoImage: UIImage?
    @Published var photoBase64: String?
    
    @Published var currentStep: Int = 0
    @Published var isAnalyzing: Bool = false
    @Published var analysisResult: FortuneResult?
    @Published var errorMessage: String?
    @Published var showError: Bool = false
    
    let currentYear = Calendar.current.component(.year, from: Date())
    var years: [Int] { Array((currentYear - 100)...currentYear).reversed() }
    var months: [Int] { Array(1...12) }
    var days: [Int] { Array(1...31) }
    var hours: [Int] { Array(0...23) }
    var minutes: [Int] { Array(0...59) }
    
    var isStep1Valid: Bool {
        !name.isEmpty
    }
    
    var formattedBirthDate: String {
        "\(birthYear)年\(birthMonth)月\(birthDay)日"
    }
    
    func loadPhoto() async {
        guard let item = selectedPhotoItem else { return }
        
        do {
            if let data = try await item.loadTransferable(type: Data.self),
               let image = UIImage(data: data) {
                photoImage = image
                
                if let jpegData = image.jpegData(compressionQuality: 0.8) {
                    photoBase64 = jpegData.base64EncodedString()
                }
            }
        } catch {
            print("Error loading photo: \(error)")
        }
    }
    
    func clearPhoto() {
        selectedPhotoItem = nil
        photoImage = nil
        photoBase64 = nil
    }
    
    func startForm() {
        withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
            currentStep = 1
        }
    }
    
    func nextStep() {
        if currentStep < 2 {
            withAnimation(.easeInOut(duration: 0.3)) {
                currentStep += 1
            }
        }
    }
    
    func previousStep() {
        if currentStep > 1 {
            withAnimation(.easeInOut(duration: 0.3)) {
                currentStep -= 1
            }
        }
    }
    
    func startAnalysis() async {
        isAnalyzing = true
        errorMessage = nil
        
        let input = FortuneInput(
            name: name,
            birthYear: birthYear,
            birthMonth: birthMonth,
            birthDay: birthDay,
            gender: gender,
            birthHour: birthHour,
            birthMinute: birthMinute,
            birthPlace: birthPlace.isEmpty ? nil : birthPlace,
            currentLocation: currentLocation.isEmpty ? nil : currentLocation,
            photoBase64: photoBase64
        )
        
        do {
            var result = try await OpenAIService.shared.analyzeFortuneWithAI(input: input)
            
            if let base64 = photoBase64 {
                do {
                    let faceReading = try await OpenAIService.shared.analyzeFaceWithAI(base64Image: base64)
                    result = FortuneResult(
                        id: result.id,
                        input: result.input,
                        personality: result.personality,
                        career: result.career,
                        dailyFortune: result.dailyFortune,
                        faceReading: faceReading,
                        ziWei: result.ziWei,
                        humanDesign: result.humanDesign,
                        astrology: result.astrology,
                        iChing: result.iChing,
                        generatedAt: result.generatedAt
                    )
                } catch {
                    print("Face reading failed, continuing without it: \(error)")
                }
            }
            
            analysisResult = result
        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }
        
        isAnalyzing = false
    }
    
    func reset() {
        name = ""
        birthYear = 1990
        birthMonth = 1
        birthDay = 1
        gender = .male
        birthHour = nil
        birthMinute = nil
        birthPlace = ""
        currentLocation = ""
        clearPhoto()
        currentStep = 0
        analysisResult = nil
        errorMessage = nil
    }
}

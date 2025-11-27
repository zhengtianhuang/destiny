import SwiftUI
import PhotosUI

struct AnalyzeView: View {
    @EnvironmentObject var appState: AppState
    @State private var currentStep = 1
    
    // 表單資料
    @State private var name = ""
    @State private var birthYear = Calendar.current.component(.year, from: Date()) - 25
    @State private var birthMonth = 1
    @State private var birthDay = 1
    @State private var gender = "male"
    @State private var birthHour: Int? = nil
    @State private var birthMinute: Int? = nil
    @State private var birthPlace = ""
    @State private var currentLocation = ""
    @State private var selectedPhoto: UIImage? = nil
    @State private var showPhotoPicker = false
    
    @State private var isAnalyzing = false
    @State private var showResult = false
    @State private var analysisResult: FortuneResult? = nil
    @State private var errorMessage: String? = nil
    
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
                    // 步驟指示器
                    StepIndicator(currentStep: currentStep)
                        .padding(.top, 20)
                        .padding(.bottom, 30)
                    
                    ScrollView {
                        VStack(spacing: 24) {
                            if currentStep == 1 {
                                Step1View(
                                    name: $name,
                                    birthYear: $birthYear,
                                    birthMonth: $birthMonth,
                                    birthDay: $birthDay,
                                    gender: $gender
                                )
                            } else {
                                Step2View(
                                    birthHour: $birthHour,
                                    birthMinute: $birthMinute,
                                    birthPlace: $birthPlace,
                                    currentLocation: $currentLocation,
                                    selectedPhoto: $selectedPhoto,
                                    showPhotoPicker: $showPhotoPicker
                                )
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 120)
                    }
                    
                    // 底部按鈕
                    VStack(spacing: 12) {
                        if currentStep == 1 {
                            Button(action: { currentStep = 2 }) {
                                HStack {
                                    Text("下一步")
                                    Image(systemName: "arrow.right")
                                }
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(
                                    LinearGradient(
                                        gradient: Gradient(colors: [.yellow, .orange]),
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(16)
                            }
                            .disabled(!isStep1Valid)
                            .opacity(isStep1Valid ? 1 : 0.5)
                        } else {
                            HStack(spacing: 12) {
                                Button(action: { currentStep = 1 }) {
                                    HStack {
                                        Image(systemName: "arrow.left")
                                        Text("上一步")
                                    }
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 16)
                                    .background(Color.white.opacity(0.15))
                                    .cornerRadius(16)
                                }
                                
                                Button(action: submitAnalysis) {
                                    HStack {
                                        if isAnalyzing {
                                            ProgressView()
                                                .tint(.black)
                                        } else {
                                            Image(systemName: "sparkles")
                                            Text("開始分析")
                                        }
                                    }
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(.black)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 16)
                                    .background(
                                        LinearGradient(
                                            gradient: Gradient(colors: [.yellow, .orange]),
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .cornerRadius(16)
                                }
                                .disabled(isAnalyzing)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 16)
                    .background(
                        Color(red: 0.08, green: 0.05, blue: 0.15)
                            .shadow(color: .black.opacity(0.3), radius: 10, y: -5)
                    )
                }
            }
            .navigationTitle("命理分析")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showPhotoPicker) {
                PhotoPicker(image: $selectedPhoto)
            }
            .sheet(isPresented: $showResult) {
                if let result = analysisResult {
                    ResultView(result: result, name: name)
                }
            }
            .alert("分析錯誤", isPresented: .init(
                get: { errorMessage != nil },
                set: { if !$0 { errorMessage = nil } }
            )) {
                Button("確定", role: .cancel) {}
            } message: {
                Text(errorMessage ?? "")
            }
        }
    }
    
    private var isStep1Valid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty
    }
    
    private func submitAnalysis() {
        isAnalyzing = true
        
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
            photoBase64: selectedPhoto.flatMap { APIService.imageToBase64($0) }
        )
        
        Task {
            do {
                let result = try await APIService.analyzeForture(input: input)
                await MainActor.run {
                    analysisResult = result
                    showResult = true
                    isAnalyzing = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isAnalyzing = false
                }
            }
        }
    }
}

// MARK: - 步驟指示器
struct StepIndicator: View {
    let currentStep: Int
    
    var body: some View {
        HStack(spacing: 0) {
            StepDot(number: 1, isActive: currentStep >= 1, label: "基本資料")
            
            Rectangle()
                .fill(currentStep >= 2 ? Color.yellow : Color.white.opacity(0.2))
                .frame(height: 2)
            
            StepDot(number: 2, isActive: currentStep >= 2, label: "進階資料")
        }
        .padding(.horizontal, 40)
    }
}

struct StepDot: View {
    let number: Int
    let isActive: Bool
    let label: String
    
    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(isActive ? Color.yellow : Color.white.opacity(0.2))
                    .frame(width: 36, height: 36)
                
                Text("\(number)")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(isActive ? .black : .white.opacity(0.5))
            }
            
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(isActive ? .white : .white.opacity(0.5))
        }
    }
}

// MARK: - Step 1
struct Step1View: View {
    @Binding var name: String
    @Binding var birthYear: Int
    @Binding var birthMonth: Int
    @Binding var birthDay: Int
    @Binding var gender: String
    
    let years = Array((1920...Calendar.current.component(.year, from: Date())).reversed())
    let months = Array(1...12)
    let days = Array(1...31)
    
    var body: some View {
        VStack(spacing: 20) {
            // 姓名
            FormField(label: "姓名", required: true) {
                TextField("請輸入姓名", text: $name)
                    .textFieldStyle(MysticalTextFieldStyle())
            }
            
            // 出生日期
            FormField(label: "出生日期", required: true) {
                HStack(spacing: 12) {
                    Picker("年", selection: $birthYear) {
                        ForEach(years, id: \.self) { year in
                            Text("\(year)年").tag(year)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.yellow)
                    
                    Picker("月", selection: $birthMonth) {
                        ForEach(months, id: \.self) { month in
                            Text("\(month)月").tag(month)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.yellow)
                    
                    Picker("日", selection: $birthDay) {
                        ForEach(days, id: \.self) { day in
                            Text("\(day)日").tag(day)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.yellow)
                }
                .padding(12)
                .background(Color.white.opacity(0.1))
                .cornerRadius(12)
            }
            
            // 性別
            FormField(label: "性別", required: true) {
                HStack(spacing: 12) {
                    GenderButton(
                        label: "男",
                        icon: "figure.stand",
                        isSelected: gender == "male"
                    ) {
                        gender = "male"
                    }
                    
                    GenderButton(
                        label: "女",
                        icon: "figure.stand.dress",
                        isSelected: gender == "female"
                    ) {
                        gender = "female"
                    }
                    
                    GenderButton(
                        label: "其他",
                        icon: "person.fill.questionmark",
                        isSelected: gender == "other"
                    ) {
                        gender = "other"
                    }
                }
            }
        }
    }
}

// MARK: - Step 2
struct Step2View: View {
    @Binding var birthHour: Int?
    @Binding var birthMinute: Int?
    @Binding var birthPlace: String
    @Binding var currentLocation: String
    @Binding var selectedPhoto: UIImage?
    @Binding var showPhotoPicker: Bool
    
    let hours = Array(0...23)
    let minutes = Array(0...59)
    
    var body: some View {
        VStack(spacing: 20) {
            Text("以下為選填，可提升分析準確度")
                .font(.system(size: 14))
                .foregroundColor(.white.opacity(0.5))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            // 出生時間
            FormField(label: "出生時間", required: false) {
                HStack(spacing: 12) {
                    Picker("時", selection: Binding(
                        get: { birthHour ?? 0 },
                        set: { birthHour = $0 }
                    )) {
                        Text("不確定").tag(0)
                        ForEach(hours, id: \.self) { hour in
                            Text("\(hour)時").tag(hour)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.yellow)
                    
                    Picker("分", selection: Binding(
                        get: { birthMinute ?? 0 },
                        set: { birthMinute = $0 }
                    )) {
                        ForEach(minutes, id: \.self) { minute in
                            Text(String(format: "%02d分", minute)).tag(minute)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.yellow)
                }
                .padding(12)
                .background(Color.white.opacity(0.1))
                .cornerRadius(12)
            }
            
            // 出生地點
            FormField(label: "出生地點", required: false) {
                TextField("例如：台北市", text: $birthPlace)
                    .textFieldStyle(MysticalTextFieldStyle())
            }
            
            // 目前位置
            FormField(label: "目前居住地", required: false) {
                TextField("例如：新竹市", text: $currentLocation)
                    .textFieldStyle(MysticalTextFieldStyle())
            }
            
            // 照片上傳
            FormField(label: "面相照片", required: false) {
                VStack(spacing: 12) {
                    if let photo = selectedPhoto {
                        ZStack(alignment: .topTrailing) {
                            Image(uiImage: photo)
                                .resizable()
                                .scaledToFill()
                                .frame(height: 200)
                                .cornerRadius(12)
                                .clipped()
                            
                            Button(action: { selectedPhoto = nil }) {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                                    .shadow(radius: 2)
                            }
                            .padding(8)
                        }
                    } else {
                        Button(action: { showPhotoPicker = true }) {
                            VStack(spacing: 12) {
                                Image(systemName: "camera.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(.yellow)
                                
                                Text("上傳正面照片")
                                    .font(.system(size: 14))
                                    .foregroundColor(.white.opacity(0.7))
                                
                                Text("用於 AI 面相分析")
                                    .font(.system(size: 12))
                                    .foregroundColor(.white.opacity(0.4))
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 150)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(style: StrokeStyle(lineWidth: 2, dash: [8]))
                                    .foregroundColor(.white.opacity(0.2))
                            )
                        }
                    }
                }
            }
        }
    }
}

// MARK: - 表單欄位
struct FormField<Content: View>: View {
    let label: String
    let required: Bool
    @ViewBuilder let content: Content
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white)
                
                if required {
                    Text("*")
                        .foregroundColor(.red)
                }
            }
            
            content
        }
    }
}

// MARK: - 性別按鈕
struct GenderButton: View {
    let label: String
    let icon: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                Text(label)
                    .font(.system(size: 14))
            }
            .foregroundColor(isSelected ? .black : .white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color.yellow : Color.white.opacity(0.1))
            )
        }
    }
}

// MARK: - 文字框樣式
struct MysticalTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .foregroundColor(.white)
            .padding(16)
            .background(Color.white.opacity(0.1))
            .cornerRadius(12)
    }
}

// MARK: - 照片選擇器
struct PhotoPicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.dismiss) var dismiss
    
    func makeUIViewController(context: Context) -> PHPickerViewController {
        var config = PHPickerConfiguration()
        config.filter = .images
        config.selectionLimit = 1
        
        let picker = PHPickerViewController(configuration: config)
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: PHPickerViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        let parent: PhotoPicker
        
        init(_ parent: PhotoPicker) {
            self.parent = parent
        }
        
        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            parent.dismiss()
            
            guard let provider = results.first?.itemProvider,
                  provider.canLoadObject(ofClass: UIImage.self) else { return }
            
            provider.loadObject(ofClass: UIImage.self) { image, _ in
                DispatchQueue.main.async {
                    self.parent.image = image as? UIImage
                }
            }
        }
    }
}

#Preview {
    AnalyzeView()
        .environmentObject(AppState())
}

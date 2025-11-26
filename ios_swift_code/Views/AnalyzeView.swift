import SwiftUI
import PhotosUI

struct AnalyzeView: View {
    @ObservedObject var viewModel: FortuneViewModel
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                HStack {
                    Button(action: { viewModel.reset() }) {
                        HStack(spacing: 6) {
                            Image(systemName: "house.fill")
                            Text("返回首頁")
                        }
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.7))
                    }
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.top, 16)
                
                HStack(spacing: 12) {
                    ForEach(1...2, id: \.self) { step in
                        HStack(spacing: 8) {
                            Circle()
                                .fill(step <= viewModel.currentStep ? FortuneTheme.primaryPurple : .white.opacity(0.2))
                                .frame(width: 32, height: 32)
                                .overlay(
                                    Text("\(step)")
                                        .font(.subheadline)
                                        .fontWeight(.semibold)
                                        .foregroundColor(.white)
                                )
                            
                            Text(step == 1 ? "基本資料" : "選填資訊")
                                .font(.subheadline)
                                .foregroundColor(step <= viewModel.currentStep ? .white : .white.opacity(0.5))
                        }
                        
                        if step < 2 {
                            Rectangle()
                                .fill(step < viewModel.currentStep ? FortuneTheme.primaryPurple : .white.opacity(0.2))
                                .frame(height: 2)
                        }
                    }
                }
                .padding(.horizontal, 24)
                
                if viewModel.currentStep == 1 {
                    Step1View(viewModel: viewModel)
                } else {
                    Step2View(viewModel: viewModel)
                }
            }
            .padding(.bottom, 40)
        }
    }
}

struct Step1View: View {
    @ObservedObject var viewModel: FortuneViewModel
    
    var body: some View {
        VStack(spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Label("姓名", systemImage: "person.fill")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                TextField("請輸入您的姓名", text: $viewModel.name)
                    .textFieldStyle(FortuneTextFieldStyle())
            }
            .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 8) {
                Label("性別", systemImage: "person.2.fill")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                HStack(spacing: 12) {
                    ForEach(Gender.allCases, id: \.self) { gender in
                        Button(action: { viewModel.gender = gender }) {
                            Text(gender.displayName)
                                .font(.body)
                                .fontWeight(.medium)
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(
                                    viewModel.gender == gender ?
                                    FortuneTheme.primaryPurple : FortuneTheme.cardBackground
                                )
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(
                                            viewModel.gender == gender ?
                                            FortuneTheme.primaryPurple : FortuneTheme.cardBorder,
                                            lineWidth: 1
                                        )
                                )
                        }
                    }
                }
            }
            .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 8) {
                Label("出生日期", systemImage: "calendar")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                HStack(spacing: 12) {
                    Picker("年", selection: $viewModel.birthYear) {
                        ForEach(viewModel.years, id: \.self) { year in
                            Text("\(year)年").tag(year)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(FortuneTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(FortuneTheme.cardBorder, lineWidth: 1)
                    )
                    
                    Picker("月", selection: $viewModel.birthMonth) {
                        ForEach(viewModel.months, id: \.self) { month in
                            Text("\(month)月").tag(month)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.white)
                    .padding(.vertical, 12)
                    .background(FortuneTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(FortuneTheme.cardBorder, lineWidth: 1)
                    )
                    
                    Picker("日", selection: $viewModel.birthDay) {
                        ForEach(viewModel.days, id: \.self) { day in
                            Text("\(day)日").tag(day)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.white)
                    .padding(.vertical, 12)
                    .background(FortuneTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(FortuneTheme.cardBorder, lineWidth: 1)
                    )
                }
            }
            .padding(.horizontal)
            
            Button(action: { viewModel.nextStep() }) {
                HStack {
                    Text("繼續")
                        .font(.headline)
                    Image(systemName: "arrow.right")
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    viewModel.isStep1Valid ?
                    FortuneTheme.accentGradient :
                    LinearGradient(colors: [.gray.opacity(0.5)], startPoint: .leading, endPoint: .trailing)
                )
                .cornerRadius(12)
            }
            .disabled(!viewModel.isStep1Valid)
            .padding(.horizontal)
            .padding(.top, 16)
        }
    }
}

struct Step2View: View {
    @ObservedObject var viewModel: FortuneViewModel
    
    var body: some View {
        VStack(spacing: 24) {
            VStack(alignment: .leading, spacing: 8) {
                Label("出生時間（選填）", systemImage: "clock.fill")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                HStack(spacing: 12) {
                    Picker("時", selection: Binding(
                        get: { viewModel.birthHour ?? 0 },
                        set: { viewModel.birthHour = $0 }
                    )) {
                        Text("時").tag(0)
                        ForEach(viewModel.hours, id: \.self) { hour in
                            Text("\(hour)時").tag(hour)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(FortuneTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(FortuneTheme.cardBorder, lineWidth: 1)
                    )
                    
                    Picker("分", selection: Binding(
                        get: { viewModel.birthMinute ?? 0 },
                        set: { viewModel.birthMinute = $0 }
                    )) {
                        Text("分").tag(0)
                        ForEach(viewModel.minutes, id: \.self) { minute in
                            Text("\(minute)分").tag(minute)
                        }
                    }
                    .pickerStyle(.menu)
                    .tint(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(FortuneTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(FortuneTheme.cardBorder, lineWidth: 1)
                    )
                }
                
                Text("提供出生時間可獲得更精確的分析")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.5))
            }
            .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 8) {
                Label("出生地點（選填）", systemImage: "mappin.circle.fill")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                TextField("例如：台北市", text: $viewModel.birthPlace)
                    .textFieldStyle(FortuneTextFieldStyle())
            }
            .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 8) {
                Label("現居地點（選填）", systemImage: "location.fill")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                TextField("例如：新北市", text: $viewModel.currentLocation)
                    .textFieldStyle(FortuneTextFieldStyle())
            }
            .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 8) {
                Label("面相照片（選填）", systemImage: "camera.fill")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.8))
                
                if let image = viewModel.photoImage {
                    ZStack(alignment: .topTrailing) {
                        Image(uiImage: image)
                            .resizable()
                            .scaledToFill()
                            .frame(height: 200)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        
                        Button(action: { viewModel.clearPhoto() }) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.title2)
                                .foregroundColor(.white)
                                .background(Circle().fill(.black.opacity(0.5)))
                        }
                        .padding(8)
                    }
                } else {
                    PhotosPicker(selection: $viewModel.selectedPhotoItem, matching: .images) {
                        VStack(spacing: 12) {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.system(size: 40))
                                .foregroundColor(.white.opacity(0.5))
                            Text("點擊上傳照片")
                                .font(.subheadline)
                                .foregroundColor(.white.opacity(0.5))
                            Text("支援 JPG、PNG，檔案大小限 5MB")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.3))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 150)
                        .background(FortuneTheme.cardBackground)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(FortuneTheme.cardBorder, style: StrokeStyle(lineWidth: 2, dash: [8]))
                        )
                    }
                    .onChange(of: viewModel.selectedPhotoItem) { _ in
                        Task { await viewModel.loadPhoto() }
                    }
                }
                
                Text("上傳正面清晰照片可進行面相分析")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.5))
            }
            .padding(.horizontal)
            
            HStack(spacing: 12) {
                Button(action: { viewModel.previousStep() }) {
                    HStack {
                        Image(systemName: "arrow.left")
                        Text("上一步")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(FortuneTheme.cardBackground)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(FortuneTheme.cardBorder, lineWidth: 1)
                    )
                }
                
                Button(action: {
                    Task { await viewModel.startAnalysis() }
                }) {
                    HStack {
                        if viewModel.isAnalyzing {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            Text("分析中...")
                        } else {
                            Image(systemName: "sparkles")
                            Text("開始解析")
                        }
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(FortuneTheme.accentGradient)
                    .cornerRadius(12)
                }
                .disabled(viewModel.isAnalyzing)
            }
            .padding(.horizontal)
            .padding(.top, 16)
        }
    }
}

struct FortuneTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(FortuneTheme.cardBackground)
            .foregroundColor(.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(FortuneTheme.cardBorder, lineWidth: 1)
            )
    }
}

#Preview {
    ZStack {
        FortuneTheme.backgroundGradient.ignoresSafeArea()
        AnalyzeView(viewModel: FortuneViewModel())
    }
    .preferredColorScheme(.dark)
}

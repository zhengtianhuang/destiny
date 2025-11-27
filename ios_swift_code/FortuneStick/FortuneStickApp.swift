import SwiftUI

@main
struct FortuneStickApp: App {
    var body: some Scene {
        WindowGroup {
            NavigationStack {
                ShakeFortuneView()
            }
            .preferredColorScheme(.dark)
        }
    }
}

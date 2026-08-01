# iOS production release runbook

1. Set the production origin with `npm run ios:set-url -- https://your-production-host`.
2. Run `npm run ios:sync` and confirm `ios/App/App/capacitor.config.json` contains only an `https://` server URL.
3. Run `npm run verify`, `npm audit --audit-level=high`, and `npm run ios:doctor`.
4. In Xcode, archive the Release scheme and validate the archive before upload.
5. Confirm `PrivacyInfo.xcprivacy` is bundled and update it whenever native plugins or data collection change.
6. Upload to TestFlight and smoke-test authentication, recommendations, watchlist, notifications, offline shell, and recovery after backgrounding.
7. Verify `/api/ready`, provider health, storage health, error rate, and Web Vitals before staged App Store rollout.

Release builds must not use local IP addresses, cleartext URLs, `NSAllowsArbitraryLoads`, or development credentials.

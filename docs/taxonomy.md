# Scam taxonomy (v0)

This is the classification scheme for alerts. It is enforced by `schemas/alert.schema.json`, and in
Phase 4 it becomes the target for AI extraction. Changes need sponsor sign-off, and the version number must be bumped.

| Dimension | Field | Values |
|---|---|---|
| Scam type | `scam_type` | impersonation, phishing, investment, romance, tech_support, job, shopping, prize_lottery, extortion, business_email_compromise, other |
| Channel | `channels[]` | sms, email, phone, voice_clone, video_call, messaging_app, social, pop_up, website, in_person, mail, other |
| Impersonated entity | `impersonated_entity` | Free text for now (e.g. "State toll agencies"). Phase 2 adds a controlled list |
| Manipulation technique | `manipulation_techniques[]` | urgency, authority, fear, secrecy, familiarity, isolation, greed, romance, reciprocity, scarcity, social_proof, emotional_manipulation |
| Requested action | `requested_action` | pay, share_credentials, share_personal_info, install_app, click_link, grant_remote_access, change_bank_details, move_money, other |
| Payment method | `payment_methods[]` | gift_card, crypto, wire, bank_transfer, p2p_app, upi, card, cash, gold, other |
| Target population | `target_population[]` | general_public, older_adults, students, job_seekers, small_business, immigrants, military, other |
| Geography | `geography[]` | ISO 3166-1 alpha-2 codes (US, IN, GB, …) or `global` |

## Technique definitions

- **urgency**: artificial deadlines or pressure to act now
- **authority**: claims to be police, government, a bank, a well-known company or a boss
- **fear**: threats of arrest, account closure, fines or harm to a loved one
- **secrecy**: instructions not to tell family, the bank or anyone else
- **familiarity**: posing as someone the target knows (including through AI voice or video cloning)
- **isolation**: keeping the target on a call or cutting them off from others
- **greed**: promises of prizes, returns or easy money
- **emotional_manipulation**: shame, excitement or panic used to cut off careful thinking

## Assessment questions ↔ taxonomy

Each assessment question has a `technique` field. This lets Phase 5 link an assessment result to the
current alerts that use the same technique ("Scams using this tactic right now…").

## Confidence levels

| Value | Meaning | Shown to users? |
|---|---|---|
| `corroborated` | Two or more independent, credible sources | Yes, once approved |
| `emerging` | One credible source | No. Internal review only |
| `insufficient` | Weak, conflicting or unverifiable evidence | No |

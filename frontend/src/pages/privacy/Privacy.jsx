import Nav from "../../components/Nav.jsx";

const section = (title, color, children) => (
  <div
    className="border rounded-lg p-4 md:p-6 mb-4 md:mb-6"
    style={{ borderColor: color, borderWidth: "2px", background: "rgba(0,0,0,0.4)" }}
  >
    <h2 className="text-lg md:text-xl font-bold mb-3" style={{ color }}>
      {title}
    </h2>
    <div className="text-sm md:text-base leading-relaxed space-y-2 text-gray-200">
      {children}
    </div>
  </div>
);

const Privacy = () => {
  return (
    <>
      <Nav />
      <div className="mt-28 mb-28 md:mb-10 md:mt-32 text-white px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#FF00EE" }}>
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-sm">Last updated: March 2026</p>
            <p className="text-gray-300 text-sm mt-2">
              This policy applies to the Zodomix website and mobile application.
            </p>
          </div>

          {/* Age Requirement */}
          {section("Age Requirement", "#FF00EE",
            <p>
              Zodomix is intended for users who are <strong>18 years of age or older</strong>. By
              using Zodomix, you confirm that you are at least 18 years old. If you are under 18,
              please do not use this platform.
            </p>
          )}

          {/* Information We Collect */}
          {section("Information We Collect", "#00F2FF",
            <>
              <p>When you create an account, we collect:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong>Username</strong> — your chosen display name</li>
                <li><strong>Email address</strong> — used for account verification and password reset</li>
                <li><strong>Password</strong> — stored securely using bcrypt hashing (we never store plain-text passwords)</li>
                <li><strong>Profile picture</strong> — a selection from our provided set of avatars</li>
                <li><strong>Messages</strong> — the messages you send in groups or to the AI chatbot</li>
                <li><strong>IP address</strong> — collected temporarily for rate limiting and abuse prevention</li>
              </ul>
              <p className="mt-2">
                You may also use Zodomix without an account (anonymously), in which case no personal
                information is tied to your activity.
              </p>
            </>
          )}

          {/* How We Use Your Information */}
          {section("How We Use Your Information", "#00FF7B",
            <>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>Create and manage your account</li>
                <li>Send verification and password reset emails</li>
                <li>Enable real-time group chat and voice chat features</li>
                <li>Power the AI chatbot (your messages are sent to OpenRouter's API to generate responses)</li>
                <li>Enforce rate limits to prevent spam and abuse</li>
                <li>Display leaderboards based on message count</li>
              </ul>
            </>
          )}

          {/* Third-Party Services */}
          {section("Third-Party Services", "#EAFF00",
            <>
              <p>
                Zodomix uses the following third-party services to operate. Each has its own privacy policy:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li>
                  <strong>Brevo (Sendinblue)</strong> — used to send verification and password reset emails.
                  Your email address is transmitted to Brevo solely for this purpose.
                </li>
                <li>
                  <strong>OpenRouter</strong> — used to power the AI chatbot. Messages you send to the
                  robot are forwarded to OpenRouter's API to generate a response. Do not share sensitive
                  personal information in AI chat messages.
                </li>
                <li>
                  <strong>Telegram</strong> — used internally for server monitoring and notifications.
                  No user data is shared publicly through this channel.
                </li>
              </ul>
              <p className="mt-2">
                We do not sell, rent, or trade your personal information to any third party for
                marketing or advertising purposes.
              </p>
            </>
          )}

          {/* Data Retention */}
          {section("Data Retention & Deletion", "#FF00EE",
            <>
              <p>
                Your account and its associated data (username, email, profile) are retained for as
                long as your account exists.
              </p>
              <p>
                <strong>Messages:</strong> You can delete your own messages at any time from within
                the chat. Deleted messages are permanently removed from our servers.
              </p>
              <p>
                <strong>Account deletion:</strong> We do not currently offer a self-service account
                deletion feature. To request deletion of your account and all associated data, contact
                us at{" "}
                <a
                  href="mailto:sendtozodo@gmail.com"
                  style={{ color: "#FF00EE" }}
                  className="hover:opacity-80 transition"
                >
                  sendtozodo@gmail.com
                </a>{" "}
                and we will process your request.
              </p>
            </>
          )}

          {/* California Privacy Rights (CCPA) */}
          {section("California Privacy Rights (CCPA)", "#00F2FF",
            <>
              <p>
                If you are a California resident, you have the following rights under the California
                Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
                <li><strong>Right to Know</strong> — you can request a copy of the personal data we hold about you</li>
                <li><strong>Right to Delete</strong> — you can request deletion of your personal data</li>
                <li><strong>Right to Opt-Out</strong> — we do not sell your data, so there is nothing to opt out of</li>
                <li><strong>Right to Non-Discrimination</strong> — exercising your rights will not affect your access to Zodomix</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:sendtozodo@gmail.com"
                  style={{ color: "#00F2FF" }}
                  className="hover:opacity-80 transition"
                >
                  sendtozodo@gmail.com
                </a>.
              </p>
            </>
          )}

          {/* Cookies */}
          {section("Cookies & Session Data", "#00FF7B",
            <p>
              Zodomix uses a single secure HTTP-only cookie to keep you logged in. This cookie contains
              a JWT authentication token and does not track you across other websites. We do not use
              advertising cookies or third-party tracking cookies.
            </p>
          )}

          {/* Security */}
          {section("Security", "#EAFF00",
            <p>
              We take reasonable measures to protect your data, including password hashing with bcrypt,
              HTTP-only cookies to prevent XSS attacks, and rate limiting to prevent abuse. However, no
              system is completely secure. Use Zodomix at your own risk and do not share sensitive
              personal information in public chats.
            </p>
          )}

          {/* Changes */}
          {section("Changes to This Policy", "#FF00EE",
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected by the
              "Last updated" date at the top of this page. Continued use of Zodomix after changes
              constitutes your acceptance of the updated policy.
            </p>
          )}

          {/* Contact */}
          <div className="text-center mt-8 mb-4">
            <p className="text-gray-300 text-sm">
              Questions about this policy? Contact us at{" "}
              <a
                href="mailto:sendtozodo@gmail.com"
                style={{ color: "#FF00EE" }}
                className="hover:opacity-80 transition font-bold"
              >
                sendtozodo@gmail.com
              </a>
            </p>
            <p className="text-xs text-gray-500 mt-2">Copyright © 2026 Zodomix</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Privacy;

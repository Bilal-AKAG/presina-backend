/** @jsxImportSource react */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface VerificationEmailProps {
  userName: string
  verificationUrl: string
}

const EmailVerification = ({
  userName,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Complete your Persina AI account setup - verify your email address
      </Preview>
      <Tailwind>
        <Body className="bg-[#F6F8FA] font-sans py-[40px]">
          <Container className="bg-[#FFFFFF] rounded-[8px] mx-auto px-[40px] py-[48px] max-w-[600px]">
            {/* Logo Section */}
            <Section className="text-center mb-[40px]">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/489432b5-862c-4089-84ba-536991d5c43e/primary/368dc7e3-84a1-4991-a67d-b77b44874bb4.png"
                alt="Persina AI"
                className="w-full h-auto object-cover max-w-[180px] mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="mb-[40px]">
              <Heading className="text-[#000000] text-[24px] font-bold mb-[24px] leading-[1.3] text-center">
                Verify Your Email Address
              </Heading>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[24px]">
                Hello {userName},
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[24px]">
                Welcome to Persina AI! To complete your account setup and start
                creating professional presentations with AI, please verify your
                email address by clicking the button below.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[40px]">
              <Button
                href={verificationUrl}
                className="bg-[#5540ff] text-white px-[40px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[40px]">
              <Text className="text-[#000000] text-[14px] leading-[1.5] mb-[12px]">
                If the button above doesn't work, please copy and paste this
                link into your browser:
              </Text>
              <Text className="text-[#5540ff] text-[14px] break-all bg-[#F6F8FA] px-[16px] py-[12px] rounded-[4px] font-mono">
                {verificationUrl}
              </Text>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[40px] bg-[#F6F8FA] px-[24px] py-[20px] rounded-[8px]">
              <Text className="text-[#000000] text-[14px] leading-[1.5] mb-[8px] font-semibold">
                Security Notice
              </Text>
              <Text className="text-[#000000] text-[14px] leading-[1.5] mb-[0px]">
                This verification link will expire in 24 hours. If you didn't
                create an account with Persina AI, please ignore this email or
                contact our support team.
              </Text>
            </Section>

            {/* What's Next */}
            <Section className="mb-[40px]">
              <Heading className="text-[#000000] text-[18px] font-semibold mb-[16px]">
                What happens next?
              </Heading>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[16px]">
                Once your email is verified, you'll have full access to:
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[8px]">
                • AI-powered presentation generation
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[8px]">
                • Professional slide templates and layouts
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[8px]">
                • Automated content structuring and design
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.6] mb-[16px]">
                • Export options for various formats
              </Text>
            </Section>

            {/* Support */}
            <Section className="mb-[40px] text-center">
              <Text className="text-[#000000] text-[14px] leading-[1.5]">
                Questions? Our support team is here to help at{' '}
                <Link
                  href="mailto:support@PersinaAI.com"
                  className="text-[#5540ff] no-underline"
                >
                  support@PersinaAI.com
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-[#F6F8FA] pt-[32px]">
              <Text className="text-[#000000] text-[12px] leading-[1.4] mb-[16px] text-center">
                <strong>Company:</strong>{' '}
                <Link
                  href="https://PersinaAI.com/about"
                  className="text-[#5540ff] no-underline"
                >
                  About us
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/careers"
                  className="text-[#5540ff] no-underline"
                >
                  Careers
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/security"
                  className="text-[#5540ff] no-underline"
                >
                  Security
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI-status.com"
                  className="text-[#5540ff] no-underline"
                >
                  Status
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/terms"
                  className="text-[#5540ff] no-underline"
                >
                  Terms & privacy
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/privacy-rights"
                  className="text-[#5540ff] no-underline"
                >
                  Your privacy rights
                </Link>
              </Text>

              <Text className="text-[#000000] text-[12px] leading-[1.4] mb-[8px] text-center">
                Persina AI
              </Text>

              <Text className="text-[#000000] text-[12px] leading-[1.4] mb-[8px] m-0 text-center">
                Addis Ababba
              </Text>

              <Text className="text-[#000000] text-[12px] leading-[1.4] mb-[16px] m-0 text-center">
                © 2025 Persina Labs, Inc.
              </Text>

              <Text className="text-[#000000] text-[10px] leading-[1.4] mb-[8px] m-0 text-center">
                Cookie settings available. Privacy Policy and Terms of Service
                apply. Status page available at PersinaAI-status.com.
              </Text>

              <Text className="text-[#000000] text-[10px] leading-[1.4] m-0 text-center">
                <Link
                  href="https://PersinaAI.com/unsubscribe"
                  className="text-[#5540ff] no-underline"
                >
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

EmailVerification.PreviewProps = {
  verificationUrl: 'https://PersinaAI.com/verify?token=abc123def456',
  userName: 'Sarah',
}

export default EmailVerification

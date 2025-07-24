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
        Verify your email to start creating stunning presentations with Persina
        AI! 🚀
      </Preview>
      <Tailwind>
        <Body className="bg-[#F6F8FA] font-sans py-[40px]">
          <Container className="bg-[#FFFFFF] rounded-[8px] mx-auto px-[32px] py-[40px] max-w-[600px]">
            {/* Logo Section */}
            <Section className="text-center mb-[32px]">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/489432b5-862c-4089-84ba-536991d5c43e/primary/b3814031-c692-4368-b343-57fd121f8c0e.png"
                alt="Persina AI"
                className="w-full h-auto object-cover max-w-[200px] mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[#000000] text-[28px] font-bold mb-[16px] leading-[1.2]">
                Welcome to Persina AI! 🎉
              </Heading>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[24px]">
                Hey {userName}! We're thrilled you've joined us. You're just one
                click away from transforming your ideas into stunning,
                professional presentations in seconds.
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[32px]">
                Let's verify your email address so you can start creating magic
                with AI! ✨
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[40px]">
              <Button
                href={verificationUrl}
                className="bg-[#6d6d6d] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-medium no-underline box-border inline-block"
              >
                Verify My Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="text-center mb-[40px]">
              <Text className="text-[#000000] text-[14px] leading-[1.5] mb-[8px]">
                Button not working? Copy and paste this link into your browser:
              </Text>
              <Link
                href={verificationUrl}
                className="text-[#6d6d6d] text-[14px] underline break-all"
              >
                {verificationUrl}
              </Link>
            </Section>

            {/* What's Next Section */}
            <Section className="mb-[40px] border-t border-solid border-[#F6F8FA] pt-[32px]">
              <Heading className="text-[#000000] text-[20px] font-bold mb-[16px]">
                What's next? 🚀
              </Heading>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[16px]">
                Once verified, you'll be able to:
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[8px] ml-[16px]">
                • Generate professional presentations in seconds
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[8px] ml-[16px]">
                • Let AI handle content structuring and design
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[8px] ml-[16px]">
                • Create stunning slide decks for work, school, or startups
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[1.5] mb-[16px] ml-[16px]">
                • Access clean, visually compelling layouts automatically
              </Text>
            </Section>

            {/* Help Section */}
            <Section className="text-center mb-[40px]">
              <Text className="text-[#000000] text-[14px] leading-[1.5]">
                Need help? We're here for you! Reach out to us anytime at{' '}
                <Link
                  href="mailto:support@PersinaAI.com"
                  className="text-[#6d6d6d] underline"
                >
                  support@PersinaAI.com
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-[#F6F8FA] pt-[24px] text-center">
              <Text className="text-[#6d6d6d] text-[12px] leading-[1.4] mb-[16px]">
                <strong>Company:</strong>{' '}
                <Link
                  href="https://PersinaAI.com/about"
                  className="text-[#6d6d6d] underline"
                >
                  About us
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/careers"
                  className="text-[#6d6d6d] underline"
                >
                  Careers
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/security"
                  className="text-[#6d6d6d] underline"
                >
                  Security
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI-status.com"
                  className="text-[#6d6d6d] underline"
                >
                  Status
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/terms"
                  className="text-[#6d6d6d] underline"
                >
                  Terms & privacy
                </Link>{' '}
                |{' '}
                <Link
                  href="https://PersinaAI.com/privacy-rights"
                  className="text-[#6d6d6d] underline"
                >
                  Your privacy rights
                </Link>
              </Text>

              <Text className="text-[#6d6d6d] text-[12px] leading-[1.4] mb-[8px] m-0">
                Persina AI, Addis Ababba
              </Text>

              <Text className="text-[#6d6d6d] text-[12px] leading-[1.4] mb-[8px] m-0">
                © 2025 Persina Labs, Inc.
              </Text>

              <Text className="text-[#6d6d6d] text-[10px] leading-[1.4] m-0">
                Cookie settings available. Privacy Policy and Terms of Service
                apply. Status page available at PersinaAI-status.com.
              </Text>

              <Text className="text-[#6d6d6d] text-[10px] leading-[1.4] mt-[8px] m-0">
                <Link
                  href="https://PersinaAI.com/unsubscribe"
                  className="text-[#6d6d6d] underline"
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

export default EmailVerification

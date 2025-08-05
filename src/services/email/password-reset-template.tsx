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
import * as React from 'react'

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
  requestTime: string
}
const PasswordResetEmail = ({
  userName,
  resetUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your Persina AI password</Preview>
        <Body className="bg-[#F6F8FA] font-sans py-[40px]">
          <Container className="bg-[#FFFFFF] rounded-[12px] shadow-sm p-[48px] max-w-[600px] mx-auto">
            {/* Logo */}
            <Section className="text-center mb-[48px]">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/489432b5-862c-4089-84ba-536991d5c43e/primary/368dc7e3-84a1-4991-a67d-b77b44874bb4.png"
                alt="Persina AI"
                className="w-full h-auto object-cover max-w-[220px] mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="text-center">
              <Heading className="text-[#000000] text-[32px] font-bold mb-[24px] m-0 leading-[38px]">
                Reset Your Password
              </Heading>

              <Text className="text-[#000000] text-[18px] leading-[28px] mb-[32px] m-0">
                Ready to get back to creating? 🚀
              </Text>

              <Text className="text-[#000000] text-[16px] leading-[26px] mb-[40px] m-0 max-w-[400px] mx-auto">
                We got a reset request for <strong>{userName}</strong>. Click
                below to create a new password.
              </Text>

              {/* Reset Button */}
              <Section className="mb-[40px]">
                <Button
                  href={resetUrl}
                  className="bg-[#5540ff] text-white px-[48px] py-[20px] rounded-[12px] text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[#6d6d6d] text-[14px] leading-[22px] mb-[32px] m-0">
                Link expires in 24 hours. Didn't request this? Ignore this
                email.
              </Text>

              <Text className="text-[#000000] text-[16px] leading-[26px] m-0">
                Happy presenting! 💫
                <br />
                <strong>The Persina AI Team</strong>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-[64px] pt-[32px] border-t border-solid border-[#F6F8FA] text-center">
              <Text className="text-[#6d6d6d] text-[12px] leading-[20px] mb-[16px] m-0">
                <Link
                  href="https://PersinaAI.com/about"
                  className="text-[#5540ff] no-underline"
                >
                  About us
                </Link>{' '}
                •{' '}
                <Link
                  href="https://PersinaAI.com/careers"
                  className="text-[#5540ff] no-underline"
                >
                  Careers
                </Link>{' '}
                •{' '}
                <Link
                  href="https://PersinaAI.com/security"
                  className="text-[#5540ff] no-underline"
                >
                  Security
                </Link>{' '}
                •{' '}
                <Link
                  href="https://PersinaAI.com/status"
                  className="text-[#5540ff] no-underline"
                >
                  Status
                </Link>{' '}
                •{' '}
                <Link
                  href="https://PersinaAI.com/terms"
                  className="text-[#5540ff] no-underline"
                >
                  Terms & privacy
                </Link>{' '}
                •{' '}
                <Link
                  href="https://PersinaAI.com/privacy"
                  className="text-[#5540ff] no-underline"
                >
                  Your privacy rights
                </Link>
              </Text>

              <Text className="text-[#6d6d6d] text-[12px] leading-[20px] mb-[16px] m-0">
                Persina Ai, Addis Ababba
              </Text>

              <Text className="text-[#6d6d6d] text-[12px] leading-[20px] mb-[16px] m-0">
                Cookie settings available.{' '}
                <Link
                  href="https://PersinaAI.com/privacy"
                  className="text-[#5540ff] no-underline"
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="https://PersinaAI.com/terms"
                  className="text-[#5540ff] no-underline"
                >
                  Terms of Service
                </Link>{' '}
                apply. Status page at{' '}
                <Link
                  href="https://PersinaAI-status.com"
                  className="text-[#5540ff] no-underline"
                >
                  PersinaAI-status.com
                </Link>
                .
              </Text>

              <Text className="text-[#6d6d6d] text-[12px] leading-[20px] m-0">
                © 2025 Persina Labs, Inc. •{' '}
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

PasswordResetEmail.PreviewProps = {
  resetUrl: 'https://PersinaAI.com/reset-password?token=abc123xyz789',
  userEmail: 'bilal.ali.irp.dev@gmail.com',
}

export default PasswordResetEmail

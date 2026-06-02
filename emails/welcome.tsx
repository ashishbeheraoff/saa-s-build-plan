import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { barebonesBoxedTailwindConfig } from './theme';
import { BarebonesFonts } from './theme-fonts';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

interface WelcomeEmailProps {
  companyName: string;
  url: string;
}

export const WelcomeEmail = ({ companyName, url }: WelcomeEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>

      <Body className="bg-bg-2 m-0 font-sans text-center">
        <Preview>Welcome aboard—{companyName}</Preview>
        <Container className="mx-auto mt-8 mobile:mt-0 w-full max-w-[640px]">
          <Section>
            <Section className="bg-bg px-6 mobile:px-2 py-4">
              <Section className="mb-3 px-6">
                <Row>
                  <Column className="py-[7px] w-1/2 align-middle">
                    <Row>
                      <Column className="w-[32px] align-middle">
                        <Img
                          src={`${baseUrl}/logo.png`}
                          alt=""
                          width={23}
                          className="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" className="py-[7px] w-1/2 align-middle">
                    <Text className="m-0 font-13 font-sans text-right">
                      <span className="text-fg-3">{companyName}</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 pt-5 mobile:pt-4 pb-14 mobile:pb-10 rounded-[10px]">
                <Section className="mx-auto max-w-[422px] text-center">
                  <Text className="mt-0 mb-6 font-13 font-sans text-fg-3">
                    Thanks for joining us
                  </Text>
                  <Heading
                    as="h1"
                    className="mt-0 mb-6 font-40 font-sans text-fg"
                  >
                    Welcome to {companyName}
                  </Heading>
                  <Text className="m-0 font-16 font-sans text-fg-2">
                    You&apos;re all set. Open your dashboard to explore the
                    basics, connect a few tools, and invite your team when
                    you&apos;re ready.
                  </Text>
                </Section>
              </Section>

              <Section className="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 pt-5 mobile:pt-4 pb-14 mobile:pb-10 rounded-[10px]">
                <Section className="px-6">
                  <Heading
                    as="h2"
                    className="mt-0 mb-10 font-32 font-sans text-fg"
                  >
                    Getting started
                  </Heading>
                  <Section className="text-center">
                    <Button
                      href={url}
                      className="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Open dashboard
                    </Button>
                  </Section>
                </Section>
              </Section>

              {/* Footer */}
              <Section className="bg-bg">
                <Row>
                  <Column className="px-6 py-10 text-center">
                    <Text className="mx-auto mt-0 mb-8 max-w-[280px] font-13 font-sans text-fg-3 text-center">
                      {companyName} - Your platform for success.
                    </Text>
                    <Text className="m-0 font-11 font-sans text-fg-3 text-center">
                      <Link href={url} className="text-fg-3">
                        Unsubscribe
                      </Link>{' '}
                      from {companyName} marketing emails.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

WelcomeEmail.PreviewProps = {
  companyName: 'LinkedLeads',
  url: 'https://example.com/dashboard',
} satisfies WelcomeEmailProps;

export default WelcomeEmail;

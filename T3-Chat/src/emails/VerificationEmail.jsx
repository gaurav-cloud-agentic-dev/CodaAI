import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const VerificationEmail = ({
  userName = "there",
  verificationCode,
}) => (
  <Html>
    <Head />
    <Preview>Your CodaAI verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Rocket Icon */}
        <Section style={iconSection}>
          <Text style={rocketIcon}>🚀</Text>
        </Section>

        {/* Main Content */}
        <Heading style={h1}>Hello {userName}!</Heading>
        
        <Text style={text}>
          Welcome to <strong>CodaAI</strong> - where intelligence meets conversation.
        </Text>

        <Text style={text}>
          Continue signing up for CodaAI by entering the code below:
        </Text>

        {/* Verification Code */}
        <Section style={codeContainer}>
          <Text style={code}>{verificationCode}</Text>
        </Section>

        <Text style={text}>
          This code will expire in <strong>10 minutes</strong>.
        </Text>

        <Text style={footerText}>
          Experience the future of AI-powered conversations. Built for developers,
          shippers, builders, and makers who demand precision, elegance, and
          performance at scale.
        </Text>

        <Text style={footer}>
          If you didn't request this code, you can safely ignore this email.
        </Text>

        <Text style={brandFooter}>
          — The CodaAI Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

// Styles
const main = {
  backgroundColor: "#fef3c7",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginTop: "40px",
  marginBottom: "40px",
  borderRadius: "8px",
  maxWidth: "560px",
};

const iconSection = {
  textAlign: "center",
  marginBottom: "32px",
};

const rocketIcon = {
  fontSize: "64px",
  margin: "0",
  lineHeight: "1",
};

const h1 = {
  color: "#78350f",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 20px",
  padding: "0",
  textAlign: "center",
};

const text = {
  color: "#78350f",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const codeContainer = {
  background: "#fef3c7",
  borderRadius: "8px",
  margin: "32px 0",
  padding: "24px",
  textAlign: "center",
  border: "2px solid #d97706",
};

const code = {
  color: "#92400e",
  fontSize: "48px",
  fontWeight: "700",
  letterSpacing: "8px",
  lineHeight: "1",
  margin: "0",
  fontFamily: "monospace",
};

const footerText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "24px 0",
  fontStyle: "italic",
};

const footer = {
  color: "#92400e",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "24px 0 8px",
};

const brandFooter = {
  color: "#78350f",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};
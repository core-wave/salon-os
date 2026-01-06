import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { User } from "better-auth";
import { styles } from "./styles";

interface VerificationEmailProps {
  user: User;
  url: string;
}

export function VerificationEmail({ user, url }: VerificationEmailProps) {
  const name = user.name ?? "there";

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for SalonOS</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            {/* Logo / Brand */}
            <Text style={styles.brand}>SalonOS</Text>

            <Heading style={styles.heading}>Verify your email address</Heading>

            <Text style={styles.text}>Hi {name},</Text>

            <Text style={styles.text}>
              Thanks for signing up for <strong>SalonOS</strong>. Please confirm
              your email address to finish setting up your account.
            </Text>

            <Section style={styles.buttonWrapper}>
              <Button href={url} style={styles.button}>
                Verify email
              </Button>
            </Section>

            <Text style={styles.muted}>
              This link will expire for security reasons. If you didn’t create
              an account, you can safely ignore this email.
            </Text>

            <Text style={styles.footer}>— SalonOS Security</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

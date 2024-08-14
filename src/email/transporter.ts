"use server";

import { env } from "@/env";
import { createTransport } from "nodemailer";
import { TransportMailEnum } from "./transporter.enum";

type TransportMailType = {
  success: boolean;
  message: TransportMailEnum;
};

/**
 * This TransportMail will sent email from sender to receiver
 *
 * @param to - The receiver mail address
 * @param html - The message you want to sent
 * @param subject - The subject of message
 * @returns
 */
export async function TransportMail(
  to: string,
  html: string,
  subject: string
): Promise<TransportMailType> {
  const transport = createTransport({
    service: "GMAIL",
    auth: { user: env.GMAIL_ID, pass: env.GMAIL_PASS },
  });

  try {
    const transportMail = await transport.sendMail({
      to,
      html,
      subject,
      from: env.GMAIL_ID,
    });
    if (transportMail.messageId) {
      return {
        success: true,
        message: TransportMailEnum.MAIL_SENT,
      };
    }

    return { success: false, message: TransportMailEnum.FAILED };
  } catch (error) {
    console.error(error);
    return { success: false, message: TransportMailEnum.ERROR };
  }
}

"use client";

import { useState, type FormEvent } from "react";
import { contactFormEndpoint } from "@/config/site";
import { messages } from "@/content/en";
import { useThemeDefinition } from "@/features/theme/useThemeDefinition";
import styles from "./ContactApp.module.css";

type FormStatus = "idle" | "sending" | "sent" | "error";

const text = messages.apps.contact;

export default function ContactApp() {
  const { definition } = useThemeDefinition();

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(contactFormEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(text.sendFailed);
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMessage(text.error);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>{text.nameLabel}</span>
        <input
          className={`${styles.input} ${definition.project.description}`}
          type="text"
          name="name"
          required
        />
      </label>

      <label className={styles.field}>
        <span>{text.emailLabel}</span>
        <input
          className={`${styles.input} ${definition.project.description}`}
          type="email"
          name="email"
          required
        />
      </label>

      <label className={styles.field}>
        <span>{text.messageLabel}</span>
        <textarea
          className={`${styles.textarea} ${definition.project.description}`}
          name="message"
          required
        />
      </label>

      <button
        type="submit"
        className={`${styles.submitButton} ${definition.controls.button}`}
        disabled={status === "sending"}
      >
        {status === "sending" ? text.sending : text.send}
      </button>

      {status === "sent" && (
        <p className={`${styles.status} ${definition.project.tag}`}>{text.sent}</p>
      )}

      {status === "error" && (
        <p className={`${styles.status} ${definition.project.tag}`}>{errorMessage}</p>
      )}
    </form>
  );
}

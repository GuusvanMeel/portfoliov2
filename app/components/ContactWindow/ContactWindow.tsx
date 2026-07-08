"use client";

import { useState, type FormEvent } from "react";
import { useTheme } from "@/app/Features/Theme/ThemeProvider";
import { windowThemes } from "@/app/Features/Window/windowThemes";
import styles from "./ContactWindow.module.css";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactWindow() {
  const { theme } = useTheme();
  const selectedTheme = windowThemes[theme];

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("https://formspree.io/f/mnjkredb", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Message could not be sent.");
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Your name:</span>
        <input
          className={`${styles.input} ${selectedTheme.projectDescription}`}
          type="text"
          name="name"
          required
        />
      </label>

      <label className={styles.field}>
        <span>Your email:</span>
        <input
          className={`${styles.input} ${selectedTheme.projectDescription}`}
          type="email"
          name="email"
          required
        />
      </label>

      <label className={styles.field}>
        <span>Your message:</span>
        <textarea
          className={`${styles.textarea} ${selectedTheme.projectDescription}`}
          name="message"
          required
        />
      </label>

      <button
        type="submit"
        className={`${styles.submitButton} ${selectedTheme.button}`}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send"}
      </button>

      {status === "sent" && (
        <p className={`${styles.status} ${selectedTheme.projectTag}`}>
          Message sent.
        </p>
      )}

      {status === "error" && (
        <p className={`${styles.status} ${selectedTheme.projectTag}`}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
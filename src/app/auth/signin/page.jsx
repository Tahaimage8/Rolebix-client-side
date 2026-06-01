"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label } from "@heroui/react";
import { Envelope, Lock, ArrowRightToSquare } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!formData.password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password."
        );
        return;
      }

      setSuccessMessage("Signed in successfully.");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setErrorMessage("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Card.Header className="flex flex-col items-start gap-1 px-0 pt-0">
          <Card.Title className="text-2xl font-semibold text-slate-950">
            Welcome back
          </Card.Title>
          <Card.Description className="text-sm text-slate-500">
            Sign in to continue to your dashboard.
          </Card.Description>
        </Card.Header>

        <Card.Content className="px-0">
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>

              <div className="relative">
                <Envelope className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="primary"
              isPending={isLoading}
              isDisabled={isLoading}
              className="mt-2"
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRightToSquare className="size-4" />}
            </Button>
          </form>
        </Card.Content>

        <Card.Footer className="flex justify-center px-0 pb-0 pt-6">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-slate-950 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </main>
  );
}
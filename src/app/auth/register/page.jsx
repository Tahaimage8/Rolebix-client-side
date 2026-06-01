"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Label } from "@heroui/react";
import { Envelope, Lock, Person, ArrowRightToSquare } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";


export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setErrorMessage(error.message || "Something went wrong. Please try again.");
        return;
      }

      setSuccessMessage("Account created successfully. You can sign in now.");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Optional: redirect after success
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1200);
    } catch (error) {
      setErrorMessage("Unable to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Card.Header className="flex flex-col items-start gap-1 px-0 pt-0">
          <Card.Title className="text-2xl font-semibold text-slate-950">
            Create account
          </Card.Title>
          <Card.Description className="text-sm text-slate-500">
            Sign up to continue to your dashboard.
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
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Name
              </Label>

              <div className="relative">
                <Person className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
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
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full pl-10"
                  required
                  minLength={8}
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
              {isLoading ? "Creating account..." : "Create account"}
              {!isLoading && <ArrowRightToSquare className="size-4" />}
            </Button>
          </form>
        </Card.Content>

        <Card.Footer className="flex justify-center px-0 pb-0 pt-6">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-slate-950 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </main>
  );
}
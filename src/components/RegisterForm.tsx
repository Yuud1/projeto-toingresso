import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleLogin } from "@react-oauth/google";

import React from "react";
import axios from "axios";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    cpf: "",
    birthdaydata: "",
    password: "",
    confirmPassword: "",
  });

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_AUTH_REGISTER}`,
        formData
      );

      if (response.data.isRegistered) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/confirm-email";
      }
    } catch (error: any) {
      console.log("Erro ao registrar", error);
      setErrorMessage(error.response?.data?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLoginSuccess(credentialResponse: any) {
    const { credential } = credentialResponse;

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_AUTH_GOOGLE}`,
        {
          credential,
        }
      )
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Erro ao logar com Google", error);
      });
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Crie sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seus dados abaixo para se registrar.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <div className="flex gap-4">
          <div className="flex-1 grid gap-3">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              required
              onChange={handleFormChange}
            />
          </div>

          <div className="flex-1 grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 grid gap-3">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              required
              onChange={handleFormChange}
            />
          </div>

          <div className="flex-1 grid gap-3">
            <Label htmlFor="birthdaydata">Data de Nascimento</Label>
            <Input
              id="birthdaydata"
              type="date"
              required
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 grid gap-3 relative">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={handleFormChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-[45px] transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex-1 grid gap-3 relative">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              onChange={handleFormChange}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-[45px] transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continue com
          </span>
        </div>

        <div className="w-full">
          <div className="w-full flex justify-center google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log("Erro ao logar com Google");
              }}
              useOneTap
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>
        </div>
      </div>

      <div className="text-center text-sm">
        Já possui conta?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}

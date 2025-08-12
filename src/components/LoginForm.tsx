import axios from "axios";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      emailVerified?: boolean;
      token?: string;
    };
  };
  }

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  function handleGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    const { credential } = credentialResponse;

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_AUTH_GOOGLE
        }`,
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_AUTH_LOGIN
        }`,
        {
          email,
          password,
        }
      );

      if (response.data.logged) {
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("tokenChanged"));
        window.location.href = "/";
      }
         } catch (error: unknown) {
       const apiError = error as ApiError;
       if (apiError.response?.data?.emailVerified === false) {
         localStorage.setItem("token", apiError.response.data.token || "");
         window.dispatchEvent(new Event("tokenChanged"));
         window.location.href = "/confirm-email";
       }

       // Mensagem genérica para não revelar qual campo está incorreto
       setErrorMessage("Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça login na sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seu e-mail abaixo para acessar sua conta
        </p>
      </div>
      {errorMessage ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          Acessar
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
        Não possui conta?{" "}
        <a href="/register" className="underline underline-offset-4">
          Registre-se
        </a>
      </div>
    </form>
  );
}

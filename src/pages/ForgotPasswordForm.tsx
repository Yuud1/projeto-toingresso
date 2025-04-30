import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Lado esquerdo: Formulário */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo e título */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center font-medium">
            <img
              src="icon-login.png"
              alt="Logo"
              className="size-9"
            />
            TOingresso
          </a>
        </div>
        {/* Formulário de recuperação de senha */}
        <div className="flex flex-1 items-center justify-center">
          <form className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Recupere sua senha</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Digite o e-mail associado à sua conta para receber um link de recuperação.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <Button 
                type="submit" 
                className="w-full cursor-pointer"
              >
                Enviar link de recuperação
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Ou volte para
                </span>
              </div>
              <div className="text-center text-sm">
                <a
                  href="/login"
                  className="w-full inline-block text-center px-4 py-2 border border-black bg-white text-black rounded"
                >
                  Página de login
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Lado direito: Imagem de fundo */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="background-login.png"
          alt="Background Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

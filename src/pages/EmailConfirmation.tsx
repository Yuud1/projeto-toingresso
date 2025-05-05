import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

export default function EmailConfirmationPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
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
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <form className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-16 h-16 bg-[#02488C]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-[#02488C]" />
                </div>
                <h1 className="text-2xl font-bold">Confirme seu e-mail</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Digite o código de confirmação que enviamos para seu e-mail
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="code">Código de confirmação</Label>
                  <Input 
                    id="code" 
                    type="text" 
                    placeholder="Digite o código de 6 dígitos" 
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full cursor-pointer bg-black text-white hover:bg-gray-800"
                >
                  Confirmar e-mail
                </Button>
                <div className="text-center text-sm">
                  <p className="text-muted-foreground">
                    Não recebeu o código?{" "}
                    <button type="button" className="text-[#02488C] hover:underline">
                      Reenviar código
                    </button>
                  </p>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Ou volte para
                  </span>
                </div>
                <div className="text-center text-sm">
                  <a
                    href="/login"
                    className="w-full inline-block text-center px-4 py-2 border border-black bg-white text-black rounded hover:bg-gray-50"
                  >
                    Página de login
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
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
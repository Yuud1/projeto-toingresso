import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function EmailConfirmedPage() {
  const navigate = useNavigate()

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
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold">E-mail confirmado!</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Seu e-mail foi confirmado com sucesso. Agora você pode acessar todas as funcionalidades da plataforma.
              </p>
              <div className="w-full space-y-4">
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full cursor-pointer bg-black text-white hover:bg-gray-800"
                >
                  Ir para a página inicial
                </Button>
                <Button 
                  onClick={() => navigate('/perfil')}
                  variant="outline"
                  className="w-full border-black text-black hover:bg-gray-50"
                >
                  Acessar meu perfil
                </Button>
              </div>
            </div>
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
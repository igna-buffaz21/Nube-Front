import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { authService } from "@/services/authService"
import toast from 'react-hot-toast'
import { useAuth } from "@/auth/authContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const { login } = useAuth(); 
  const [check, setCheck] = useState(true)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("se toco el boton de enviar");
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await authService.login({ email, password });

      const token = response.token

      login(token)
      toast.success('Inicio de sesión exitoso, redirigiendo a home...')

      setTimeout(() => {
        navigate('/home')
      }, 1500)

    }
    catch (error: any) {

      if (error.response.status == 500) {
        console.error('Credenciales incorrectas:', error)
        toast.error('Credenciales incorrectas')
      }
      else if (error.response.status == 400) {
        console.error('Error en login:', error.response.data.message)
        toast.error('Credenciales incorrectas')
      }
      else {
        console.error('Error en login:', error)
        toast.error('Credenciales incorrectas')
      }
    }


  }

  useEffect(() => {
    if (email.trim() && password.trim()) {
      setCheck(false)
    }
    else {
      setCheck(true)
    }
  }, [email, password]
)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de vuelta</CardTitle>
          <CardDescription>
            Inicia sesión en tu cuenta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button 
                type="submit" 
                className="w-full"
                disabled={check}
                >
                  Iniciar sesión
                </Button>
              </div>
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="underline underline-offset-4">
                  Registrarse
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
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
import { useEffect, useState } from "react"
import { authService } from "@/services/authService"
import type { RegisterRequest } from "@/interfaces/register.interface"
import toast from "react-hot-toast"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const [check, setCheck] = useState(true)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      console.log("Email:", email);
      console.log("Password:", password);

      try {
        if (name && email && password && phone) {

          const data: RegisterRequest = {
            nombre: name,
            email: email,
            phone: phone,
            password: password
          }

          const response = await authService.register(data)

          setName('')
          setEmail('')
          setPhone('')
          setPassword('')

          console.log(response);

          toast.success("Usuario creado con exito, redirigiendo al login...")

          setTimeout(() => {
            navigate('/login')
          }, 1500)

        }
      }
      catch (error: any) {
        console.log(error.response.data.error);

        if (error.response.data.error == "Duplicate entry '" + phone + "' for key 'user.phone'") {
          toast.error("El telefono ya esta en uso, ingrese otro")
          throw error
        }

        toast.error(error.response.data.error + ", ingrese otro")
      }
    }

    useEffect(() =>{
      if (name.trim() && email.trim() && phone.trim() && password.trim()) {
        setCheck(false)
      }
      else {
        setCheck(true)
      }
    }, [name, email, phone, password]
  )


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
          <CardDescription>
            Completa los datos para registrarte en nuestra plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="fullname">Nombre completo</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Juan Pérez"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Número de teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                  id="password" 
                  type="password" 
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  />
                </div>
                <Button disabled={check} type="submit" className="w-full">
                  Crear cuenta
                </Button>
              </div>
              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
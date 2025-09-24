import type { File, Folder, PostFolderRequest } from "@/interfaces/folder.interface";
import { folderService } from "@/services/folderService";
import { ArrowLeft, Download, FolderIcon, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fileService } from "@/services/fileService";
import { FileUp, FolderPlus } from 'lucide-react'
import { getUserId } from "@/auth/jwt";
import { api_URL } from "@/services/api";

export default function Folders() {

  const [carpetas, setCarpetas] = useState<Folder[]>([]);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [parent_id, setParentId] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]); // historial de navegación
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [id_carpeta_actual, setCarpetaActual] = useState<number>(0);
  const [isDialogOpenSA, setIsDialogOpenSA] = useState(false); // ✅ Estado del dialog
  const [isDialogOpenCC, setIsDialogOpenCC] = useState(false); // ✅ Estado del dialog
  const [user_id, setUserId] = useState<number | null>(0)
  const [isLoading, setIsLoading] = useState(false)

  const [isLoadingSA, setIsLoadingSA] = useState(false)

  const regexProhibidos = /[^a-zA-Z0-9 ]/; 


  function obtenerId() {

    setUserId(getUserId())

  }

  async function fetchFolders() {
    try {
      setIsLoading(true)

      if (user_id == 0 || user_id == undefined) {
        console.log("USER ID NO VALIDO")
        throw new Error()
      }

      const response = await folderService.obtenerCarpetas({ user_id, parent_id });

      setIsLoading(false)

      console.log(response);

      setCarpetas(response.carpetas);

      if (!response.archivos || response.archivos.length === 0) {
        setArchivos([])
      } 
      else {
        setArchivos(response.archivos)
      }

    }
    catch (error) {
      toast.error("Error al traer las carpetas");
      setIsLoading(false)
      console.error("Error fetching folders:", error);
    }
  }

  function abrirCarpeta(id: number) {
    setCarpetaActual(id);    
    setHistory((prev) => [...prev, parent_id]); //crea un nuevo array con el id actual
    console.log("ID CARPETA " + parent_id)
    console.log("HISTORIA: " + history)
    setParentId(id); 
  }

  function volverAtras() {
    if (history.length > 0) {
      const last = history[history.length - 1]; // obtiene el ultimo id del historial

      setCarpetaActual(last);    

      setHistory((prev) => prev.slice(0, -1)); 

      setParentId(last); 

    } 
    else {
      setParentId(0);
    }
  }

  const abrirImagenEnDialog = (archivo: File) => {
    setSelectedImage(archivo);
    setIsDialogOpen(true);
    setImageScale(1); // Reset zoom
  };

  const cerrarDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
    setImageScale(1);
  };

  const descargarImagen = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = `http://192.168.0.50:3000/api/archivos/servirArchivo?id_file=${selectedImage.id}&user_id=4`;
      //link.download = selectedImage;
      link.click();
    }
  };

  const zoomIn = () => {
    setImageScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setImageScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0]; // Solo el primer archivo
    setSelectedFile(file);
  }

  const handleFolderChange = (event: any) => {
    const name = event.target.value
    setSelectedFolder(name);
  }

  const handleSubmit = async () => {
    console.log("FILE" + selectedFile)
    console.log("CARPETA ACTUAL: " + id_carpeta_actual)
    if (selectedFile) {
      console.log(selectedFile.type);

      if (selectedFile.type == "image/jpeg" || selectedFile.type == "image/png" || selectedFile.type == "image/webp") {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('user_id', user_id!!.toString());
        formData.append('folder_id', id_carpeta_actual.toString())
  
        try {

          setIsLoadingSA(true)

          const response = await fileService.subirArchivo(formData)

          setIsLoadingSA(false)
  
          fetchFolders()
  
          setIsDialogOpenSA(false);
          setSelectedFile(null);
  
          toast.success("Archivo subido correctamente")
  
          console.log(response)
        }
        catch (error) {
          setIsLoadingSA(false)
          toast.error("Error al subir el archivo, intentelo nuevamente!")
          console.log(error)
        }
      }
      else {
        toast.error("Solo se permiten archivos PNG | JPG | WEBP")
      }
    }
  }

  const handleSubmitFolder = async () => {
    if (selectedFolder) {
      if (!regexProhibidos.test(selectedFolder)) {
        try {
          const data: PostFolderRequest = {
            user_id: user_id!!,
            nombre: selectedFolder,
            parent_id: id_carpeta_actual
          }
  
          const response = await folderService.crearCarpeta(data)
  
          console.log(response)
  
          toast.success("Carpeta creada correctamente")
  
          setIsDialogOpenCC(false);
          setSelectedFolder(null);
  
          fetchFolders()
  
        }
        catch (error) {
          toast.error("Error al crear la carpeta, intentelo nuevamente!")
          console.log(error)
        }
      }
      else {
        toast.error("Solo se permiten Letras y Numeros")

        setIsDialogOpenCC(false)
        
        setSelectedFolder(null)
      }
    }
  }

  const handleDialogChange = (open: any) => {
    setIsDialogOpenSA(open)

    if (!open) {
      // 👉 el modal se cerró (por cualquier motivo)
      setSelectedFile(null)      // resetea el archivo en memoria
      setIsLoadingSA(false) // limpia loading si quedó activo
    }
  }

  useEffect(() => {
    if (user_id != undefined && user_id != 0){
      console.log("USER ID: " + user_id)
      fetchFolders();
    }
  }, [user_id, parent_id]
)

  useEffect(() => {
    obtenerId()
  }, []
)

return (
  <div className="flex flex-1 flex-col gap-6 p-6">
    <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
  <h2 className="text-2xl font-semibold text-foreground">Mis carpetas</h2>
  
  <div className="flex gap-2">
  <Dialog open={isDialogOpenSA} onOpenChange={handleDialogChange}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FileUp className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Subir Archivo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="picture">Se permite PNG, JPG y WEBP</Label>
              <Input id="picture" type="file" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" onClick={handleSubmit}>
              {isLoadingSA ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Subir Archivo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>

    <Dialog open={isDialogOpenCC} onOpenChange={setIsDialogOpenCC}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Carpeta</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Input
                id="email"
                type="text"
                placeholder="Ingrese el nombre de la carpeta..."
                onChange={handleFolderChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmitFolder}
            >Crear Carpeta</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  </div>
</div>

      {parent_id !== 0 && (
        <button
          onClick={() => volverAtras()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      )}
    </div>

    {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 items-start">
      {/* Carpetas */}
      {carpetas.map((carpeta) => (
        <div 
          onClick={() => abrirCarpeta(carpeta.id)}
          key={carpeta.id}
          className="group flex flex-col items-center p-8 rounded-xl hover:bg-muted/30 cursor-pointer transition-all duration-200 border border-muted/40 hover:border-muted/60 hover:shadow-sm bg-muted/10 min-h-[140px] justify-center"
        >
          <div className="flex flex-col items-center gap-4 w-full">
            <FolderIcon 
              size={72} 
              className="text-gray-500 group-hover:text-gray-600 transition-colors"
              fill="currentColor"
            />
            <span className="text-base text-center text-foreground font-medium line-clamp-2 w-full px-2 leading-relaxed">
              {carpeta.name}
            </span>
          </div>
        </div>
      ))}

      {/* Archivos */}
      {archivos.map((archivo) => (
        <div
          key={archivo.id}
          onClick={() => abrirImagenEnDialog(archivo)}
          className="group flex flex-col items-center p-4 rounded-xl border border-muted/40 hover:shadow-sm bg-muted/10 cursor-pointer transition-all duration-200 hover:border-primary/20"
        >
          <div className="relative w-full h-40 mb-2 overflow-hidden rounded-lg">
            <img 
              src={`http://${api_URL}:3000/api/archivos/servirArchivo?id_file=${archivo.id}&user_id=${user_id}`} 
              alt={archivo.original_name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                <ZoomIn size={20} className="text-gray-700" />
              </div>
            </div>
          </div>
          <span className="text-sm text-center text-foreground line-clamp-2 px-2">
            {archivo.original_name}
          </span>
        </div>
      ))}
    </div>      
    )}


    {/* Dialog para mostrar imágenes */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {selectedImage?.original_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-0">
          {selectedImage && (
            <div className="relative max-w-full max-h-[60vh] overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
              <img
                src={`http://${api_URL}:3000/api/archivos/servirArchivo?id_file=${selectedImage.id}&user_id=${user_id}`}
                alt={selectedImage.original_name}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${imageScale})` }}
              />
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={imageScale <= 0.5}
            >
              <ZoomOut size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={imageScale >= 3}
            >
              <ZoomIn size={16} />
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {Math.round(imageScale * 100)}%
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={descargarImagen}
            >
              <Download size={16} className="mr-2" />
              Descargar
            </Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={cerrarDialog}>
                Cerrar
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
);
}
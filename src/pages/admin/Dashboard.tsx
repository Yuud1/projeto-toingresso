import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoToIngresso from "../../../public/logos/TOingresso_logo_512x512.png"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  ImageIcon,
  LinkIcon,
  Settings,
  GripVertical,
  LogOut,
  Home,
} from "lucide-react";
import CarrosselInterface from "@/interfaces/CarrosselInterface";
import BannerInterface from "@/interfaces/BannerInterface";

// Adiciona tipo auxiliar para slides com tempKey

type CarouselSlideWithTempKey = CarrosselInterface & { tempKey?: string };

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminToken");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const [carouselSlides, setCarouselSlides] = useState<
    CarouselSlideWithTempKey[]
  >([]);
  console.log(carouselSlides);

  useEffect(() => {
    const fetchCarouselSlides = async () => {
      try {                
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_CARROSSEL_GET_ADMIN
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        console.log(response);
        
        if (response.data.carrossels) {
          setCarouselSlides(response.data.carrossels);
        }
      } catch (error) {
        console.error("Erro ao buscar carrosséis:", error);
      }
    };

    fetchCarouselSlides();
  }, []);

  const [bannerData, setBannerData] = useState<BannerInterface>({
    _id: "", // vazio para indicar novo
    redirectUrl: "",
    urlImage: "",
    active: true,
    title: "",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carouselFiles, setCarouselFiles] = useState<Record<string, File>>({});
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    // Buscar banner do endpoint admin ao carregar o Dashboard
    if (!bannerData._id) {
      const fetchBanner = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_BANNER_GET_ADMIN}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            }
          );
          console.log(response);
          
          // Ajuste conforme a resposta do backend
          if (response.data.banners) {
            setBannerData(response.data.banners[0]);
          } else if (response.data.banners && response.data.banners.length > 0) {
            setBannerData(response.data.banners[0]);
          }
        } catch (error) {
          console.error("Erro ao buscar banner:", error);
        }
      };
      fetchBanner();
    }
  }, [bannerData._id]);

  // Adiciona tempKey para slides novos
  const addSlide = () => {
    const newSlide: CarouselSlideWithTempKey = {
      _id: "", // vazio para indicar novo
      tempKey: Date.now().toString(), // chave temporária única
      redirectUrl: "",
      urlImage: "",
      active: true,
      title: "",
    };
    setCarouselSlides([...carouselSlides, newSlide]);
    setHasChanges(true);
  };

  // Função para deletar slide do backend e do estado local
  const handleDeleteSlide = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_CARROSSEL_GET
        }${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setCarouselSlides((prev) =>
        prev.filter((slide) => slide._id !== id && slide.tempKey !== id)
      );
      setHasChanges(true);
    } catch (error) {
      console.error("Erro ao deletar slide:", error);
      alert("Erro ao deletar slide!");
    }
  };

  const updateSlide = (
    id: string,
    field: keyof CarouselSlideWithTempKey,
    value: any
  ) => {
    setCarouselSlides(
      carouselSlides.map((slide) =>
        slide._id === id || slide.tempKey === id
          ? { ...slide, [field]: value }
          : slide
      )
    );
    setHasChanges(true);
  };

  const toggleSlideActive = (id: string) => {
    updateSlide(
      id,
      "active",
      !carouselSlides.find((s) => s._id === id)?.active
    );
  };

  const updateBanner = (field: keyof BannerInterface, value: any) => {
    setBannerData({ ...bannerData, [field]: value });
    setHasChanges(true);
  };

  // Atualiza handleImageUpload para garantir que salva o arquivo corretamente
  const handleImageUpload = (slideIdOrTempKey?: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (slideIdOrTempKey) {
            updateSlide(slideIdOrTempKey, "urlImage", imageUrl);
            setCarouselFiles((prev) => ({ ...prev, [slideIdOrTempKey]: file }));
          } else {
            updateBanner("urlImage", imageUrl);
            setBannerFile(file);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const goToHome = () => {
    navigate("/");
  };

  // Atualiza o mapeamento de arquivos no handleSave
  const handleSave = async () => {
    try {
      setLoading(true);            
      const slidesWithFileField = carouselSlides.map((slide, idx) => {
        const key = slide._id || slide.tempKey || "";
        // Remove urlImage do slide
        const { urlImage, ...slideWithoutUrlImage } = slide;
        return {
          ...slideWithoutUrlImage,
          fileField: carouselFiles[key] ? `carouselFile_${idx}` : null,
        };
      });

      const formData = new FormData();
      formData.append("carouselSlides", JSON.stringify(slidesWithFileField));

      // Adiciona arquivos do carrossel usando o índice
      carouselSlides.forEach((slide, idx) => {
        const key = slide._id || slide.tempKey || "";
        if (carouselFiles[key]) {
          formData.append(`carouselFile_${idx}`, carouselFiles[key]);
        }
      });

      // Lógica para o banner igual ao carrossel
      const bannerFileField = bannerFile ? "bannerFile_0" : null;
      const { urlImage, ...bannerDataToSend } = bannerData;
      const bannerDataWithFileField = {
        ...bannerDataToSend,
        fileField: bannerFileField,
      };
      formData.append("bannerData", JSON.stringify(bannerDataWithFileField));
      if (bannerFile) {
        formData.append("bannerFile_0", bannerFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_ADMIN_UPDATE_CONTENT
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.saved) {
        setHasChanges(false);
        setCarouselFiles({});
        setBannerFile(null);
        alert("Alterações salvas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar alterações!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasChanges(false);
    window.location.reload();
  };

  // Atualiza o uso do handleImageUpload nos botões dos slides
  // (No JSX, troque onClick={() => handleImageUpload(slide._id)} por onClick={() => handleImageUpload(slide._id || slide.tempKey)})

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <img className="w-10" src={logoToIngresso} alt="logo header" />
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap hidden sm:inline">
                  Painel Administrativo
                </h1>
                <span className="px-2 py-1 bg-[#FEC800] text-black text-xs font-medium rounded">
                  ADMIN
                </span>
              </div>
            </div>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={goToHome}
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 gap-2 px-3 py-2 text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              <Button
                onClick={handleLogout}
                className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 gap-2 px-3 py-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="block sm:hidden space-y-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Dashboard de Propagandas
                </h1>
              </div>

              <div>
                <p className="text-gray-600 text-sm">
                  Gerencie carrossel e banners da página inicial
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {hasChanges && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="cursor-pointer gap-2 text-sm w-full"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Descartar
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || loading}
                  className="cursor-pointer bg-[#FEC800] text-black hover:bg-[#e5b700] gap-2 text-sm w-full"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="space-y-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Dashboard de Propagandas
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Gerencie carrossel e banners da página inicial
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {hasChanges && (
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="cursor-pointer gap-2 text-sm w-full sm:w-auto"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Descartar
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={!hasChanges || loading}
                    className="cursor-pointer bg-[#FEC800] text-black hover:bg-[#e5b700] gap-2 text-sm w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="carousel" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-full sm:max-w-md h-auto">
              <TabsTrigger
                value="carousel"
                className="cursor-pointer gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Carrossel</span>
              </TabsTrigger>
              <TabsTrigger
                value="banner"
                className="cursor-pointer gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
              >
                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Banner</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carousel" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Gerenciar Carrossel
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Configure os slides do carrossel principal
                  </p>
                </div>
                <Button
                  onClick={addSlide}
                  className="gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Slide
                </Button>
              </div>

              <div className="grid gap-3 sm:gap-4">
                {carouselSlides.map((slide, index) => (
                  <Card
                    key={slide._id || slide.tempKey}
                    className={`${!slide.active ? "opacity-60" : ""}`}
                  >
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-400 hidden sm:block" />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg truncate">
                              Slide {index + 1}
                            </CardTitle>
                            <CardDescription className="text-sm truncate">
                              {slide.title || "Sem título"}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={slide.active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {slide.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleSlideActive(
                                  slide._id || slide.tempKey || ""
                                )
                              }
                            >
                              {slide.active ? (
                                <Eye className="w-4 h-4 cursor-pointer" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteSlide(
                                  slide._id || slide.tempKey || ""
                                )
                              }
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2 lg:col-span-1">
                          <Label className="text-sm font-medium">Preview</Label>
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
                            {slide.urlImage ? (
                              <img
                                src={slide.urlImage || "/placeholder.svg"}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Título do Slide
                            </Label>
                            <Input
                              value={slide.title || ""}
                              onChange={(e) =>
                                updateSlide(
                                  slide._id || slide.tempKey || "",
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Digite o título do slide"
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            {/* <Label className="text-sm font-medium">
                              URL da Imagem
                            </Label> */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              {/* <Input
                                value={slide.src}
                                onChange={(e) =>
                                  updateSlide(slide.id, "src", e.target.value)
                                }
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="flex-1 text-sm"
                              /> */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 w-full sm:w-auto cursor-pointer"
                                onClick={() =>
                                  handleImageUpload(
                                    slide._id || slide.tempKey || ""
                                  )
                                }
                              >
                                <Upload className="w-4 h-4" />
                                Upload
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Link de Redirecionamento
                            </Label>
                            <div className="flex gap-2">
                              <LinkIcon className="w-4 h-4 mt-3 text-gray-400 flex-shrink-0" />
                              <Input
                                value={slide.redirectUrl}
                                onChange={(e) =>
                                  updateSlide(
                                    slide._id || slide.tempKey || "",
                                    "redirectUrl",
                                    e.target.value
                                  )
                                }
                                placeholder="/evento/123 ou https://exemplo.com"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <Switch
                              checked={slide.active}
                              onCheckedChange={() =>
                                toggleSlideActive(
                                  slide._id || slide.tempKey || ""
                                )
                              }
                            />
                            <Label className="text-sm">Slide ativo</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="banner" className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Gerenciar Banner
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Configure o banner de propaganda principal
                </p>
              </div>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base sm:text-lg">
                        Banner Principal
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Banner exibido na página inicial
                      </CardDescription>
                    </div>
                    <Badge
                      variant={bannerData.active ? "default" : "secondary"}
                      className="text-xs w-fit"
                    >
                      {bannerData.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preview</Label>
                    <div className="w-full h-32 sm:h-48 bg-gray-100 rounded-lg overflow-hidden border">
                      {bannerData.urlImage ? (
                        <img
                          src={bannerData.urlImage || "/placeholder.svg"}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Título do Banner
                        </Label>
                        <Input
                          value={bannerData.title || ""}
                          onChange={(e) =>
                            updateBanner("title", e.target.value)
                          }
                          placeholder="Digite o título do banner"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        {/* <Label className="text-sm font-medium">
                          URL da Imagem
                        </Label> */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {/* <Input
                            value={bannerData.image}
                            onChange={(e) =>
                              updateBanner("image", e.target.value)
                            }
                            placeholder="https://exemplo.com/banner.jpg"
                            className="flex-1 text-sm"
                          /> */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 w-full sm:w-auto"
                            onClick={() => handleImageUpload()}
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Link de Redirecionamento
                        </Label>
                        <div className="flex gap-2">
                          <LinkIcon className="w-4 h-4 mt-3 text-gray-400 flex-shrink-0" />
                          <Input
                            value={bannerData.redirectUrl}
                            onChange={(e) =>
                              updateBanner("redirectUrl", e.target.value)
                            }
                            placeholder="https://exemplo.com/promocao"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          checked={bannerData.active}
                          onCheckedChange={(checked) =>
                            updateBanner("active", checked)
                          }
                        />
                        <Label className="text-sm">Banner ativo</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {hasChanges && (
            <Card className="border-[#FEC800] bg-yellow-50">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-yellow-800">
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">
                      Você tem alterações não salvas
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                  Lembre-se de salvar suas alterações antes de sair da página.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

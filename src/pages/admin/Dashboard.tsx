import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoToIngresso from "../../../public/logos/TOingresso_logo_512x512.png";
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
import AdInterface from "@/interfaces/AdInterface";


// Adiciona tipo auxiliar para slides com tempKey
type CarouselSlideWithTempKey = AdInterface & { tempKey?: string };
type BannerWithTempKey = AdInterface & { tempKey?: string };

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
  
  const [banners, setBanners] = useState<BannerWithTempKey[]>([]);

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

        if (response.data.carrossels) {
          setCarouselSlides(response.data.carrossels);
        }
      } catch (error) {
        console.error("Erro ao buscar carrosséis:", error);
      }
    };

    fetchCarouselSlides();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_BANNER_GET_ADMIN
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );        

        if (response.data.banners) {
          setBanners(response.data.banners);
        }
      } catch (error) {
        console.error("Erro ao buscar banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carouselFiles, setCarouselFiles] = useState<Record<string, File>>({});
  const [bannerFiles, setBannerFiles] = useState<Record<string, File>>({});

  // Adiciona tempKey para slides novos
  const addSlide = () => {
    const newSlide: CarouselSlideWithTempKey = {
      _id: "", // vazio para indicar novo
      tempKey: Date.now().toString(), // chave temporária única
      redirectUrl: "",
      urlImage: "",
      active: true,
      title: "",
      type: "carousel",
    };
    setCarouselSlides([...carouselSlides, newSlide]);
    setHasChanges(true);
  };

  // Adiciona tempKey para banners novos
  const addBanner = () => {
    const newBanner: BannerWithTempKey = {
      _id: "", // vazio para indicar novo
      tempKey: Date.now().toString(), // chave temporária única
      redirectUrl: "",
      urlImage: "",
      active: true,
      title: "",
      type: "banner",
    };
    setBanners([...banners, newBanner]);
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

  // Função para deletar banner do backend e do estado local
  const handleDeleteBanner = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_BANNER_GET
        }${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setBanners((prev) =>
        prev.filter((banner) => banner._id !== id && banner.tempKey !== id)
      );
      setHasChanges(true);
    } catch (error) {
      console.error("Erro ao deletar banner:", error);
      alert("Erro ao deletar banner!");
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

  const updateBanner = (
    id: string,
    field: keyof BannerWithTempKey,
    value: any
  ) => {
    setBanners(
      banners.map((banner) =>
        banner._id === id || banner.tempKey === id
          ? { ...banner, [field]: value }
          : banner
      )
    );
    setHasChanges(true);
  };

  const toggleSlideActive = (id: string) => {
    updateSlide(
      id,
      "active",
      !carouselSlides.find((s) => s._id === id || s.tempKey === id)?.active
    );
  };

  const toggleBannerActive = (id: string) => {
    updateBanner(
      id,
      "active",
      !banners.find((b) => b._id === id || b.tempKey === id)?.active
    );
  };

  // Atualiza handleImageUpload para garantir que salva o arquivo corretamente
  const handleImageUpload = (slideIdOrTempKey?: string, isBanner: boolean = false) => {
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
            if (isBanner) {
              updateBanner(slideIdOrTempKey, "urlImage", imageUrl);
              setBannerFiles((prev) => ({ ...prev, [slideIdOrTempKey]: file }));
            } else {
              updateSlide(slideIdOrTempKey, "urlImage", imageUrl);
              setCarouselFiles((prev) => ({ ...prev, [slideIdOrTempKey]: file }));
            }
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
      
      // Verifica se há banners sem título
      const bannersWithoutTitle = banners.filter(banner => !banner.title || banner.title.trim() === "");
      if (bannersWithoutTitle.length > 0) {
        alert("Existem banners sem título. Por favor, adicione um título para todos os banners antes de salvar.");
        setLoading(false);
        return;
      }

      // Verifica se há banners com _id vazio mas sem tempKey
      const bannersWithoutId = banners.filter(banner => !banner._id && !banner.tempKey);
      if (bannersWithoutId.length > 0) {
        alert("Existem banners inválidos. Por favor, recarregue a página e tente novamente.");
        setLoading(false);
        return;
      }

      // Verifica se há slides sem título
      const slidesWithoutTitle = carouselSlides.filter(slide => !slide.title || slide.title.trim() === "");
      if (slidesWithoutTitle.length > 0) {
        alert("Existem slides sem título. Por favor, adicione um título para todos os slides antes de salvar.");
        setLoading(false);
        return;
      }

      // Verifica se há slides com _id vazio mas sem tempKey
      const slidesWithoutId = carouselSlides.filter(slide => !slide._id && !slide.tempKey);
      if (slidesWithoutId.length > 0) {
        alert("Existem slides inválidos. Por favor, recarregue a página e tente novamente.");
        setLoading(false);
        return;
      }
      
      // Processa slides do carrossel
      const slidesWithFileField = carouselSlides
        .filter(slide => slide.title && slide.title.trim() !== "") // Remove slides sem título
        .map((slide, idx) => {
          const key = slide._id || slide.tempKey || "";
          const { urlImage, ...slideWithoutUrlImage } = slide;
          return {
            ...slideWithoutUrlImage,
            _id: slide._id || slide.tempKey || "", // Garante que _id não seja vazio
            fileField: carouselFiles[key] ? `carouselFile_${idx}` : null,
          };
        });

      // Processa banners
      const bannersWithFileField = banners
        .filter(banner => banner.title && banner.title.trim() !== "") // Remove banners sem título
        .map((banner, idx) => {
          const key = banner._id || banner.tempKey || "";
          const { urlImage, ...bannerWithoutUrlImage } = banner;
          return {
            ...bannerWithoutUrlImage,
            _id: banner._id || banner.tempKey || "", // Garante que _id não seja vazio
            fileField: bannerFiles[key] ? `bannerFile_${idx}` : null,
          };
        });

      // Debug logs
      

      const formData = new FormData();
      formData.append("carouselSlides", JSON.stringify(slidesWithFileField));
      formData.append("banners", JSON.stringify(bannersWithFileField));

      // Adiciona arquivos do carrossel
      carouselSlides.forEach((slide, idx) => {
        const key = slide._id || slide.tempKey || "";
        if (carouselFiles[key]) {
          formData.append(`carouselFile_${idx}`, carouselFiles[key]);
          
        }
      });

      // Adiciona arquivos dos banners
      banners.forEach((banner, idx) => {
        const key = banner._id || banner.tempKey || "";
        if (bannerFiles[key]) {
          formData.append(`bannerFile_${idx}`, bannerFiles[key]);
          
        }
      });

      // Debug: log FormData contents            
      
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
        setBannerFiles({});
        alert("Alterações salvas com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Gerenciar Banners
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Configure os banners de propaganda
                  </p>
                </div>
                <Button
                  onClick={addBanner}
                  className="gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Banner
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {banners.map((banner, index) => (
                  <Card
                    key={banner._id || banner.tempKey}
                    className={`${!banner.active ? "opacity-60" : ""}`}
                  >
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-gray-400 hidden sm:block" />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg truncate">
                              Banner {index + 1}
                            </CardTitle>
                            <CardDescription className="text-sm truncate">
                              {banner.title || "Sem título"}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={banner.active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {banner.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleBannerActive(
                                  banner._id || banner.tempKey || ""
                                )
                              }
                            >
                              {banner.active ? (
                                <Eye className="w-4 h-4 cursor-pointer" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteBanner(
                                  banner._id || banner.tempKey || ""
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
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2 lg:col-span-1">
                          <Label className="text-sm font-medium">Preview</Label>
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
                            {banner.urlImage ? (
                              <img
                                src={banner.urlImage || "/placeholder.svg"}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 lg:col-span-2">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Título do Banner
                            </Label>
                            <Input
                              value={banner.title || ""}
                              onChange={(e) =>
                                updateBanner(
                                  banner._id || banner.tempKey || "",
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Digite o título do banner"
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 w-full sm:w-auto cursor-pointer"
                                onClick={() =>
                                  handleImageUpload(
                                    banner._id || banner.tempKey || "",
                                    true
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
                                value={banner.redirectUrl}
                                onChange={(e) =>
                                  updateBanner(
                                    banner._id || banner.tempKey || "",
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
                              checked={banner.active}
                              onCheckedChange={() =>
                                toggleBannerActive(
                                  banner._id || banner.tempKey || ""
                                )
                              }
                            />
                            <Label className="text-sm">Banner ativo</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

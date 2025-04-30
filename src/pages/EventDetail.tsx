import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const EventDetail = () => {
  const [open, setOpen] = useState(false);

  const event = {
    title: "Festa Sunset",
    dateTime: "10 de Maio, 18:00",
    location: "Praça Central, São Paulo - SP",
    image: "/evento1.jpg",
    description: "Uma noite inesquecível com música ao vivo e DJ convidados!",
    price: 50.00,
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.739356682307!2d-46.57722528502233!3d-23.507179384709717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5c7bd3a5bdbb%3A0xd808d5db42a37a2e!2sPra%C3%A7a%20Central!5e0!3m2!1spt-BR!2sbr!4v1680800000000!5m2!1spt-BR!2sbr"
  };

  return (
    <>
      <Header isScrolled />
      <main className="pt-[80px] max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <img src={event.image} alt={event.title} className="w-full h-[400px] object-cover rounded-lg" />

          <div>
            <h1 className="text-3xl font-bold text-[#414141] mb-4">{event.title}</h1>
            <p className="text-gray-600 text-sm mb-2">{event.dateTime}</p>
            <p className="text-gray-600 text-sm mb-4">{event.location}</p>
            <p className="text-gray-700 text-base mb-6">{event.description}</p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FEC800] text-black hover:bg-[#e5b700] font-semibold">
                  Adicionar Ingresso - R$ {event.price.toFixed(2)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Compra</DialogTitle>
                  <DialogDescription>
                    Você está prestes a adquirir 1 ingresso para <strong>{event.title}</strong> no valor de <strong>R$ {event.price.toFixed(2)}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button className="bg-[#FEC800] text-black hover:bg-[#e5b700]">Confirmar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mapa */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-[#414141] mb-4">Localização</h2>
          <div className="w-full h-[400px]">
            <iframe
              src={event.mapUrl}
              width="100%"
              height="100%"
              className="rounded-lg border"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetail;

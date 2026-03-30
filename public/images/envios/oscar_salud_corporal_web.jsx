import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  HeartPulse,
  Activity,
  Stethoscope,
  Hand,
  ShieldCheck,
  Clock3,
  Ambulance,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const phoneNumber = "0990105293";
const whatsappLink = "https://wa.me/593990105293";
const callLink = "tel:0990105293";

const services = [
  {
    icon: <HeartPulse className="h-8 w-8" />,
    title: "Fisioterapia a domicilio",
    description:
      "Atención personalizada para aliviar dolor, recuperar movilidad y apoyar procesos de rehabilitación física sin que tengas que salir de casa.",
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "Quiropraxia",
    description:
      "Evaluación y ajuste corporal orientado al bienestar postural, alivio de molestias musculares y mejora de la funcionalidad del cuerpo.",
  },
  {
    icon: <Stethoscope className="h-8 w-8" />,
    title: "Medicina general a domicilio",
    description:
      "Atención inicial en casa para valoración general, seguimiento básico y orientación oportuna de tu estado de salud.",
  },
  {
    icon: <Hand className="h-8 w-8" />,
    title: "Masajes terapéuticos",
    description:
      "Masajes orientados a relajar tensión muscular, disminuir contracturas y favorecer una sensación real de alivio y descanso.",
  },
];

const benefits = [
  "Atención profesional en la comodidad de tu hogar",
  "Servicio humano, puntual y personalizado",
  "Enfoque en alivio del dolor y recuperación funcional",
  "Ideal para adultos mayores, pacientes con movilidad reducida y personas con poco tiempo",
  "Agenda rápida y atención directa",
  "Tratamientos orientados al bienestar integral",
];

const steps = [
  {
    title: "Agenda tu cita",
    text: "Contáctanos por llamada o WhatsApp para coordinar día, hora y tipo de atención que necesitas.",
  },
  {
    title: "Evaluación en domicilio",
    text: "Realizamos una valoración inicial para identificar tu necesidad y definir la atención adecuada.",
  },
  {
    title: "Tratamiento personalizado",
    text: "Recibes una atención enfocada en tu condición, comodidad y proceso de recuperación.",
  },
];

export default function OscarSaludCorporalWebsite() {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_25%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-6 md:px-10">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white text-xl font-bold text-black shadow-lg">
                OS
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide md:text-2xl">Oscar Salud Corporal</h1>
                <p className="text-sm text-white/70 md:text-base">Fisioterapia, quiropraxia y atención a domicilio</p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-white/60">Contáctanos</p>
              <a href={callLink} className="text-lg font-semibold hover:text-white/80">
                {phoneNumber}
              </a>
            </div>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-10 md:px-10 lg:grid-cols-2 lg:items-center lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              Atención profesional a domicilio
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                Oscar <span className="text-white/75">Salud Corporal</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
                Fisioterapia, quiropraxia, medicina general y masajes a domicilio.
                <br />
                Atención profesional, cercana y enfocada en tu bienestar integral.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-base leading-7 text-white/85">
                Soy <span className="font-semibold">Oscar Vivanco</span>, y mi propósito es brindar atención de salud corporal con enfoque humano, profesional y accesible, directamente en la comodidad de tu hogar.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <Button className="rounded-2xl bg-white px-6 py-6 text-base font-semibold text-black hover:bg-white/90">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp: {phoneNumber}
                </Button>
              </a>
              <a href={callLink}>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white/20 bg-transparent px-6 py-6 text-base text-white hover:bg-white/10"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar ahora
                </Button>
              </a>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Ambulance className="h-4 w-4" />
                  Servicio móvil
                </div>
                <p className="mt-2 font-semibold">Atención en casa</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock3 className="h-4 w-4" />
                  Coordinación ágil
                </div>
                <p className="mt-2 font-semibold">Citas programadas</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <ShieldCheck className="h-4 w-4" />
                  Atención responsable
                </div>
                <p className="mt-2 font-semibold">Enfoque profesional</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
                  alt="Atención médica domiciliaria"
                  className="h-64 w-full rounded-[22px] object-cover"
                />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:mt-14">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80"
                  alt="Bienestar corporal y fisioterapia"
                  className="h-64 w-full rounded-[22px] object-cover"
                />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=900&q=80"
                  alt="Masaje terapéutico"
                  className="h-64 w-full rounded-[22px] object-cover"
                />
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:-mt-10">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80"
                  alt="Salud y movilidad"
                  className="h-64 w-full rounded-[22px] object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="mb-10 max-w-2xl">
          <h3 className="text-3xl font-bold md:text-4xl">Servicios</h3>
          <p className="mt-3 text-white/70">
            Atención a domicilio pensada para cuidar tu salud con comodidad, seguridad y cercanía.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/10 p-3">
                  {service.icon}
                </div>
                <h4 className="mb-3 text-xl font-semibold">{service.title}</h4>
                <p className="text-sm leading-7 text-white/70">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold md:text-4xl">¿Por qué elegirnos?</h3>
            <div className="mt-8 grid gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-white/80">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold md:text-4xl">Cómo funciona</h3>
            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/50">Paso {index + 1}</p>
                  <h4 className="mt-1 text-xl font-semibold">{step.title}</h4>
                  <p className="mt-2 text-white/75">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur md:p-12">
          <h3 className="text-3xl font-bold md:text-5xl">Agenda tu atención hoy</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Atención domiciliaria con enfoque profesional, humano y personalizado.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <Button className="rounded-2xl bg-white px-8 py-6 text-base font-semibold text-black hover:bg-white/90">
                <MessageCircle className="mr-2 h-5 w-5" />
                Escríbenos al WhatsApp
              </Button>
            </a>
            <a href={callLink}>
              <Button
                variant="outline"
                className="rounded-2xl border-white/20 bg-transparent px-8 py-6 text-base text-white hover:bg-white/10"
              >
                <Phone className="mr-2 h-5 w-5" />
                {phoneNumber}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

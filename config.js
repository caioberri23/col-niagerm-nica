/* =====================================================================
   CONFIGURAÇÃO — Landing page Restaurante Colônia Germânica
   ---------------------------------------------------------------------
   Contatos, horários, valores, fotos, formulário e rastreamento ficam
   aqui. Não é preciso mexer no HTML.

   reviewMode: true  → versão para aprovação: mostra as marcações
                       "a confirmar" e as fotos que faltam.
   reviewMode: false → versão final: itens com confirmed: false ficam ocultos.
   ===================================================================== */
window.CG_CONFIG = {
  reviewMode: false,

  // Mostra o cartão "Foto necessária" em cada espaço ainda sem foto.
  // Depois que todas as fotos estiverem no site, troque para false.
  fotosPendentes: true,

  contato: {
    // WhatsApp e telefone oficiais do restaurante: (47) 3306-8895.
    whatsappNumero: "554733068895",
    whatsappMensagem: "Olá! Vim pelo site do Colônia Germânica e gostaria de mais informações.",
    // WhatsApp que recebe os pedidos de grupos, excursões e eventos (formulário).
    whatsappEventos: "5547984913627",
    telefoneExibicao: "(47) 3306-8895",
    telefoneLink: "+554733068895",
    instagram: "https://www.instagram.com/coloniagermanica/",
    email: "restaurantecoloniagermanica@gmail.com"
  },

  local: {
    nome: "Restaurante Colônia Germânica",
    endereco: "Rua Concórdia, 100 — Testo Rega, Pomerode/SC",
    cep: "89107-000",
    referencia: "antiga Associação da Malwee",
    lat: -26.7058409,
    lng: -49.162717,
    // Perfil no Google Maps (avaliações, fotos, rotas).
    mapsPerfil: "https://maps.google.com/?cid=12110928806485895308",
    // Rota (abre o app de mapas no celular).
    mapsRota: "https://www.google.com/maps/dir/?api=1&destination=Restaurante%20Col%C3%B4nia%20Germ%C3%A2nica%2C%20R.%20Conc%C3%B3rdia%2C%20100%20-%20Testo%20Rega%2C%20Pomerode%20-%20SC",
    // Mapa incorporado (só carrega quando o visitante clica).
    mapsEmbed: "https://maps.google.com/maps?q=Restaurante%20Col%C3%B4nia%20Germ%C3%A2nica%2C%20R.%20Conc%C3%B3rdia%2C%20100%20-%20Testo%20Rega%2C%20Pomerode%20-%20SC&ll=-26.7058409,-49.162717&z=16&output=embed"
  },

  // Horários do almoço.
  horarios: [
    { dias: "Terça a sexta", horas: "11h às 14h", confirmed: true },
    { dias: "Sábado e domingo", horas: "11h às 14h30", confirmed: true },
    { dias: "Segunda-feira", horas: "Fechado", confirmed: true }
  ],
  horariosResumo: { texto: "Almoço de terça a domingo", confirmed: true },

  // Valores do buffet.
  valores: {
    confirmed: true,
    validade: "outubro de 2026",
    livre: "R$ 72,00",
    quilo: "R$ 109,90/kg",
    criancas: "Crianças até 5 anos não pagam; de 6 a 11 anos, metade do livre ou por quilo."
  },

  // Nota no Google.
  notaGoogle: { nota: "4,6", total: "792", data: "23/10/2026", confirmed: true },

  // Avaliações de clientes (somente reais e autorizadas).
  // Formato: { nome: "Nome público", texto: "...", nota: 5, fonte: "Google", link: "https://..." }
  avaliacoes: [],

  // Fotos e vídeo. Envie o arquivo para o site e informe o nome em src
  // (ex.: "salao.webp"). Sem foto, a versão para aprovação mostra qual foto vai em cada lugar.
  midia: {
    "hero":              { src: "", alt: "Buffet do Restaurante Colônia Germânica, em Pomerode" },
    "hero-video":        { src: "", poster: "" }, // MP4 curto (até ~4 MB), sem áudio
    "sobre":             { src: "", alt: "Salão do restaurante com famílias almoçando" },
    "buffet-carnes":     { src: "", alt: "Carnes e pratos típicos alemães" },
    "buffet-eisbein":    { src: "", alt: "Eisbein servido no buffet" },
    "buffet-quentes":    { src: "", alt: "Buffet de pratos quentes" },
    "buffet-acomp":      { src: "", alt: "Acompanhamentos do buffet" },
    "buffet-saladas":    { src: "", alt: "Buffet de saladas" },
    "buffet-sobremesas": { src: "", alt: "Sobremesas" },
    "galeria-salao":     { src: "", alt: "Salão do restaurante" },
    "galeria-familias":  { src: "", alt: "Famílias almoçando" },
    "galeria-ambiente":  { src: "", alt: "Ambiente do restaurante" },
    "galeria-musica":    { src: "", alt: "Música ao vivo aos sábados e domingos" },
    "galeria-kids":      { src: "", alt: "Área kids" },
    "galeria-eventos":   { src: "", alt: "Evento no salão" },
    "galeria-fachada":   { src: "", alt: "Entrada e fachada do restaurante" },
    "galeria-estac":     { src: "", alt: "Estacionamento" },
    "turismo":           { src: "", alt: "Fachada do Restaurante Colônia Germânica" },
    "grupos":            { src: "", alt: "Salão preparado para receber grupos" },
    "cta":               { src: "", alt: "Mesa servida no Restaurante Colônia Germânica" }
  },

  // Formulário de grupos, excursões e eventos.
  formulario: {
    // URL que recebe os contatos em JSON (ex.: Google Apps Script).
    // Vazio = envio pelo WhatsApp de eventos, com os dados digitados pelo visitante.
    endpoint: "",
    origem: "LP Colônia Germânica — Grupos, excursões e eventos"
  },

  // Rastreamento. Nada é carregado enquanto os IDs estiverem vazios.
  // Com algum ID preenchido, aparece o aviso de cookies e as tags só
  // carregam depois do aceite (LGPD / Consent Mode v2).
  rastreamento: {
    gtmId: "",          // ex.: "GTM-XXXXXXX" (recomendado: configure GA4, Ads e Pixel dentro do GTM)
    ga4Id: "",          // usado só se não houver GTM. ex.: "G-XXXXXXXXXX"
    googleAdsId: "",    // usado só se não houver GTM. ex.: "AW-XXXXXXXXX"
    metaPixelId: ""     // usado só se não houver GTM
  },

  // Crédito discreto no rodapé.
  creditoEagle: { mostrar: false, confirmed: false }
};

/* Landing page — Restaurante Colônia Germânica · Eagle Ads
   Sem dependências. Lê tudo de window.CG_CONFIG (config.js). */
(function () {
  "use strict";
  var C = window.CG_CONFIG || {};
  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var review = !!C.reviewMode;
  var show = function (confirmed) { return confirmed || review; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); };
  var PEND = '<span class="pend">a confirmar</span>';

  root.classList.add("js");
  if (review) root.classList.add("is-review");
  // Cartões "Foto necessária" nos espaços sem foto (independe do modo revisão).
  var fotosPendentes = review || !!C.fotosPendentes;
  if (fotosPendentes) root.classList.add("show-ph");

  /* ---------- Links centralizados ---------- */
  var contato = C.contato || {}, local = C.local || {};
  var waNum = String(contato.whatsappNumero || "").replace(/\D/g, "");
  var waBase = waNum ? "https://wa.me/" + waNum + (contato.whatsappMensagem ? "?text=" + encodeURIComponent(contato.whatsappMensagem) : "") : (contato.whatsappLink || "");
  var links = { rota: local.mapsRota, perfil: local.mapsPerfil, whatsapp: waBase, instagram: contato.instagram, telefone: contato.telefoneLink ? "tel:" + contato.telefoneLink : "" };
  $$("[data-link]").forEach(function (a) { var u = links[a.getAttribute("data-link")]; if (u) a.setAttribute("href", u); });
  $$("[data-phone]").forEach(function (el) { if (contato.telefoneExibicao) el.textContent = contato.telefoneExibicao; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Fotos e vídeo (Eagle Filmes) ---------- */
  var midia = C.midia || {};
  $$("[data-slot]").forEach(function (slot) {
    var m = midia[slot.getAttribute("data-slot")];
    if (!m || !m.src) return;
    var img = new Image();
    img.src = m.src; img.alt = m.alt || ""; img.decoding = "async"; img.loading = "lazy";
    slot.innerHTML = ""; slot.appendChild(img); slot.classList.add("has-img");
    var dish = slot.closest(".dish"); if (dish) dish.classList.add("has-photo");
  });
  // Versão para aprovação: cada espaço sem foto diz qual foto precisa ser colocada ali.
  var PH = {
    "sobre":             ["Salão com famílias almoçando", "Pessoas aproveitando a refeição, ambiente acolhedor.", "Vertical"],
    "buffet-carnes":     ["Carnes e pratos típicos", "Close dos pratos típicos alemães no buffet.", "Horizontal"],
    "buffet-eisbein":    ["Eisbein", "O Eisbein servido no buffet, bem de perto.", "Horizontal"],
    "buffet-quentes":    ["Buffet de pratos quentes", "As ilhas do buffet mostrando a variedade.", "Horizontal"],
    "buffet-acomp":      ["Acompanhamentos", "Acompanhamentos servidos no buffet.", "Horizontal"],
    "buffet-saladas":    ["Saladas", "O buffet de saladas.", "Horizontal"],
    "buffet-sobremesas": ["Sobremesas", "As sobremesas do buffet.", "Horizontal"],
    "galeria-salao":     ["Salão", "Visão ampla do salão, mostrando o tamanho do espaço.", "Quadrada"],
    "galeria-familias":  ["Famílias almoçando", "Famílias à mesa, de preferência com crianças.", "Quadrada"],
    "galeria-ambiente":  ["Ambiente e decoração", "Detalhes da decoração e do ambiente.", "Quadrada"],
    "galeria-musica":    ["Música ao vivo", "Apresentação de fim de semana com o público.", "Horizontal"],
    "galeria-kids":      ["Área kids", "Espaço das crianças, de preferência em uso no fim de semana.", "Quadrada"],
    "galeria-eventos":   ["Evento no salão", "Salão decorado para casamento, festa ou evento.", "Quadrada"],
    "galeria-fachada":   ["Entrada e fachada", "Fachada ou entrada, com a placa do restaurante.", "Quadrada"],
    "galeria-estac":     ["Estacionamento", "Estacionamento mostrando o espaço para carros e ônibus.", "Quadrada"],
    "turismo":           ["Fachada do restaurante", "Fachada ou entrada, de preferência com a placa à vista.", "Horizontal"],
    "grupos":            ["Salão montado para grupo ou evento", "Mesas preparadas para excursão ou evento.", "Horizontal"],
    "cta":               ["Mesa bem servida (fundo)", "Mesa farta com pratos típicos; fica ao fundo, escurecida.", "Horizontal"]
  };
  if (fotosPendentes) $$("[data-slot]").forEach(function (slot) {
    if (slot.classList.contains("has-img")) return;
    var d = PH[slot.getAttribute("data-slot")] || [(slot.getAttribute("data-label") || "Foto").replace(/^Foto real · /, ""), "", ""];
    slot.classList.add("has-ph");
    var target = slot, cls = "ph";
    if (slot.getAttribute("data-slot") === "cta") { target = $(".cta .container") || slot; cls = "ph ph--static"; }
    target.insertAdjacentHTML("beforeend", '<span class="' + cls + '"><span class="ph__k"><svg class="icon"><use href="#i-cam"/></svg>Foto necessária</span><span class="ph__t">' + esc(d[0]) + "</span>" + (d[1] ? '<span class="ph__d">' + esc(d[1]) + "</span>" : "") + (d[2] ? '<span class="ph__f">' + esc(d[2]) + "</span>" : "") + "</span>");
  });
  // Versão publicada: a galeria mostra só fotos reais; sem nenhuma foto, a seção não aparece.
  if (!fotosPendentes) {
    $$("[data-gallery] .g-item").forEach(function (b) { if (!$(".media.has-img", b)) b.remove(); });
    if (!$("[data-gallery] .g-item")) { var gsec = $("#galeria"); if (gsec) gsec.remove(); }
  }
  (function hero() {
    var box = $("[data-hero]"); if (!box) return;
    var h = midia.hero || {}, v = midia["hero-video"] || {};
    var conn = navigator.connection || {};
    var slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
    if (h.src) {
      var img = new Image(); img.src = h.src; img.alt = ""; img.fetchPriority = "high"; img.decoding = "async";
      box.appendChild(img);
    }
    if (v.src && !reduceMotion && !slow) {
      var vid = doc.createElement("video");
      vid.muted = true; vid.loop = true; vid.autoplay = true; vid.playsInline = true; vid.setAttribute("playsinline", ""); vid.preload = "metadata";
      if (v.poster || h.src) vid.poster = v.poster || h.src;
      vid.src = v.src;
      vid.addEventListener("canplay", function () { box.innerHTML = ""; box.appendChild(vid); vid.play && vid.play().catch(function () {}); }, { once: true });
      vid.load();
    }
    var tag = $(".hero__tag");
    if (tag) { if (h.src || v.src || !fotosPendentes) tag.remove(); else root.classList.add("has-hero-tag"); }
  })();

  /* ---------- Horários ---------- */
  // Itens não confirmados recebem data-unconfirmed: aparecem só no modo revisão.
  var U = function (html, ok, tag) { tag = tag || "span"; return ok ? html : "<" + tag + " data-unconfirmed>" + html + PEND + "</" + tag + ">"; };
  var FALLBACK_H = "Consulte nossos horários pelo WhatsApp.";
  var horarios = C.horarios || [], resumo = C.horariosResumo || {};
  var algumOk = horarios.some(function (h) { return h.confirmed; });
  $$("[data-hours]").forEach(function (ul) {
    if (!horarios.length) return;
    ul.innerHTML = horarios.map(function (h) {
      var li = "<span>" + esc(h.dias) + "</span><span>" + esc(h.horas) + (h.confirmed ? "" : PEND) + "</span>";
      return h.confirmed ? "<li>" + li + "</li>" : "<li data-unconfirmed>" + li + "</li>";
    }).join("") +
      (resumo.texto ? (resumo.confirmed ? '<li class="muted">' + esc(resumo.texto) + "</li>" : '<li class="muted" data-unconfirmed>' + esc(resumo.texto) + PEND + "</li>") : "") +
      (algumOk ? "" : '<li class="muted" data-fallback>' + FALLBACK_H + "</li>");
  });
  var hi = $("[data-hours-inline]");
  if (hi && horarios.length) {
    var ok = horarios.filter(function (h) { return h.confirmed; }), nok = horarios.filter(function (h) { return !h.confirmed; });
    var fmt = function (arr) { return arr.map(function (h) { return esc(h.dias) + ": " + esc(h.horas); }).join("; ") + "."; };
    hi.innerHTML = (resumo.texto && resumo.confirmed ? esc(resumo.texto) + ". " : "") + (ok.length ? fmt(ok) + " " : '<span data-fallback>' + FALLBACK_H + " </span>") + (nok.length ? '<span data-unconfirmed>' + (resumo.texto ? esc(resumo.texto) + ". " : "") + fmt(nok) + PEND + "</span>" : "");
  }

  /* ---------- Valores ---------- */
  var V = C.valores || {};
  if (V.livre || V.quilo) {
    var vok = !!V.confirmed;
    var p1 = $('[data-price="livre"]'), p2 = $('[data-price="quilo"]'), nota = $('[data-price="nota"]'), kids = $('[data-price="criancas"]'), faq = $('[data-price="faq"]');
    var mark = function (el) { if (!vok) el.setAttribute("data-unconfirmed", ""); el.hidden = false; };
    if (p1 && V.livre) { p1.innerHTML = esc(V.livre) + (vok ? "" : PEND); mark(p1); }
    if (p2 && V.quilo) { p2.innerHTML = esc(V.quilo) + (vok ? "" : PEND); mark(p2); }
    if (nota && V.validade) nota.innerHTML = U("Valores de " + esc(V.validade) + ", sujeitos a alteração. Consulte as informações do dia com o restaurante.", vok) + (vok ? "" : '<span data-fallback>' + nota.innerHTML + "</span>");
    if (kids && V.criancas) { kids.innerHTML = esc(V.criancas) + (vok ? "" : PEND); mark(kids); }
    if (faq) faq.innerHTML = " " + U("Valores de " + esc(V.validade || "") + ": livre " + esc(V.livre) + "; por quilo " + esc(V.quilo) + ".", vok);
  }

  /* ---------- Avaliações ---------- */
  var N = C.notaGoogle || {};
  if (show(N.confirmed) && N.nota) {
    var r = $("[data-rating]"); r.hidden = false;
    $$("[data-rating-num]").forEach(function (el) { el.textContent = N.nota; });
    $$("[data-rating-total]").forEach(function (el) { el.textContent = N.total; });
    $("[data-rating-date]").innerHTML = "Segundo o Google · consulta em " + esc(N.data) + (N.confirmed ? "" : PEND);
    var star = '<svg viewBox="0 0 24 24"><use href="#i-star"/></svg>';
    var five = star + star + star + star + star;
    $("[data-stars-off]").innerHTML = five; var on = $("[data-stars-on]"); on.innerHTML = five;
    on.style.width = Math.max(0, Math.min(100, parseFloat(String(N.nota).replace(",", ".")) / 5 * 100)) + "%";
  } else $$("[data-proof-rating]").forEach(function (el) { el.remove(); });
  var cards = $("[data-review-cards]"), list = (C.avaliacoes || []);
  if (cards) {
    if (list.length) {
      cards.innerHTML = list.slice(0, 3).map(function (a) {
        return '<article class="rcard"><blockquote>“' + esc(a.texto) + '”</blockquote><footer><strong>' + esc(a.nome) + "</strong>" + (a.nota ? " · " + esc(a.nota) + "/5" : "") + " · " + (a.link ? '<a href="' + esc(a.link) + '" target="_blank" rel="noopener">' + esc(a.fonte || "Google") + "</a>" : esc(a.fonte || "Google")) + "</footer></article>";
      }).join("");
    } else { cards.remove(); $("[data-reviews]").classList.add("single"); }
  }

  /* ---------- Crédito ---------- */
  var cr = C.creditoEagle || {}, credit = $("[data-credit]");
  if (credit && cr.mostrar) { credit.hidden = false; if (cr.confirmed) { var pd = $(".pend", credit); if (pd) pd.remove(); } else credit.setAttribute("data-unconfirmed", ""); }

  /* ---------- Header, barra mobile e WhatsApp flutuante ---------- */
  var header = $(".header"), wa = $(".wa-float"), mbar = $(".mbar"), heroEl = $(".hero");
  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("is-scrolled", y > 24);
    var past = y > (heroEl ? heroEl.offsetHeight * 0.55 : 400);
    if (wa) wa.classList.toggle("is-on", past);
    if (mbar) mbar.classList.toggle("is-on", y > 260);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Menu mobile ---------- */
  var mBtn = $(".menu-btn"), menu = $("#menu-mobile");
  var setMenu = function (open) {
    menu.classList.toggle("is-open", open); menu.setAttribute("aria-hidden", String(!open));
    mBtn.setAttribute("aria-expanded", String(open)); mBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    $("use", mBtn).setAttribute("href", open ? "#i-x" : "#i-menu");
    if (open) header.classList.add("is-scrolled"); else onScroll();
    doc.body.style.overflow = open ? "hidden" : "";
  };
  if (mBtn) {
    mBtn.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); mBtn.focus(); } });
    doc.addEventListener("click", function (e) { if (menu.classList.contains("is-open") && !menu.contains(e.target) && !mBtn.contains(e.target)) setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1020 && menu.classList.contains("is-open")) setMenu(false); });
  }

  /* ---------- Revelar ao rolar ---------- */
  var rev = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add("is-visible"); });

  /* ---------- FAQ: abre e fecha com animação suave ---------- */
  $$(".acc details").forEach(function (d) {
    var s = $("summary", d), body = $(".ans", d);
    s.addEventListener("click", function (e) {
      if (reduceMotion || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        var a = body.animate([{ height: body.offsetHeight + "px" }, { height: "0px" }], { duration: 260, easing: "ease" });
        a.onfinish = function () { d.open = false; };
      } else {
        d.open = true; var h = body.offsetHeight;
        body.animate([{ height: "0px" }, { height: h + "px" }], { duration: 300, easing: "ease" });
      }
    });
  });

  /* ---------- Mapa (carrega só no clique) ---------- */
  var mapBtn = $("[data-map-load]");
  if (mapBtn && local.mapsEmbed) mapBtn.addEventListener("click", function () {
    var f = doc.createElement("iframe");
    f.src = local.mapsEmbed; f.title = "Mapa: Restaurante Colônia Germânica, Rua Concórdia, 100, Pomerode/SC";
    f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade"; f.allowFullscreen = true;
    var box = $("[data-map]"); box.innerHTML = ""; box.appendChild(f);
    track("mapa_carregado", { cta_local: "localizacao" });
  });

  /* ---------- Galeria + lightbox ---------- */
  var items = $$("[data-gallery] .g-item"), dlg = $("#lightbox"), idx = 0;
  var openLb = function (i) {
    idx = (i + items.length) % items.length;
    var src = $(".media", items[idx]), stage = $("[data-lb-stage]");
    stage.innerHTML = ""; stage.appendChild(src.cloneNode(true));
    $("[data-lb-cap]").textContent = items[idx].getAttribute("data-cap") || "";
    if (dlg && !dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
  };
  items.forEach(function (b, i) { b.addEventListener("click", function () { openLb(i); }); });
  if (dlg) {
    $("[data-lb-prev]").addEventListener("click", function () { openLb(idx - 1); });
    $("[data-lb-next]").addEventListener("click", function () { openLb(idx + 1); });
    $("[data-lb-close]").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") openLb(idx - 1); if (e.key === "ArrowRight") openLb(idx + 1); });
    var sx = null;
    dlg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) openLb(idx + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* =====================================================================
     ORIGEM DO TRÁFEGO + EVENTOS (GTM / GA4 / Google Ads / Meta Pixel)
     ===================================================================== */
  var qs = new URLSearchParams(location.search), utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"].forEach(function (k) { var v = qs.get(k); if (v) utm[k] = v.slice(0, 200); });
  var ref = doc.referrer || "";
  var trafficSource = (function () {
    var src = (utm.utm_source || "").toLowerCase(), med = (utm.utm_medium || "").toLowerCase();
    var paid = /(cpc|ppc|paid|ads|cpm)/.test(med);
    if (utm.gclid || utm.gbraid || utm.wbraid || (/google/.test(src) && paid)) return "google_ads";
    if (/(facebook|instagram|meta|fb|ig)/.test(src) && paid) return "meta_ads";
    if (utm.fbclid) return "meta_social";
    if (src) return "campanha_" + src.replace(/[^a-z0-9_]/g, "");
    if (/(google|bing|yahoo|duckduckgo|ecosia)\./.test(ref)) return "organico";
    if (ref && ref.indexOf(location.hostname) === -1) return "referencia";
    return "direto";
  })();
  window.dataLayer = window.dataLayer || [];
  function track(name, params) {
    var p = Object.assign({ traffic_source: trafficSource }, params || {});
    window.dataLayer.push(Object.assign({ event: name }, p));
    var T = C.rastreamento || {};
    if (!T.gtmId) {
      if (typeof window.gtag === "function") window.gtag("event", name, p);
      if (typeof window.fbq === "function") window.fbq("trackCustom", name, p);
    }
  }
  window.dataLayer.push({ event: "page_context", traffic_source: trafficSource, utm_source: utm.utm_source || "", utm_campaign: utm.utm_campaign || "" });
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-track]");
    if (a) track(a.getAttribute("data-track"), { cta_local: a.getAttribute("data-loc") || "", link_url: a.getAttribute("href") || "" });
  });

  /* Consentimento: só existe se algum ID estiver configurado. */
  (function consent() {
    var T = C.rastreamento || {};
    if (!(T.gtmId || T.ga4Id || T.googleAdsId || T.metaPixelId)) return;
    var KEY = "cg_consent";
    var read = function () { try { var m = doc.cookie.match(/(?:^|; )cg_consent=([^;]+)/); return m ? m[1] : null; } catch (e) { return null; } };
    var write = function (v) { try { doc.cookie = KEY + "=" + v + "; Max-Age=" + 60 * 60 * 24 * 180 + "; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : ""); } catch (e) {} };
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", wait_for_update: 500 });
    var load = function () {
      window.gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
      var s;
      if (T.gtmId) {
        window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
        s = doc.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(T.gtmId); doc.head.appendChild(s);
        return;
      }
      var gid = T.ga4Id || T.googleAdsId;
      if (gid) {
        s = doc.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gid); doc.head.appendChild(s);
        window.gtag("js", new Date());
        if (T.ga4Id) window.gtag("config", T.ga4Id);
        if (T.googleAdsId) window.gtag("config", T.googleAdsId);
      }
      if (T.metaPixelId) {
        !function (f, b, e, v, n, t, s2) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t, s2); }(window, doc, "script", "https://connect.facebook.net/en_US/fbevents.js");
        window.fbq("init", T.metaPixelId); window.fbq("track", "PageView");
      }
    };
    var state = read();
    if (state === "sim") return load();
    if (state === "nao") return;
    var box = doc.createElement("div");
    box.className = "cookie"; box.setAttribute("role", "region"); box.setAttribute("aria-label", "Aviso de cookies");
    box.innerHTML = '<p>Usamos cookies para medir o desempenho da página e dos anúncios. Você pode aceitar ou recusar. Saiba mais na <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p><div class="btn-row"><button class="btn btn--sm" type="button" data-c="sim">Aceitar</button><button class="btn btn--outline btn--sm" type="button" data-c="nao">Recusar</button></div>';
    doc.body.appendChild(box);
    box.addEventListener("click", function (e) {
      var b = e.target.closest("[data-c]"); if (!b) return;
      var v = b.getAttribute("data-c"); write(v); box.remove(); if (v === "sim") load();
    });
  })();

  /* =====================================================================
     FORMULÁRIO DE GRUPOS, EXCURSÕES E EVENTOS
     - Com endpoint: envia JSON (POST) ao backend configurado.
     - Sem endpoint: abre o WhatsApp do restaurante com a mensagem pronta
       (envio real feito pelo próprio visitante, com os dados que digitou).
     ===================================================================== */
  var form = $("#form-grupos");
  if (form) {
    var startedAt = Date.now(), lastSent = 0;
    var F = C.formulario || {};
    var TIPOS = { excursao: "Excursão ou agência", evento: "Evento ou celebração", empresa: "Empresa ou outro grupo" };
    var seg = $("[data-seg]", form), empOpt = $("[data-emp-opt]", form);
    var tipoAtual = function () { var r = $("input[name=tipo]:checked", form); return r ? r.value : ""; };
    var syncTipo = function () {
      var t = tipoAtual();
      $$(".seg__opts label", form).forEach(function (l) { l.classList.toggle("is-checked", !!$("input:checked", l)); });
      empOpt.textContent = t === "excursao" ? "" : "(opcional)";
      form.elements.empresa.required = t === "excursao";
      if (t) { seg.classList.remove("invalid"); $(".err", seg).textContent = ""; }
    };
    $$("input[name=tipo]", form).forEach(function (r) { r.addEventListener("change", syncTipo); });
    // Links "Pedir condições / Solicitar orçamento" já escolhem o tipo.
    $$("[data-tipo]").forEach(function (a) {
      a.addEventListener("click", function () {
        var r = $('input[name=tipo][value="' + a.getAttribute("data-tipo") + '"]', form);
        if (r) { r.checked = true; syncTipo(); }
        setTimeout(function () { var n = form.elements.nome; if (n && !n.value) n.focus({ preventScroll: true }); }, 700);
      });
    });
    syncTipo();

    var tel = $("#f-whats");
    tel.addEventListener("input", function () {
      var d = tel.value.replace(/\D/g, "").slice(0, 13);
      if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
      var o = d;
      if (d.length > 2) o = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 7) o = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
      tel.value = o;
    });
    var setErr = function (input, msg) {
      var f = input.closest(".field"); if (!f) return;
      f.classList.toggle("invalid", !!msg);
      var e = $(".err", f); if (e) e.textContent = msg || "";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
    };
    var rules = {
      nome: function (v) { return v.trim().length >= 3 ? "" : "Informe seu nome completo."; },
      empresa: function (v) { return tipoAtual() !== "excursao" || v.trim().length >= 2 ? "" : "Informe a agência ou empresa."; },
      cidade: function (v) { return v.trim().length >= 2 ? "" : "Informe a cidade e o estado."; },
      whatsapp: function (v) { var d = v.replace(/\D/g, ""); return d.length >= 10 && d.length <= 11 ? "" : "Informe um WhatsApp com DDD."; },
      pessoas: function (v) { if (!v) return ""; var n = Number(v); return n >= 1 && n <= 2000 ? "" : "Informe um número entre 1 e 2000."; },
      data_prevista: function (v) { return v.length <= 60 ? "" : "Use até 60 caracteres."; },
      mensagem: function (v) { return v.length <= 600 ? "" : "Use até 600 caracteres."; }
    };
    $$("input:not([type=radio]):not([type=checkbox]),textarea", form).forEach(function (el) {
      el.addEventListener("blur", function () { if (rules[el.name] && el.value) setErr(el, rules[el.name](el.value)); });
      el.addEventListener("input", function () { if (el.closest(".invalid") && rules[el.name]) setErr(el, rules[el.name](el.value)); });
    });
    var status = $("[data-form-status]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      if (!tipoAtual()) { seg.classList.add("invalid"); $(".err", seg).textContent = "Escolha uma opção."; bad = $("input[name=tipo]", form); }
      Object.keys(rules).forEach(function (k) { var el = form.elements[k]; var m = rules[k](el.value || ""); setErr(el, m); if (m && !bad) bad = el; });
      var cons = form.elements.consentimento;
      cons.closest(".consent").classList.toggle("invalid", !cons.checked);
      if (!cons.checked && !bad) bad = cons;
      if (bad) { status.textContent = "Revise os campos destacados."; bad.focus(); return; }
      // Anti-spam: campo isca, tempo mínimo de preenchimento e intervalo entre envios.
      if (form.elements.site.value) return;
      if (Date.now() - startedAt < 3000) { status.textContent = "Aguarde um instante e envie novamente."; return; }
      if (Date.now() - lastSent < 30000) { status.textContent = "Seus dados já foram enviados. Aguarde alguns segundos para reenviar."; return; }
      lastSent = Date.now();

      var v = function (k) { return (form.elements[k].value || "").trim(); };
      var tipo = tipoAtual();
      var payload = {
        tipo: tipo, tipo_descricao: TIPOS[tipo] || "", nome: v("nome"), empresa: v("empresa"), cidade: v("cidade"), whatsapp: v("whatsapp"),
        pessoas: v("pessoas"), data_prevista: v("data_prevista"), mensagem: v("mensagem"), consentimento: true,
        origem: F.origem || "LP Colônia Germânica", traffic_source: trafficSource,
        utm_source: utm.utm_source || "", utm_medium: utm.utm_medium || "", utm_campaign: utm.utm_campaign || "",
        utm_term: utm.utm_term || "", utm_content: utm.utm_content || "", gclid: utm.gclid || "", fbclid: utm.fbclid || "",
        referrer: ref.slice(0, 300), pagina: location.href.split("#")[0].slice(0, 300), enviado_em: new Date().toISOString()
      };
      var msg = "Olá! Quero conhecer as condições do Colônia Germânica para " + (tipo === "evento" ? "um evento" : tipo === "excursao" ? "excursões/grupos" : "um grupo") + ".\n\n" +
        "Tipo: " + payload.tipo_descricao + "\nNome: " + payload.nome + (payload.empresa ? "\nAgência/empresa: " + payload.empresa : "") +
        "\nCidade/Estado: " + payload.cidade + "\nWhatsApp: " + payload.whatsapp +
        (payload.pessoas ? "\nNº de pessoas: " + payload.pessoas : "") + (payload.data_prevista ? "\nData prevista: " + payload.data_prevista : "") +
        (payload.mensagem ? "\nMensagem: " + payload.mensagem : "") + "\n\n(Enviado pela página do restaurante)";
      var waDest = String(contato.whatsappEventos || contato.whatsappNumero || "").replace(/\D/g, "");
      var waUrl = waDest ? "https://wa.me/" + waDest + "?text=" + encodeURIComponent(msg) : (contato.whatsappLink || "");

      var success = function (title, text, showWa) {
        $("[data-form-wrap]").style.display = "none";
        var box = $("[data-form-success]"); box.classList.add("is-on");
        $("[data-success-title]").textContent = title; $("[data-success-text]").textContent = text;
        var b = $("[data-success-wa]"); if (showWa && waUrl) { b.href = waUrl; b.hidden = false; }
        box.focus();
      };

      if (F.endpoint) {
        var btn = $("button[type=submit]", form); btn.disabled = true; status.textContent = "Enviando…";
        fetch(F.endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
          .then(function () {
            track("form_grupos_enviado", { metodo: "endpoint", tipo: tipo, cta_local: "grupos" });
            success("Recebemos seus dados.", "Em breve o restaurante entra em contato para apresentar as condições.", true);
          })
          .catch(function () {
            btn.disabled = false; lastSent = 0;
            status.textContent = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
          });
        return;
      }
      // Sem backend: envio real pelo WhatsApp do visitante.
      track("form_grupos_enviado", { metodo: "whatsapp", tipo: tipo, cta_local: "grupos" });
      if (waDest) {
        window.open(waUrl, "_blank", "noopener");
        success("Sua mensagem está pronta no WhatsApp.", "Confira os dados na conversa que abrimos e toque em enviar. Se a janela não abriu, use o botão abaixo.", true);
      } else {
        if (waUrl) window.open(waUrl, "_blank", "noopener");
        success("Falta só enviar pelo WhatsApp.", "Na conversa que abrimos com o restaurante, envie seus dados para receber as condições.", true);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(msg).then(function () {
              $("[data-success-text]").textContent = "Copiamos sua mensagem. Na conversa que abrimos com o restaurante, cole o texto e toque em enviar.";
            }, function () {});
          }
        } catch (err) {}
      }
    });
  }

  /* ---------- Versão publicada: remove do HTML o que ainda não foi confirmado ---------- */
  if (!review) $$("[data-unconfirmed]").forEach(function (el) { el.remove(); });

  /* ---------- Pílula do modo revisão ---------- */
  if (review) {
    var pill = doc.createElement("div"); pill.className = "review-pill";
    pill.innerHTML = '<span>Versão para aprovação</span><button type="button">Ocultar marcações</button>';
    doc.body.appendChild(pill);
    var b = $("button", pill);
    b.addEventListener("click", function () {
      var on = root.classList.toggle("is-review");
      b.textContent = on ? "Ocultar marcações" : "Mostrar marcações";
    });
  }
})();
